/*!
* gaozh v1
*/
/**
	@name /util/string
	@class
	@category javascript
	@util
	@description String工具类
*/

/**
	@name /util/string.trim
	@function
	@description 清除前后两端的空白字符
	@param {String} str
	@returns {String}
*/

/**
	@name /util/string.splitAndTrim
	@function
	@description 用指定的元素分隔成字符串数组, 并对每个元素执行trim
	@param {String} str 字符串
	@param {String} spliter 分隔符
	@returns {String[]}
*/

/**
	@name /util/string.format
	@function
	@description 字符串格式化, 参数个数动态
	@param {String} str 字符串
	@param {Object} options
	@returns {String}
*/

/**
	@name /util/string.toInt
	@function
	@description 转换成整数
	@param {String} str 字符串
	@param {Integer} defaultValue
	@returns {Integer}
*/

/**
	@name /util/string.toFloat
	@function
	@description 转换成浮点数
	@param {String} str 字符串
	@param {Float} defaultValue
	@returns {Float}
*/

/**
	@name /util/string.HTMLEncode
	@function
	@description html编码
	@param {String} str 字符串
	@returns {String}
*/

/**
	@name /util/string.HTMLDecode
	@function
	@description html解码
	@param {String} str 字符串
	@returns {String}
*/

/**
	@name /util/string.zeros
	@function
	@description 补零
	@param {String} value 字符串
	@param {Integer} length 补零后的长度
	@param {Boolean} right 是否右边补零, true表示右边补零, false表示左边补零
	@returns {String}
*/

/**
	@name /util/string.camelize
	@function
	@description 首字母转大写
	@param {String} str 字符串
	@returns {String}
*/
  var _String = {};

  _String.trim = function (str) {
    return (str || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
  };

  _String.splitAndTrim = function (str, spliter) {
    var result = str.split(spliter);
    for (var i = 0; i < result.length; i++) {
      result[i] = _String.trim(result[i]);
    }
    return result;
  };

  _String.format = function () {
    if (arguments.length === 0)
      return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
      str = str.replace(re, arguments[i]);
    }
    return str;
  };

  _String.toInt = function (str, defaultValue) {
    var result = parseInt(str, 10);
    return (isNaN(result)) ? defaultValue : result;
  };

  _String.toFloat = function (str, defaultValue) {
    var result = parseFloat(str);
    return (isNaN(result)) ? defaultValue : result;
  };

  _String.HTMLEncode = function (text) {
    var converter = document.createElement("DIV");
    converter.innerText = text;
    converter.textContent = text;
    var output = converter.innerHTML;
    converter = null;
    output = output.replace(/"/g, "&quot;");
    output = output.replace(/'/g, "&apos;");
    return output;
  };

  _String.HTMLDecode = function (html) {
    var converter = document.createElement("DIV");
    converter.innerHTML = html;
    var output = converter.innerText || converter.textContent;
    converter = null;
    return output;
  };

  _String.zeros = function (value, length, right) {
    var res = "" + value;
    for (; res.length < length; res = right ? res + '0' : '0' + res) {
    }
    return res;
  };

  _String.camelize = function (str, lowFirstLetter) {
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.substring(1);
  };

  //金额格式化
  _String.number_format=function (number, decimals, dec_point, thousands_sep){
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.ceil(n * k) / k;
        };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while(re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  };

  //取消金额格式化
  _String.rmoney=function(e){
    return parseFloat(e.replace(/[^\d\.-]/g, ""));
};


// module.exports= _String

//根据单位换算数量
_String.unitNumUp=(unit, num)=>{
    let nowNum=parseFloat(num+'');
    if (nowNum == null) {
        return 0;
    }
    let newNum=0;
    switch (unit) {
        case '斤':
            newNum=nowNum*500;
            break;
        case '公斤':
        case '千克':
            newNum=nowNum*1000;
            break;
        default:
            newNum=nowNum;
    }
    return newNum;
};

//根据单位换算数量
_String.unitNumDown=(unit, num)=>{
    let nowNum=parseFloat(num+'');
    if (nowNum == null) {
        return 0;
    }
    let newNum=0;
    switch (unit) {
        case '斤':
            newNum=nowNum/500;
            break;
        case '公斤':
        case '千克':
            newNum=nowNum/1000;
            break;
        default:
            newNum=nowNum;
    }
    return newNum;
};

/**
 * 根据单位显示数字，默认显示个位数
 * @param unit
 * @param num
 */
_String.unitNum5=(unit, num)=>{
    let nowNum=parseFloat(num+'').toFixed(5);
    let newNum=0;
    switch (unit) {
        //截取5位小数、不四舍五入
        case '公斤':
        case '千克':
        case '斤':
            newNum=Math.floor(nowNum*100000)/100000;
            break;
        case '克':
            //截取2位小数、不四舍五入
            newNum=Math.floor(nowNum*100)/100;
            break;
        default:
            //显示个位数
            newNum=parseInt(num);
            break;
    }
    return newNum;
};

export default _String
