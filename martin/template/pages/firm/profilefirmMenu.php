
    <?php
    if (isset($permissions["roles_processes"])) {
        ?>
        <p><a href=" <?php echo HTML_PATH . 'index.php/firm/palo/'; ?> "> Manažment rolí </a></p>
        <p><a href=" <?php echo HTML_PATH . 'index.php/firm/tomas/'; ?> "> Add, edit proces </a></p>
        <p><a href=" <?php echo HTML_PATH . 'index.php/firm/neviem_ale_ja_urcite_nie/'; ?> "> Delete proces </a></p>

        <?php
    }
    ?>

    <?php
    if (isset($permissions["assign_user_to_role"])) {
        ?>
        <p><a href=" <?php echo HTML_PATH . 'index.php/firm/palo/'; ?> "> Manažment rolí / Mapovanie userov na role </a></p>
        <?php
    }
    ?>

    <?php
    if (isset($permissions["kick_user"]) || isset($permissions["invite_user"]) || isset($permissions["change_user_permissions"])) {
        ?>
        <p><a href=" <?php echo HTML_PATH . 'index.php/firm/usermanagement/' . $firm_id; ?> "> Manažment userov </a></p>
        <?php
    }
    ?>


    <?php
    if (isset($permissions["delete_firm"])) {
        ?>
        <p><a href=" <?php echo HTML_PATH . 'index.php/firm/delete/' . $firm_id; ?> "> Zabiť firmu </a></p>
        <?php
    }
    ?>


    <?php /*
      if(isset($permissions["invite_user"])){
      ?>
      <p><a href=" <?php echo $this->html_path . 'index.php/firm/invitefind'; ?> "> Pozvať usera do firmy </a></p>
      <?php
      }
      ?>

      <?php
      if(isset($permissions["kick_user"])){
      ?>
      <p><a href=" <?php echo $this->html_path . 'index.php/firm/remove'; ?> "> Kicknúť usera do firmy </a></p>
      <?php
      }
      ?>

      <?php
      if(isset($permissions["change_user_permissions"])){
      ?>
      <p><a href=" <?php echo $this->html_path . 'index.php/firm/changepermissionsfind/'; ?> "> Zmeniť userovi práva </a></p>
      <?php
      } */
    ?>
