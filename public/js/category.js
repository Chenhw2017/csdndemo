$(function() {
    $("#writePost").click(function() {
        $(".writePostMask").show();
        clearTimeout($(".writePostMask").timer);
        $(".writePostMask").timer = setTimeout(() => {
            $(".writePostMask").hide();
        }, 1000);
    });
    $("#write").click(function() {
        if (this.href == "javascript:;") {
            window.location.href = "../../public/pages/login.html";
        }
    })

    $(".postDetails").click(function() {
        if (this.href == "javascript:;") {
            window.location.href = "../../public/pages/login.html";
        }
    })
})