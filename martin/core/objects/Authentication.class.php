<?php

class Authentication {

    private $connection;
    
    private $id;  
    private $email;
    private $password;
    private $salt;
    private $activation;
    private $browser;
    
    function getConnection() {
        return $this->connection;
    }

    
    public function __construct() {
        $this->connection = \app\registry\Registry::singleton()->getObject("db");
        //$this->checkLogin(1,"sprava");
    }
    
    
    // momentálne nefunguje, zisťuje počet prihlásení v poslednom čase, aby sa predišlo bruteforcom KED SA VYMYSLI AKO REDIRECT CHYBY, DOROBIT JU AJ TU
    public function checkBrute($user_id) {
        $now = time();
        $now = $now - (30);

        $result = $this->connection->select("time","LOGIN_TRIES", "user_id = ? AND time > " . $now, array($user_id));
            if (count($result) > 3) {
                return true;
            } else {
                return false;
            }
    }
    
    
    // zistuje, či je užívateľ prihlásený
    public function checkLogin($state, $message = null){
        if( isset( $_SESSION["User"], $_SESSION["Check"]) ){
            
            $result = $this->connection->select("id, email, password, salt, activation","USERS", "id = ?", array($_SESSION["User"]));
            $this->setAll( $result["id"],$result["email"],$result["password"],$result["salt"],$result["activation"], $_SERVER['HTTP_USER_AGENT'] );
            
            $user_id = $_SESSION["User"];
            $hash = $_SESSION["Check"];
            
            $browser =  $_SERVER['HTTP_USER_AGENT'];
            $checking_hash = hash('sha512', $this->password . $browser );
            
            if( $checking_hash === $hash ){
                return true;
            }
        }
        
        if( $state == 1 ){
            return false;
        }
        elseif( $state == 2 ){
            header("Location: " . HTML_PATH . 'index.php/error/notlogged');
            exit();
            return false;
        }
    }

    
    // login proste 
    public function login($email, $password) {
        $result = $this->connection->select("id, email, password, salt, activation", "USERS", "email = ? LIMIT 1", array($email));

        if (count($result) !== 0) {
            
            if ($this->checkBrute($result["id"]) == true) {
                return false; // moc vela prihlaseni  
            } 
            else {
                $password = hash('sha512', $password . $result["salt"]);
                
                if ($result["password"] == $password && $result["activation"] == null) {
                    $this->id = $result["id"];
                    $this->email = $result["email"];
                    $this->password = $result["password"];
                    $this->salt = $result["salt"];
                    $this->activation = $result["activation"];
                    $this->browser = $_SERVER['HTTP_USER_AGENT'];
                    
                    // XSS ochrana
                    $this->id = preg_replace("/[^0-9]+/", "", $this->id);
                    $this->email = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $this->email);
                    
                    $_SESSION["User"] = $this->id;
                    $_SESSION["Check"] = hash('sha512', $this->password . $this->browser);
                    return true;
                } 
                else {
                    $now = time();
                    $this->connection->insert("LOGIN_TRIES", "user_id, time","?, ?", array($result["id"],$now) );
                    return false; // zle heslo
                }
            }
        } else {
            return false; // neexistuje uzivatel
        }
    }
    
    
    //
    public function logout(){
        if ( $this->checkLogin(2) ){
            session_unset(); 
            session_destroy();
            start_session();
            
            header("Location: " . HTML_PATH . 'index.php');
            exit();
        }
    }
    
    
    public function setAll($id, $email, $password, $salt, $activation, $browser){;
        $this->setActivation($activation);
        $this->setEmail($email);
        $this->setId($id);
        $this->setPassword($password);
        $this->setSalt($salt);
        $this->setBrowser($browser);
    }
    
    // GETTRE SETTRE
    function getId() {
        return $this->id;
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

    function getActivation() {
        return $this->activation;
    }

    function setConnection($connection) {
        $this->connection = $connection;
    }

    function setId($id) {
        $this->id = $id;
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

    function setActivation($activation) {
        $this->activation = $activation;
    }
    function getBrowser() {
        return $this->browser;
    }

    function setBrowser($browser) {
        $this->browser = $browser;
    }
}
