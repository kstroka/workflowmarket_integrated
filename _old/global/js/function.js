$(document).ready(function () {
    // Vzdy konajuce sa kody (skoro :))
    calculateVisits();
    showLoginForm();
    hideOverlay();
    preventHideForm();

    // Ajax click handler funkcie
    loginSubmit();
    pwRecoverySubmit();
    regSubmit();


    // Definicie funkcii
    function calculateVisits() {
        if (localStorage.getItem("visits") === null)
            visits = 0;
        else
            visits = JSON.parse(localStorage.getItem("visits"));

        visits += 1;
        localStorage["visits"] = visits;
        $("#footer-visits").text("Na tejto stránke si už bol/a: " + visits + " krát");
    }

    function hideOverlay() {
        $(".overlay").click(function (e) {
            $(this).hide();
            $("#form-login").hide();
        });
    }

    function preventHideForm() {
        $(".main-menu-form-layout").click(function (e) {
            e.stopPropagation();
        });
    }

    function showLoginForm() {
        $("#main-menu-login").click(function (e) {
            $(".overlay").show();
            $("#form-login").show();
        });
    }


    // Definicie ajax funkcii
    function loginSubmit() {
        $("#login-submit").click(function (e) {
            e_mail = $("#login-email").val();
            password = $("#login-passwd").val();
            alert( html_path + '/index.php/auth/login' );
            $.ajax({
                type: "POST",
                url: html_path + '/index.php/auth/login',
                data: {email: e_mail, p: password},
                success: function (data) {
                    var result = $.parseJSON(data);
                    
                    if (result == "ok")
                        location.reload();
                    else {
                        alert(data);
                    }
                },
            });
            return false;
        });
    }

    function pwRecoverySubmit() {
        $("#password-recovery-submit").click(function (e) {
            e_mail = $("#password-recovery-email").val();
            
            if( !isEmailValid(e_mail) ){
                alert("zly email");
            } else {
                $.ajax({
                    type: "POST",
                    url: html_path + '/index.php/user/passwordrecovery',
                    data: {email: e_mail},
                    success: function (data) {
                        //var data = $.parseJSON(data);
                        $("body").after(data);
                    },
                    error: function (d) {
                        alert("ajax error, json: " + JSON.stringify(d));
                    }
                });
                return false;
            }
        });
        
    }

    function regSubmit() {
        $("#reg-submit").click(function (e) {
            first_name = $("#reg-fname").val();
            last_name = $("#reg-lname").val();
            e_mail = $("#reg-email").val();
            password = $("#reg-passwd").val();

            isEmailValid(e_mail);
            isNameValid(first_name);
            isNameValid(last_name);
            isPasswordValid(password);

            if ( !isEmailValid(e_mail) || !isNameValid(first_name) || !isNameValid(last_name) || !isPasswordValid(password) ) {
                messages = new Array();
                if( !isEmailValid(e_mail) ) messages.push("zly email");
                if( !isNameValid(first_name) ) messages.push("zle meno");
                if( !isNameValid(last_name) ) messages.push("zle priezvisko");
                if( !isPasswordValid(password) ) messages.push("zle heslo");
                alert(messages.join(", "));
                
            } else {
                $.ajax({
                    type: "POST",
                    url: html_path + '/index.php/user/registration?submitted=yes',
                    data: {email: e_mail, p: password, fname: first_name, lname: last_name},
                    success: function(data) {
                        var result = $.parseJSON(data);
                        
                        if(result == "ok"){
                            window.location.replace(html_path + '/index.php/user/registrationConfirmed');
                        } else {
                            $("head").after("zle:" + result);
                        }
                    },
                    error: function (d) {
                        alert("ajax error, json: " + JSON.stringify(d));
                    }
                });
            }
            return false;
        });
    }

});
//alert(JSON.stringify(menu));