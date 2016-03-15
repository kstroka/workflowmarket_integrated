<?php
function var_dum($mixed = null) { echo '<pre>'; var_dump($mixed); echo '</pre>'; return null; }
    
    function errors($errors){
        $errors = serialize($errors);
        $errors = $errors . "\n";
        error_log($errors, 3, "E:/xampp/htdocs/bc/errory.txt");
    }
    
    function unsetFromMultiArray($var,$key,$value) {

    foreach($var as $index => $val) {
        if($val[$key] == $value){
            unset( $var[$index] );
        } 
    }
    return $var;
}