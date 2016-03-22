<script src="<?php echo HTML_PATH; ?>template/js/jsuser.js" type="text/javascript"></script>

<form action="<?php echo HTML_PATH . 'index.php/user/changepassword'; ?>" method="POST" id="form-changepw"> <!-- formular na zmenu passwordu -->
    <input type="password" id="changepw-oldpw" placeholder="staré heslo">
    <input type="password" id="changepw-newpw" placeholder="nové heslo">
    <input type="password" id="changepw-newpwagain" placeholder="nové heslo opakuj">
    <input type="submit" id="changepw-submit">
</form>