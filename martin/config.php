<?php
    define("ROOT_PATH" , "http://localhost/workflowmarket_integrated/"); // definovane aj v template/js/define.js
    define("SITE_PATH" , str_replace("\\","/",dirname(__FILE__) . "/"));
    define("HTML_PATH" , "http://localhost/workflowmarket_integrated/martin/"); // definovane aj v template/js/define.js
    
    define("ROUTER_BASE" , "workflowmarket_integrated/martin/index.php/"); // define pre core/objects/router

    //define("DBHOST", "localhost"); // mockup.sk
    define("DBHOST", "db55.websupport.sk:3310");
    define("DBNAME", "testbcz");
    define("DBUNAME", "testbcz");
    define("DBPW", "gabojepan");
    
    //define("DBSOCKET", "mysql:unix_socket"); // mockup.sk
    define("DBSOCKET", "mysql:host="); // localhost
    
    