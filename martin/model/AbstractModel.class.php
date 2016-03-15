<?php namespace app\model;

abstract class AbstractModel {
    private $auth;
    
    public function checkLogin($state){
        $this->auth = \app\registry\Registry::singleton()->getObject("auth");
        if( $this->auth->checkLogin($state) ){
            return true;
        } else {
            return false;
        }
    }
}
