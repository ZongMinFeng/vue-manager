

var GwRegular={};

//正整数
GwRegular.num=/^\+?[1-9][0-9]*$/;

//所有整数
GwRegular.num_=/^-?\d+$/;

//两位正实数
GwRegular.numeric2=/^[0-9]+(\.[0-9]{1,2})?$/;

//两位实数
GwRegular.numeric2_=/^-?[0-9]+(\.[0-9]{1,2})?$/;

//三位实数
GwRegular.numeric3=/^[0-9]+(\.[0-9]{1,3})?$/;

//三位实数
GwRegular.numeric3_=/^-?[0-9]+(\.[0-9]{1,3})?$/

//不能输入超过四位的整数,或带两位小数点
GwRegular.numeric4=/^\d{1,4}(\.\d{1,2})?$/;

//五位正实数
GwRegular.numeric5=/^[0-9]+(\.[0-9]{1,5})?$/;

//必须两位小数
GwRegular.num2=/^\d+\.\d{2}$/;

//手机号
GwRegular.phone=/^1[3456789]\d{9}$/;

//身份证
GwRegular.certNo=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;


export default GwRegular;
