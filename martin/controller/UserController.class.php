<?php

namespace app\controller;

class UserController extends AbstractController {

    private $userModel;
    private $firmModel;
    private $processModel;

    public function __construct() {
        $this->userModel = new \app\model\UserModel;
        $this->firmModel = new \app\model\FirmModel;
        $this->processModel = new \app\model\ProcessModel;
    }

    //aktivuje usera cez usermodel, vymaze mu activation hash
    public function activate($email, $activation) {
        $email = urldecode($email);

        if ($this->userModel->activateUser($email, $activation)) {
            $message = "uspesne";
        } else {
            $message = "neuspesne";
        }
        $this->view("UserView", array(
            "title" => "Aktivácia usera",
            "message" => $message
                ), "user/confirmActivation.php");
    }

    // zmeni cez usermodel password ak su setnute posty a ak sedi 2x nove heslo a stare heslo je take ake ma byt
    public function changePassword() {
        if ($this->firmModel->checkLogin(2)) {

            if (isset($_POST["oldpw"], $_POST["newpw"], $_POST["newpwagain"])) {

                $oldpw = filter_input(INPUT_POST, 'oldpw', FILTER_SANITIZE_STRING);
                $newpw = filter_input(INPUT_POST, 'newpw', FILTER_SANITIZE_STRING);
                $newpwagain = filter_input(INPUT_POST, 'newpwagain', FILTER_SANITIZE_STRING);

                $user = \app\registry\Registry::singleton()->getObject("auth");

                if (!$this->userModel->validatePassword($oldpw) || !$this->userModel->validatePassword($newpw) || !$this->userModel->validatePassword($newpwagain)) {
                    return false;
                }

                if ($newpw == $newpwagain && $user->getPassword() == hash('sha512', $oldpw . $user->getSalt())) {

                    if ($this->userModel->changePassword($_SESSION["User"], hash('sha512', $oldpw . $user->getSalt()), hash('sha512', $newpw . $user->getSalt()))) {
                        echo json_encode("ok");
                        return true;
                    }
                }

                echo json_encode("nepodarilo sa");
                return false;
            } else {
                $this->view("UserView", array("title" => "Zmena hesla"), "user/changepassword.php");
            }
        }
    }

    //zmení permissiony nejakému userovi v danej firme, SESSIONS user sa tu pouziva, zmenit |||
    public function changepermissions($firm_hash, $user_id, $firm_id) {
        if ($this->firmModel->checkLogin(2)) {

            if ($this->userModel->checkUserPermission($firm_id, $_SESSION["User"], "change_user_permissions")) {
                $salt = $this->userModel->getUserAttribute("salt", "id = ?", array($user_id));

                if (hash('sha512', $user_id . $firm_id . $salt["salt"]) === $firm_hash) {

                    if (!empty($_POST['permissions']) && !empty($_POST['completer'])) {
                        $new_user_permissions = [];

                        foreach ($_POST['permissions'] as $selected) {
                            $new_user_permissions[$selected] = 1;
                        }

                        $this->userModel->setUserPermissions($firm_id, $user_id, $new_user_permissions);
                    }

                    $user_permissons = $this->userModel->getUserPermissions($user_id, $firm_id);
                    $this->view("UserView", array("title" => "Zmena práv usera",
                        "user_permissons" => $user_permissons,
                        "firm_hash" => $firm_hash,
                        "user_id" => $user_id,
                        "firm_id" => $firm_id), "user/userPermissions.php");
                } else {
                    echo "vsetko ZLE";
                }
            }
        }
    }

    // userove objednavky, tu sa ukazuju iba skopcene, nie ktore vytvoril
    public function myOrders() {
        if ($this->firmModel->checkLogin(2)) {
            if ($orders = $this->processModel->getUserOrders($_SESSION["User"])) {

                for ($i = 0; $i < count($orders); $i++) {
                    $orders[$i]["firm_name"] = $this->firmModel->getFirmAttribute("firm_name", "firm_id = ? LIMIT 1", array($orders[$i]["firm_id"]))["firm_name"];
                    $this->processModel->getProcess($orders[$i]["pn_id"]);
                    $orders[$i]["pn_name"] = $this->processModel->getName();
                }
            } else {
                $orders = null;
            }

            $this->view("UserView", array("title" => "Mnou skopčené procesy / objednávky",
                "orders" => $orders
                    ), "user/myorders.php");
        }
    }

    // profile
    public function myProfile() {
        if ($this->firmModel->checkLogin(2)) {
            $firms = $this->firmModel->getUsersFirms($_SESSION["User"]);
            $processes = $this->processModel->getProcessesByUserId($_SESSION["User"]);
            $this->userModel->loadUser($_SESSION["User"]);

            $this->view("UserView", array("title" => "Môj profil",
                "firms" => $firms,
                "processes" => $processes,
                "id" => $this->userModel->getId(),
                "first_name" => $this->userModel->getFirst_name(),
                "last_name" => $this->userModel->getLast_name(),
                "email" => $this->userModel->getEmail(),
                "coins" => $this->userModel->getCoins()), "user/myprofile.php");
        }
    }

    // password recovery
    public function passwordRecovery() {
        if (!$this->userModel->checkLogin(1)) {

            if (isset($_POST['email'])) {

                $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    echo json_encode("zly email");
                    return false;
                }
                if ($this->userModel->sendPasswordActivation($email)) {
                    echo json_encode("OK");
                    return true;
                } else {
                    echo json_encode("email neexistuje");
                }
                return false; 
            
            } else {
                $this->view("UserView", array(
                    "title" => "Recovery password"
                        ), "user/passwordRecovery.php");
            }
        } else {
            
        }
    }

    // vymaže usera z users_x_firm cez userModel ||| Pridať redirect 
    public function removeuser($firm_hash, $user_id, $firm_id) {
        if ($this->firmModel->checkLogin(2)) {
            if ($user = $this->userModel->checkUserInFirm($firm_id)) {
                $permissions = $user->getUserPermissions($_SESSION["User"], $firm_id);

                if ($permissions["kick_user"] == 1) {
                    $result = $user->getUserAttribute("salt", "id = ?", array($user_id));

                    if (hash('sha512', $user_id . $firm_id . $result["salt"]) === $firm_hash) {
                        $this->firmModel->removeUserFromFirm($firm_id, $user_id);
                    }
                }
            }
            echo "CHYBA"; // sem dat nejaký view, alebo redirect
        }
    }

    // Mám pocit, že toto nieje dokončené 
    public function registrationandfirm($invitation_hash, $firm_id) {
        if ($this->registration()) {

            $firm = new \app\controller\FirmController();
            $firm->proceedinvitation($invitation_hash, $firm_id);

            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
            $email = filter_var($email, FILTER_VALIDATE_EMAIL);

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode("zly email");
                return false;
            }

            $this->view("UserView", array("title" => "teitle",
                "email" => $email,
                "random_hash" => $invitation_hash,
                "firm_id" => $firm_id)
                    , "user/registrationAndJoinFirm.php");
        }
    }

    //funkcia, ktorá sa volá keď sa príde na user/registration url 
    public function registration() {
        if (!$this->firmModel->checkLogin(1)) {

            if (isset($_POST['email'], $_POST['p'], $_POST['fname'], $_POST['lname'])) {
                return $this->registrationSubmit();
            } else {
                $this->view("UserView", array("title" => "Registrácia", "ahoj" => "totoide"), "user/registration.php");
            }
        } else {
            echo "si prihlaseny uz"; // osetrit;
        }
    }

    // pokiaľ je postnutý formulár, overí v modeli voľnosť emailu a usernamu a modelu dá pokyn na registráciu
    private function registrationSubmit() {

        // validacia udajov 
        $first_name = filter_input(INPUT_POST, 'fname', FILTER_SANITIZE_STRING);
        $last_name = filter_input(INPUT_POST, 'lname', FILTER_SANITIZE_STRING);
        $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
        $email = filter_var($email, FILTER_VALIDATE_EMAIL);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode("zly email");
            return false;
        }
        $password = filter_input(INPUT_POST, 'p', FILTER_SANITIZE_STRING);

        if (!$this->userModel->validatePassword($password)) {
            echo json_encode("slabé heslo");
            return false;
        }

        // check existing v modeli, komunikacia uz s databazou
        if ($this->userModel->checkExisting("email", array($email))) {
            echo json_encode("email uz existuje");
            return false;
        }

        // registracia do databazy
        if ($this->userModel->registrationUser($first_name, $last_name, $email, $password)) {
            echo json_encode("ok");
            return true;
        } else {
            echo json_encode("registrácia neplatná");
            return false;
        }
        //return $this->userModel->registrationUser($first_name, $last_name, $email, $password);
    }

    
    // sem sa cez ajax success call preheadruje stranka po registracii usera
    public function registrationConfirmed() {
        $this->view("UserView", array("title" => "Registrácia dokončená"), "user/confirmRegistration.php");
    }

    
    // z emailu pride na tuto funkciu a ta zisti ci sedi token a email a podla toho nastavi nove heslo useroveri
    public function resetPassword($hash, $recovery_id){
        if (!$this->firmModel->checkLogin(1)){
            
            if( $this->userModel->setNewPassword($hash, $recovery_id) ){
                $message = "ok";
            } else {
                $message = "nevyslo to";
            }
            $this->view("UserView", array(
                        "title" => "Zmena hesla",
                        "message" => $message
            ), "user/passwordReset.php");
        }
    }
    
    // funkcia ktora prida do databazy USER_X_FIRM usera
    public function signuser($firm_id) {
        if ($this->firmModel->checkLogin(2) && !$this->userModel->isInFirm($_SESSION["User"], $firm_id)) {

            if ($this->firmModel->checkPassword($firm_id)) { // ma nastavene heslo
                if (isset($_POST['p'])) {
                    $this->signUserToFirm($firm_id);
                } else {
                    $this->view("FirmView", array("title" => "Profil firmy",
                        "firm_id" => $firm_id
                            ), "user/sign.php");
                }
            } else {
                $permissions = $this->firmModel->getDefaultPermissions($firm_id);

                if ($this->firmModel->createFirmUser($_SESSION["User"], $firm_id, $permissions)) {
                    echo json_encode("ok");
                    return true;
                }
            }
        }
    }

    // druha cast funkcie, ktora handluje formulár s heslom
    private function signUserToFirm($firm_id) {

        $password = filter_input(INPUT_POST, 'p', FILTER_SANITIZE_STRING);

        if ($this->firmModel->validateFirmPassword($firm_id, $password)) {
            echo json_encode("ok");
            $result = $this->firmModel->getDefaultPermissions($firm_id);
            $this->firmModel->createFirmUser($_SESSION["User"], $firm_id, $result["firm_default_permissions"]);
        } else {
            echo json_encode("nieco sa nepodarilo");
        }
    }

    // GETRE, SETRE
    public function getUserModel() {
        return $this->UserModel;
    }

}
