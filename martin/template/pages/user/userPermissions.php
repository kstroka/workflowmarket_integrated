
<form action=" <?php echo HTML_PATH . 'index.php/user/changepermissions/' . $firm_hash . '/' . $user_id . '/' . $firm_id . '/?submitted'; ?> " method="POST" id="change-user-permissions">

    <input id='change-user-permissions-completer' type='hidden' value='1' name='completer' checked>

    <input id="change-user-permissions-p1" type="checkbox" name="permissions[]" value="roles_processes" <?php if (isset($user_permissons["roles_processes"])) echo "checked"; ?> />
    <input id="change-user-permissions-p2" type="checkbox" name="permissions[]" value="assign_user_to_role" <?php if (isset($user_permissons["assign_user_to_role"])) echo "checked"; ?> />
    <input id="change-user-permissions-p3" type="checkbox" name="permissions[]" value="invite_user" <?php if (isset($user_permissons["invite_user"])) echo "checked"; ?> />
    <input id="change-user-permissions-p4" type="checkbox" name="permissions[]" value="kick_user" <?php if (isset($user_permissons["kick_user"])) echo "checked"; ?> />
    <input id="change-user-permissions-p5" type="checkbox" name="permissions[]" value="change_user_permissions" <?php if (isset($user_permissons["change_user_permissions"])) echo "checked"; ?> />
    <input id="change-user-permissions-p6" type="checkbox" name="permissions[]" value="delete_firm" <?php if (isset($user_permissons["delete_firm"])) echo "checked"; ?> />
    <input id="change-user-permissions-submit" type="submit" />
</form>