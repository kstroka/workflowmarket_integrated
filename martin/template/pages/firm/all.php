<form action=" <?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?> " method="GET">
    <?php for( $i = 0; $i <= count($sort); $i++ ){ ?>
            <p><a href=" <?php echo $sort["url"][$i]; ?> "> <?php echo $sort["name"][$i]; ?> </a></p> 
    <?php } ?>
</form>

<?php echo "Počet nájdených firiem: " . $items; ?>

<?php for( $i = 0; $i < count($firms); $i++ ){ ?>
    
        <p><a href=" <?php echo HTML_PATH . "index.php/firm/profile/" . $firms[$i]["firm_id"] ?> "> 
            <?php echo $firms[$i]["firm_id"] . " " . $firms[$i]["firm_name"] . " " .
                        $firms[$i]["firm_self_processes"] . " " . $firms[$i]["firm_copied_processes"] . " počet procesov: " . 
                        $firms[$i]["processes"] . " počet userov: " . $firms[$i]["users"]; ?> 
        </a></p>
    
<?php } ?>

<?php for( $i = 0; $i < count($pagination["name"]); $i++ ){ ?>
        <p><a href=" <?php echo $pagination["url"][$i]; ?> "> <?php echo $pagination["name"][$i]; ?> </a></p> 
<?php } ?>