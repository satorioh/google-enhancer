//——————————————————————————————————双击回到顶部——————————————————————————————————
$("body").dblclick(function () {
    window.getSelection().removeAllRanges();
    $("html, body").animate({scrollTop: 0}, 300);
});