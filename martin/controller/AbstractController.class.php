<?php namespace app\controller;

class AbstractController {
    private $view;
    
    public function index(){
        
    }
    
    public function view($type,$fields, $body, $header = "header.php", $footer = "footer.php"){
        $this->setView($type, $body, $header, $footer);
        $this->view->renderAll($fields);
    }
    
    public function setView($type, $body, $header, $footer){
        //$string = "\app\\view\\" . $type . "(" . "$body,$header,$footer" . ")";
        $string = "\app\\view\\" . $type;
        $this->view = new $string($body, $header, $footer);
    }
    
}
