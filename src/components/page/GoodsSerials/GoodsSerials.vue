<template>
    <div>
        <el-button v-if="addVisible" type="success" icon="el-icon-plus" @click="onAddItemNewTap(goodId)" class="button">
            新增
        </el-button>

        <div class="container" :class="{displayNon:isDisplayNon}">
            <div v-if="oper===2" class="showId">
                <span>系列Id：{{AddFormSerial.specGoodsId}}</span>
            </div>
            <el-form :span="6" :model="AddFormSerial" :rules="rules" ref="AddFormSerial" label-width="100px"
                     size="mini">
                <!--商品名称-->
                <el-row :gutter="10">
                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item :label="specName1" prop="specColor">
                            <el-input maxlength="20" :placeholder="'请输入系列'+specName1" v-model="AddFormSerial.specColor"
                                      @change="onColorChange(AddFormSerial.specColor)"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item :label="specName2" prop="specSize">
                            <el-input maxlength="20"  :placeholder="'请输入系列'+specName2" v-model="AddFormSerial.specSize"
                                      @change="onSizeChange(AddFormSerial.specSize)"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col v-if="oper===1" :sm="24" :md="12" :xl="8">
                        <el-form-item label="系列库存" prop="stockNum">
                            <el-input maxlength="9" placeholder="请输入系列库存"
                                      v-model="AddFormSerial.stockNum"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="起售金额" prop="specMinPrice">
                            <el-input maxlength="64" placeholder="请输入起售金额,如：1.00"
                                      v-model="AddFormSerial.specMinPrice"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="系列价格" prop="specPrice">
                            <el-input maxlength="9" placeholder="请输入系列价格,如：1.00"
                                      v-model="AddFormSerial.specPrice"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="系列现价" prop="specNowPrice">
                            <el-input maxlength="9" placeholder="请输入系列现价,如：1.00"
                                      v-model="AddFormSerial.specNowPrice"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="picture">
                    <div class="list-name">商品系列图</div>
                    <el-upload
                            :action="uploadUrl"
                            multiple
                            list-type="fileList"
                            :show-file-list="false"
                            :http-request="handelPicturePostSerials"
                            :before-upload="beforeAvatarUploadSerials">
                        <el-button v-if="AddFormSerial.specPic!=null&&AddFormSerial.specPic!==''" size="small"
                                   type="primary">修改系列图
                        </el-button>
                        <el-button v-else size="small" type="primary">新增系列图</el-button>
                    </el-upload>
                    <div v-if="AddFormSerial.specPic!=null&&AddFormSerial.specPic!==''" style="margin-top:5px;">
                        <div class="drag-list">
                            <!--<img :src="this.uploadUrl + '/'+AddFormSerial.specPic+'?'+time" class="drag-list-img"/>-->
                            <img :src="imgSrc" class="drag-list-img"/>
                        </div>
                    </div>
                </div>

                <el-form-item class="form-bot">
                    <el-button style="margin-right:5px" @click="addCancle">取 消</el-button>
                    <el-button type="primary" @click="addConfirm('AddFormSerial')">确 定</el-button>
                </el-form-item>
            </el-form>

        </div>

        <el-table :data="tableDataArray" size="medium" class="table" stripe border>
            <el-table-column label="系列 ID" prop="specGoodsId"></el-table-column>
            <el-table-column label="系列主图" width="120" align="center">
                <template slot-scope="scope"><img v-if="scope.row.specPic!=null&&scope.row.specPic!==''"
                                                  :preview="scope.$index"
                                                  style="height: 80px; width: 80px;background-color: white;"
                                                  :src="uploadUrl + '/'+scope.row.specPic"></template>
            </el-table-column>
            <el-table-column :label=specName1 prop="specColor"></el-table-column>
            <el-table-column :label=specName2 prop="specSize" width="80px"></el-table-column>
            <el-table-column label="原价">
                <template slot-scope="props">
                    <p>{{formatPrice(props.row.specPrice)}}元</p>
                </template>
            </el-table-column>
            <el-table-column label="现价">
                <template slot-scope="props">
                    <p>{{formatPrice(props.row.specNowPrice)}}元</p>
                </template>
            </el-table-column>
            <el-table-column label="起售金额" width="80">
                <template slot-scope="props">
                    <p>{{formatPrice(props.row.specMinPrice)}}元</p>
                </template>
            </el-table-column>
            <el-table-column label="库存" width="210">
                <template slot-scope="props">
                    <div class="stock-div">
                        <div>
                            <p>总库存: {{showStock(mastGoodInfo.unit, props.row.stockNum+"")}} {{mastGoodInfo.unit}}</p>
                            <p style="color: red;">锁定库存: {{showStock(mastGoodInfo.unit, props.row.lockNum)}}
                                {{mastGoodInfo.unit}}</p>
                            <p style="color: green;">可用库存: {{showStock(mastGoodInfo.unit,
                                (props.row.stockNum-props.row.lockNum))}} {{mastGoodInfo.unit}}</p>
                        </div>
                        <el-button type="warning" style="margin-left: 5px;" icon="el-icon-edit" circle
                                   @click="upStock(props.row)"></el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" style="margin-right: 5px;" @click="editSerial(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="onDeleteTap(scope.row.specGoodsId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <h3 style="margin-top:20px; color: #909399;">主商品信息</h3>
        <div class="line"></div>
        <el-form :model="mastGoodInfo" label-width="100px" class="goodInfo">
            <el-row :gutter="10">
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="商品名称">
                        <el-input maxlength="20" :disabled="true" v-model="mastGoodInfo.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="商品价格">
                        <el-input maxlength="20" :disabled="true" v-model="mastGoodInfo.price"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="商品现价">
                        <el-input maxlength="20" :disabled="true" v-model="mastGoodInfo.nowPrice"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="商品卖点">
                        <el-input maxlength="20" :disabled="true" v-model="mastGoodInfo.sellPoint"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-dialog title="库存调整" :visible.sync="stockVisible" width="30%">
            <el-form :model="stockForm" label-width="100px" :rules="stockRules" ref="stockForm">
                <el-form-item label="系列ID" prop="name">
                    <el-input :disabled="true" v-model="stockForm.specGoodsId"></el-input>
                </el-form-item>
                <el-form-item label="总库存:">
                    <span style="color: red;"> {{showStock5(stockForm.unit, stockForm.stockNumOld )}} {{stockForm.unit}}</span>
                </el-form-item>
                <el-form-item label="锁定库存:">
                    {{showStock5(stockForm.unit, stockForm.lockNum )}} {{stockForm.unit}}
                </el-form-item>
                <el-form-item label="可用库存:">
                    <span style="color: green;">{{showStock5(stockForm.unit, stockForm.stockNumOld - stockForm.lockNum )}} {{stockForm.unit}}</span>
                </el-form-item>
                <el-form-item label="当前库存修改" prop="stockNum" :rules="[{validator:checkStockUpdate, trigger:'blur'}]">
                    <el-input v-model="stockForm.stockNum" placeholder="请输入要修改的库存"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stockVisible = false">取 消</el-button>
                <el-button type="danger" style="margin-left: 20px;" :disabled="stockFormUpdate" @click="OnUpStockTapDown()">销 货</el-button>
                <el-button type="primary" style="margin-left: 20px;" :disabled="stockFormUpdate" @click="OnUpStockTap()">补 货</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
    import cfg from '../../../config/cfg';
    import {sendServer} from '../../../util/common';
    import pageBus from "../PageBus";
    import {
        uptGoodsStock,
    } from '../../../util/module';
    import _String from '../../../util/string';
    import GwRegular from '@/Gw/GwRegular.js';
    import {unitNum} from '@/Gw/GwString.js';
    import String from '@/util/string.js';

    export default {
        props: {
            data: {}
        },

        data() {
            let checkStockNum = (rule, stockNum, callback) => {
                if (stockNum - this.goodInfo.stockNum < 0) {
                    callback(new Error('库存不能比原来小!'));
                    return true;
                }
                let reg = /^\d+(\.\d{0,5})?$/;
                if (!reg.test(stockNum)) {
                    callback(new Error('请输入大于等于0的数字'));
                    return true;
                }
                if (stockNum > 999999) {
                    callback(new Error('库存应小于100万'));
                    return true;
                }
            };

            let checkLockNum = (rule, lockNum, callback) => {
                if (lockNum - this.goodInfo.stockNum > 0.00001) {
                    callback(new Error('锁定库存不能比当前库存大!'));
                    return true;
                }
                let reg = /^\d+(\.\d{0,5})?$/;
                if (!reg.test(lockNum)) {
                    callback(new Error('请输入大于等于0的数字'));
                    return true;
                }
                if (lockNum > 999999) {
                    callback(new Error('锁定库存应小于100万'));
                    return true;
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

            let checkMinPrice = (rule, specMinPrice, callback) => {
                if (this.AddFormSerial.specMinPrice) {
                    //允许两位小数
                    if (!GwRegular.num2.test(specMinPrice)) {
                        callback(new Error('格式0.00'));
                    }
                    callback();
                } else {
                    callback();
                }
            };
            return {
                goodId: null,
                mastGoodInfo: {
                    name: ''
                },
                tableDataArray: [],
                stockVisible: false,
                stockForm: {
                    name: '兰博基尼',
                    stockNum: null,
                    stockNumOld: null,
                    lockNum: 0,
                    unit: null,
                },
                AddFormSerial: {
                    goodsId: '',
                    specPic: '',
                    specColor: '',
                    specSize: '',
                    stockNum: '',
                    specPrice: '',
                    specNowPrice: '',
                    specMinPrice: '0.00',
                },
                stockRules: {
                    stockNum: [
                        {required: true, message: '请输入当前库存', trigger: 'blur'},
                        {validator: checkStockNum, trigger: 'blur'},
                    ],
                    lockNum: [
                        {required: true, message: '请输入锁定库存', trigger: 'blur'},
                        {validator: checkLockNum, trigger: 'blur'},
                    ]
                },
                goodInfo: {
                    name: ''
                },
                rules: {
                    stockNum: [
                        {validator: this.checkStock, trigger: 'blur'}
                    ],
                    specPrice: [
                        {validator: checkAmt, trigger: 'blur'}
                    ],
                    specNowPrice: [
                        {validator: checkAmt, trigger: 'blur'}
                    ],
                    specMinPrice: [
                        {required: true, message: '请输入起售金额', trigger: 'blur'},
                        {validator: checkMinPrice, trigger: 'blur'}
                    ],
                },
                oper: 1, // 1:新增，2:修改
                goodsId: '',
                isDisplayNon: true,
                addVisible: true,
                uploadUrl: '',
                time: '',
                imgSrc2: '',
                specName1:'颜色',
                specName2:'尺寸',
            }
        },

        computed: {
            stockFormUpdate() {
                if (this.stockForm.stockNum == null) {
                    return true;
                }
                let stockNum=parseFloat(this.stockForm.stockNum+'');
                if (Math.abs(stockNum) < 0.000005) {
                    return true;
                }
                return false;
            },


            imgSrc() {
                return this.uploadUrl + '/' + this.AddFormSerial.specPic + '?' + this.time;
            }
        },

        created() {
            let specNames=localStorage.getItem('specNames').split('||');
            if(specNames.length===1){
                this.specName1=specNames[0];
            }
            if(specNames.length===2){
                this.specName1=specNames[0];
                this.specName2=specNames[1];
            }
            pageBus.$on("goodId", (goodId) => {
                this.goodId = goodId;
                this.initDate();
            });
        },

        beforeDestroy() {
            pageBus.$off("goodId");
        },

        methods: {
            initDate() {
                this.isDisplayNon = true;
                this.addVisible = true;
                if (this.goodId == null) {
                    this.tableDataArray = [];
                    return;
                }
                this.tableDataArray = [];
                this.getGoodsSerials(this.goodId);
                let mallId = localStorage.getItem('mallId') || '';
                this.uploadUrl = cfg.service.uploadUrl + '/' + mallId + '/' + this.goodId;
            },

            showStock(unit, stock){
                return unitNum(unit, String.unitNumDown(unit, stock));
            },

            showStock5(unit, stock){

                return String.unitNum5(unit, String.unitNumDown(unit, stock));
            },

            unitNum(unit, num) {
                return unitNum(unit, num);
            },



            checkStock(rule, stockNum, callback) {
                if (stockNum == null || this.mastGoodInfo.unit == null) {
                    callback(new Error('请输入值'));
                }
                switch (this.mastGoodInfo.unit) {
                    case '公斤':
                    case '斤':
                    case '克':
                        if (!GwRegular.numeric2.test(stockNum)) {
                            callback('请输入正数，可以为2位小数');
                        }
                        break;
                    default:
                        //只能是个位数
                        if (!GwRegular.num.test(stockNum)) {
                            callback('请输入整数');
                        }
                }
                if (stockNum > 999999) {
                    callback(new Error('库存应小于100万'));
                    return true;
                }
                callback();
            },

            checkStockUpdate(rule, stockNum, callback) {
                if (stockNum == null || this.mastGoodInfo.unit == null) {
                    callback(new Error('请输入值'));
                }
                switch (this.mastGoodInfo.unit) {
                    case '公斤':
                    case '斤':
                    case '克':
                        if (!GwRegular.numeric2.test(stockNum)) {
                            callback('请输入数字，可以为2位小数');
                        }
                        break;
                    default:
                        //只能是个位数
                        if (!GwRegular.num.test(stockNum)) {
                            callback('请输入整数');
                        }
                }
                if (stockNum > 999999) {
                    callback(new Error('库存应小于100万'));
                    return true;
                }
                callback();
            },

            //获取商品系列信息
            getGoodsSerials(goodsId) {
                let that = this;
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.getGoodsInfoById.url + '/' + cfg.service.getGoodsInfoById.action;
                urlParams.txnId = cfg.service.getGoodsInfoById.txnId;
                send.goodsId = goodsId;
                urlParams.send = send;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        this.mastGoodInfo = res.data;
                        if (res.data["isSerial"] != null && res.data["isSerial"] === "Y") {
                            //有系列信息，返回系列详细信息
                            that.tableDataArray = res.data["goodsSerials"];
                            return res.data["goodsSerials"];
                        } else {
                            //没有系列系列信息，返回空
                            return [];
                        }
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            // 系列信息新增
            onAddItemNewTap(goodsId) {
                this.oper = 1;
                this.isDisplayNon = false;
                this.addVisible = false;
                this.goodsId = goodsId;
                let AddFormSerial = {
                    goodsId: this.goodsId,
                    specColor: '',
                    specSize: '',
                    stockNum: '',
                    specPrice: '',
                    specNowPrice: '',
                    specPic: '',
                    specMinPrice: '0.00',
                };
                this.AddFormSerial = AddFormSerial;
            },

            //编辑系列信息
            editSerial(serial) {
                //serial有set和get信息，复制一个简单的对象发送到编辑界面
                this.AddFormSerial.goodsId = serial.goodsId;
                this.AddFormSerial.lockNum = serial.lockNum;
                this.AddFormSerial.specColor = serial.specColor;
                this.AddFormSerial.specGoodsId = serial.specGoodsId;
                this.AddFormSerial.specNowPrice = serial.specNowPrice;
                this.AddFormSerial.specPrice = serial.specPrice;
                this.AddFormSerial.specSellCount = serial.specSellCount;
                this.AddFormSerial.specSize = serial.specSize;
                this.AddFormSerial.stockNum = serial.stockNum;
                this.AddFormSerial.specMinPrice = serial.specMinPrice;
                if (serial.specPic == null) {
                    this.AddFormSerial.specPic = '';
                } else {
                    this.AddFormSerial.specPic = serial.specPic;
                }
                this.oper = 2;
                this.isDisplayNon = false;
                this.addVisible = false;
            },

            //删除
            onDeleteTap(specGoodsId) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.deleteSerial(specGoodsId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },

            //编辑系列信息
            deleteSerial(specGoodsId) {
                //serial有set和get信息，复制一个简单的对象发送到编辑界面
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.delGoodsSerialById.url + '/' + cfg.service.delGoodsSerialById.action;
                urlParams.txnId = cfg.service.delGoodsSerialById.txnId;

                let userId = localStorage.getItem('userId') || '';
                send.specGoodsId = specGoodsId;
                send.userId = userId;

                urlParams.signArray = {
                    specGoodsId: send.specGoodsId,
                    userId: send.userId
                };

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        that.$message.success("删除成功");

                        //刷新数据
                        this.initDate();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            upStock(row) {
                this.goodInfo = row;
                this.stockForm.specGoodsId = row.specGoodsId;
                this.stockForm.unit = this.mastGoodInfo.unit;
                this.stockForm.stockNumOld = row.stockNum;
                this.stockForm.lockNum = row.lockNum;
                this.stockForm.goodsId = row.goodsId;
                //初始化库存输入框
                this.stockForm.stockNum=null;
                this.stockVisible = true;
            },

            //补货
            OnUpStockTap(){
                let flag=1;
                this.$refs['stockForm'].validate((valid)=>{
                    if (valid) {
                        this.OnUpStock(flag);
                    }else{
                        return false;
                    }
                });
            },

            //销货
            OnUpStockTapDown(){
                let flag=2;
                this.$refs['stockForm'].validate((valid)=>{
                    if (valid) {
                        this.OnUpStock(flag);
                    }else{
                        return false;
                    }
                });
            },

            OnUpStock(flag) {
                //后台很坑地设置了重量单位“克”，而下发的单位有可能是“斤”
                let stockNum = String.unitNumUp(this.stockForm.unit, this.stockForm.stockNum);
                if (flag===2){
                    //销货，stockNum反转
                    stockNum=-stockNum;
                }
                //减库存时，不能将库存减为负数
                if (parseFloat(stockNum) + parseFloat(this.stockForm.stockNumOld) < -0.000005) {
                    this.$message.error('减库存时，不能将库存减为负数！');
                    return;
                }
                let lockNum=null;

                uptGoodsStock(this, this.stockForm.specGoodsId, stockNum, lockNum).then(
                    (res) => {
                        this.$message.success("库存修改成功");
                        this.stockVisible = false;
                        this.initDate();
                    },
                    (res) => {
                        if (res.msg != null) {
                            this.$message.error(res.msg);
                        }else{
                            this.$message.error("库存修改失败");
                        }
                    }
                );
            },

            // 商品颜色修改
            onColorChange(specColor) {
                specColor = specColor.replace(/\s+/g, "");
                this.AddFormSerial.specColor = specColor;
            },
            // 商品尺寸修改
            onSizeChange(specSize) {
                specSize = specSize.replace(/\s+/g, "");
                this.AddFormSerial.specSize = specSize;
            },

            goodsAddItem() {
                //颜色和尺寸必须上传一个
                if ((this.AddFormSerial.specColor == null || this.AddFormSerial.specColor === '') && (this.AddFormSerial.specSize == null || this.AddFormSerial.specSize === '')) {
                    this.$message.error('颜色或者尺寸必须填写一个！');
                    return;
                }
                let urlParams = {};
                let send = [];
                urlParams.url = cfg.service.project + cfg.service.saveGoodsSerials.url + '/' + cfg.service.saveGoodsSerials.action;
                urlParams.txnId = cfg.service.saveGoodsSerials.txnId;

                let userId = localStorage.getItem('userId') || '';
                let goodsSerialsItem = {};
                goodsSerialsItem.goodsId = this.goodsId;
                goodsSerialsItem.specColor = this.AddFormSerial.specColor;
                goodsSerialsItem.specSize = this.AddFormSerial.specSize;
                //后台很坑地设置了重量单位“克”，而下发的单位有可能是“斤”
                // if (this.mastGoodInfo.unit === '斤') {
                //     goodsSerialsItem.stockNum = this.AddFormSerial.stockNum * 500;
                // } else {
                //     goodsSerialsItem.stockNum = this.AddFormSerial.stockNum;
                // }
                goodsSerialsItem.stockNum=String.unitNumUp(this.mastGoodInfo.unit, this.AddFormSerial.stockNum);
                goodsSerialsItem.specPrice = parseFloat(this.AddFormSerial.specPrice).toFixed(2);
                goodsSerialsItem.specNowPrice = parseFloat(this.AddFormSerial.specNowPrice).toFixed(2);
                goodsSerialsItem.userId = userId;
                goodsSerialsItem.specMinPrice = this.AddFormSerial.specMinPrice;
                if (goodsSerialsItem.specPic !== null && goodsSerialsItem.specPic !== '') {
                    goodsSerialsItem.specPic = this.AddFormSerial.specPic;
                }
                let goodsSerials = [];
                goodsSerials.push(goodsSerialsItem);
                send = goodsSerials;

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

                        // that.$router.push({path:'/goodsInfos', query:{goodId:that.goodsId}});
                        this.initDate();
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
                send.specGoodsId = this.AddFormSerial.specGoodsId;
                send.specColor = this.AddFormSerial.specColor;
                send.specSize = this.AddFormSerial.specSize;
                send.specPrice = parseFloat(this.AddFormSerial.specPrice).toFixed(2);
                send.specNowPrice = parseFloat(this.AddFormSerial.specNowPrice).toFixed(2);
                send.userId = userId;
                send.goodsId = this.AddFormSerial.goodsId;
                send.specMinPrice = this.AddFormSerial.specMinPrice;
                if (this.AddFormSerial.specPic != null && this.AddFormSerial.specPic !== '') {
                    send.specPic = this.AddFormSerial.specPic;
                    urlParams.signArray = {
                        specGoodsId: send.specGoodsId,
                        goodsId: send.goodsId,
                        specPic: send.specPic,
                        specPrice: send.specPrice,
                        specNowPrice: send.specNowPrice,
                        userId: send.userId,
                        specMinPrice: send.specMinPrice,
                    };
                } else {
                    urlParams.signArray = {
                        specGoodsId: send.specGoodsId,
                        goodsId: send.goodsId,
                        specPrice: send.specPrice,
                        specNowPrice: send.specNowPrice,
                        userId: send.userId,
                        specMinPrice: send.specMinPrice,
                    };
                }

                urlParams.send = send;

                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        that.$message.success("修改成功");
                        // that.$router.push({path:'/goodsInfos', query:{goodId:that.goodsId}});
                        this.initDate();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            addConfirm(AddFormSerialName) {
                let that = this;
                this.$refs[AddFormSerialName].validate((valid) => {
                    if (valid) {
                        if (this.oper === 1) {
                            //新增
                            that.goodsAddItem();
                        } else {
                            //修改
                            that.goodsEditItem();
                        }
                    } else {
                        return false;
                    }
                });
            },

            addCancle() {
                this.isDisplayNon = true;
                this.addVisible = true;
            },

            handelPicturePostSerials(param) {

                let urlParams = {};
                let index = 'S';
                urlParams.url = cfg.service.project + cfg.service.sendGoodsFile.url + '/' + cfg.service.sendGoodsFile.action;
                let fileType = param.file.type === 'image/jpeg' ? 'jpg' : 'mp4';
                urlParams.url += '?fileType=' + fileType + '&index=' + index;
                urlParams.url += '&goodsId=' + this.AddFormSerial.goodsId;
                urlParams.txnId = cfg.service.sendGoodsFile.txnId;

                let goodsFileNames = [];
                goodsFileNames.push(param.file.name);

                // FormData 对象
                let send = new FormData();
                // 文件对象
                send.append("goodsFileNames", param.file);
                // 其他参数

                let operFlag = '1';
                if (this.AddFormSerial.specPic != null && this.AddFormSerial.specPic !== '') {
                    operFlag = '2';
                }
                urlParams.header = {
                    operFlag: operFlag,
                    'Content-Type': 'multipart/form-data'
                };
                urlParams.UnUserId = true;

                urlParams.signArray = {
                    goodsId: this.AddFormSerial.goodsId,
                    index: index,
                    fileType: fileType
                };

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        if (operFlag === '1') {
                            that.$message.success("上传成功");
                        } else {
                            that.$message.success("修改成功");
                        }
                        let filenames = res.data.filenames;
                        this.AddFormSerial.specPic = filenames;
                        this.time = this.getTime();

                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            beforeAvatarUploadSerials(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 4;

                if (!isJPG) {
                    this.$message.error('上传头像信息只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像信息大小不能超过 4MB!');
                }
                return isJPG && isLt2M;
            },

            getTime() {
                return new Date().getTime();
            },

            //格式化金额
            formatPrice(price) {
                return _String.number_format(price, 2);
            },
        }
    }
</script>

<style scoped>
    .table {
        width: 100%;
    }

    .line {
        border: 1px solid;
        height: 0px;
        color: #909399;
    }

    .goodInfo {
        margin-top: 10px;
    }

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

    .showId {
        margin-bottom: 15px;
        margin-left: 28px;
        color: #606266;
    }

    .displayNon {
        display: none;
    }

    .drag-list {
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
        width: 175px;
    }

    .drag-list-img {
        height: 175px;
        width: 175px;
        border: 1px solid #EFF1F5;
    }
</style>
