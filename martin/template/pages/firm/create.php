<?php $auth = \app\registry\Registry::singleton()->getObject("auth"); ?>

    <script src="<?php echo HTML_PATH; ?>template/js/jsfirm.js" type="text/javascript"></script>
    <?php
    if( $auth->checkLogin(1) ){
        ?>
        <form action="index.php" method="POST" id="firm-create">
            <input type="text" id="firm-name">
            <input type="checkbox" name="firm-strategy" id="firm-strategy">
            <input type="password" id="firm-passwd">
            
            <textarea id="firm-description" placeholder="firm description"></textarea>

            <p> nastavenie defaultnych prav pre noveho uzivatela</p>
            <input type="checkbox" name="firmp-roles-processes" id="firm-perm0">
            <input type="checkbox" name="firmp-assign-to-role" id="firm-perm1">
            <input type="checkbox" name="firmp-invite-user" id="firm-perm2">
            <input type="checkbox" name="firmp-kick-user" id="firm-perm3">
            <input type="checkbox" name="firmp-change-user-permissions" id="firm-perm4">
            <input type="checkbox" name="firmp-delete-firm" id="firm-perm5">

            <input type="submit" id="firm-submit">
        </form>
<?php } else { ?>



<?php } ?>
