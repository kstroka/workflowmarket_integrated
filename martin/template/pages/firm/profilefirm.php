<?php $auth = \app\registry\Registry::singleton()->getObject("auth"); ?>

<?php include_once ($main_path); ?>

    <?php
    if( $auth->checkLogin(1) ){
        ?>
        <p> moje tasky v tejto firme: </p>
        <!-- vypis veci z firmy -->
        <?php
        echo $firm_id, PHP_EOL, $firm_name, PHP_EOL, "počet vytvorených procesov:" . $firm_self_processes, PHP_EOL, "počet okopčených procesov:" . $firm_copied_processes;
        ?>
        
        <!-- čast userov -->
        <?php for ($i = 0; $i < count($users); $i++) { ?>
            <div>
                <p> <?php echo "do tejto firmy patrí user s idčkom:" . $users[$i]->getId(); ?>
            </div>
        <?php } ?>
        
        <!-- čast procesov -->
        <?php if( array_filter($processes) ) { ?>
        
            <?php for ($i = 0; $i < count($processes); $i++) { ?>
                <div>
                    <p> <?php echo "Patrí sem proces:" . $processes[$i]["name"]; ?>
                </div>
            <?php } ?>
        
        <?php } ?>
        
        <?php
        // konec isset session user, ktory aj tak pojde prec a pride lepsia autentifikacia
    } else {
        echo "niesi prihlaseny, co by si chcel videt?";
    }
    ?>