/**
 * 得到32位随机字符（字母大小写和数字）
 * @returns {string}
 */
const get32randString=()=>{
  let chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  let nums="";
  for(var i=0;i<32;i++){
    let id = parseInt(Math.random()*61);
    nums+=chars[id];
  }
  return nums;
};

const num2Date=(dateNum)=>{
  if(dateNum==null||dateNum===''){
    return '未知';
  }
  let date = new Date(dateNum);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let D = (date.getDate()<10?'0'+date.getDate():date.getDate()) + ' ';
  let h = (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':';
  let m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()) + ':';
  let s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
  return Y+M+D+h+m+s;
};

export {
  get32randString,
  num2Date
}
