<form action="<?php echo HTML_PATH . 'index.php/user/registrationandfirm/' . $random_hash . '/' . $firm_id . '/' . '?submitted=yes'; ?>" method="POST" id="form-reg-join-firm"> <!-- formular na registraciu -->
    <input type="text" id="reg-join-firm-fname" value="fero" name="fname">
    <input type="text" id="reg-join-firm-lname" value="laki" name="lname">
    <input type="hidden" id="reg-join-firm-email" value="<?php echo $email; ?>" name="email">
    <input type="password" id="reg-join-firm-passwd" value="fero" name="p">
    <input type="submit" id="reg-join-firm-submit">
</form>