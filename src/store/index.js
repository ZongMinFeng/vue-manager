import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
    state:{
        suppRefreshFlag: false,
        brandRefreshFlag: false,
        goodsRefreshFlag: false,
        loginFlag:false,
        unitArray:null,
        goodsTypeArray:null,
        goodsBrandArray:null,
        ruleFunction:{ }  // 权限
    },
    mutations:{
        loginIn(state){//这里的state对应着上面这个state
            state.loginFlag = true;
            //你还可以在这里执行其他的操作改变state
        },
        loginOut(state){//这里的state对应着上面这个state
            state.loginFlag = false;
            //你还可以在这里执行其他的操作改变state
        },
        setRuleFunction(state, ruleFunction) {
            state.ruleFunction = ruleFunction;
        },
        setUnitArray(state, unitArray) {
            state.unitArray = unitArray;
        },
        setGoodsTypeArray(state, goodsTypeArray) {
            state.goodsTypeArray = goodsTypeArray;
        },
        setGoodsBrandArray(state, goodsBrandArray) {
            state.goodsBrandArray = goodsBrandArray;
        },
        suppRefreshT(state){
            state.suppRefreshFlag = true;
        },
        suppRefreshF(state){
            state.suppRefreshFlag = false;
        },
        brandRefreshT(state){
            state.brandRefreshFlag = true;
        },
        brandRefreshF(state){
            state.brandRefreshFlag = false;
        },
        goodsRefreshT(state){
            state.goodsRefreshFlag = true;
        },
        goodsRefreshF(state){
            state.goodsRefreshFlag = false;
        },
    },

    actions:{

    }
})
