<?php

namespace app\controller;

class AuthController extends AbstractController {

    private $userModel;
    private $auth;

    public function __construct() {
        $this->auth = \app\registry\Registry::singleton()->getObject("auth");
        $this->userModel = new \app\model\UserModel;
    }

    // tato funkcia sa vola ajaxovym volanim zo suboru template/js/function.js
    public function login() {
        $email = filter_input(INPUT_POST, "email");
        $password = filter_input(INPUT_POST, "p");

        if (isset($email, $password) && $email !== false && $password !== false) {

            if ($this->auth->login($email, $password)) {
                echo json_encode("ok");
                return true;
            }
        }
        echo json_encode("zle prihlasovacie udaje");
        return false;
    }
    
    
    // logoutne usera   
    public function logout(){ 
        if( $this->auth->checkLogin(2) ){
            $this->auth->logout();
        }
    }
    

    // zisti ci sa submitol formular a zavola dalsiu funkciu
    public function registration() {
        
        if (isset($_GET["submitted"])) {
            $this->registrationSubmit();
        } else {
            
        }
    }

    // pokiaľ je postnutý formulár, overí v modeli voľnosť emailu a usernamu a modelu dá pokyn na registráciu
    private function registrationSubmit() {
        if (isset($_POST['email'], $_POST['p'], $_POST['usern'])) {

            // validacia udajov 
            $username = filter_input(INPUT_POST, 'usern', FILTER_SANITIZE_STRING);
            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
            $email = filter_var($email, FILTER_VALIDATE_EMAIL);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode("zly email");
                return false;
            }
            $password = filter_input(INPUT_POST, 'p', FILTER_SANITIZE_STRING);


            // check existing v modeli, komunikacia uz s databazou
            if ($this->userModel->checkExisting("email", $email, $this->connection)) {
                echo json_encode("email uz existuje");
                return false;
            }
            if ($this->userModel->checkExisting("username", $username, $this->connection)) {
                echo json_encode("username uz existuje");
                return false;
            }

            // registracia do databazy
            var_dump($_POST['email'], $_POST['p'], $_POST['usern'], $username, $email, $password, $this->connection);
            return $this->userModel->registrationUser($username, $email, $password);
        }
    }

}
