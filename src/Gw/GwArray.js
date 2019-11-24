import {objKeySort} from "../util/jsonSha256";

const inArrayByCons=(objects, object, option)=>{
  if (!objects instanceof Array){
    return false;
  }
  if(object[option]==null){
    return false;
  }
  let haveIt=false;
  objects.forEach((value)=>{
    if(value[option]===object[option]){
      haveIt=true;
      return false;
    }
  });
  if(haveIt){
    return true;
  } else{
    return false;
  }
};

/**
 * 检查value是否在objects数组中
 * @param objects
 * @param value
 * @param option
 * @returns true 表示value在objects中
 */
const inArrayOptionByCons=(objects, value, option)=>{
  if (!objects instanceof Array){
    return false;
  }
  if(value==null){
    return false;
  }
  let haveIt=false;
  objects.forEach((res)=>{
    if(res[option]===value){
      haveIt=true;
      return false;
    }
  });
  if(haveIt){
    return true;
  } else{
    return false;
  }
};

/**
 * 返回数组下标
 * @param objects
 * @param object
 * @param option
 * @returns {number}
 */
const indexByCons=(objects, object, option)=>{
  let indexReturn=-1;
  if(!objects instanceof Array){
    return -1;
  }

  objects.forEach((item, index)=>{
    if (item[option]===object[option]) {
      indexReturn=index;
    }
    return -1;
  });

  return indexReturn;
};

/**
 * 返回数组项
 * @param objects
 * @param object
 * @param option
 * @returns {number}
 */
const itemByCons=(objects, value, option)=>{
  let indexReturn=-1;
  if(!objects instanceof Array){
    return null;
  }

  objects.forEach((item, index)=>{
    if (item[option]===value) {
      indexReturn=index;
    }
    return null;
  });

  return objects[indexReturn];
};


const sortByNum=(a, b)=>{
  let numA=parseInt(a);
  let numB=parseInt(b);
  if(!isNaN(numA)&&!isNaN(numB)){
    return numA-numB;
  }else if(!isNaN(numA)&&isNaN(numB)){
    return -1;
  }else if(isNaN(numA)&&!isNaN(numB)){
    return 1;
  }else{
    return (a).localeCompare(b);
  }
};

export {
  inArrayByCons,
  inArrayOptionByCons,
  indexByCons,
  sortByNum,
  itemByCons,
};
