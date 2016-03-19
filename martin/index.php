<?php       
    require_once("config.php");
    require_once("includes/start_session.php");
    require_once("core/Registry.class.php");
    require_once("includes/functions.php");
    require_once("includes/errors.php");
    
    start_session();
    //session_start();
    
    $registry = \app\registry\Registry::singleton();
    
    $registry->storeObject('Autoloader', 'autoloader');
    $registry->getObject("autoloader")->register(); // v tejto funkcii su aj napevno zadefinovane namespacy
    
    $registry->storeObject('Database', 'db');
    $registry->storeObject('Authentication', 'auth');
    
    $registry->storeObject('Router', 'router');
    $registry->getObject("router")->run();
    
    // pridat namespacy do "core/registry/objects classes"
    // ovalidovat funkcie ze ci su prihlasení, vo firme, práva,... niektoré funkcie to nemajú
    // bug: po viacnasobnom refreshi sa stratia sessiony CHYBA JE V session_start() metode, ktora robi secured sessiony, neviem presne ale kde.
?>

