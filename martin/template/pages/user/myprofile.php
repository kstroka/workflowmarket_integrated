<h1> <?php echo $first_name . " " .  $last_name; ?></h1>
<p> <?php echo $email; ?></p>
<p>počet peňazí:  <?php echo $coins; ?></p>
<p><a href="<?php echo HTML_PATH . "index.php/user/changepassword" ?>"> Zmeniť heslo </a></p>

<h2> Firmy v ktorých som pridaný </h2>

<?php
    for($i = 0; $i < count($firms); $i++){
?>
        <p><a href="<?php echo HTML_PATH . "index.php/firm/profilefirm/{$firms[$i]['firm_id']}"; ?>"> <?php echo $firms[$i]["firm_name"]; ?> </a></p>
<?php
    }
?>

<h2> Procesy, ktoré som vytvoril </h2>
<?php
    for($i = 0; $i < count($processes); $i++){
?>
        <p><a href="#"> <?php echo $processes[$i]["name"] . " ______plus dame niekam urlku?"; ?> </a></p>
<?php
    }
?>
       
<p><a href="<?php echo HTML_PATH . "index.php/user/myorders"; ?>"> Moje skopírovania </a></p>