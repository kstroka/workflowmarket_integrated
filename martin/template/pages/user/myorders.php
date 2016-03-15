<?php for( $i = 0; $i < count($orders); $i++ ){ ?>
        <p> Objednávka číslo: <?php echo $orders[$i]["id"] . " Názov procesu:" . $orders[$i]["pn_name"] . " do firmy {$orders[$i]["firm_name"]}" . " vytvorená: {$orders[$i]['created_date']}" ?> </p>
<?php } ?>