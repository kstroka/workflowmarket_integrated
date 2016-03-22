$(document).ready(function () {
    firmCreateSubmit();

    function firmCreateSubmit() {
        $("#firm-submit").click(function (e) {
            password = $("#firm-passwd").val();
            strategy = $("#firm-strategy").prop('checked');
            
            if (!isPasswordValid(password) && strategy === true ) {
                alert("zle heslo");
            } else {
                $.ajax({
                    type: "POST",
                    url: html_path + '/index.php/firm/create',
                    data: {name: $("#firm-name").val(), desc: $("#firm-description").val(), strat:strategy, p: password, p0: $("#firm-perm0").prop('checked'), p1: $("#firm-perm1").prop('checked'), p2: $("#firm-perm2").prop('checked'), p3: $("#firm-perm3").prop('checked'), p4: $("#firm-perm4").prop('checked'), p5: $("#firm-perm5").prop('checked')},
                    success: function (data) {
                        var data = $.parseJSON(data);
                        if( data == "ok" ){
                            location.reload();
                        } else {
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
    } // koniec firmCreateSubmit


});