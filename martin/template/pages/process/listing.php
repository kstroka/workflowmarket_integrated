<form action=" <?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?> " method="GET">
    <?php for( $i = 0; $i <= count($sort); $i++ ){ ?>
            <p><a href=" <?php echo $sort["url"][$i]; ?> "> <?php echo $sort["name"][$i]; ?> </a></p> 
    <?php } ?>
</form>

<?php echo "Počet nájdených procesov: " . $items; ?>

<?php for( $i = 0; $i < count($processes); $i++ ){ ?>
    
        <p><a href=" <?php echo HTML_PATH . "index.php/process/profile/" . $processes[$i]["id"] ?> "> 
            <?php echo $processes[$i]["id"] . " " . $processes[$i]["name"] . " " . $processes[$i]["created_date"] . " " . $processes[$i]["created_by"] . " " . $processes[$i]["bla"]; ?> 
        </a></p>
    
<?php } ?>

<?php for( $i = 0; $i < count($pagination["name"]); $i++ ){ ?>
        <p><a href=" <?php echo $pagination["url"][$i]; ?> "> <?php echo $pagination["name"][$i]; ?> </a></p> 
<?php } ?>
