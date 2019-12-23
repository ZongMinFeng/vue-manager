<template>
    <div>
        <div class="param-top">
            <el-button v-if="paramDataId" type="danger" @click="delParamTap">删除</el-button>
            <el-button type="success" :disabled="saveDisabled" @click="saveParamTap" style="margin-left: 10px">保存</el-button>
        </div>
        <div>
            <div v-for="(item, i) in GoodsParamsForm">
                <el-row class="param-list">
                    <el-col :span="12" style="background-color: #AEAAAA;height: 30px;">
                        <div style="text-align:center;background-color: #AEAAAA; line-height: 25px;">{{item.group}}</div>
                    </el-col>
                </el-row>
                <div v-for="(item1, j) in item.params">
                    <el-row class="param-list">
                        <el-col :span="3" class="param-list-test">
                            <div style="margin-left: 5px;">
                                {{item1.name}}
                            </div>
                        </el-col>
                        <el-col :span="9">
                            <el-input v-model="item1.value" placeholder="请输入参数" @change="inputChange"></el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getGoodsParamsById,
        getCateParamByCateId,
        getGoodsInfoById
    } from '../../../util/module';
    import cfg from '../../../config/cfg';
    import {sendServer} from '../../../util/common';
    import pageBus from "../PageBus";
    export default {
        name: "goodsSpec",
        props:{
            data:{}
        },
        data(){
            return{
                GoodsParamsForm:[],
                paramDataId: '',
                goodId:null,
                goodInfo:null,
                saveDisabled:true,
                first:true,
            }
        },

        created(){
            pageBus.$on("goodId", (goodId)=>{
                this.goodId=goodId;
                this.initData();
            });

            pageBus.$on("changeTab3", ()=>{
                pageBus.$emit('changeTab3Resp', !this.saveDisabled);
            });

            pageBus.$on('cancelChange3', ()=>{
                this.saveDisabled=true;
            });
        },

        beforeDestroy(){
            pageBus.$off("goodId");
            pageBus.$off("changeTab3");
            pageBus.$off('cancelChange3');
        },

        watch:{
            //自动监听form变化，点亮保存按钮
            GoodsParamsForm:{
                deep:true,
                handler:function(val, oldVal){
                    if(this.first!==true){
                        this.saveDisabled=false;
                    }else{
                        this.first=false;
                    }
                }
            }
        },

        methods:{
            initData() {
                this.first=true;
                if(this.goodId==null){
                    this.GoodsParamsForm=[];
                    return;
                }
                let that = this;
                //根据goodId获取good详细信息
                let params={};
                params.goodsId=this.goodId;
                getGoodsInfoById(this, params).then(
                    (res)=>{
                        if(res.status!==200 && res.status!==400){
                            this.$message.error(res.msg);
                            return false;
                        }
                        this.goodInfo=res.data;
                        getGoodsParamsById(this, this.goodId).then((res) => {
                            if (res.status === 400) {
                                getCateParamByCateId(this, this.goodInfo.categoryId).then((res) => {
                                    if (res.status !== 200 && res.status !== 400) {
                                        that.$message.error(res.msg);
                                        return false;
                                    }
                                    if(res.status===400){
                                        //不提示
                                        // that.$message.error('没有规格参数');
                                        return false;
                                    }
                                    let paramData = res.data.paramData;
                                    let Param = [];
                                    if (paramData) {
                                        Param = JSON.parse(paramData)
                                    } else {
                                        that.$message.error('没有规格参数');
                                        return false;
                                    }

                                    this.GoodsParamsForm = Param;
                                    this.paramDataId = '';
                                    // that.$store.commit('setGoodsTypeArray', res.data);
                                    // let Params = {
                                    //     paramData: Param,
                                    //     oper: 2   // 1:新增，2:修改
                                    // };
                                    // that.$router.push({path: '/addGoods', query: Params});

                                }, (res) => {
                                    that.$message.error('请求失败');
                                })
                            } else {
                                let paramData = res.data.paramData;
                                let Param = [];
                                if (paramData) {
                                    Param = JSON.parse(paramData)
                                } else {
                                    that.$message.error('没有规格参数');
                                    return false;
                                }
                                this.GoodsParamsForm = Param;
                                this.paramDataId = res.data.id;
                            }

                        }, (res) => {
                            that.$message.error('请求失败');
                        });
                    },
                    (res)=>{
                        this.$message.error("查询商品信息失败");
                        this.$router.go(-1);
                    }
                );

            },

            delParamTap() {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.delGoodsParams();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },

            delGoodsParams() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.delGoodsParams.url + '/' + cfg.service.delGoodsParams.action;
                urlParams.txnId = cfg.service.delGoodsParams.txnId;

                // urlParams.header = {
                //     operFlag: '1',
                // };
                urlParams.signArray = {
                    id: this.paramDataId
                };
                send.id = this.paramDataId;
                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        that.$message.success("删除成功");
                        this.initData();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            saveParamTap() {
                //没有goodId，先保存
                if(this.goodId==null){
                    this.$message.error("请在基础设置先新增商品！");
                    return;
                }
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.saveGoodsParams.url + '/' + cfg.service.saveGoodsParams.action;
                urlParams.txnId = cfg.service.saveGoodsParams.txnId;

                urlParams.header = {
                    operFlag: '1',
                };

                urlParams.signArray = {
                    goodsId: this.goodId,
                };

                if (this.paramDataId) {
                    send.id = this.paramDataId;
                    urlParams.header.operFlag = '2';
                    urlParams.signArray.id = this.paramDataId;
                }
                send.goodsId = this.goodId;
                send.paramData = JSON.stringify(this.GoodsParamsForm);

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        that.$message.success("保存成功");
                        this.saveDisabled=true;
                        this.initData();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            //修改了input内容
            inputChange(){
                this.saveDisabled=false;
            },
        }
    }
</script>

<style scoped>
    .param-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 5px 0;
    }

    .param-list-test {
        margin-left: 0px;
    }

    .param-top {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
</style>
