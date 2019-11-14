const common = require('./common.js');
const cfg = require("../config/cfg.js");

const getCateParamByCateId = (me, Id) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.getCateParamByCateId.url + '/' + cfg.service.getCateParamByCateId.action;
        urlParams.txnId = cfg.service.getCateParamByCateId.txnId;
        send.categoryId = Id;

        urlParams.signArray = {
            categoryId: Id
        };
        urlParams.noShow = true;
        urlParams.send = send;
        // 与server通信，
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功

                if (res.status !== 200 && res.status !== 400) {
                    reject(false); // 失败回调
                    return false;
                }
                resolve(res)
            }, (res) => {
                // 失败
                reject(false)
            }
        );
    })
};
const getMallCategory = (me) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.getMallCategory.url + '/' + cfg.service.getMallCategory.action;
        urlParams.txnId = cfg.service.getMallCategory.txnId;
        send.categoryPid = '99';
        let signArray = {
            categoryPid: '99'
        };
        urlParams.signArray = signArray;

        urlParams.send = send;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(false); // 失败回调
                    return false;
                }
                resolve(res)
            }, (res) => {
                // 失败
                reject(false)
            }
        );
    })
};
const genGoodsId = (me) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.genGoodsId.url + '/' + cfg.service.genGoodsId.action;
        urlParams.txnId = cfg.service.genGoodsId.txnId;

        urlParams.send = send;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(false); // 失败回调
                    return false;
                }
                resolve(res)
            }, (res) => {
                // 失败
                reject(false)
            }
        );
    })
};
const getGoodsDescById = (me, goodsId) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.getGoodsDescById.url + '/' + cfg.service.getGoodsDescById.action;
        urlParams.txnId = cfg.service.getGoodsDescById.txnId;

        send.goodsId = goodsId;

        urlParams.send = send;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(false); // 失败回调
                    return false;
                }
                resolve(res)
            }, (res) => {
                // 失败
                reject(false)
            }
        );
    })
};
const getGoodsParamsById = (me, goodsId) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.getGoodsParamsById.url + '/' + cfg.service.getGoodsParamsById.action;
        urlParams.txnId = cfg.service.getGoodsParamsById.txnId;

        send.goodsId = goodsId;

        urlParams.send = send;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(false); // 失败回调
                    return false;
                }
                resolve(res)
            }, (res) => {
                // 失败
                reject(false)
            }
        );
    });
};
// const getCateParamByCateId = (me, categoryId) => {
//     return new Promise((resolve, reject) => {
//         let urlParams = {};
//         let send = {};
//         urlParams.url = cfg.service.project + cfg.service.getCateParamByCateId.url + '/' + cfg.service.getCateParamByCateId.action;
//         urlParams.txnId = cfg.service.getCateParamByCateId.txnId;
//
//         send.categoryId = categoryId;
//
//         urlParams.send = send;
//         common.sendServer(urlParams, me).then(
//             (res) => {
//                 // 成功
//                 if (res.status !== 200 && res.status !== 400) {
//                     reject(false); // 失败回调
//                     return false;
//                 }
//                 resolve(res)
//             }, (res) => {
//                 // 失败
//                 reject(false)
//             }
//         );
//     })
// };

const getGoodsInfoById = (me, params) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.getGoodsInfoById.url + '/' + cfg.service.getGoodsInfoById.action;
        urlParams.txnId = cfg.service.getGoodsInfoById.txnId;

        send.goodsId = params.goodsId;

        urlParams.send = send;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(false); // 失败回调
                    return false;
                }
                resolve(res)
            }, (res) => {
                // 失败
                reject(false)
            }
        );
    });
};

const uptGoodsStock = (me, productId, stockNum, lockNum) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.uptGoodsStock.url + '/' + cfg.service.uptGoodsStock.action;
        urlParams.txnId = cfg.service.uptGoodsStock.txnId;

        send.productId = productId;
        if (stockNum == null && lockNum == null) {
            reject(false); // 失败回调
            return false;
        }

        let signArray = {
            productId: productId,
        };

        if (stockNum != null) {
            send.stockNum = stockNum;
            signArray.stockNum = stockNum;
        }

        if (lockNum != null) {
            send.lockNum = lockNum;
            signArray.lockNum = lockNum;
        }

        urlParams.send = send;
        urlParams.signArray = signArray;

        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(false); // 失败回调
                    return false;
                }
                resolve(res)
            }, (res) => {
                // 失败
                reject(false)
            }
        );
    });
};

const delMallIndexById = (me, id) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.delMallIndexById.url + '/' + cfg.service.delMallIndexById.action;
        urlParams.txnId = cfg.service.delMallIndexById.txnId;

        send.id = id;

        let signArray = {
            id: id,
        };

        urlParams.send = send;
        urlParams.signArray = signArray;

        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(false); // 失败回调
                    return false;
                }
                resolve(res)
            }, (res) => {
                // 失败
                reject(false)
            }
        );
    });
};

const qryGoodsInfo = (me, params) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        if (params.CurPage == null || params.CurPage === '') {
            params.CurPage = params.page;
        }
        if (params.limitNum == null || params.limitNum === '') {
            params.limitNum = params.pageSize;
        }
        urlParams.url = cfg.service.project + cfg.service.qryGoodsInfo.url + '/' + cfg.service.qryGoodsInfo.action;
        urlParams.txnId = cfg.service.qryGoodsInfo.txnId;
        urlParams.url += '?page=' + params.CurPage + '&pageSize=' + params.limitNum;
        if (params.categoryId != null && params.categoryId !== '') {
            send.categoryId = params.categoryId;
        }
        if (params.name != null && params.name !== '') {
            send.name = params.name;
        }
        if (params.sellPoint != null && params.sellPoint !== '') {
            send.sellPoint = params.sellPoint;
        }
        if (params.isSerial != null && params.isSerial !== '') {
            send.isSerial = params.isSerial;
        }
        if (params.begPrice != null) {
            send.begPrice = params.begPrice;
        }
        if (params.endPrice != null) {
            send.endPrice = params.endPrice;
        }
        if (params.begNowPrice != null) {
            send.begNowPrice = params.begNowPrice;
        }
        if (params.endNowPrice != null) {
            send.endNowPrice = params.endNowPrice;
        }
        if (params.begSellCount != null) {
            send.begSellCount = params.begSellCount;
        }
        if (params.endSellCount != null) {
            send.endSellCount = params.endSellCount;
        }
        if (params.endSellCount != null) {
            send.endSellCount = params.endSellCount;
        }
        urlParams.send = send;

        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

const getSysMallConfig = (me) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.getSysMallConfig.url + '/' + cfg.service.getSysMallConfig.action;
        urlParams.txnId = cfg.service.getSysMallConfig.txnId;
        urlParams.send = send;
        common.sendServer(urlParams, me).then(
            (res) => {
                console.log('res', res);
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

const getMallContent = (me) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.getMallContent.url + '/' + cfg.service.getMallContent.action;
        urlParams.txnId = cfg.service.getMallContent.txnId;
        urlParams.send = send;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

const saveMallContent = (me, params) => {
    return new Promise((resolve, reject) => {
        console.log("saveMallContent", params);//debug
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.saveMallContent.url + '/' + cfg.service.saveMallContent.action;
        urlParams.txnId = cfg.service.saveMallContent.txnId;

        send.userId = params.userId;
        send.argName = params.argName;
        send.argValue = params.argValue;

        let signArray = {
            userId: send.userId,
            argName: send.argName,
        };
        console.log('params.signFlag', params.signFlag);
        //根据signFlag决定argValue是否要签名
        if (params.signFlag != null && params.signFlag === 'Y') {
            console.log('params.signFlag', params.signFlag);
            signArray.argValue = params.argValue;
        }

        if (params.pictureUrl != null && params.pictureUrl !== '') {
            send.pictureUrl = params.pictureUrl;
            signArray.pictureUrl = send.pictureUrl;
        }

        urlParams.send = send;
        urlParams.signArray = signArray;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

const delMallContentById = (me, params) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.delMallContentById.url + '/' + cfg.service.delMallContentById.action;
        urlParams.txnId = cfg.service.delMallContentById.txnId;

        send.userId = params.userId;
        send.id = params.id;

        let signArray = {
            userId: send.userId,
            id: params.id
        };

        urlParams.send = send;
        urlParams.signArray = signArray;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

const uptMallContent = (me, params) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.uptMallContent.url + '/' + cfg.service.uptMallContent.action;
        urlParams.txnId = cfg.service.uptMallContent.txnId;

        send.userId = params.userId;
        send.id = params.id;
        send.argValue = params.argValue;

        let signArray = {
            userId: send.userId,
            id: params.id,
        };

        //根据signFlag决定argValue是否要签名
        if (params.signFlag != null && params.signFlag === 'Y') {
            signArray.argValue = params.argValue;
        }

        if (params.pictureUrl != null && params.pictureUrl !== '') {
            send.pictureUrl = params.pictureUrl;
            signArray.pictureUrl = params.pictureUrl;
        }

        urlParams.send = send;
        urlParams.signArray = signArray;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

const putOnOffBatch = (me, params) => {
    return new Promise((resolve, reject) => {
        console.log("params", params);//debug
        let urlParams = {};
        urlParams.url = cfg.service.project + cfg.service.putOnOffGoods.url + '/' + cfg.service.putOnOffGoods.action;
        urlParams.txnId = cfg.service.putOnOffGoods.txnId;

        urlParams.header = {};
        urlParams.header.operFlag = params.operFlag;
        urlParams.send = params.goods;
        urlParams.UnUserId = true;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

const delGoodsInfoById = (me, params) => {
    return new Promise((resolve, reject) => {
        console.log("params", params);//debug
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.delGoodsInfoById.url + '/' + cfg.service.delGoodsInfoById.action;
        urlParams.txnId = cfg.service.delGoodsInfoById.txnId;

        send.goodsId = params.goodsId;
        send.userId = params.userId;

        let signArray = {
            goodsId: send.goodsId
        };

        urlParams.send = send;
        urlParams.signArray = signArray;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

//公共交易处理模块
const qryOrders = (me, params) => {
    return new Promise((resolve, reject) => {
        console.log("params", params);//debug
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.serviceApi.project + cfg.serviceApi.qryOrders.url + '/' + cfg.serviceApi.qryOrders.action;
        urlParams.txnId = cfg.serviceApi.qryOrders.txnId;
        urlParams.url += '?page=' + params.page;
        urlParams.url += '&pageSize=' + params.pageSize;

        if (params.userId != null && params.userId !== '') {
            send.userId = params.userId;
        }

        if (params.status != null && params.status !== '') {
            send.status = params.status;
        }

        urlParams.send = send;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

//1.5.12	根据订单id查询订单– 查询 – 不验签
const qryOrderById = (me, params) => {
    return new Promise((resolve, reject) => {
        console.log("params", params);//debug
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.serviceApi.project + cfg.serviceApi.qryOrderById.url + '/' + cfg.serviceApi.qryOrderById.action;
        urlParams.txnId = cfg.serviceApi.qryOrderById.txnId;

        send.orderId = params.orderId;

        urlParams.send = send;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

/**
 * 1.3.37	商城店铺--新增--验签
 * @param me
 * @param params
 * @returns {Promise<any>}
 */
const saveShop = (me, params) => {
    return new Promise((resolve, reject) => {
        console.log("params", params);//debug
        let urlParams = {};
        let send = {};
        let signArray = {};
        urlParams.url = cfg.service.project + cfg.service.saveShop.url + '/' + cfg.service.saveShop.action;
        urlParams.txnId = cfg.service.saveShop.txnId;

        send.userId = params.userId;
        signArray.userId=params.userId;

        if(params.province!=null){
            send.province=params.province;
        }
        if(params.city!=null){
            send.city=params.city;
        }
        if(params.area!=null){
            send.area=params.area;
        }
        if(params.street!=null){
            send.street=params.street;
        }
        if(params.shopName!=null){
            send.shopName=params.shopName;
        }
        if(params.shopAddress!=null){
            send.shopAddress=params.shopAddress;
        }

        //debug写死测试 b1egin
        params.latitude=30.108904;
        params.longitude=117.03571;
        if(params.latitude!=null){
            send.latitude=params.latitude;
            signArray.latitude=params.latitude;
        }
        if(params.longitude!=null){
            send.longitude=params.longitude;
            signArray.longitude=params.longitude;
        }
        //debug写死测试 end

        urlParams.send = send;
        urlParams.signArray = signArray;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

/**
 * 1.3.38    根据商城查询店铺列表 –不验签
 * @param me
 * @returns {Promise<any>}
 */
const getMallShop = (me, params) => {
    return new Promise((resolve, reject) => {
        let urlParams = {};
        let send = {};
        let signArray={};
        urlParams.url = cfg.service.project + cfg.service.getMallShop.url + '/' + cfg.service.getMallShop.action;
        urlParams.txnId = cfg.service.getMallShop.txnId;

        urlParams.send = send;
        urlParams.signArray=signArray;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

/**
 * 1.3.41	生成操作员信息--新增--验签
 * @param me
 * @param params
 * @returns {Promise<any>}
 */
const saveOper = (me, params) => {
    return new Promise((resolve, reject) => {
        console.log("params", params);//debug
        let urlParams = {};
        let send = {};
        let signArray = {};
        urlParams.url = cfg.service.project + cfg.service.saveOper.url + '/' + cfg.service.saveOper.action;
        urlParams.txnId = cfg.service.saveOper.txnId;

        send.userId = params.userId;
        signArray.userId=params.userId;

        if(params.userPhone!=null){
            send.userPhone=params.userPhone;
            signArray.userPhone=send.userPhone;
        }

        if(params.userName!=null){
            send.userName=params.userName;
        }

        urlParams.send = send;
        urlParams.signArray = signArray;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

/**
 * 1.3.42	查询操作员信息–不验签(分页)
 * @param me
 * @param params
 * @returns {Promise<any>}
 */
const getOper = (me, params) => {
    return new Promise((resolve, reject) => {
        console.log("getOper params", params);//debug
        let urlParams = {};
        let send = {};
        urlParams.url = cfg.service.project + cfg.service.getOper.url + '/' + cfg.service.getOper.action;
        urlParams.txnId = cfg.service.getOper.txnId;
        urlParams.url += '?page=' + params.page;
        urlParams.url += '&pageSize=' + params.pageSize;
        urlParams.send = send;
        common.sendServer(urlParams, me).then(
            (res) => {
                // 成功
                if (res.status !== 200 && res.status !== 400) {
                    reject(res); // 失败回调
                    return res;
                }
                resolve(res);
            }, (res) => {
                // 失败
                reject(res);
            }
        );
    });
};

export {
    getCateParamByCateId,
    getMallCategory,
    genGoodsId,
    getGoodsDescById,
    getGoodsParamsById,
    getGoodsInfoById,
    uptGoodsStock,
    delMallIndexById,
    qryGoodsInfo,
    getSysMallConfig,
    getMallContent,
    saveMallContent,
    delMallContentById,
    uptMallContent,
    putOnOffBatch,
    delGoodsInfoById,
    qryOrders,
    qryOrderById,
    getMallShop,
    saveShop,
    saveOper,
    getOper,
};
