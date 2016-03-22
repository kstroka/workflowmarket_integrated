<?php

namespace app\controller;

class ProcessController extends AbstractController {
    private $firmModel;
    private $userModel;
    private $processModel;
    
    public function __construct() {
        $this->firmModel = new \app\model\FirmModel;
        $this->userModel = new \app\model\UserModel;
        $this->processModel = new \app\model\ProcessModel;
    }
    

    // kopčne proces do firmy ||| vybrat realne udaje a tie ukazat userovi ||| zvysit firm_copied_processes o jedno
    public function copyToFirm($hash,$firm_id,$process_id){
        $firm_salt = $this->firmModel->getFirmAttribute("firm_name, firm_salt", "firm_id = ?", array($firm_id));
        
        if( $this->processModel->checkUniqueProcessUserFirmHash($hash, $firm_salt["firm_salt"], $process_id, $_SESSION["User"]) && !$this->processModel->checkDuplicateProcessesInFirm($firm_id, $process_id) && $this->firmModel->checkLogin(2) ){
            $new_id = $this->processModel->copyToFirm($firm_id, $process_id, $_SESSION["User"]);
            $order = $this->processModel->getOrder($new_id);
            $this->processModel->getProcess($process_id);
            
            $this->processModel->copyRolesToFirm($firm_id, $process_id);

            $this->view("ProcessView",
                    array("title" => "Objednávka procesu",
                            "order_id" => $order["id"],
                            "process_name" => $this->processModel->getName(),
                            "firm_name" => $firm_salt["firm_name"],
                            "order_date" => $order["created_date"]
                ), "process/copiedProcess.php");
        }
    }
    
    
    // funkcia na výpis procesov, môže byť vyfiltrovaný podľa stringu
    public function show($param = null) {
        $items_per_page = 2;
        $sort = $_GET["sort"];
        $p = $_GET["page"];
        $string = htmlspecialchars($_SERVER["PHP_SELF"]) . "?";
        
        if( !isset( $_GET["sort"] ) || !is_numeric($_GET["sort"]) ){
            $sort = "0";
        }
        if( !isset( $_GET["page"] ) || !is_numeric($_GET["page"]) ){
            $p = "1";
        }
        
        $items = $this->processModel->getAllProcesses($param);
        $items = count($items);
        
        $result = $this->processModel->getAllProcesses($param, $items_per_page, $sort, $p);
        $pages = ceil($items / $items_per_page);
        $string = htmlspecialchars($_SERVER["PHP_SELF"]) . "?" . "&sort=$sort" . "&page=$p"; 
        
        $sorts = array( "name" => array( "najlepsie", "najnovsie", "najvykejsovanejsie" ) );
        for($i = 0; $i < 3 ;$i++){
            $wtf = 'sort=' . ($i+1);
            $sorts["url"][] = str_replace("sort=$sort", $wtf, $string);
        }

        $page = [];
        for($i = 0; $i < $pages ; $i++){
            $page["name"][] = ($i+1);
            $wtf = 'page=' . ($i+1);
            $page["url"][] = str_replace("page=$p", $wtf, $string);
        }
        
        $this->view("ProcessView", array(
            "title" => "Výpis procesov",
            "pages" => $pages,
            "sort" => $sorts,
            "items" => $items,
            "pagination" => $page,
            "processes" => $result
        ), "process/listing.php");
    }
    
    
    // zobrazí profil procesu a zistí, pre ktoré firmy si ho vie user nakopírovať
    public function profile($process_id){
        $this->processModel->getProcess($process_id);
        $this->userModel->getProcessOwner($process_id);
        
        if ( $this->firmModel->checkLogin(1) ){
            $firms = $this->firmModel->getAvailibleFirmsForCopyingProcess($this->processModel->getId(), $_SESSION["User"], array("roles_processes"));
            
            for( $i = 0; $i < count($firms); $i++ ){
                $firms[$i]["unique_hash"] = $this->processModel->createUniqueProcessUserFirmHash($firms[$i]["firm_salt"], $process_id, $_SESSION["User"]);
            }
        }
        
        $this->view("ProcessView",
                array("title" => "Profil procesu brasko",
                        "id" => $this->processModel->getId(),
                        "name" => $this->processModel->getName(),
                        "description" => $this->processModel->getDescription(),
                        "firms" => $firms,
                        "user" => array("first_name" => $this->userModel->getFirst_name(),"last_name" => $this->userModel->getLast_name(), "email" => $this->userModel->getEmail())
                ), "process/profile.php");
    }
    
    
    /*public function test(){
        $this->processModel->test();
    }*/
    
}
