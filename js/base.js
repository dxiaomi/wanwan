$(function () {
    $("#buttom").click(function (event) {
        event.preventDefault();
        $.mIntDecimal("set",8,3);
        var dd = $.mValueText("name");
        $("#name").val(dd);
        var stex = $.mArrayCompare('.ulLi input[name=name]','.ulLiTow input[name=name]');
        console.log(stex)
        //$.mCleanValSelect("valSelect");
    })

    //alert($.mIntDecimal("set",8,3));

})
setInterval(function(){
    $.mColorText('text');
    //console.log(Math.floor(Math.random()*256))
},1000);