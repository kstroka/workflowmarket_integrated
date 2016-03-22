<?php $auth = \app\registry\Registry::singleton()->getObject("auth"); ?>

    <script src="<?php echo HTML_PATH; ?>template/js/jsuser.js" type="text/javascript"></script>
    <?php if( $auth->checkLogin(1) ){ ?>
    
    <form action="<?php echo HTML_PATH . 'index.php/user/signuser/' . $firm_id . '?submitted' ?>" method="POST" id="firm-signuser">
        <input type="password" id="firm-sign-passwd">
        <input type="submit" id="firm-sign-submit" data-id="<?php echo $firm_id; ?>">
    </form>
    
    <?php } ?>
