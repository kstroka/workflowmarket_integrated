<?php

namespace app\controller;

class FirmController extends AbstractController {
    
    private $firmModel;
    private $userModel;
    private $processModel;

    
    public function __construct() {
        $this->firmModel = new \app\model\FirmModel;
        $this->userModel = new \app\model\UserModel;
        $this->processModel = new \app\model\ProcessModel;
    }

    
    //funkcia dá pokyn modelu aby zistil všetky firmy z databázy a includuje view ktorý ich zobrazí
    public function all($param = null) {
        $items_per_page = 3;
 
        $string = htmlspecialchars($_SERVER["PHP_SELF"]) . "?";
        
        if( !isset( $_GET["sort"] ) || !is_numeric( $_GET["sort"]) ){
            $sort = "0";
        } else {
            $sort = $_GET["sort"];
        }
        if( !isset( $_GET["page"] ) || !is_numeric( $_GET["page"]) ){
            $p = "1";
        } else {
            $p = $_GET["page"];
        }
        
        $items = $this->firmModel->getAll($param);
        $items = count($items);
        $pages = ceil($items / $items_per_page);
        
        $result = $this->firmModel->getAll($param, $items_per_page, $sort, $p);
        $string = htmlspecialchars($_SERVER["PHP_SELF"]) . "?" . "&sort=$sort" . "&page=$p"; 
        
        $sorts = array( "name" => array( "najviac procesov", "najviac userov", "default" ) );
        for($i = 0; $i < 3 ;$i++){
            $wtf = 'sort=' . ($i+1);
            $sorts["url"][] = str_replace("sort=$sort", $wtf, $string);
        }

        $page = null;
        for($i = 0; $i < $pages ; $i++){
            $page["name"][] = ($i+1);
            $wtf = 'page=' . ($i+1);
            $page["url"][] = str_replace("page=$p", $wtf, $string);
        }
        
        $this->view("UserView", 
                array("title" => "Výpis všetkých firiem",
                    "firms" => $result,
                    "items" => $items,
                    "pagination" => $page,
                    "sort" => $sorts
                    ), 
                "firm/all.php");
    }

    
    // includuje view s formulárom pre create a pri vyplnení formuláru spustí funkciu createFirm 
    public function create() {
        if ( $this->firmModel->checkLogin(1) ) {
            if (isset($_POST['name'], $_POST['strat'], $_POST['p'], $_POST['p0'], $_POST['p1'], $_POST['p2'], $_POST['p3'], $_POST['p4'], $_POST['p5'])) {
                $this->createFirm(); 
            } else {
                $this->view("FirmView", array("title" => "Vytvoriť firmu"), "firm/create.php");
            }
            
        }
    }

    
    // funkcia zistí či je formulár odoslaný a spracuje vstupy, ktoré odošle do modela a ten vyhodnotí či je možné vytvoriť firmu 
    private function createFirm() {
        
            $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
            $passwd = filter_input(INPUT_POST, 'p', FILTER_SANITIZE_STRING);
            
            if( isset($_POST['desc']) && $_POST['desc'] != "" ) {
                $description = $_POST['desc'];
            } else {
                $description = null;
            }
            
            if( filter_var($_POST["strat"], FILTER_VALIDATE_BOOLEAN) === false ){              
                $passwd = null;
            }
            

            $binaryperm = '';
            for ($i = 0; $i < 6; $i++) {
                if (filter_var($_POST["p" . "$i"], FILTER_VALIDATE_BOOLEAN) === true) {
                    $binaryperm = $binaryperm . '1';
                } else {
                    $binaryperm = $binaryperm . '0';
                }
            }

            if ($this->firmModel->checkExisting("firm_name", array($name))) {
                echo json_encode("uz existuje nazov");
                return false;
            }
            if ($this->firmModel->createFirm($name,$description, $passwd, bindec($binaryperm))) {
                echo json_encode("ok");
                return true;
            } else {
                echo json_encode("chyba");
                return false;
            }
        
    }
    
    
    // vymaze firmu, necakane
    public function deleteFirm($firm_id){
        if ( $this->firmModel->checkLogin(2) ) {
            
            if($this->userModel->checkUserPermission($firm_id, $_SESSION["User"], "delete_firm")){
                $this->firmModel->deleteFirm($firm_id);
                
                header("Location: " . HTML_PATH . 'index.php/firm/usermanagement/' . $firm_id);
                exit();
            }
        }
        
    }

    
    //clovek dostane linku z mailu ktora vedie na tuto funkciu, zisti ci sedi invite a potom bud ukaze registracny formular ak email este neexistuje, ak existuje tak usera prida do firmy
    public function proceedinvitation($random_hash, $firm_id) {
        if ($email = $this->firmModel->getInvitationEmail($random_hash, $firm_id)) {

            if ($this->userModel->checkExisting("email", array($email))) {
                
                if ($result = $this->userModel->getUserAttribute("id", "email = ?", array($email))) {

                    $permissions = $this->firmModel->getDefaultPermissions($firm_id);
                    $this->firmModel->createFirmUser($result["id"], $firm_id, $permissions["firm_default_permissions"]);
                    $this->firmModel->deleteInvitation($random_hash, $firm_id, $email);
                }
            } else {
                $this->view("UserView", 
                        array("title" => "Vytveqeqeqoriť firmu",
                            "email" => $email,
                            "random_hash" => $random_hash,
                            "firm_id" => $firm_id), 
                "user/registrationAndJoinFirm.php");
            }
        } else {
            header("Location: " . HTML_PATH . 'index.php/error');
            exit();
        }
    }

    
    //funkcia zobrazí profil firmy podľa parametru $firm_id ||||| tu este asi pridu aj procesy a dalsie junky |||||
    public function profile($firm_id) {
        
        $this->userModel->findAllInFirm($firm_id);
        $this->firmModel->find($firm_id);

        if ( $this->firmModel->checkLogin(1) ) {
            $alreadySigned = $this->userModel->isInFirm($_SESSION["User"], $this->firmModel->getFirm_Id());
        }
        $this->view("FirmView", 
                        array("title" => "Profil firmy",
                            "firm_id" => $this->firmModel->getFirm_id(),
                            "firm_name" => $this->firmModel->getFirm_name(),
                            "firm_description" => $this->firmModel->getFirm_description(),
                            "firm_self_processes" => $this->firmModel->getFirm_self_processes(),
                            "firm_copied_processes" => $this->firmModel->getFirm_copied_processes(),
                            "firm_created_date" => $this->firmModel->getFirm_created_date(),
                            "users" => $this->userModel->getUsers(),
                            "alreadySigned" => $alreadySigned
                        ), 
                "firm/profile.php");
    }
    

    // funkcia zobrazí profil kde uz bude aj dalsie menu so vsetkym 
    public function profilefirm($firm_id) {
        if ( $this->firmModel->checkLogin(2) ){
            $this->firmModel->find($firm_id);
                
            if ($this->userModel->isInFirm($_SESSION["User"], $this->firmModel->getFirm_Id())) {

                $this->userModel->findAllInFirm($firm_id);
                $permissions = $this->userModel->getUserPermissions($_SESSION["User"], $this->firmModel->getFirm_Id());
                $processes = $this->processModel->getProcessesByFirmId($firm_id);
                        
                $this->view("FirmView", 
                        array("title" => "Profil firmy",
                            "main_path" => SITE_PATH . "template/pages/firm/profilefirmMenu.php",
                            "permissions" => $permissions,
                            "firm_id" => $firm_id,
                            "firm_name" => $this->firmModel->getFirm_name(),
                            "firm_self_processes" => $this->firmModel->getFirm_self_processes(),
                            "firm_copied_processes" => $this->firmModel->getFirm_copied_processes(),
                            "processes" => $processes,
                            "users" => $this->userModel->getUsers()),
                        "firm/profilefirm.php");
                
            } else {
                $this->view("FirmView", array("title" => "Profil firmy - niesi vo firme"), "firm/profilefirmNoUserSigned.php");
            }
        }
    }

    
    // poslať pozvánku do firmy
    public function sendinvitation($firm_id) {
        if ( $this->firmModel->checkLogin(2) ){
            
            if ($user = $this->userModel->checkUserInFirm($firm_id)) {

                $permissions = $user->getUserPermissions($_SESSION["User"], $firm_id);

                if ($permissions["invite_user"] == 1) {

                    if (isset($_GET["submitted"])) {

                        if (isset($_POST['email'])) {

                            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
                            $email = filter_var($email, FILTER_VALIDATE_EMAIL);

                            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                                echo json_encode("zly email");
                                return false;
                            }

                            $this->firmModel->sendInvitation($email, $firm_id);
                        }
                    }
                }
            }
        }
    }


    // Zobrazí formulár na odoslanie pozvánky, všetkých userov a pri nich možnosti na kick, ale zmenu permissions. Samozrejme pokiaľ nato má užívateľ práva 6.1.2016
    public function usermanagement($firm_id) {
        if ( $this->firmModel->checkLogin(2) ){
            
            if ($user = $this->userModel->checkUserInFirm($firm_id)) {

                if ($user->checkUserManagementPermissions($_SESSION["User"], $firm_id)) {

                    $user->findAllInFirm($firm_id);

                    $permissions = $user->getUserPermissions($_SESSION["User"], $firm_id);
                    $this->view("FirmView", array("title" => "Profil firmy - user management",
                        "permissions" => $permissions,
                        "firm_id" => $firm_id,
                        "users" => $user->getUsers()
                            ), "firm/userManagement.php");
                } else {
                    echo "nemas prava";
                }
            } else {
                echo "problem";
            }
        }
    }

    public function getFirmModel() {
        return $this->firmModel;
    }

    public function setFirmModel($firmModel) {
        $this->firmModel = $firmModel;
    }

}
