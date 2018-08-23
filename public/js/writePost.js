$(function() {
    // console.log($(".picUl label").attr('for'));

    // 添加图片组
    var picCount = 1;
    $(".picUl").on("change", "#picture" + picCount, function() {
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


    // 悬赏积分
    $("#offerMarks").change(function(e) {
        // console.log($(this).val());
        console.log($(this).val(), $("#leftMarks").html());
        if (parseInt($(this).val()) > parseInt($("#leftMarks").html())) {
            $(".writePostMask").show();
            $(".writePostMask").timer = null;
            $(".writePostMask").timer = setTimeout(function(param) {
                $("#offerMarks").val(0);
                $(".writePostMask").hide();
                $("#offerMarks").focus();
            }, 1000);
        }
    })
})