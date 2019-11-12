

var GwRegular={};

//数字
GwRegular.num=/^-?\d+$/;

//必须两位小数
GwRegular.num2=/^\d+\.\d{2}$/;

//手机号
GwRegular.phone=/^1[3456789]\d{9}$/;

//身份证
GwRegular.certNo=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;


export default GwRegular;
