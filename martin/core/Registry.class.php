<?php namespace app\registry;

class Registry {

    private static $objects = array();
    private static $settings = array();
    private static $instance;
    
    private function __construct(){
    }
 
    
    public function __clone(){
    }

    
    public function storeObject( $object, $key ){
        require_once('objects/' . $object . '.class.php');
        self::$objects[ $key ] = new $object( self::$instance );
     }

     
    public function getObject( $key ){
        if( is_object ( self::$objects[ $key ] ) ){
            return self::$objects[ $key ];
        }
    }
    
    
    public static function singleton(){
        if( !isset( self::$instance ) ){
            $obj = __CLASS__;
            self::$instance = new $obj;
        }

        return self::$instance;
    }

    
    public function storeSetting( $data, $key ){
        self::$settings[ $key ] = $data;
    }

    
    public function getSetting( $key ){
        return self::$settings[ $key ];
    }
}
