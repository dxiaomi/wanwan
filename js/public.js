(function ($) {
    /*
    *   获取URL 参数
    *   @param name 参数 如 http://localhost:63342/7.html?name=123&set=123123&age=123
    *   调用的方法 var a = $.mGetUrlParam('name');
    *   @return
    */
    $.mGetUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    };
    /*
    * 将数值四舍五入(保留2位小数)后格式化成金额形式
    * @param num 数值(Number或者String)
    * @return 金额格式的字符串,如'1,234,567.45'
    */
    $.mFormatCurrency = function(num) {
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
    };
    /*
    * 判断邮箱地址是否正确
    * @param s 参数
    * @return 返回 true 或 false
    */
    $.mEmail = function (s) {
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(reg.test(s)){
            return true;
        }else{
            return false;
        }
    };
    /*
    * 判断手机号或固定电话
    *  @param mt 参数
    *  mReg 代表手机号
    *  tReg 代表固定号
    *  @return 返回 true 或 false
    */
    $.mMobileTel = function (mt) {
        var mReg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])([0-9]{8})$/;
        var tReg = /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/;  ///^([0-9]{3,4}-)?[0-9]{7,8}$/
        if(mReg.test(mt) || tReg.test(mt)){
            return true;
        }else {
            return false;
        }
    };
    /*
    * 判断金额保留小数
    * @param m 参数数字 n 代表保留小数点位数
    * @return 返回 true 或 false
    */
    $.mAmountMoney = function(m, n){
        var mReg = new RegExp("^[0-9]+[\.][0-9]{0,"+n+"}$");
        if(mReg.test(m)){
            return true;
        }else{
            return false;
        }
    };
    /*
    * 金额逗号分隔 将数值四舍五入
    * @param m 代表金额值，n 代表保留几位小数
    * @return money
    */
    $.mSeparateMoney = function(m, n){
        n = n > 0 && n <= 20 ? n : 2;
        m = parseFloat((m + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = m.split(".")[0].split("").reverse(), r = m.split(".")[1];
        money = "";
        for (i = 0; i < l.length; i++) {
            money += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return money.split("").reverse().join("") + "." + r;
    };
    /*
    * 判断整数和小数位数,分为正常数字，和逗号分隔
    * @param 参数 objId代表id m代表整数的位数， n代表小数点的位数
    * splitLengthInt 整数个数
    * splitLengthDecimal 小数个数
    * regInt 判断是否整数
    */
    $.mIntDecimal = function(objId, m, n){
        var val = $("#"+ objId).val();
        var clsComma = val.replace(/,/g,'');
        var regInt = /^\d+$/;
        if(val == ""){
            return false;
        }
        if(isNaN(clsComma)){
            $("#"+objId).val("").focus();
            layer.msg('请输入数字！');
            return false
        }
        if(regInt.test(clsComma) ){
            var splitLengthInt = val.toString().length;
            if(splitLengthInt > m){
                $("#"+objId).val("").focus();
                layer.msg('数字太大，请重新输入！');
                return false;
            }
        }else{
            var splitLengthInt = clsComma.toString().split('.')[0].length;
            var splitLengthDecimal = clsComma.toString().split('.')[1].length;
            if(splitLengthInt > m){
                $("#"+objId).val("").focus();
                layer.msg('数字太大，请重新输入！');
                return false
            }
            if(splitLengthDecimal > n){
                $("#"+objId).val("").focus();
                layer.msg('请保留' +n+' 小数！');
                return false
            }
        }
    };
    /*
    * 判断是否是整数
    * @param 参数obj 是否是数字
    * @return true 或 false
    */
    $.mIntNumber = function(obj){
        var reg = /^[0-9]*[1-9][0-9]*$/;
        if(!parseInt(obj)){
            var objIdVal = $("#"+ obj).val();
            if(reg.test(objIdVal)){
                return true;
            }else {
                return false;
            }
        }else{
            if(reg.test(obj)){
                return true;
            }else {
                return false;
            }
        }
    };
    /**
    *  判断英文字母和数字组成
    *  @param 参数obj 参数是否英文字母和数字组成
    *  return true 或 false
    */
    $.mMumletter = function(obj){
        var reg = /^[0-9a-zA-Z]+$/;
        if(reg.test(obj)){
            return true;
        }else {
            return false;
        }
    };
    /*
    * 计算开始时间和结束时间之间差数
    * 格式2019-01-01 转化 yyyy/MM/dd格式
    * @param endDate   参数 表示结束时间
    * @param startDate 参数 表示开始时间
    * @return 返回 Number 相差天数
    */
    $.mDataDifference = function (endDate, startDate) {
        var oDate1, oDate2, iDays;
        oDate1 = new Date(endDate.replace(/-/g, "/")); //转换为yyyy/MM/dd格式
        oDate2 = new Date(startDate.replace(/-/g, "/"));  //转换为yyyy/MM/dd格式
        var day = 24 * 3600 * 1000;
        iDays = ((oDate1 - oDate2) /day) * 1 + 1; //把相差的毫秒数转换为天数
        return iDays;
    };
    /*
    * 判断object对象是否空，未定义或null
    * @param object
    * @return true 或 false
    */
    $.mIsNul = function (obj) {
        if (obj == "" || typeof(obj) == "undefined" || obj == null) {
            return true;
        }else {
            return false;
        }
    };
    /*
    * 文字颜色替换
    * @param objId 参数id
    */
    $.mColorText = function (objId) {
        var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        $('#' +objId).css({ 'color': hue });
    };
    /*
    * 去除左右空格符
    * @param objId 参数id
    * @return 返回 string 或 number
    */
    $.mValueText = function (objId) {
        var valText = $.trim($("#"+ objId).val());
        //$("#"+objId).val(valText);
        return valText;
    };
    /*
    * 清空input select 内容
    * @param objId 参数id
    */
    $.mCleanValSelect = function (objId) {
        $("#"+ objId).find("input,select").val("");
    };
    /*
    * 数组比较，返回没有重复的数组
    * @param 参数 obj1对比代表遍历字段，obj2代表跟obj1对比遍历字段
    * @param arr1 代表全部数组， arr2代表跟arr1进行比较 arr3 返回不再这个数组里面的
    * @param 返回arr3 数组
    */
    $.mArrayCompare = function (obj1, obj2) {
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        $(obj1).each(function (index, item) {
            var valText = $(item).val();
            arr1.push(valText);
        });
        $(obj2).each(function (index, item) {
            var valText = $(item).val();
            arr2.push(valText);
        });
        for(key in arr1){
            var mStrA = arr1[key];
            var mCunt = 0;
            for(var j= 0; j < arr2.length; j++){
                var mStrB = arr2[j];
                if(mStrA == mStrB){
                    mCunt ++
                }
            }
            if(mCunt === 0) { //表示数组1的这个值没有重复的，放到arr3列表中
                arr3.push(mStrA);
            }
        }
        return arr3;
    };
    /*************************************************** 身份证校验 ********************************************************/
    /*
    * 身份证15位编码规则：dddddd yymmdd xx p
    * dddddd：地区码
    * yymmdd: 出生年月日
    * xx: 顺序类编码，无法确定
    * p: 性别，奇数为男，偶数为女
    * <p />
    * 身份证18位编码规则：dddddd yyyymmdd xxx y
    * dddddd：地区码
    * yyyymmdd: 出生年月日
    * xxx:顺序类编码，无法确定，奇数为男，偶数为女
    * y: 校验码，该位数值可通过前17位计算获得
    * <p />
    * 18位号码加权因子为(从右到左) wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2,1 ]
    * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
    * 校验位计算公式：Y_P = mod( ∑(Ai×wi),11 )
    * i为身份证号码从右往左数的 2...18 位; Y_P为校验码所在校验码数组位置
    */
    // 加权因子
    var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    // 身份证验证位值.10代表X
    var valideCodeArr = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    // 区域ID
    var areaMap = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西 ",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    // 男女ID
    var sexMap = {0:"女",1:"男"};
    /*
    * 调用的方法
    * flag = checkIdCard(idCard);
	* if (flag) {
	*	 return true;
	*  }else{
	*	 return false;
	*  }
    * 验证ID，正确返回“true”，错误则返回错误信息
    * @param {Object} idCard
    */
    $.checkIdCard = function (idCard) {
        //去掉首尾空格
        idCard = $.trim(idCard);
        if (idCard.length == 15||idCard.length == 18) {
            if (!$.checkArea(idCard)) {
                return false;//status[4];
            } else if(!$.checkBrith(idCard)){
                return false;//status[2];
            } else if(idCard.length == 18 && !$.check18Code(idCard)){
                return false;//status[3];
            } else {
                return true;//status[0];
            }
        } else {
            //不是15或者18，位数不对
            return false;//status[1];
        }
    };
    /*
    * 显示解析出的信息
    * @param {Object} idCard 正确的ID号
    * @param {Object} sexId 性别要显示的Input的id
    * @param {Object} birthId 生日要显示的Input的id
    * @param {Object} areaId 地区要显示的Input的id
    */
    $.showIDInfo = function (idCard, areaId, sexId, birthId) {
        // 对身份证号码做处理。包括字符间有空格。
        idCard = $.trim(idCard);
        // 性别
        $("#"+sexId).val($.getSex(idCard));
        // 地区
        $("#"+areaId).val($.getArea(idCard));
        //生日
        $("#"+birthId).val($.getBirthday(idCard));
    };
    /*
    * 得到地区码代表的地区
    * @param {Object} idCard 正确的15/18位身份证号码
    */
    $.getArea = function (idCard) {
        return areaMap[parseInt(idCard.substr(0, 2))];
    };
    /*
    * 通过身份证得到性别
    * @param idCard 正确的15/18位身份证号码
    * @return 女、男
    */
    $.getSex = function (idCard) {
        if (idCard.length == 15) {
            return sexMap[idCard.substring(14, 15) % 2];
        } else if (idCard.length == 18) {
            return sexMap[idCard.substring(14, 17) % 2];
        } else {
            //不是15或者18,null
            return null;
        }
    };
    /*
    * 得到生日"yyyy-mm-dd"
    * @param {Object} idCard 正确的15/18位身份证号码
    */
    $.getBirthday = function (idCard) {
        var birthdayStr;
        if (15 == idCard.length) {
            birthdayStr = idCard.charAt(6) + idCard.charAt(7);
            if (parseInt(birthdayStr) < 10) {
                birthdayStr = '20' + birthdayStr;
            } else {
                birthdayStr = '19' + birthdayStr;
            }
            birthdayStr = birthdayStr + '-' + idCard.charAt(8) + idCard.charAt(9) + '-' + idCard.charAt(10) + idCard.charAt(11);
        }else if (18 == idCard.length) {
            birthdayStr = idCard.charAt(6) + idCard.charAt(7) + idCard.charAt(8) + idCard.charAt(9) + '-' + idCard.charAt(10) + idCard.charAt(11) + '-' + idCard.charAt(12) + idCard.charAt(13);
        }
        return birthdayStr;
    };
    /*
    * 验证身份证的地区码
    * @param {Object} idCard 身份证字符串
    */
    $.checkArea = function (idCard) {
        if(areaMap[parseInt(idCard.substr(0, 2))] == null){
            return false;
        } else {
            return true;
        }
    };
    /*
    * 验证身份证号码中的生日是否是有效生日
    * @param idCard 身份证字符串
    * @return
    */
    $.checkBrith = function (idCard) {
        var result = true;
        if (15 == idCard.length) {
            var year = idCard.substring(6, 8);
            var month = idCard.substring(8, 10);
            var day = idCard.substring(10, 12);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
            if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                result =  false;
            }
        } else if (18 == idCard.length) {
            var year = idCard.substring(6, 10);
            var month = idCard.substring(10, 12);
            var day = idCard.substring(12, 14);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 这里用getFullYear()获取年份，避免千年虫问题
            if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                result = false;
            }
        } else {
            result = false;
        }
        return result;
    };
    /*
    * 判断身份证号码为18位时最后的验证位是否正确
    * @param idCardArr 身份证号码数组
    * @return
    */
    $.check18Code = function (idCardArr) {
        var sum = 0; // 声明加权求和变量
        var code18 = idCardArr[17] ;
        if (idCardArr[17].toLowerCase() == 'x') {
            code18 = 10;// 将最后位为x的验证码替换为10方便后续操作
        }
        for (var i = 0; i < 17; i++) {
            sum += wi[i] * idCardArr[i];// 加权求和
        }
        var valCodePosition = sum % 11;// 得到验证码所位置
        if (code18 == valideCodeArr[valCodePosition]) {
            return true;
        } else {
            return false;
        }
    };
})(jQuery);