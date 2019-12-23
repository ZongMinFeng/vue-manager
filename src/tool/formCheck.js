/**
 *表单验证
 */

import GwRegular from '@/Gw/GwRegular.js';

var FormCheck={};

FormCheck.stock=(rule, stockNum, callback, source) => {

    if (source.AddForm.stockNum==null||source.AddForm.unit==null){
        callback(new Error('请输入值'));
    }
    switch(me.AddForm.unit){
        case '公斤':
        case '斤':
            //允许三位小数
            if (!GwRegular.numeric3.test(stockNum)) {
                callback('请输入数字，可以为3位小数');
            }
            break;
        case '克':
            if (!GwRegular.numeric2.test(stockNum)) {
                callback('请输入数字，可以为2位小数');
            }
            break;
        default:
            //只能是个位数
            if (!GwRegular.num.test(sotckNum)) {
                callback('请输入整数');
            }
    }
    if(stockNum>999999){
        callback(new Error('库存应小于100万'));
        return true;
    }
    callback();
};

FormCheck.amt=(rule, amt, callback) => {
    //允许两位小数
    if (!GwRegular.numeric2.test(amt)) {
        callback('请输入数字，可以为2位小数');
    }
    callback();
};

export default FormCheck;
