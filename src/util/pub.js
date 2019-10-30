/*! 
* gaozh v1
*/
var packValue = require("./../config/packValue");
let routeArray = require("./../config/routeArray.js");
/*
 * 获取6位随机数
 */
var pubRandom = function (urlParams) {

    var Num = "";
    for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    urlParams.reqCasher = Num;
    return true;
};
var fmoney = function (s, n, f) {

    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
        if (f === 1) {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
        } else {
            t += l[i];
        }
    }
    return t.split("").reverse().join("") + "." + r;
};

var initAmtIpt = function(value) {
    value = value.replace(/[^\d|.]/g, '');
    if (value) {

        var priceArry = value.split(".");
        if (priceArry[0]) {
            priceArry[0] = parseInt(priceArry[0]).toString()
            if (priceArry[0].length > 6) {
                priceArry[0] = priceArry[0].substr(0, 6)
            }
        }
        if (priceArry.length > 1 && !priceArry[0]) {
            priceArry[0] = '0'
        }
        value = priceArry[0];
        if (priceArry.length > 1) {
            value += ".";
            if (priceArry[1].length > 2) {
                priceArry[1] = priceArry[1].substr(0, 2)
            }
            value += priceArry[1]
        }
    }
    return value;
};

// 打包
var pack = function (urlParams) {
    var packJson = {};
    for (var i = 0; i < packValue.Y.length; i++) {
        if (urlParams[packValue.Y[i].Desc] === undefined || urlParams[packValue.Y[i].Desc] === "undefined") {
            continue;
        }
        packJson[packValue.Y[i].Val] = urlParams[packValue.Y[i].Desc];
    }
    for (i = 0; i < packValue.R.length; i++) {
        if (urlParams[packValue.R[i].Desc] === undefined || urlParams[packValue.R[i].Desc] === "undefined") {
            continue;
        }
        var uR = urlParams[packValue.R[i].Desc];
        var Rr = packValue.R[i].Rr;
        packJson[packValue.R[i].Val] = packR(uR, Rr);

    }
    for (i = 0; i < packValue.Z.length; i++) {
        if (urlParams[packValue.Z[i].Desc] === undefined || urlParams[packValue.Z[i].Desc] === "undefined") {
            continue;
        }
        packJson[packValue.Z[i].Val] = urlParams[packValue.Z[i].Desc];
    }
    for (i = 0; i < packValue.S.length; i++) {
        if (urlParams[packValue.S[i].Desc] === undefined || urlParams[packValue.S[i].Desc] === "undefined") {
            continue;
        }
        packJson[packValue.S[i].Val] = urlParams[packValue.S[i].Desc];
    }
    return packJson;
};
var packR = function (uR, Rr) {
    var endR = [];
    for (var i = 0; i < uR.length; i++) {
        var endRr = {};
        var uRi = uR[i];
        for (var j = 0; j < Rr.length; j++) {
            if (uRi[Rr[j].Desc] === undefined || uRi[Rr[j].Desc] === "undefined") {
                continue;
            }
            endRr[Rr[j].Val] = uRi[Rr[j].Desc];
        }
        endR[i] = endRr;
    }
    return endR;
};
// 解包
var unPack = function (urlParams) {
    var unPackJson = {};
    for (var i = 0; i < packValue.Y.length; i++) {
        if (urlParams[packValue.Y[i].Val] === undefined) {
            continue;
        }
        unPackJson[packValue.Y[i].Desc] = urlParams[packValue.Y[i].Val];
    }
    for (i = 0; i < packValue.R.length; i++) {
        if (urlParams[packValue.R[i].Val] === undefined) {
            continue;
        }
        var uR = urlParams[packValue.R[i].Val];
        var Rr = packValue.R[i].Rr;
        unPackJson[packValue.R[i].Desc] = unPackR(uR, Rr);

    }
    for (i = 0; i < packValue.Z.length; i++) {
        if (urlParams[packValue.Z[i].Val] === undefined) {
            continue;
        }
        unPackJson[packValue.Z[i].Desc] = urlParams[packValue.Z[i].Val];
    }
    for (i = 0; i < packValue.S.length; i++) {
        if (urlParams[packValue.S[i].Val] === undefined) {
            continue;
        }
        unPackJson[packValue.S[i].Desc] = urlParams[packValue.S[i].Val];
    }
    return unPackJson;
};
var unPackR = function (uR, Rr) {
    var endR = [];
    for (var i = 0; i < uR.length; i++) {
        var endRr = {};
        var uRi = uR[i];
        for (var j = 0; j < Rr.length; j++) {
            endRr[Rr[j].Desc] = uRi[Rr[j].Val];
        }
        endR[i] = endRr;
    }
    return endR;
};

/**
 * 将list装换成tree
 * @param {Object } id    节点主ID
 * @param {Object } pId   父节点ID
 * @param {Object } list  list数据
 * @return {Node} - 自定义Node树节点
 */
var listToTree = (id, pId, list) => {
    convertToNodeList(list);

    /**
     * @param {} list        list
     * @param {} pId        父节点
     * @return {Boolean}    是否存在父节点
     * @description now.id = other.pid   other 的父节点为 noew
     */
    function exists(list, pId) {
        for (var i = 0; i < list.length; i++) {
            if (list[i][id] == pId) {
                return true;
            }
        }
        return false;
    }

    /**
     * 树节点数据  最终数据结构
     * @type  Node treeNode
     */
    var nodes = [];


    /**
     * 将所有的节点数据装入List
     * @type Number
     */
    for (var i = 0; i < list.length; i++) {
        var row = list[i];
        if (!exists(list, row[pId])) {//now.pid != new.id
            nodes.push(row);//new ids
        }
    }

    /**
     * 父节点
     * @type Node
     */
    var pNodes = [];

    /**
     * 将所有的子节点数据装入 pNodes
     * @type pNodes
     */
    for (var i = 0; i < nodes.length; i++) {
        pNodes.push(nodes[i]);
    }


    /**
     * 循环处理所有节点数据并进行封装
     */
    while (pNodes.length) {

        /**
         *  把数组的第一个元素从其中删除，并返回第一个元素的值
         *  the parent node
         */
        var node = pNodes.shift();

        /**
         *
         * get the children nodes
         */
        for (var i = 0; i < list.length; i++) {
            var row = list[i];
            /**
             * 取出list所有数据 比较处理
             *
             * 这里可以定制化 Node 节点数据结构
             * {
             *   "isActive": true,
             *   "isRoot": true,
             *   "title": "标题1",
             *   "items": [
             *       {
             *           "text": "内容1"
             *       },
             *       {
             *           "text": "内容2"
             *       }
             *   ]
             * }
             */
            if (row[pId] == node[id]) {
                /**
                 * 如果有items 直接放入
                 */
                if (node.menuBeans) {
                    node.menuBeans.push(row);
                } else {
                    node.menuBeans = [row];
                }
                pNodes.push(row);
            }
        }
    }
    return nodes;
};
var convertToNodeList = (list) => {
    // $.each(list,function(i,e){
    //
    // })
    list.forEach(e => {
        e['title'] = e.NAME;
        e['isRoot'] = (e.PARENT_ID == '-1');
        e['isActive'] = (e.ENABLE_STATUS == '01');
    });
    return list;
};

var contains = (a, obj) => {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return i;
        }
    }
    return false;
};
var setTitle = (route, title) => {
    let routes = routeArray.routes[1].children;
   for(let i=0;i< routes.length; i++) {
       if(route === routes[i].path) {
           routes[i].meta.title =title;
       }
   }
    return true;
};


export {
    pubRandom,
    fmoney,
    pack,
    unPack,
    listToTree,
    contains,
    setTitle,
    initAmtIpt
};
