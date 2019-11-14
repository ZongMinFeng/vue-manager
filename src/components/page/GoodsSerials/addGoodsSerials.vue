<template>
    <div class="container">
        <div v-if="oper===2" class="showId">
            <span>系列Id：{{AddForm.goodsId}}</span>
        </div>
        <el-form :span="6" :model="AddForm" :rules="rules" ref="AddForm" label-width="100px"
                 size="mini">
            <!--商品名称-->
            <el-row :gutter="10">
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="颜色" prop="specColor">
                        <el-input maxlength="10" placeholder="请输入系列颜色" v-model="AddForm.specColor"
                                  @change="onColorChange(AddForm.specColor)"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="尺寸" prop="specSize">
                        <el-input maxlength="10" placeholder="请输入系列尺寸" v-model="AddForm.specSize"
                                  @change="onSizeChange(AddForm.specSize)"></el-input>
                    </el-form-item>
                </el-col>

                <el-col v-if="oper===1" :sm="24" :md="12" :xl="8">
                    <el-form-item label="系列库存" prop="stockNum">
                        <el-input maxlength="9" placeholder="请输入系列库存"
                                  v-model="AddForm.stockNum"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="系列价格" prop="specPrice">
                        <el-input maxlength="9" placeholder="请输入系列价格,如：1.00"
                                  v-model="AddForm.specPrice"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="系列现价" prop="specNowPrice">
                        <el-input maxlength="9" placeholder="请输入系列现价,如：1.00"
                                  v-model="AddForm.specNowPrice"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item class="form-bot">
                <el-button style="margin-right:5px" @click="$router.go(-1)">取 消</el-button>
                <el-button type="primary" @click="addConfirm('AddForm')">确 定</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import {sendServer} from '../../../util/common';
    import cfg from '../../../config/cfg';
    import draggable from 'vuedraggable'

    export default {

        data() {
            let checkSafePeriod = (rule, SafePeriod, callback) => {
                let reg = /^[0-9]*[1-9][0-9]*$/;
                if (!reg.test(SafePeriod)) {
                    callback(new Error('请输入大于0的数字'));
                }
                let SafePeriodI = parseInt(SafePeriod);
                if (SafePeriodI === 0) {
                    callback(new Error('请输入大于0的数字'));
                } else {
                    callback();
                }
            };
            let checkAmt = (rule, amt, callback) => {
                let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                if (!reg.test(amt)) {
                    callback(new Error('请输入正确的金额，如：1.00'));
                    return true;
                }
                let amtD = parseFloat(amt);
                if (amtD - 999999.99 > 0.001) {
                    callback(new Error('请输入小于100万的金额'));
                    return true;
                }
                callback();
            };
            return {
                AddForm: {},
                rules: {
                    stockNum:[
                        {validator:checkSafePeriod, trigger: 'blur'}
                    ],
                    specPrice:[
                        {validator:checkAmt, trigger: 'blur'}
                    ],
                    specNowPrice:[
                        {validator:checkAmt, trigger: 'blur'}
                    ]
                },
                oper: 1, // 1:新增，2:修改
                goodsId:''
            }
        },

        activated(){
            this.initGoodsItem();
        },

        methods: {
            // 商品颜色修改
            onColorChange(specColor) {
                specColor = specColor.replace(/\s+/g, "");
                this.AddForm.specColor = specColor;
            },
            // 商品尺寸修改
            onSizeChange(specSize) {
                specSize = specSize.replace(/\s+/g, "");
                this.AddForm.specSize = specSize;
            },

            initGoodsItem() {
                let AddForm = {
                    goodsId:'',
                    specColor:'',
                    specSize:'',
                    stockNum:'',
                    specPrice:'',
                    specNowPrice:''
                };
                let query = this.$route.query || {};
                this.oper = query.oper;
                if(this.oper===2){
                    //系列修改
                    this.AddForm=query.AddForm;
                    this.goodsId=this.AddForm.goodsId;
                }else{
                    //系列新增
                    AddForm = {
                        goodsId:'',
                        specColor:'',
                        specSize:'',
                        stockNum:'',
                        specPrice:'',
                        specNowPrice:''
                    };
                    this.goodsId=query.goodsId;
                    this.AddForm=AddForm;
                }
            },

            goodsAddItem() {
                let urlParams = {};
                let send = [];
                urlParams.url = cfg.service.project + cfg.service.saveGoodsSerials.url + '/' + cfg.service.saveGoodsSerials.action;
                urlParams.txnId = cfg.service.saveGoodsSerials.txnId;

                let userId = localStorage.getItem('userId') || '';
                let goodsSerialsItem={};
                goodsSerialsItem.goodsId=this.goodsId;
                goodsSerialsItem.specColor=this.AddForm.specColor;
                goodsSerialsItem.specSize=this.AddForm.specSize;
                //后台很坑地设置了重量单位“克”，而下发的单位有可能是“斤”

                goodsSerialsItem.stockNum=this.AddForm.stockNum;
                goodsSerialsItem.specPrice = parseFloat(this.AddForm.specPrice).toFixed(2);
                goodsSerialsItem.specNowPrice = parseFloat(this.AddForm.specNowPrice).toFixed(2);
                goodsSerialsItem.userId=userId;
                let goodsSerials=[];
                goodsSerials.push(goodsSerialsItem);
                send=goodsSerials;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        that.$message.success("新增成功");

                        console.log("新增 goodsId", that.goodsId);//debug
                        that.$router.push({path:'/goodsInfos', query:{goodId:that.goodsId}});
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            goodsEditItem() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.uptGoodsSerialById.url + '/' + cfg.service.uptGoodsSerialById.action;
                urlParams.txnId = cfg.service.uptGoodsSerialById.txnId;

                let userId = localStorage.getItem('userId') || '';
                send.specGoodsId=this.AddForm.specGoodsId;
                send.specColor=this.AddForm.specColor;
                send.specSize=this.AddForm.specSize;
                send.specPrice = parseFloat(this.AddForm.specPrice).toFixed(2);
                send.specNowPrice = parseFloat(this.AddForm.specNowPrice).toFixed(2);
                send.userId=userId;

                urlParams.signArray={
                    specGoodsId:send.specGoodsId,
                    specPrice:send.specPrice,
                    specNowPrice:send.specNowPrice,
                    userId:send.userId
                };

                urlParams.send=send;

                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        that.$message.success("修改成功");
                        console.log("修改 goodsId", that.goodsId);//debug
                        that.$router.push({path:'/goodsInfos', query:{goodId:that.goodsId}});
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            addConfirm(AddFormName) {
                let that = this;
                this.$refs[AddFormName].validate((valid) => {
                    if (valid) {
                        if(this.oper===1){
                            //新增
                            that.goodsAddItem();
                        }else{
                            //修改
                            that.goodsEditItem();
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        created() {
            this.initGoodsItem();
        },
        computed: {

        },
        components: {
            draggable
        }
    }
</script>

<style>
    .form-bot {
        text-align: right;
    }

    .spec-name-list span {
        font-size: 15px;
        color: #5F6165;
        padding-left: 10px;
    }

    .spec-list1 input {
        border-width: 0;
    }

    .barcode-ipt button {
        padding: 0 5px;
    }

    .spec-name-list-btn i {
        font-size: 15px;
        line-height: 42px;
        color: #429EFD;
    }

    .spec-name-list .spec-name-list-btn span {
        line-height: 42px;
        margin: 0;
        padding-left: 5px;
        color: #429EFD;
    }

    .showId{
        margin-bottom: 15px;
        margin-left: 28px;
        color: #606266;
    }

</style>
