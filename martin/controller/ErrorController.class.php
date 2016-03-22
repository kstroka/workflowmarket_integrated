<?php

namespace app\controller;

class ErrorController extends AbstractController {
   
    
    public function index(){
        $this->view("ErrorView", array("title" => "Chyba"), "error/error.php");
    }
    
    public function notLogged(){
        $this->view("ErrorView", array("title" => "Nieste prihlásený"), "error/notLogged.php");
    }
}
