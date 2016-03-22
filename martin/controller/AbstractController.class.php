<?php namespace app\controller;

class AbstractController {
    private $view;
    
    public function index(){
        
    }
    
    public function view($type,$fields, $body,$carousel = "subCarousel.php", $header = "header.php", $footer = "footer.php"){
        $this->setView($type, $body, $carousel, $header, $footer);
        $this->view->renderAll($fields);
    }
    
    public function setView($type, $body, $carousel, $header, $footer){
        $string = "\app\\view\\" . $type;
        $this->view = new $string($body, $carousel, $header, $footer);
    }
    
}
