
    <?php
    echo $firm_id, PHP_EOL, $firm_name, PHP_EOL, "počet vytvorených procesov:" . $firm_self_processes, PHP_EOL, "počet okopčených procesov:" . $firm_copied_processes;
    ?>
    <!-- čast userov -->
    <?php for ($i = 0; $i < count($users); $i++) { ?>
        <div>
            <p> <?php echo "do tejto firmy patrí user s idčkom:" . $users[$i]->getFirst_Name(); ?>
        </div>
    <?php } ?>
    
    <p> <?php echo "desc tejto firmy:" . $firm_description; ?></p>
    <p> <?php echo "vytvorená firma v dni:" . $firm_created_date; ?></p>
    
    <!-- testovanie ci uz je user vo firme, alebo nie. Moze sa pridat ak este nie -->
    <?php if (isset($alreadySigned) && $alreadySigned === false) { ?>
        <div>
            <p><a href="<?php echo HTML_PATH . "index.php/user/signuser/" . $firm_id; ?>"> Pripojiť sa do firmy </a></p>
        </div>
    <?php } ?>
	