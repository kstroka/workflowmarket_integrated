<?php $auth = \app\registry\Registry::singleton()->getObject("auth"); ?>

<p> <?php echo $id;?> </p>
<p> <?php echo $name;?> </p>
<p> <?php echo $description;?> </p>
<p> <?php echo $user["first_name"];?> </p>
<p> <?php echo $user["last_name"];?> </p>
<p> <?php echo $user["email"];?> </p>

<?php if( $auth->checkLogin(1) ){ ?>
        <?php for( $i = 0; $i < count($firms); $i++ ){ ?>
                <p><a href="<?php echo HTML_PATH . 'index.php/process/copytofirm/' . $firms[$i]["unique_hash"] . '/' . $firms[$i]["firm_id"] . "/$id"; ?>"> skopírovať proces do firmy: <?php echo $firms[$i]["firm_name"] ?> </a></p>
        <?php } ?>
<?php } ?>



