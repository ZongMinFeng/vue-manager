/*!
* gaozh v1
*/
let jsonSha256 = require("./jsonSha256.js");
let pub = require("./pub.js");
let cfg = require("../config/cfg.js");
let trans = require("./../config/trans.js");
let sysArg = require("./../config/sysArg.js");
let RSA = require('jsencrypt');
let util = require('./util.js');
let axios = require('axios');
let base64 = require('./base64');

const sendServer = (urlParams, me, flag) => {
    let mallPcUuid = localStorage.getItem('mallPcUuid') || '';
    let macKey = localStorage.getItem('macKey') || '';
    let mallId = localStorage.getItem('mallId') || '';
    let userId = localStorage.getItem('userId') || '';
    let sha256Key = '';
    let date = new Date();
    let ssDate = util.ssformatTime(date);
    let params = {};
    let rc = "", sign = "";
    let method = flag || "POST";

    params = urlParams.send;
    // 生成6位随机数
    // pub.pubRandom(params);
    // let sparams = pub.pack(params);
    return new Promise((resolve, reject) => {
        // 获取密钥
        // sha256Key = sysArg.key;
        // 计算签名
        let send = urlParams.send;
        let header = urlParams.header || {};
        header.txnId = urlParams.txnId;
        header.channelFlag = '4';
        header.reqTime = ssDate;
        if(urlParams.txnId !== cfg.service.genLoginId) {
            header.mallPcUuid = mallPcUuid
        }


        if(urlParams.txnId !== cfg.service.genLoginId.txnId && urlParams.txnId !== cfg.service.getLoginStatus.txnId) {
            pub.pubRandom(header);
            let headerStr = '1=4&2=' + header.reqCasher + '&3=' + ssDate + '&4=' + urlParams.txnId + '&5=' + header.mallPcUuid;
            let signArray = urlParams.signArray || {};
            header.mallId = mallId;
            if(urlParams.txnId!==cfg.service.saveGoodsSerials.txnId && urlParams.txnId!==cfg.service.getGoodsInfoById.txnId && urlParams.txnId!==cfg.serviceApi.qryOrders.txnId){
                send.userId = userId;
            }
            if(!urlParams.UnUserId&&urlParams.txnId!==cfg.service.saveGoodsSerials.txnId&& urlParams.txnId!==cfg.serviceApi.qryOrders.txnId) {
                signArray.userId = userId;
            }

            headerStr += '&6=' + header.mallId;
            if(header.operFlag) {
                headerStr += '&7=' + header.operFlag;
            }
            let jsonstr = "";
            if (signArray && signArray !== {}) {
                let jsonObj = jsonSha256.objKeySort(signArray);
                // console.log("jsonObj:", jsonObj)
                for (let item in jsonObj) {
                    jsonstr += "&" + item + "=" + jsonObj[item] ;
                }
            }
            if (jsonstr) {
                headerStr += jsonstr
            }
            // console.log("签名原内容:", headerStr);//debug
            let signBase64 = base64.base64encode(headerStr);
            let signString1 = signBase64 + '&key=' + macKey;
            // console.log("签名内容：", signString1);//debug
            header.signValue = jsonSha256.json2sha(signString1);

        }

        // console.log("url:", urlParams.url);//debug
        axios.post(urlParams.url, params, {headers:header}).then((res) => {
            if (res.status === 200) {
                // if (params.TxnId !== cfg.service.getLoginId.txnId) {
                //     sign = jsonSha256.mathJsonSha(res.data, sha256Key, 2);
                //     if (false === sign) {
                //         console.log("验证sign失败:" + sign);
                //         return false;
                //     }
                // }
                // var unPackRes = pub.unPack(res.data);
                // console.log("res:",res)
                // console.log(unPackRes)
                resolve(res.data); // 成功回调
                return true;
            } else {
                reject(false);// 失败回调
                return false;
            }

        }, (res) => {
            reject(false);// 失败回调
        });

    })
};

// exports sendServer
//
// let sendServer = (urlParams, callback) => {
//     let uuid = localStorage.getItem('Uuid') || '';
//     let MacKey = localStorage.getItem('MacKey') || '';
//     let prikey64 = localStorage.getItem('LocalPriKey') || '';
//     let sha256Key = '';
//     let date = new Date().Format('yyyy-MM-dd hh:mm:ss');
//     let ssDate = new Date().Format('yyyy-MM-dd-hh:mm:ss');
//     let params = {};
//     let rc = "", sign = "";
//
//     console.log("sendServer beg" );
//
//     params = urlParams.send;
//     if (uuid) {
//         params.Uuid = uuid;
//     }
//     if (params.TxnId !== "20018") {
//         let userInfo = localStorage.getItem('userInfo') || {};
//         if (userInfo) {
//             if (urlParams.UserIdFlag !== 1) {  // UserIdFlag = 1 则不上送 UserId
//                 params.UserId = userInfo.UserId;
//             }
//             if (params.TxnId !== "10004") {
//                 params.StoreId = userInfo.StoreId;
//                 params.Issuid = userInfo.Issuid;
//             }
//
//         }
//
//         let decrypt = new RSA.JSEncrypt();
//         decrypt.setPrivateKey(prikey64);
//         sha256Key = decrypt.decrypt(MacKey);
//     }
//
//     params.ChannelFlag = "3";
//     params.SsPackReqTime = ssDate;
//     // 生成6位随机数
//     pub.pubRandom(params);
//
//     // 获取密钥
//     // sha256Key = sysArg.key;
//     // 计算签名
//     // console.log("开始打包:" + JSON.stringify(params));
//     let sparams = pub.pack(params);
//
//     console.log("打包结束:" + JSON.stringify(sparams));
//     if (params.TxnId !== cfg.service.weChatUuidAndKey.txnId) {
//         sign = jsonSha256.mathJsonSha(sparams, sha256Key, 1);
//         if (false === sign) {
//             return false;
//         }
//     }
//
//     axios.post("/users/cartDel",sparams).then((response)=>{
//         let res = response.data;
//         callback(res);
//     });
//     //wx.request 为回调函数
//     // wx.request({
//     //     url: urlParams.url,
//     //     data: sparams,
//     //     method: 'POST',
//     //     success: (res) => {
//     //         // console.log(res);
//     //         wx.hideLoading();
//     //         if (params.TxnId !== cfg.service.weChatUuidAndKey.txnId) {
//     //             sign = jsonSha256.mathJsonSha(res.data, sha256Key, 2);
//     //             if (false === sign) {
//     //                 console.log("验证sign失败:" + sign);
//     //                 return false;
//     //             }
//     //         }
//     //
//     //         // console.log("验签成功----------------------------");
//     //         // console.log("通讯成功:" + JSON.stringify(res.data));
//     //         // 解包
//     //         let unPackRes = pub.unPack(res.data);
//     //         urlParams.res = unPackRes;
//     //         // 需要重新登录
//     //         if (unPackRes.RespCode !== cfg.resp.success.code) {
//     //             wx.showToast({
//     //                 title: '失败',
//     //                 image: '/images/icon/info.png',
//     //                 duration: 1500
//     //             })
//     //         }
//     //         if (unPackRes.RespCode === '1009' || unPackRes.RespCode === '4005') {
//     //             wx.reLaunch({
//     //                 url: '/pages/login/login'
//     //             })
//     //             return false;
//     //         }
//     //         if (typeof (callback) == 'function') {
//     //             callback(unPackRes)
//     //         }
//     //     },
//     //     "error": function (res) {
//     //         console.log("通讯失败:" + JSON.stringify(res));
//     //         wx.hideLoading()
//     //         if (typeof (callback) == 'function') {
//     //             callback(res);
//     //         }
//     //     }
//     // })
//
//
// };
// module.exports = {
//     sendServer
// };
export {
    sendServer
};
