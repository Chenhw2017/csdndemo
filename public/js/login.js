$(function() {
    $("#login").click(function() {
        console.log(333);
        $.ajax({
            type: "POST",
            data: {
                "name": $("#name").val(),
                "password": $("#psw").val()
            },
            url: "http://127.0.0.1:9999/api/login",
            success: function(res) {
                // console.log(JSON.parse(res));
                if (res.code) {
                    console.log(res);
                    console.log(typeof res._id);
                    $("#info").html('');
                    window.location.href = "http://127.0.0.1:9999";
                } else {;
                    $("#info").html('您的用户名或密码不正确');
                }
            }
        })
    })
})