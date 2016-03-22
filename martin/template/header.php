<?php $auth = \app\registry\Registry::singleton()->getObject("auth"); ?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="<?php echo ROOT_PATH; ?>global/vendor/global.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo ROOT_PATH; ?>global/vendor/normalize.css" />

        <script src="<?php echo ROOT_PATH; ?>global/vendor/jquery-1.11.3.min.js" type="text/javascript"></script>
        <script src="<?php echo ROOT_PATH; ?>global/js/define.js" type="text/javascript"></script>
        <script src="<?php echo ROOT_PATH; ?>global/js/function.js" type="text/javascript"></script>

        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title> <?php echo $title; ?> </title>
    </head>

    <body>

        <div class="wrapper">

            <!-- TUTO TREEEEBA ZISTIT AKO TO JE S VIEW A TIETOOO BLBOSTIIIIIIIII -->
            <?php
            
            if ( !$auth->checkLogin(1) ) {  // zobrazi sa to iba neprihlasenym 
                include_once(SITE_PATH . "template/pages/login_reg_forms.php");
            }
            ?>
            
            <div class="banner">
                <div class="content container">
                    <div class="tip-text">
                         Vyskusajte ako nakupovat
                    </div>
                    <div class="navigation">
                        <div class="banner-td forms">
                            <a href="../jan/index.html">Vytváranie formulárov</a>
                        </div>

                        <div class=" banner-td contact">
                            <a href="/">Kontakt</a>
                        </div>

                        <div class=" banner-td license">
                            <a href="/">Obchodné podmienky</a>
                        </div>

                        <div class=" banner-td howto">
                            <a href="/">Ako nakupovať</a>
                        </div>
                        <div class="banner-td telephone-number ">
                            <a href="tel:+421919437635">+421 919 437 635</a>
                        </div>

                    </div>
                </div>
            </div>
            
            
            
            
            <div class="masthead">
                <div class="content container">
                    
                    <div class="logo"> <img src="<?php echo ROOT_PATH; ?>global/content/logo.jpg" alt="logo"/> </div>
                    
                    <?php if ( $auth->checkLogin(1) ){ ?>
                    
                        <div id="main-menu-logged" class="login-register">

                            <div class="login">
                                <i class="icon icon-door24"></i>
                                <a href="#"><?php if (isset($_SESSION["User"])) echo $_SESSION["User"]; ?></a>
                            </div>

                            <div class="login">
                                <i class="icon icon-door24"></i>
                                <a href="<?php echo HTML_PATH . 'index.php/firm/create' ?>"> Vytvoriť firmu </a>
                            </div>

                            <div class="register">
                                <i class="icon icon-locked61"></i>
                                <a href="<?php echo HTML_PATH . 'index.php/auth/logout' ?>"> Odhlásiť </a>
                            </div>

                        </div>
                    
                    <?php } else { ?>
                    
                        <div class="login-register">

                            <div class="login">
                                <i class="icon icon-door24"></i>
                                <a id="main-menu-login" href="#">Prihlásenie</a>
                            </div>

                            <div class="register">
                                <i class="icon icon-locked61"></i>
                                <a id="main-menu-reg" href="<?php echo HTML_PATH . 'index.php/user/registration' ?>">Registrácia</a>
                            </div>

                        </div>
                    
                    <?php } ?>

                </div> <!-- /.content container -->
            </div> <!-- /.masthead -->
            <!-- -->

