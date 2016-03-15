<?php namespace app\controller;

class IndexController extends AbstractController {
    
    private $firmModel;
    private $userModel;
    private $processModel;

    public function __construct() {
        $this->firmModel = new \app\model\FirmModel;
        $this->userModel = new \app\model\UserModel;
        $this->processModel = new \app\model\ProcessModel;
    }
    
    public function index(){
        $processes = $this->processModel->getBestProcesses(4);
        $firms = $this->firmModel->getBestFirms(4);
        //var_dum($firms);
        $this->view("UserView", array("title" => "Index"),"body.php");
    }
    
}
