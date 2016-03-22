<?php

namespace app\model;

class FirmModel extends AbstractModel {
    private $connection;
    
    private $firm_id;
    private $firm_name;
    private $firm_description;
    private $firm_password;
    private $firm_salt;
    private $firm_owner;
    private $firm_created_date;
    private $firm_self_processes;
    private $firm_copied_processes;
    private $firm_default_permissions;
    private $firms = [];
    
    public function __construct() {
        $this->connection = \app\registry\Registry::singleton()->getObject("db");
    }

    
    // Najde ci existuje zaznam s danym atributom 
    public function checkExisting($attribute, $string){
        $result = $this->connection->select("firm_id", "FIRM", $attribute . " =? LIMIT 1", $string);
        if (count($result) == 1) {
            return true;
        } else {
            return false;
        }
    }


    // Pozrie ci firma ma setnute PWčko
    public function checkPassword($firm_id) {
        $result = $this->connection->select("firm_password", "FIRM", "firm_id = ? LIMIT 1", array($firm_id));
            
        if ($result["firm_password"] == null){
            return false;
        } else {
            return true;
        }
    }

    
    // Vytvori formu
    public function createFirm($name, $description, $passwd, $default_permissions) {
        $random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
        if ($passwd !== null){
            $password = hash('sha512', $passwd . $random_salt);
        } else {
            $password = null;
        }
        
        $new_id = $this->connection->insert("FIRM",
                                   "firm_name, firm_description, firm_password, firm_owner, firm_self_processes, firm_copied_processes, firm_default_permissions, firm_salt, firm_created_date",
                                   "?, ?, ?, ?, ?, ?, ?, ?, NOW()",
                                   array($name, $description, $password, $_SESSION["User"], 0, 0, $default_permissions, $random_salt));
        //$result = $this->getFirmAttribute("firm_id","firm_name = ?", array($name));
        //errors($result);
        if ($this->createFirmUser($_SESSION["User"], $new_id, 63)) { // poriesit este ten password
            return true;        
        }
        else {
            return false;
        }
    }

    
    // Vytvori do tabulky USERS_X_FIRM ownera so vsetkymi pravami
    public function createFirmUser($user_id, $firm_id, $permissions = 0) {
        $bin = sprintf("%06d", decbin($permissions));
        $per0 = $bin[0];
        $per1 = $bin[1];
        $per2 = $bin[2];
        $per3 = $bin[3];
        $per4 = $bin[4];
        $per5 = $bin[5];
        
        $this->connection->insert("USERS_X_FIRM",
                "firm_id, id, roles_processes, assign_user_to_role, invite_user, kick_user, change_user_permissions, delete_firm",
                "?, ?, ?, ?, ?, ?, ?, ?", 
                array($firm_id, $user_id, $per0, $per1, $per2, $per3, $per4, $per5));
        return true;
    }
    
    
    // vymaže firmu
    public function deleteFirm($firm_id){
        $this->connection->delete("FIRM", "firm_id = ?", array($firm_id));
    }
    
    
    // po spracovaní celého procesu pridania do firmy cez invitation sa invitation vymaže z DB
    public function deleteInvitation($random_hash, $firm_id, $email) {
        $this->connection->delete("FIRM_INVITATIONS", "firm_id = ? AND invitation_email = ? AND invitation_hash = ?", array($firm_id, $email, $random_hash));
        header("Location: " . HTML_PATH . '/index.php');
        exit();
    }

    
    // Najde firmu podľa IDčka 
    public function find($firm_id){
        $return = $this->connection->selectA("*", "FIRM", "firm_id = ? LIMIT 1", array($firm_id));
        $this->setAll($return[0]["firm_id"], $return[0]["firm_name"], $return[0]["firm_description"], $return[0]["firm_created_date"], $return[0]["firm_password"], $return[0]["firm_owner"], $return[0]["firm_self_processes"], $return[0]["firm_copied_processes"], $return[0]["firm_default_permissions"], $return[0]["firm_salt"]);
    }

    
    // Najde všetky firmy a setne ich do premennej firms v classe
    public function getAll($letter = null, $items_per_page = null, $sort = null, $page = null) {
        
        if($items_per_page == null || $sort == null || $page == null){
            $result = $this->connection->selfSelect("SELECT F.firm_id, firm_name, firm_self_processes, firm_copied_processes, "
                . "COUNT( DISTINCT P.pn_id ) as processes, COUNT(DISTINCT U.id) as users"
                . " FROM FIRM F LEFT OUTER JOIN PN_X_FIRM P on P.firm_id = F.firm_id LEFT OUTER JOIN USERS_X_FIRM U on U.firm_id = F.firm_id"
                . " WHERE F.firm_name LIKE ". '"' . $letter . '%"' . "GROUP BY F.firm_id");
            return $result;
        }
        
        $offset = ($page - 1) * $items_per_page;
        switch($sort){
            case "1":
                echo "1";
                $result = $this->connection->selfSelect("SELECT * FROM"
                . "(SELECT F.firm_id, firm_name, firm_self_processes, firm_copied_processes, count( DISTINCT P.pn_id ) as processes, COUNT(DISTINCT U.id) as users"
                . " FROM FIRM F LEFT OUTER JOIN PN_X_FIRM P on P.firm_id = F.firm_id LEFT OUTER JOIN USERS_X_FIRM U on U.firm_id = F.firm_id"
                . " WHERE F.firm_name LIKE ". '"' . $letter . '%"' . "GROUP BY F.firm_id LIMIT $offset, $items_per_page) AS T1 ORDER BY T1.processes DESC");
                break;
            case "2":
                echo "2";
                $result = $this->connection->selfSelect("SELECT * FROM"
                . "(SELECT F.firm_id, firm_name, firm_self_processes, firm_copied_processes, count( DISTINCT P.pn_id ) as processes, COUNT(DISTINCT U.id) as users"
                . " FROM FIRM F LEFT OUTER JOIN PN_X_FIRM P on P.firm_id = F.firm_id LEFT OUTER JOIN USERS_X_FIRM U on U.firm_id = F.firm_id"
                . " WHERE F.firm_name LIKE ". '"' . $letter . '%"' . "GROUP BY F.firm_id LIMIT $offset, $items_per_page) AS T1 ORDER BY T1.users DESC");
                break;
            default:
                echo "3";
                $result = $this->connection->selfSelect("SELECT * FROM"
                . "(SELECT F.firm_id, firm_name, firm_self_processes, firm_copied_processes, count( DISTINCT P.pn_id ) as processes, COUNT(DISTINCT U.id) as users"
                . " FROM FIRM F LEFT OUTER JOIN PN_X_FIRM P on P.firm_id = F.firm_id LEFT OUTER JOIN USERS_X_FIRM U on U.firm_id = F.firm_id"
                . " WHERE F.firm_name LIKE ". '"' . $letter . '%"' . "GROUP BY F.firm_id LIMIT $offset, $items_per_page) AS T1 ORDER BY T1.firm_id");
                break;
        }
        
        return $result;
        
    }
    
    
    // funkcia na index, ktora najde tri najlepsie firmy
    public function getBestFirms($amount){
        $result = $this->connection->selfSelect("SELECT F.firm_id, firm_name, firm_description, COUNT( DISTINCT P.pn_id ) as processes, COUNT(DISTINCT U.id) as users "
                                                . "FROM FIRM F LEFT OUTER JOIN PN_X_FIRM P on P.firm_id = F.firm_id LEFT OUTER JOIN USERS_X_FIRM U on U.firm_id = F.firm_id "
                                                . "GROUP BY F.firm_id ORDER BY processes DESC LIMIT $amount");
        return $result;
    }
    
    // KOKOTNA funkcia, kde je taky tazky select, ze som ho nevedel spravit na jeden krat...
    // cize najde vsetky firmy, do ktorych je mozne nakopirovat process
    public function getAvailibleFirmsForCopyingProcess($process_id, $user_id, $permissions = null){
        // SELECT F.firm_id, F.firm_name, F.firm_salt FROM FIRM F INNER JOIN USERS_X_FIRM U ON F.firm_id = U.firm_id LEFT OUTER JOIN PN_X_FIRM P ON F.firm_id = P.firm_id WHERE U.id = 1 AND U.kick_user = 1 AND (P.pn_id IS NULL OR P.pn_id != 2) GROUP BY F.firm_id
        // SELECT F.firm_id, F.firm_name, F.firm_salt FROM FIRM F INNER JOIN USERS_X_FIRM U ON F.firm_id = U.firm_id LEFT OUTER JOIN PN_X_FIRM P ON F.firm_id = P.firm_id WHERE U.id = 1 AND U.roles_processes = 1 AND (P.pn_id IS NULL OR P.pn_id != 3) GROUP BY F.firm_id
        $settings = "U.id = ? AND (P.pn_id IS NULL OR P.pn_id != ?)";
        if( $permissions != null ){
            for( $i = 0; $i < count($permissions); $i++ ){
                $settings = $settings . " AND $permissions[$i] = 1";
            }
        }
        
        try{
            $stmt = $this->connection->getConn()->prepare("SELECT F.firm_id, F.firm_name, F.firm_salt FROM FIRM F INNER JOIN USERS_X_FIRM U ON F.firm_id = U.firm_id LEFT OUTER JOIN PN_X_FIRM P ON F.firm_id = P.firm_id WHERE $settings GROUP BY F.firm_id");
            $stmt->execute(array($user_id, $process_id));
            $result = $stmt->fetchAll();
        } catch (Exception $e){
            echo $e;
            //header("Location: " . HTML_PATH . 'index.php/error');
            //exit();
        } 
        
        $settings = "U.id = ? AND (P.pn_id = ?)";
        if( $permissions != null ){
            for( $i = 0; $i < count($permissions); $i++ ){
                $settings = $settings . " AND $permissions[$i] = 1";
            }
        }
        
        try{
            $stmt = $this->connection->getConn()->prepare("SELECT F.firm_id, F.firm_name, F.firm_salt FROM FIRM F INNER JOIN USERS_X_FIRM U ON F.firm_id = U.firm_id LEFT OUTER JOIN PN_X_FIRM P ON F.firm_id = P.firm_id WHERE $settings GROUP BY F.firm_id");
            $stmt->execute(array($user_id, $process_id));
            $result2 = $stmt->fetchAll();
        } catch (Exception $e){
            echo $e;
            //header("Location: " . HTML_PATH . 'index.php/error');
            //exit();
        } 
        /*var_dum($result);
        var_dum($result2);*/
        $intersect = array_values(array_udiff($result, $result2, array($this,'cmp')));
        return $intersect;
    }
    
    private function cmp($val1, $val2){
        return strcmp($val1['firm_salt'], $val2['firm_salt']);
    }
    

    // nájde v tabuľke firiem nejaký atribút
    public function getFirmAttribute($what, $settings = 1, $values = null) {
        $return = $this->connection->select($what, "FIRM", $settings, $values);
        return $return;
    }


    // podla id firmy najde defaultné práva
    public function getDefaultPermissions($firm_id) {
        return $this->getFirmAttribute("firm_default_permissions","firm_id = ? LIMIT 1",array($firm_id));
    }

    
    // vráti email ak existuje v tabuľke pozvánok
    public function getInvitationEmail($random_hash, $firm_id) {
        $result = $this->connection->select("invitation_email", "FIRM_INVITATIONS", "firm_id = ? AND invitation_hash = ?  LIMIT 1",array($firm_id,$random_hash));
        
        if (count($result) == 1) {
            return $result["invitation_email"];
        } else {
            return false;
        }
    }
    
    
    // nájde firmy v ktorých je daný user
    public function getUsersFirms($user_id){
        $result = $this->connection->selectJoin("FIRM.firm_id, firm_name", "FIRM", "USERS_X_FIRM", "FIRM.firm_id = USERS_X_FIRM.firm_id", "USERS_X_FIRM.id = ?",array($user_id));
        return $result;
    }
    
    
    
    // vymaže usera z users_x_firm
    public function removeUserFromFirm($firm_id, $user_id) {
        $this->connection->delete("USERS_X_FIRM", "firm_id = ? AND id = ? ",array($firm_id,$user_id));
        header("Location: " . HTML_PATH . 'index.php/firm/usermanagement/' . $firm_id);
    }

    
    // pošle pozvánku na pripojenie do firmy na zadaný email
    public function sendInvitation($email, $firm_id) {
        $random_hash = substr(hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true)), 0, 32);
        $this->connection->insert("FIRM_INVITATIONS", "firm_id, invitation_email, invitation_hash", "?, ?, ?",array($firm_id,$email,$random_hash));
            
        $message = "Dostali ste pozvanku do firmy $firm_id na worfklowmarkete. \r\n Pozvanie dokončíte kliknutím na nasledujúci link: " . HTML_PATH . 'index.php/firm/proceedinvitation/' . $random_hash . '/' . $firm_id;
        echo $message;

        mail($email, 'Workflow  pozvánka do firmy', $message);
        
    }
    
    
    // Nastaví viacero parametrov naraz
    public function setAll($firm_id, $firm_name, $firm_description, $firm_created_date, $firm_password, $firm_owner, $firm_self_processes, $firm_copied_processes, $firm_default_permissions, $firm_salt) {
        $this->firm_id = $firm_id;
        $this->firm_name = $firm_name;
        $this->firm_description = $firm_description;
        $this->firm_created_date = $firm_created_date;
        $this->firm_password = $firm_password;
        $this->firm_owner = $firm_owner;
        $this->firm_self_processes = $firm_self_processes;
        $this->firm_copied_processes = $firm_copied_processes;
        $this->firm_default_permissions = $firm_default_permissions;
        $this->firm_salt = $firm_salt;
    }

    
    // Overenie, či sedí heslo firmy so zadaným heslom 
    public function validateFirmPassword($firm_id, $password) {
        $firm_password = $this->getFirmAttribute("firm_password", "firm_id = ?", array($firm_id));
        $firm_salt = $this->getFirmAttribute("firm_salt", "firm_id = ?", array($firm_id));
        $password = hash('sha512', $password . $firm_salt["firm_salt"]);

        if ($password === $firm_password["firm_password"]) {
            return true;
        } else {
            return false;
        }
    }
    

    // GETTRE SETTRE
    function getFirm_id() {
        return $this->firm_id;
    }

    function getFirm_name() {
        return $this->firm_name;
    }

    function getFirm_password() {
        return $this->firm_password;
    }

    function getFirm_salt() {
        return $this->firm_salt;
    }

    function getFirm_owner() {
        return $this->firm_owner;
    }

    function getFirm_self_processes() {
        return $this->firm_self_processes;
    }

    function getFirm_copied_processes() {
        return $this->firm_copied_processes;
    }

    function getFirm_default_permissions() {
        return $this->firm_default_permissions;
    }

    function getFirms() {
        return $this->firms;
    }

    function setFirm_id($firm_id) {
        $this->firm_id = $firm_id;
    }

    function setFirm_name($firm_name) {
        $this->firm_name = $firm_name;
    }

    function setFirm_password($firm_password) {
        $this->firm_password = $firm_password;
    }

    function setFirm_salt($firm_salt) {
        $this->firm_salt = $firm_salt;
    }

    function setFirm_owner($firm_owner) {
        $this->firm_owner = $firm_owner;
    }

    function setFirm_self_processes($firm_self_processes) {
        $this->firm_self_processes = $firm_self_processes;
    }

    function setFirm_copied_processes($firm_copied_processes) {
        $this->firm_copied_processes = $firm_copied_processes;
    }

    function setFirm_default_permissions($firm_default_permissions) {
        $this->firm_default_permissions = $firm_default_permissions;
    }

    function setFirms($firms) {
        $this->firms = $firms;
    }
    
    function getConnection() {
        return $this->connection;
    }

    function getFirm_description() {
        return $this->firm_description;
    }

    function getFirm_created_date() {
        return $this->firm_created_date;
    }

    function setConnection($connection) {
        $this->connection = $connection;
    }

    function setFirm_description($firm_description) {
        $this->firm_description = $firm_description;
    }

    function setFirm_created_date($firm_created_date) {
        $this->firm_created_date = $firm_created_date;
    }


}
