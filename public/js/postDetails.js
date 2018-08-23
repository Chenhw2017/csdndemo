$(function() {
    $(".reply").click(function() {
        window.scrollTo(0, $(".write").offset().top);
    })

    // 添加图片组
    var picCount = 1;
    $(".pic").on("change", "#picture" + picCount, function() {
        console.log(this);
        console.log(111);
        var reader = new FileReader();
        reader.onload = function(e) {
            if (picCount == 1) {
                $(".picUl").append("<li><input type='file' id='picture" + (picCount + 1) + "' hidden='hidden' name='picture" + (picCount + 1) + "'><img src='" + e.target.result + "'></li>");
            } else {
                console.log(picCount);
                $(".picUl").append("<li><input type='file' id='picture" + (picCount + 1) + "' hidden='hidden' name='picture" + (picCount + 1) + "'><img src='" + e.target.result + "'></li>");
            }
            picCount++;
            $(".picUl label").prop('for', "picture" + picCount);
            console.log($(".picUl label").attr('for'));
        }

        $(".picUl li").on("click", ".picUl label", function() {
            console.log("当前点击的是---", this);
        })

        reader.readAsDataURL(this.files[0]);



    })

    //回复提交
    $("#writeSubmit").click(function() {
        var formData = new FormData();
        console.log($("#picture1")[0].files[0], $("#replyContent").val());
        formData.append("picture", $("#picture1")[0].files[0]);
        formData.append("comments", $("#replyContent").val());
        console.log(444444444);
        $.ajax({
            url: "http://127.0.0.1:9999/nav/Mobile/IOS/5b7d486c697f20229c262188/comments",
            type: "post",
            data: formData,
            async: false,
            dataType: "html",
            contentType: false,
            processData: false,
            mimeType: "multipart/form-data",
            // dataType: "text/html",
            success: function(res) {
                console.log(typeof res);
                $("#content").append(res);
            }
        })
    })
})