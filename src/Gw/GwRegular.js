

var GwRegular={};

//数字
GwRegular.num=/^-?\d+$/;

//两位实数
GwRegular.numeric=/^[0-9]+(.[0-9]{2})?$/;

//两位实数
GwRegular.numeric_=/^-?[0-9]+(.[0-9]{2})?$/;

//三位实数
GwRegular.numeric3=/^[0-9]+(.[0-9]{3})?$/;

//三位实数
GwRegular.numeric3_=/^-?[0-9]+(.[0-9]{1,3})?$/;

//必须两位小数
GwRegular.num2=/^\d+\.\d{2}$/;

//手机号
GwRegular.phone=/^1[3456789]\d{9}$/;

//身份证
GwRegular.certNo=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;


export default GwRegular;
