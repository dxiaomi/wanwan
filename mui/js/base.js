$(function () {
    $(".ulLoad").on("tap",".titleBox",function () {
        $(this).siblings(".imgBox").toggle();
        $(this).find("i").toggleClass("rotate");
    });
/*    $(".btnForder").on("tap","#loanSubmit",function (evt) {

    });*/
})
/**
 *   uploadImg()
 *   fileId    input上传id
 *   clickId   触发事件id
 */
//    用于压缩图片的canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
//    瓦片canvas
var tCanvas = document.createElement("canvas");
var tctx = tCanvas.getContext("2d");
var maxsize = 100 * 1024;
var Li_Number = 1;
function uploadImg(clickId ,fileId) {
    var identityCard = document.getElementById(fileId);
    identityCard.click();
    identityCard.onchange = function() {
        var liClass = $("#" +clickId).parents("li").attr("class");
        if (!this.files.length) return;
        var files = Array.prototype.slice.call(this.files);
        files.forEach(function(file, i) {
            if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
            var reader = new FileReader();
            var li = document.createElement("li");
            li.className = 'linumber';
            li.id='diagnosis_img'+Li_Number;
            // 获取图片大小
            var size = file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB";
            li.innerHTML = '<div class="progress"><span></span></div><div class="size">' + size + '</div>';
           $("."+liClass).before($(li));
           $(".linumber").attr("onclick","text(this.id)")
            reader.onload = function() {
                var result = this.result;
                var img = new Image();
                img.src = result;
                //$(li).css("background-image", "url(" + result + ")");
                $(li).append('<img src='+result+'>');
                //如果图片大小小于100kb，则直接上传
                if (result.length <= maxsize) {
                    img = null;
                    upload(result, file.type, $(li));
                    return;
                }
                //  图片加载完毕之后进行压缩，然后上传
                if (img.complete) {
                    callback();
                } else {
                    img.onload = callback;
                }
                function callback() {
                    var data = compress(img);
                    upload(data, file.type, $(li));
                    img = null;
                }
            };
            reader.readAsDataURL(file);
            Li_Number++;
        });
    }

}


//    使用canvas对大图片进行压缩
function compress(img) {
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;
    canvas.width = width;
    canvas.height = height;
    // 铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    ctx.drawImage(img, 0, 0, width, height);
    //进行最小压缩
    var ndata = canvas.toDataURL('image/jpeg',0.7);
  /*  console.log('压缩前：' + initSize);
    console.log('压缩后：' + ndata.length);
    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");*/
    //tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
}
//    图片上传，将base64的图片转成二进制对象，塞进formdata上传
function upload(basestr, type, $li) {
    var asID = $("#" +$li[0].id).siblings("li").find("a").attr("id");
    console.log(asID)
    var pecent = 0, loop = null;
    //var fileObj = basestr.files[0];
    var formData = new FormData();
    formData.append('file', basestr);
    formData.append('fileType', 'file');
    formData.append('requireId', '01111111');
    if(asID == "uploadIdentityCard"){
        formData.append('fileCode', '0201');
    }
    if(asID == "uploadHomeBook"){
        formData.append('fileCode', '0203');
    }
    if(asID == "uploadMarriageMakings"){
        formData.append('fileCode', '0908');
    }
    if(asID == "uploadMortgage"){
        formData.append('fileCode', '0913');
    }
    if(asID == "uploadOther"){
        formData.append('fileCode', '0914');
    }
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "http://192.168.137.215:8080/ephone/webImgFile/uploadImgFile.htm", true);
    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4) {
            var obj = JSON.parse(ajax.responseText);
            console.log(obj)
            if(obj.success == true){
                var id = $li[0].id;
                var text = obj.message ? '上传成功' : '上传失败';
                clearInterval(loop);
                //当收到该消息时上传完毕
                $("#"+id).append('<input type="hidden" id="input_'+id+'" value="'+obj.id+'" title="'+obj.url+'">');
                $("#"+id).find(".progress span").animate({'width': "100%"}, pecent < 95 ? 200 : 0, function() {
                    $("#"+id).find(".progress").siblings("div.size").html(text);
                });
            }
        }
    }
    ajax.send(formData);
}
/**
 * 获取blob对象的兼容性写法
 * @param buffer
 * @param format
 * @returns {*}
 */
function getBlob(buffer, format) {
    try {
        return new Blob(buffer, {type: format});
    } catch (e) {
        var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
        buffer.forEach(function(buf) {
            bb.append(buf);
        });
        return bb.getBlob(format);
    }
}
/**
 * 获取formdata
 */
function getFormData() {
    var isNeedShim = ~navigator.userAgent.indexOf('Android')
        && ~navigator.vendor.indexOf('Google')
        && !~navigator.userAgent.indexOf('Chrome')
        && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
    return isNeedShim ? new FormDataShim() : new FormData()
}
/**
 * formdata 补丁, 给不支持formdata上传blob的android机打补丁
 * @constructor
 */
function FormDataShim() {
    console.warn('using formdata shim');
    var o = this,
        parts = [],
        boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36),
        oldSend = XMLHttpRequest.prototype.send;
    this.append = function(name, value, filename) {
        parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
        if (value instanceof Blob) {
            parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
            parts.push(value);
        }
        else {
            parts.push('\r\n\r\n' + value);
        }
        parts.push('\r\n');
    };
    // Override XHR send()
    XMLHttpRequest.prototype.send = function(val) {
        var fr,
            data,
            oXHR = this;
        if (val === o) {
            // Append the final boundary string
            parts.push('--' + boundary + '--\r\n');
            // Create the blob
            data = getBlob(parts);
            // Set up and read the blob into an array to be sent
            fr = new FileReader();
            fr.onload = function() {
                oldSend.call(oXHR, fr.result);
            };
            fr.onerror = function(err) {
                throw err;
            };
            fr.readAsArrayBuffer(data);
            // Set the multipart content type and boudary
            this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
            XMLHttpRequest.prototype.send = oldSend;
        }
        else {
            oldSend.call(this, val);
        }
    };
}
//删除
function text(objId) {
    var inputId = $("#"+objId).find("input").attr("id");
    var valId = $("#"+inputId).val();            //获取val值
    var valUrl = $("#"+inputId).attr("title");   //获取url路径
    console.log(valId)
    console.log(valUrl)
    var btnArray = ['否', '是'];
    mui.confirm('是否要删除该区域图片？', '您好', btnArray, function(e) {
        if (e.index == 1) {
            $.ajax({
                url : 'http://192.168.137.215:8080/ephone/webImgFile/delImgByURl.htm',
                type: "POST",
                data : {id : valId, url : valUrl},
                dataType : "json",
                success:function (obj) {
                    console.log(obj)
                    if(obj.flag === "删除成功"){
                        mui.toast('删除成功！');
                        $("#"+objId).remove('li');
                    }
                    if(obj.flag === "删除失败"){
                        mui.toast('删除失败！');
                        return false;
                    }
                }
            })
        }
    })
}


function formData(event) {
    $(".ulLoad").each(function(){
        var liLength = $(this).find("li.linumber").length;
        var inputLength = $(this).find("li.linumber").find("input").length;
        if(liLength != inputLength){
            mui.toast('请等待上传或者请求失败！');
            event.preventDefault();
        }
    });
}
