<?php $auth = \app\registry\Registry::singleton()->getObject("auth"); ?>

    <?php if( $auth->checkLogin(2) ){ ?>

        <?php
        if (isset($permissions["invite_user"])) {
            ?>
            <form id="firm-invite-user" action="<?php echo HTML_PATH . 'index.php/firm/sendinvitation/' . $firm_id . '/?submitted'; ?>" method="POST">
                <input id="firm-invite-user-email" type="text" name="email" />
                <input id="firm-invite-user-submit" type="submit" />
            </form>
            <?php
        }
        ?>

        <!-- čast userov -->
        <?php for ($i = 0; $i < count($users); $i++) { ?>
            <div>

                <span> <?php echo "do tejto firmy patrí user s idčkom:" . $users[$i]->getId(); ?>  </span>

                <?php
                if (isset($permissions["kick_user"])) {
                    ?>
                    <span> <a href=" <?php echo HTML_PATH . 'index.php/user/removeuser/' . $users[$i]->getUniqueHash() . '/' . $users[$i]->getId() . '/' . $firm_id; ?> "> DELETE </a> </span>
                    <?php
                }
                ?>

                <?php
                if (isset($permissions["change_user_permissions"])) {
                    ?>
                    <span> <a href=" <?php echo HTML_PATH . 'index.php/user/changepermissions/' . $users[$i]->getUniqueHash() . '/' . $users[$i]->getId() . '/' . $firm_id; ?> "> Zmena práv </a> </span>	
                    <?php
                }
                ?>

            </div>
        <?php } ?>

        <?php
        // konec isset session user, ktory aj tak pojde prec a pride lepsia autentifikacia
    } else {
        echo "niesi prihlaseny, co by si chcel videt?";
    }
    ?>