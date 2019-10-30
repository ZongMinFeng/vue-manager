/*!
* gaozh v1
*/
module.exports = {
    //	交易码，返回码定义
    service: {
        //图片地址
        uploadUrl:'http://111.231.202.32:10080',//测试
        // uploadUrl:'http://139.196.162.158:10080',//生产
        // uploadUrl:Vue.prototype.baseConfig.PictureBaseUrl,

        project: "/mall/",

        genLoginId: {
            url: "MallPcMng",
            action: "genLoginId",
            txnId: "30001"
        },
        getLoginStatus: {
            url: "MallPcMng",
            action: "getLoginStatus",
            txnId: "30002"
        },
        getMallCategory: {
            url: "MallPcMng",
            action: "getMallCategory",
            txnId: "30003"
        },
        saveMallCategory: {
            url: "MallPcMng",
            action: "saveMallCategory",
            txnId: "30004"
        },
        delMallCategory: {
            url: "MallPcMng",
            action: "delMallCategory",
            txnId: "30005"
        },
        getCateParamByCateId: {
            url: "MallPcMng",
            action: "getCateParamByCateId",
            txnId: "30006"
        },
        saveCateParam: {
            url: "MallPcMng",
            action: "saveCateParam",
            txnId: "30007"
        },
        delCateParam: {
            url: "MallPcMng",
            action: "delCateParam",
            txnId: "30008"
        },
        saveGoodsParams: {
            url: "MallPcMng",
            action: "saveGoodsParams",
            txnId: "30009"
        },
        getGoodsParamsById: {
            url: "MallPcMng",
            action: "getGoodsParamsById",
            txnId: "30010"
        },
        delGoodsParams: {
            url: "MallPcMng",
            action: "delGoodsParams",
            txnId: "30011"
        },
        saveGoodsDesc: {
            url: "MallPcMng",
            action: "saveGoodsDesc",
            txnId: "30012"
        },
        getGoodsDescById: {
            url: "MallPcMng",
            action: "getGoodsDescById",
            txnId: "30013"
        },
        delGoodsDesc: {
            url: "MallPcMng",
            action: "delGoodsDesc",
            txnId: "30014"
        },
        saveGoodsInfo: {
            url: "MallPcMng",
            action: "saveGoodsInfo",
            txnId: "30015"
        },
        uptGoodsInfo: {
            url: "MallPcMng",
            action: "uptGoodsInfo",
            txnId: "30016"
        },
        getGoodsInfoById: {
            url: "MallPcMng",
            action: "getGoodsInfoById",
            txnId: "30017"
        },
        saveGoodsSerials: {
            url: "MallPcMng",
            action: "saveGoodsSerials",
            txnId: "30018"
        },
        getGoodsSerialsByGoodsId: {
            url: "MallPcMng",
            action: "getGoodsSerialsByGoodsId",
            txnId: "30019"
        },
        uptGoodsSerialById: {
            url: "MallPcMng",
            action: "uptGoodsSerialById",
            txnId: "30020"
        },
        delGoodsSerialById: {
            url: "MallPcMng",
            action: "delGoodsSerialById",
            txnId: "30021"
        },
        delGoodsSerialByGoodsId: {
            url: "MallPcMng",
            action: "delGoodsSerialByGoodsId",
            txnId: "30022"
        },
        sendGoodsFile: {
            url: "MallPcMng",
            action: "sendGoodsFile",
            txnId: "30023"
        },
        qryGoodsInfo: {
            url: "MallPcMng",
            action: "qryGoodsInfo",
            txnId: "30024"
        },
        putOnOffGoods: {
            url: "MallPcMng",
            action: "putOnOffGoods",
            txnId: "30025"
        },
        getMallContent: {
            url: "MallPcMng",
            action: "getMallContent",
            txnId: "30026"
        },
        saveMallContent: {
            url: "MallPcMng",
            action: "saveMallContent",
            txnId: "30027"
        },
        getMallIndexById: {
            url: "MallPcMng",
            action: "getMallIndexById",
            txnId: "30028"
        },
        uptMallContent: {
            url: "MallPcMng",
            action: "uptMallContent",
            txnId: "30029"
        },
        delMallContentById:{
            url: "MallPcMng",
            action: "delMallContentById",
            txnId: "30030"
        },
        genGoodsId: {
            url: "MallPcMng",
            action: "genGoodsId",
            txnId: "30031"
        },
        uptGoodsStock:{
            url: "MallPcMng",
            action: "uptGoodsStock",
            txnId: "30032"
        },
        sendContentFile:{
            url: "MallPcMng",
            action: "sendContentFile",
            txnId: "30034"
        },
        getSysMallConfig:{
            url: "MallPcMng",
            action: "getSysMallConfig",
            txnId: "30035"
        },
        delGoodsInfoById:{
            url: "MallPcMng",
            action: "delGoodsInfoById",
            txnId: "30036"
        },



    },

    //公共处理模块
    serviceApi:{
        project: "/api/",

        qryOrderById:{
            url: "UserWeChat",
            action: "qryOrderById",
            txnId: "40012"
        },

        qryOrders:{
            url: "UserWeChat",
            action: "qryOrders",
            txnId: "40013"
        }
    },

    resp: {
        success: {
            code: "0000",
            desc: "交易成功"
        },

    }
};