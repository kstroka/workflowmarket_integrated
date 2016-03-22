<?php

namespace app\model;

class UserModel extends AbstractModel {

    private $connection;
    private $id;
    private $first_name;
    private $last_name;
    private $email;
    private $password;
    private $salt;
    private $coins;
    private $activation;
    private $users = [];
    private $permissions;
    private $uniqueHash;

    public function __construct() {
        $this->connection = \app\registry\Registry::singleton()->getObject("db");
    }

    // človek z mailu dostane linku s tokenom, ktorá zavolá tuto funkciu a v databaze nastavi activation na NULL, tym padom sa user bude moct prihlasit
    public function activateUser($email, $activate) { // connection tu asi nebude dobre
        $stmt = $this->connection->update("USERS", "activation = NULL", "email = ? AND activation = ?", array($email, $activate));

        if ($stmt->rowCount() == 1) {
            return true;
        } else {
            return false;
        }
    }

    // zmení password zo starého na nový
    public function changePassword($user_id, $oldpw, $newpw) {
        errors(array($user_id, $oldpw, $newpw));

        $update = $this->connection->update("USERS", "password = ?", "id = ? AND password = ?", array($newpw, $user_id, $oldpw));
        if ($update->rowCount() == 1) {
            return true;
        }
        return false;
    }

    // zistí, či existuje v databáze záznam podľa zadaných parametrov 
    public function checkExisting($attribute, $string) {
        $result = $this->connection->select("id", "USERS", $attribute . " =? LIMIT 1", $string);
        //var_dum(count($result));

        if (count($result) == 1) {
            return true;
        } else {
            return false;
        }
    }

    // pozre, či je prihlásený užívateľ vo firme, urobiť inač autentifikaciu NESTACI VRATIT TRUE? VED TU NIC NENI! 
    public function checkUserInFirm($firm_id) {
        if ($this->isInFirm($_SESSION["User"], $firm_id)) {
            return $this;
        } else {
            return false;
        }
    }

    // zistí, či user má daný permission a dokáže zistiť zároveň aj či je vo firme
    public function checkUserPermission($firm_id, $user_id, $permission) {
        $result = $this->connection->select($permission, "USERS_X_FIRM", "firm_id = ? AND id = ?", array($firm_id, $user_id));
        if (!isset($result[$permission])) {
            return false;
        }

        if ($result[$permission] == 1) {
            return true;
        } else {
            return false;
        }
    }

    // zistí, či má user vo v danej firme právo na invite, kick alebo zmenu permissionov
    public function checkUserManagementPermissions($user_id, $firm_id) {
        $result = $this->connection->select("invite_user, kick_user, change_user_permissions", "USERS_X_FIRM", "firm_id = ? AND id = ?", array($firm_id, $user_id));

        if ($result["invite_user"] == 1 || $result["kick_user"] == 1 || $result["change_user_permissions"] == 1) {
            return true;
        } else {
            return false;
        }
    }

    // Nájde všetkých userov vo firme s parametrom $firm_id a nastavi HASH, ktory pozostava z id, id firmy a user saltu. Použitý pre parametre funkcii pri napr. kickovaní firmy 
    public function findAllInFirm($firm_id) {
        $stmt = $this->connection->getConn()->prepare("SELECT USERS.id, first_name, last_name, email, password, salt, coins, activation FROM USERS INNER JOIN USERS_X_FIRM ON USERS_X_FIRM.id = USERS.id WHERE USERS_X_FIRM.firm_id = ?");
        $stmt->execute(array($firm_id));
        $result = $stmt->fetchAll();

        for ($i = 0; $i < count($result); $i++) {
            $temp = new UserModel($this->connection);
            $temp->setAll($result[$i]["id"], $result[$i]["first_name"], $result[$i]["last_name"], $result[$i]["email"], $result[$i]["password"], $result[$i]["salt"], $result[$i]["coins"], $result[$i]["activation"]);
            $temp->uniqueHash = hash('sha512', $result[$i]["id"] . $firm_id . $result[$i]["salt"]);
            $this->users[] = $temp;
        }
    }

    // vseobecna funkcia na vybratie hocicoho z userov
    public function getUserAttribute($what, $clause, $toBind) {
        $result = $this->connection->select($what, "USERS", $clause, $toBind);
        return $result;
    }

    //zisti ownera procesu skuska davat to do premennych v modeli
    public function getProcessOwner($process_id) {
        $result = $this->connection->selectJoinA("USERS.id,first_name,last_name,email", "USERS", "petri_net", "USERS.id = petri_net.created_by", "petri_net.id = ? LIMIT 1", array($process_id));
        $this->setFirst_name($result[0]["first_name"]);
        $this->setLast_name($result[0]["last_name"]);
        $this->setEmail($result[0]["email"]);
    }

    // zistí v ktorých firmách je user 
    public function getUserFirmsByPermissions($user_id, $permissions = null) {
        $settings = "U.id = ?";
        if ($permissions != null) {
            for ($i = 0; $i < count($permissions); $i++) {
                $settings = $settings . " AND $permissions[$i] = 1";
            }
        }
        $result = $this->connection->selectJoin("F.firm_id, firm_name", "FIRM F", "USERS_X_FIRM U", "U.firm_id = F.firm_id", $settings, array($user_id));
        if (!isset($result[0])) {
            return array($result);
        } else {
            return $result;
        }
        //SELECT F.firm_id, F.firm_name FROM FIRM F RIGHT OUTER JOIN USERS_X_FIRM U ON F.firm_id = U.firm_id LEFT OUTER JOIN PN_X_FIRM P ON F.firm_id = P.firm_id WHERE U.id = 1 AND (P.pn_id IS NULL OR P.pn_id != 2) GROUP BY F.firm_id
        //SELECT F.firm_id, F.firm_name FROM FIRM F RIGHT OUTER JOIN USERS_X_FIRM U ON F.firm_id = U.firm_id LEFT OUTER JOIN PN_X_FIRM P ON F.firm_id = P.firm_id WHERE U.id = 1 AND U.roles_processes = 1 AND (P.pn_id IS NULL OR P.pn_id != 2) GROUP BY F.firm_id
    }

    // zistí userove permissions v danej firme
    public function getUserPermissions($user_id, $firm_id) {
        var_dum($firm_id);
        $permissions = $this->connection->select("roles_processes, assign_user_to_role, invite_user, kick_user, change_user_permissions, delete_firm", "USERS_X_FIRM", "firm_id = ? AND id = ?", array($firm_id, $user_id));

        if ($permissions["roles_processes"] == 0) {
            unset($permissions["roles_processes"]);
        }
        if ($permissions["assign_user_to_role"] == 0) {
            unset($permissions["assign_user_to_role"]);
        }
        if ($permissions["invite_user"] == 0) {
            unset($permissions["invite_user"]);
        }
        if ($permissions["kick_user"] == 0) {
            unset($permissions["kick_user"]);
        }
        if ($permissions["change_user_permissions"] == 0) {
            unset($permissions["change_user_permissions"]);
        }
        if ($permissions["delete_firm"] == 0) {
            unset($permissions["delete_firm"]);
        }

        return $permissions;
    }

    // vráti boolean podľa toho, či sa user nachádza vo firme 
    public function isInFirm($user_id, $firm_id) {
        $result = $this->connection->select("firm_id", "USERS_X_FIRM", "firm_id = ? AND id = ? LIMIT 1", array($firm_id, $user_id));
        if (count($result) == 1) {
            return true;
        } else {
            return false;
        }
    }

    // podľa ID získa všetky údaje o userovi a naplní classu
    public function loadUser($user_id) {
        $result = $this->connection->select("*", "USERS", "id = ? LIMIT 1", array($user_id));
        $this->setAll($result["id"], $result["first_name"], $result["last_name"], $result["email"], $result["password"], $result["salt"], $result["coins"], $result["activation"]);
    }

    // vytvori random string danej dlzky
    private function randomStr($length, $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        $str = '';
        $max = mb_strlen($keyspace, '8bit') - 1;
        for ($i = 0; $i < $length; ++$i) {
            $str .= $keyspace[rand(0, $max)];
        }
        return $str;
    }

    // Registrácia usera
    public function registrationUser($first_name, $last_name, $email, $password) {
        if (empty($error_msg)) {
            $activation = substr(hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true)), 0, 32);
            $random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
            $password = hash('sha512', $password . $random_salt);

            $this->connection->insert("USERS", "first_name, last_name, email, password, salt, coins, activation", "?,?,?,?,?,?,?", array($first_name, $last_name, $email, $password, $random_salt, $coin = 0, $activation));

            $message = "Ďakujeme za registráciu. \r\n Registráciu dokončíte kliknutím na nasledujúci link: "
                    . "localhost/bc/index.php/user/activate/" . urlencode($email) . "/" . $activation;

            mail($email, 'Workflow market potvrdenie registrácie', $message);
            return true;
        }
        return false;
    }

    //zaslanie noveho hesla na email
    public function setNewPassword($hash, $recovery_id) {
        $password = $this->randomStr(8);
        $result = $this->connection->selectJoinA("U.id, U.salt, U.email", "USERS U","USERS_PASSWORD_RECOVERY UP","UP.user_id = U.id", "UP.activation = ? AND UP.id = ? LIMIT 1", array($hash, $recovery_id));

        if (count($result) == 1) {
            $hashedPw = hash('sha512', $password . $result[0]["salt"]);
            $update = $this->connection->update("USERS", "password = ?", "id = ? AND salt = ? LIMIT 1", array($hashedPw, $result[0]["id"], $result[0]["salt"]));

            if ($update->rowCount() == 1) {
                $message = "Zmena hesla prebehla úspešne. \r\n Vaše nové heslo je: $password";
                echo $message;
                mail($result[0]["email"], 'Workflow market recovery password', $message);
                $this->connection->delete("USERS_PASSWORD_RECOVERY", "id = ? AND activation = ?", array($recovery_id, $hash));
                return true;
            }
        }
        return false;
    }
    
    public function sendPasswordActivation($email){
        $result = $this->connection->select("id", "USERS", "email = ? LIMIT 1", array($email));
        if (count($result) == 1) {
            $hash = substr(hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true)), 0, 32);
            $newId = $this->connection->insert("USERS_PASSWORD_RECOVERY","user_id, activation, created_date", "?, ?, NOW()", array($result["id"], $hash));
            $uri = HTML_PATH . "index.php/user/resetpassword/$hash/$newId";
            
            $message = "Na váš email bola zaslaná aktivačná linka pre resetovanie hesla: $uri";
            mail($email, 'Workflow market recovery password', $message);
            echo $uri;
            return true;
        }
        return false;
    }

    // nastaví naraz viacero premenných
    public function setAll($id, $first_name, $last_name, $email, $password, $salt, $coins, $activation, $users = [], $permissions = null, $uniqueHash = null) {
        $this->id = $id;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->email = $email;
        $this->password = $password;
        $this->salt = $salt;
        $this->coins = $coins;
        $this->activation = $activation;
        $this->users = $users;
        $this->permissions = $permissions;
        $this->uniqueHash = $uniqueHash;
    }

    // nastaví userovi permissiony
    public function setUserPermissions($firm_id, $user_id, $permissions) {

        if (!isset($permissions["roles_processes"])) {
            ($permissions["roles_processes"] = 0);
        }
        if (!isset($permissions["assign_user_to_role"])) {
            ($permissions["assign_user_to_role"] = 0);
        }
        if (!isset($permissions["invite_user"])) {
            ($permissions["invite_user"] = 0);
        }
        if (!isset($permissions["kick_user"])) {
            ($permissions["kick_user"] = 0);
        }
        if (!isset($permissions["change_user_permissions"])) {
            ($permissions["change_user_permissions"] = 0);
        }
        if (!isset($permissions["delete_firm"])) {
            ($permissions["delete_firm"] = 0);
        }

        $this->connection->update("USERS_X_FIRM", "roles_processes = ?, assign_user_to_role = ?, invite_user = ?, kick_user = ?, change_user_permissions = ?, delete_firm = ?", " firm_id = $firm_id AND id = $user_id", array($permissions["roles_processes"], $permissions["assign_user_to_role"], $permissions["invite_user"], $permissions["kick_user"], $permissions["change_user_permissions"], $permissions["delete_firm"])
        );
    }

    // ovaliduje dlzku parametru
    public function validatePassword($password) {
        if (strlen($password) > 6 && strlen($password) < 20) {
            return true;
        } else {
            return false;
        }
    }

    //Gettre, Settre
    function getConnection() {
        return $this->connection;
    }

    function getId() {
        return $this->id;
    }

    function getFirst_name() {
        return $this->first_name;
    }

    function getLast_name() {
        return $this->last_name;
    }

    function getEmail() {
        return $this->email;
    }

    function getPassword() {
        return $this->password;
    }

    function getSalt() {
        return $this->salt;
    }

    function getCoins() {
        return $this->coins;
    }

    function getActivation() {
        return $this->activation;
    }

    function getUsers() {
        return $this->users;
    }

    function getPermissions() {
        return $this->permissions;
    }

    function getUniqueHash() {
        return $this->uniqueHash;
    }

    function setConnection($connection) {
        $this->connection = $connection;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setFirst_name($first_name) {
        $this->first_name = $first_name;
    }

    function setLast_name($last_name) {
        $this->last_name = $last_name;
    }

    function setEmail($email) {
        $this->email = $email;
    }

    function setPassword($password) {
        $this->password = $password;
    }

    function setSalt($salt) {
        $this->salt = $salt;
    }

    function setCoins($coins) {
        $this->coins = $coins;
    }

    function setActivation($activation) {
        $this->activation = $activation;
    }

    function setUsers($users) {
        $this->users = $users;
    }

    function setPermissions($permissions) {
        $this->permissions = $permissions;
    }

    function setUniqueHash($uniqueHash) {
        $this->uniqueHash = $uniqueHash;
    }

}
