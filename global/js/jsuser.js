$(document).ready(function () {
    changeUserPasswordSubmit();
    signUserSubmit();

    function changeUserPasswordSubmit() {
        $("#changepw-submit").click(function (e) {
            oldpw = $("#changepw-oldpw").val();
            newpw = $("#changepw-newpw").val();
            newpwagain = $("#changepw-newpwagain").val();

            if (!isPasswordValid(oldpw) || !isPasswordValid(newpw) || !isPasswordValid(newpwagain) || newpwagain !== newpw) {

                messages = new Array();

                if (!isPasswordValid(oldpw))
                    messages.push("neplatne povodne heslo");
                if (!isPasswordValid(newpw))
                    messages.push("neplatne nove heslo");
                if (!isPasswordValid(newpwagain))
                    messages.push("neplatne nove heslo opakovane");
                if (newpwagain !== newpw)
                    messages.push("nove hesla sa nerovnaju");
                alert(messages.join(", "));
            } else {
                $.ajax({
                    type: "POST",
                    url: html_path + '/index.php/user/changepassword/',
                    data: {oldpw: oldpw, newpw: newpw, newpwagain: newpwagain},
                    success: function (data) {
                        var data = $.parseJSON(data);
                    
                        if (data == "ok")
                            alert(data);
                        else {
                            alert(data);
                        }
                    },
                    error: function (d) {
                        alert("ajax error, json: " + JSON.stringify(d));
                    }
                });
                e.preventDefault();
            }
            return false;
        });

    } // changeUserPasswordSubmit signUserSubmit


    function signUserSubmit() {
        $("#firm-sign-submit").click(function (e) {
            password = $("#firm-sign-passwd").val();
            if (!isPasswordValid(password)) {
                alert("zle heslo");
            } else {
                $.ajax({
                    type: "POST",
                    url: html_path + '/index.php/user/signuser/' + $("#firm-sign-submit").data("id") + '?submitted',
                    data: {p: password},
                    success: function (data) {
                        var data = $.parseJSON(data);
                    
                        if (data == "ok")
                            alert(data);
                        else {
                            alert(data);
                        }
                    },
                    error: function (d) {
                        alert("ajax error, json: " + JSON.stringify(d));
                    }
                });
                e.preventDefault();
            }
            return false;
        });
    } // koniec signUserSubmit
});

