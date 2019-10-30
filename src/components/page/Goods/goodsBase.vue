<template>
    <div ref="addFormDiv">
        <el-form :span="6" :model="AddForm" :rules="rules" ref="AddForm" label-width="100px"
                 size="mini">
            <!--商品名称-->
            <el-row :gutter="10">
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="名称" prop="name">
                        <el-input ref="AddFormName"  maxlength="20" placeholder="请输入商品名称" v-model="AddForm.name"
                                  @change="onNameChange(AddForm.name)"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="分类" prop="categoryId">
                        <el-select ref="AddFormCategoryId" style="width:100%" v-model="AddForm.categoryId" placeholder="请选择"
                                   @change="onTypeChangeTap">
                            <el-option
                                    v-for="item in goodsTypeArray"
                                    :key="item.categoryId"
                                    :label="item.name"
                                    :value="item.categoryId">
                                <div v-if="item.categoryId==='NEW'" class="type-new-btn">
                                    <span>
                                        <i class="el-icon-plus"></i>新增商品分类
                                    </span>
                                </div>
                                <span v-else style="float: left">{{ item.name }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="单位" prop="unit">
                        <el-select
                                style="width:100%" v-model="AddForm.unit" placeholder="请选择"
                                @change="onUnitChangeTap"
                                filterable
                                allow-create
                                default-first-option>
                            <el-option
                                    v-for="item in unitArray"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="价格" prop="price">
                        <el-input ref="AddFormPrice" maxlength="9" placeholder="请输入商品价格,如：1.00"
                                  v-model="AddForm.price" @change="onChangeTap"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="现价" prop="nowPrice">
                        <el-input ref="AddFormNowPrice" maxlength="9" placeholder="请输入商品现价,如：1.00"
                                  v-model="AddForm.nowPrice" @change="onChangeTap"></el-input>
                    </el-form-item>
                </el-col>
                <el-col v-if="oper===1" :sm="24" :md="12" :xl="8">
                    <el-form-item label="库存" prop="stockNum">
                        <el-input ref="AddFormStockNum" maxlength="9" placeholder="请输入商品库存"
                                  v-model="AddForm.stockNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="卖点" prop="sellPoint">
                        <el-input maxlength="64" placeholder="请输入商品卖点"
                                  v-model="AddForm.sellPoint" @change="onChangeTap"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="picture">
                <div class="list-name">商品轮播信息（拖动可调换顺序）</div>
                <el-upload
                        :action="uploadUrl"
                        multiple
                        list-type="fileList"
                        :show-file-list="false"
                        :http-request="handelPicturePost"
                        :before-upload="beforeAvatarUpload">
                    <el-button v-if="AddForm.imgs.length<1" size="small" type="primary" @click="uploadButton($event)">新增图片</el-button>
                    <el-button v-else size="small" type="primary" @click="uploadButton($event)">添加图片</el-button>
                </el-upload>
                <div v-if="AddForm.imgs.length > 0" class="drag-box-item">
                    <draggable v-model="AddForm.imgs" :options="dragOptions" :move="onMove"  >
                        <transition-group tag="div" id="AddForm.imgs" class="item-ul">
                            <div v-for="(item,index) in AddForm.imgs" :key="index" class="item">
                                <div class="drag-list">
                                    <img v-image-preview :src="uploadUrl+item" class="drag-list-img"/>
                                </div>
                                <el-button v-if="item === AddForm.picture" class="drag-list-button" type="warning">此为主图</el-button>
                                <el-button v-if="item.endsWith('.mp4')" class="drag-list-button">视频</el-button>
                                <el-button v-if="item !== AddForm.picture&&!item.endsWith('.mp4')" type="primary" class="drag-list-button" @click="onMainPicTap(item)">设为主图</el-button>
                                <el-button type="danger" @click="deletePicTap(item, index)">删除</el-button>
                            </div>
                        </transition-group>
                    </draggable>
                </div>
            </div>

            <div class="picture">
                <div class="list-name">商品主图</div>
                <el-upload
                        :action="uploadUrl"
                        multiple
                        list-type="fileList"
                        :show-file-list="false"
                        :http-request="handelPicturePostMain"
                        :before-upload="beforeAvatarUploadMain">
                    <el-button v-if="AddForm.imgs.length<1" size="small" type="primary">新增主图</el-button>
                    <el-button v-else size="small" type="primary">修改主图</el-button>
                </el-upload>
                <div v-if="AddForm.picture!=null&&AddForm.picture!==''" style="margin-top:5px;">
                    <div class="drag-list">
                        <img v-image-preview :src="uploadUrl+AddForm.picture+'?'+time" class="drag-list-img"/>
                    </div>
                </div>
            </div>

            <div class="picture" v-loading="videoLoading">
                <div class="list-name">商品视频</div>
                <el-upload
                        :action="uploadUrl"
                        multiple
                        list-type="fileList"
                        :show-file-list="false"
                        :http-request="handelPicturePostVideo"
                        :before-upload="beforeAvatarUploadVideo">
                    <el-button v-if="AddForm.videos!=null&&AddForm.videos!==''" size="small" type="primary">修改视频</el-button>
                    <el-button v-else size="small" type="primary">新增视频</el-button>
                    <el-button v-if="AddForm.videos!=null&&AddForm.videos!==''" size="small" type="danger" style="margin-left: 5px;" @click="deleteVideo($event)">删除视频</el-button>
                </el-upload>
                <div v-if="AddForm.videos!=null&&AddForm.videos!==''" style="margin-top:5px;">
                    <div class="drag-list-video">
                        <video width="300" height="300" controls :src="videoSrc"></video>
                    </div>
                </div>
            </div>

            <div class="list-name">备注信息</div>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-input
                            type="textarea"
                            class="goods-memo"
                            :autosize="{ minRows: 2}"
                            placeholder="请输入备注信息"
                            v-model="AddForm.GoodsMemo" @change="onChangeTap">
                    </el-input>
                </el-col>
            </el-row>

            <el-form-item class="form-bot">
                <!--<el-button @click="$router.go(-1)">取 消</el-button>-->
                <el-button v-if="oper==2" type="primary" :disabled="saveDisabled" @click="addConfirm('AddForm')">保存</el-button>
                <el-button v-else type="success" @click="addConfirm('AddForm')">新增</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import {sendServer} from '../../../util/common';
    import cfg from '../../../config/cfg';
    import {
        genGoodsId,
        getGoodsInfoById
    } from '../../../util/module';
    import pageBus from "../PageBus";
    export default {
        name: "goodsBase",
        props:{
            data:null,
        },
        components: {
            draggable
        },
        data(){
            let checkUnit = (rule, Unit, callback) => {
                if (!this.MultipleUnitFlag) {
                    callback();
                    return true;
                }
                if (Unit.UnitName && !Unit.Calc) {
                    callback(new Error('请输入换算比例!'));
                    return false;
                } else if (!Unit.UnitName && Unit.Calc) {
                    callback(new Error('请选择单位!'));
                    return false;
                }
                let reg = /^[0-9]*[1-9][0-9]*$/;
                if (!reg.test(Unit.Calc)) {
                    callback(new Error('请输入大于等于2的数字'));
                    return false;
                }
                let CalcI = parseInt(Unit.Calc);
                if (CalcI < 2) {
                    callback(new Error('换算比例需输入大于等于2的数字'));
                    return false;
                }
                if (this.AddForm.UnitName && Unit.UnitName === this.AddForm.UnitName) {
                    callback(new Error('副单位不可与主单位相同!'));
                    return false;
                }
                if (this.AddForm.Unit1.UnitName && this.AddForm.Unit2.UnitName &&
                    this.AddForm.Unit1.UnitName === this.AddForm.Unit2.UnitName) {
                    callback(new Error('副单位1不可与副单位2相同!'));
                    return false;
                }
                if (this.AddForm.Unit1.Calc && this.AddForm.Unit2.Calc &&
                    this.AddForm.Unit1.Calc === this.AddForm.Unit2.Calc) {
                    callback(new Error('副单位换算比例不可相同!'));
                    return false;
                }
                callback();
            };
            let checkStockLimitUp = (rule, StockLimitUp, callback) => {
                if (this.AddForm.StockAlarmFlag) {
                    let reg = /^[0-9]*[1-9][0-9]*$/;
                    if (!reg.test(StockLimitUp)) {
                        callback(new Error('请输入大于等于0的数字'));
                    }
                    if (this.AddForm.StockLimitLow) {
                        if (!reg.test(this.AddForm.StockLimitLow)) {
                            callback();
                        } else {
                            let StockLimitLowI = parseInt(this.AddForm.StockLimitLow);
                            let StockLimitUpI = parseInt(StockLimitUp);
                            if (StockLimitUpI < StockLimitLowI) {
                                callback(new Error('库存上限需大于库存下限'));
                            }
                            callback();
                        }
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }

            };
            let checkStockLimitLow = (rule, StockLimitLow, callback) => {
                if (this.AddForm.StockAlarmFlag) {
                    let reg = /^[0-9]*[1-9][0-9]*$/;
                    if (!reg.test(StockLimitLow)) {
                        callback(new Error('请输入大于等于0的数字'));
                    }
                    if (this.AddForm.StockLimitUp) {
                        if (!reg.test(this.AddForm.StockLimitUp)) {
                            callback();
                        } else {
                            let StockLimitUpI = parseInt(this.AddForm.StockLimitUp);
                            let StockLimitLowI = parseInt(StockLimitLow);
                            if (StockLimitUpI < StockLimitLowI) {
                                callback(new Error('库存下限需小于库存上限'));
                            }
                            callback();
                        }
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            let checkStock = (rule, stockNum, callback) => {
                if (this.AddForm.stockNum) {
                    let reg = /^[0-9]*[1-9][0-9]*$/;
                    if (!reg.test(stockNum)) {
                        callback(new Error('请输入大于等于0的数字'));
                    }
                    if(stockNum>999999){
                        callback(new Error('库存应小于100万'));
                        return true;
                    }
                    callback();
                } else {
                    callback();
                }
            };
            let checkSafePeriod = (rule, SafePeriod, callback) => {
                if (this.AddForm.ExpFlag) {
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
                } else {
                    callback();
                }
            };
            let checkAmt = (rule, amt, callback) => {
                if (!amt) {
                    callback();
                    return true;
                }
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
            return{
                rules: {
                    name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                    ],
                    categoryId: [
                        {required: true, message: '请选择分类', trigger: 'blur'},
                    ],
                    UnitName: [
                        {required: true, message: '请选择单位', trigger: 'blur'},
                    ],
                    unit: [
                        {validator: checkUnit, trigger: 'blur'},
                    ],
                    StockLimitUp: [
                        {validator: checkStockLimitUp, trigger: 'blur'},
                    ],
                    StockLimitLow: [
                        {validator: checkStockLimitLow, trigger: 'blur'},
                    ],
                    SafePeriod: [
                        {validator: checkSafePeriod, trigger: 'blur'},
                    ],
                    price: [
                        {required: true, message: '请输入零售价', trigger: 'blur'},
                        {validator: checkAmt, trigger: 'blur'},
                    ],
                    nowPrice: [
                        {required:true, message:'请输入现价', trigger:'blur'},
                        {validator: checkAmt, trigger: 'blur'},
                    ],
                    PurchasePrice: [
                        {validator: checkAmt, trigger: 'blur'},
                    ],
                    stockNum:[
                        {required: true, message: '请输入商品库存', trigger: 'blur'},
                        {validator: checkStock, trigger: 'blur'}
                    ],
                },
                goodsTypeArray: [],
                unitArray: ['件', '个', '只', '双', '套', '打', '箱', '卷', '袋', '包', '米', '厘米', '平方', '克', '千克'],
                AddForm:{
                    goodsId: '',
                    categoryId: '',
                    name: '',
                    sellPoint: '',
                    picture: '',
                    imgs: [],
                    videos:'',
                    unit: '件',
                    stockNum: '',
                    price: '',
                    nowPrice: '',
                    memo: '',
                    rsv2: '',
                    GoodsMemo:''
                },
                uploadUrl:'',
                dragOptions: {
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                isDragging: false,
                saveDisabled:true,
                time:'123456',
                videoTime:'123456',
                oper:null,//1新增  2修改,
                videoOper:1,//1新增  2修改,
                videoLoading:false,
            }
        },

        computed:{
            videoSrc(){
                return this.uploadUrl+this.AddForm.videos+'?t='+this.videoTime;
            }
        },

        created(){
            console.log("hello, goodsBase created");//debug
            // pageBus.$on("goodId",
            //     (goodId)=>{
            //         console.log("hello, goodsBase");
            //         this.goodId=goodId;
            //         this.initData();
            //     }
            // );

            pageBus.$on("goodId", this.goodId);

            pageBus.$on("change", ()=>{
                pageBus.$emit('change1', !this.saveDisabled);
            });

            pageBus.$on("changeTab1", ()=>{
                pageBus.$emit('changeTab1Resp', !this.saveDisabled);
            });

            pageBus.$on('cancelChange1', ()=>{
                this.saveDisabled=true;
            });
        },

        beforeDestroy(){
            pageBus.$off("goodId");
            pageBus.$off("change");
            pageBus.$off("changeTab1");
            pageBus.$off('cancelChange1');
        },

        watch:{
            //自动监听form变化，点亮保存按钮
            AddForm:{
                deep:true,
                handler:function(val, oldVal){
                    if(oldVal.categoryId!==""&&oldVal.goodsId===val.goodsId){
                        this.saveDisabled=false;
                    }
                }
            }
        },

        methods:{
            goodId(goodId){
                console.log("goodId", goodId);//debug
                this.goodId=goodId;
                this.initData();
            },

            initData(){
                this.saveDisabled=true;
                if(this.goodId==null){
                    //新增
                    this.oper=1;
                    this.videoOper=1;
                    let AddForm = {
                        goodsId: '',
                        categoryId: '',
                        name: '',
                        sellPoint: '',
                        picture: '',
                        imgs: [],
                        videos:'',
                        unit: '件',
                        stockNum: '',
                        price: '',
                        nowPrice: '',
                        memo: '',
                        rsv2: '',
                    };
                    this.AddForm=AddForm;
                    //获取goodsId号
                    let that=this;
                    genGoodsId(that).then((res) => {
                        this.AddForm.goodsId=res.data.goodsId;
                        this.goodId=res.data.goodsId;
                        let mallId = localStorage.getItem('mallId') || '';
                        this.uploadUrl = cfg.service.uploadUrl+'/' + mallId + '/' + this.AddForm.goodsId + '/';
                    }, (res) => {
                        that.$message.error('获取新的商品号失败');
                        that.$router.go(-1);
                    });
                }else{
                    //修改
                    this.oper=2;
                    //清除上一个内容
                    let AddForm = {
                        goodsId: '',
                        categoryId: '',
                        name: '',
                        sellPoint: '',
                        picture: '',
                        imgs: [],
                        videos:'',
                        unit: '件',
                        stockNum: '',
                        price: '',
                        nowPrice: '',
                        memo: '',
                        rsv2: '',
                    };
                    this.AddForm=AddForm;
                    //根据goodId获取good详细信息
                    let params={};
                    params.goodsId=this.goodId;
                    getGoodsInfoById(this, params).then(
                        (res)=>{
                            if(res.status!=200 && res.status!=400){
                                this.$message.error(res.msg);
                                return false;
                            }
                            let goodInfo=res.data;
                            this.AddForm=goodInfo;
                            let imgsTmp = goodInfo.imgs;
                            if (imgsTmp) {
                                let imgs = imgsTmp.split(',');
                                if (!imgs[imgs.length - 1]) {
                                    imgs.splice(imgs.length - 1, 1);
                                }
                                this.AddForm.imgs = imgs;
                            }
                            let mallId = localStorage.getItem('mallId') || '';
                            this.uploadUrl = cfg.service.uploadUrl+'/' + mallId + '/' + this.AddForm.goodsId + '/';
                            console.log("AddForm", this.AddForm);//debug
                        },
                        (res)=>{
                            this.$message.error("查询商品信息失败");
                            this.$router.go(-1);
                        }
                    );
                }
                //获取商品分类信息
                this.typeQry();
            },

            onTypeChangeTap(options) {
                if (options === 'NEW') {
                    this.AddForm.TypeId = '';
                    this.initAddTypeForm();
                    this.addTypeFlag = true;
                }
                this.saveDisabled=false;
            },

            onUnitChangeTap(){
                this.saveDisabled=false;
            },

            onChangeTap(){
                this.saveDisabled=false;
            },

            // 增加规格
            onAddSpecTap() {
                let SpecInfo = {
                    Name: '',
                    Stock: '',
                    BarCode: '',
                    BarCode1: '',
                    BarCode2: '',
                };
                this.AddForm.SpecArray.push(SpecInfo);
            },
            // 库存值改变
            stockChange(idx) {
                let Stock = this.AddForm.SpecArray[idx].Stock;
                Stock = Stock.replace(/[^0-9]/ig, "");
                this.AddForm.SpecArray[idx].Stock = Stock;
            },
            // 商品名称修改
            onNameChange(name) {
                name = name.replace(/\s+/g, "");
                // let PyCode = GetJP(name).toUpperCase();
                // this.AddForm.PyCode = PyCode;
                this.AddForm.Name = name;
                this.saveDisabled=false;
            },
            // 减少规格
            onDelSpecTap(index) {
                if (this.AddForm.SpecArray.length <= 1) {
                    return true;
                }
                this.AddForm.SpecArray.splice(index, 1)
            },
            // 生成条码
            onBarCodeTap(idx, id, val) {
                let that = this;
                if (val) {

                    this.$confirm('是否重新生成条码', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        genBarCode(this).then((BarCode) => {
                            if (id === 0) {
                                that.AddForm.SpecArray[idx].BarCode = BarCode;
                            } else if (id === 1) {
                                that.AddForm.SpecArray[idx].BarCode1 = BarCode;
                            } else if (id === 2) {
                                that.AddForm.SpecArray[idx].BarCode2 = BarCode;
                            }
                            this.$message({
                                type: 'success',
                                message: '生成成功!'
                            });
                        }, () => {
                        })
                    }).catch(() => {
                    });
                } else {
                    genBarCode(this).then((BarCode) => {
                        if (id === 0) {
                            that.AddForm.SpecArray[idx].BarCode = BarCode;
                        } else if (id === 1) {
                            that.AddForm.SpecArray[idx].BarCode1 = BarCode;
                        } else if (id === 2) {
                            that.AddForm.SpecArray[idx].BarCode2 = BarCode;
                        }
                        this.$message({
                            type: 'success',
                            message: '生成成功!'
                        });
                    }, () => {
                    })
                }
            },

            removeHandle(event) {
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            },

            onMainPicTap(row) {
                let end = row.substr(row.lastIndexOf(".")+1);;
                if(end !== 'jpg') {
                    this.$message.error("只能设置图片为主图");
                    return false;
                }
                this.AddForm.picture = row;
                this.saveDisabled=false;
            },

            handelPicturePost(param) {
                console.log("param:", param);

                let urlParams = {};
                let index = 'B';
                // let send = {};
                urlParams.url = cfg.service.project + cfg.service.sendGoodsFile.url + '/' + cfg.service.sendGoodsFile.action;
                let fileType = param.file.type === 'image/jpeg' ? 'jpg' : 'mp4';
                urlParams.url += '?fileType=' + fileType + '&index=' + index;
                // if(this.AddForm.goodsId) {
                urlParams.url += '&goodsId=' + this.AddForm.goodsId;
                // }
                urlParams.txnId = cfg.service.sendGoodsFile.txnId;

                let goodsFileNames = [];
                goodsFileNames.push(param.file.name);

                // FormData 对象
                let send = new FormData();
                // 文件对象
                send.append("goodsFileNames", param.file);
                // 其他参数

                urlParams.header = {
                    operFlag: '1',
                    'Content-Type': 'multipart/form-data'
                };
                urlParams.UnUserId = true;

                urlParams.signArray = {
                    goodsId: this.AddForm.goodsId,
                    index: index,
                    fileType: fileType
                };
                // urlParams.form = send;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        console.log("res:", res)
                        that.$message.success("上传成功");
                        let filenames = res.data.filenames;
                        console.log("filenames:",filenames)
                        if (filenames) {
                            let fileArray = res.data.filenames.split(',');
                            if (!fileArray[fileArray.length - 1]) {
                                fileArray.splice(fileArray.length - 1, 1);
                            }
                            console.log("fileArray:",fileArray);
                            that.AddForm.imgs = that.AddForm.imgs.concat(fileArray);
                            //如果这个是第一张图，而且主图没有设置，那么自动设置为主图
                            if(this.isFirstPic(filenames)&&this.AddForm.picture===''){
                                this.AddForm.picture=filenames;
                            }

                        }

                        //使保存按钮可用
                        this.saveDisabled=false;

                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            isFirstPic(picName){
                if(picName.endsWith('.jpg')){
                    let num=0;
                    this.AddForm.imgs.forEach((val)=>{
                        if(val.endsWith('.jpg')){
                            num++;
                        }
                    });
                    if(num===1){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            },

            beforeAvatarUpload(file) {
                console.log("file:", file);
                // const isJPG = file.type === 'image/jpeg' || file.type === "video/mp4";
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 4;

                if (!isJPG) {
                    this.$message.error('上传头像信息只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像信息大小不能超过 4MB!');
                }
                if(file.type === "video/mp4"){
                    //检查视频数量,不能超过1个
                    if(!this.checkMp4()){
                        this.$message.error("视频信息不能超过1条！");
                        return false;
                    }
                }
                return isJPG && isLt2M;
            },


            handelPicturePostMain(param) {
                console.log("param:", param);

                let urlParams = {};
                let index = 'M';
                urlParams.url = cfg.service.project + cfg.service.sendGoodsFile.url + '/' + cfg.service.sendGoodsFile.action;
                let fileType = param.file.type === 'image/jpeg' ? 'jpg' : 'mp4';
                urlParams.url += '?fileType=' + fileType + '&index=' + index;
                urlParams.url += '&goodsId=' + this.AddForm.goodsId;
                urlParams.txnId = cfg.service.sendGoodsFile.txnId;

                let goodsFileNames = [];
                goodsFileNames.push(param.file.name);

                // FormData 对象
                let send = new FormData();
                // 文件对象
                send.append("goodsFileNames", param.file);
                // 其他参数

                let operFlag='1';
                if(this.AddForm.picture!=null&&this.AddForm.picture!==''){
                    operFlag='2';
                }
                //如果是新增商品，那么主图永远为新增
                console.log("oper",this.oper);//debug
                if(this.oper===1){
                    operFlag='1';
                }
                urlParams.header = {
                    operFlag:operFlag,
                    'Content-Type': 'multipart/form-data'
                };
                urlParams.UnUserId = true;

                urlParams.signArray = {
                    goodsId: this.AddForm.goodsId,
                    index: index,
                    fileType: fileType
                };
                // urlParams.form = send;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        console.log("res:", res);
                        if(operFlag==='1'){
                            that.$message.success("上传成功");
                        }else{
                            that.$message.success("修改成功");
                        }
                        let filenames = res.data.filenames;
                        console.log("filenames:",filenames);
                        this.AddForm.picture=filenames;
                        this.time=this.getTime();
                        //使保存按钮可用
                        this.saveDisabled=false;

                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            beforeAvatarUploadMain(file) {
                console.log("file:", file);
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

            handelPicturePostVideo(param) {
                this.videoLoading=true;
                console.log("param:", param);

                let urlParams = {};
                let index = 'V';
                urlParams.url = cfg.service.project + cfg.service.sendGoodsFile.url + '/' + cfg.service.sendGoodsFile.action;
                let fileType = param.file.type === 'image/jpeg' ? 'jpg' : 'mp4';
                urlParams.url += '?fileType=' + fileType + '&index=' + index;
                urlParams.url += '&goodsId=' + this.AddForm.goodsId;
                urlParams.txnId = cfg.service.sendGoodsFile.txnId;

                let goodsFileNames = [];
                goodsFileNames.push(param.file.name);

                // FormData 对象
                let send = new FormData();
                // 文件对象
                send.append("goodsFileNames", param.file);
                // 其他参数

                let operFlag='1';
                if(this.AddForm.videos!=null&&this.AddForm.videos!==''){
                    operFlag='2';
                }
                //如果oper是新增，那么videoOper也是新增
                if(this.oper===1){
                    operFlag='1';
                }
                urlParams.header = {
                    operFlag:operFlag,
                    'Content-Type': 'multipart/form-data'
                };
                urlParams.UnUserId = true;

                urlParams.signArray = {
                    goodsId: this.AddForm.goodsId,
                    index: index,
                    fileType: fileType
                };

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        this.videoLoading=false;
                        if (res.status !== 200) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        console.log("res:", res);
                        if(operFlag==='1'){
                            that.$message.success("上传成功");
                        }else{
                            that.$message.success("修改成功");
                        }
                        let filenames = res.data.filenames;
                        console.log("filenames:",filenames);
                        this.AddForm.videos='';//debug
                        this.videoTime=this.getTime();
                        this.AddForm.videos=filenames;
                        //使保存按钮可用
                        this.saveDisabled=false;

                    }, (res) => {
                        // 失败
                        this.videoLoading=false;
                        that.$message.error('请求失败');
                    }
                );
            },

            beforeAvatarUploadVideo(file) {
                console.log("file:", file);
                const isJPG = file.type === 'video/mp4';
                const isLt2M = file.size / 1024 / 1024 < 64;

                if (!isJPG) {
                    this.$message.error('上传视频信息只能是 mp4 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传视频信息大小不能超过 64MB!');
                }
                return isJPG && isLt2M;
            },

            getTime(){
                return new Date().getTime();
            },

            checkMp4(){
                let num=0;
                this.AddForm.imgs.forEach((val, index, arr)=>{
                    if(val.endsWith('.mp4')){
                        num++;
                    }
                });
                console.log("num", num);
                if(num<1){
                    return true;
                }else{
                    return false;
                }
            },

            addConfirm(AddFormName) {
                let that = this;
                this.$refs[AddFormName].validate((valid, items) => {
                    if (valid) {
                        //检查轮播图和主图
                        if(this.AddForm.imgs.length===0){
                            this.$message.error('请添加轮播图');
                            return false;
                        }
                        if(this.AddForm.picture==null||this.AddForm.picture===''){
                            this.$message.error("请添加主图");
                            return false;
                        }
                        that.goodsAdd();
                    } else {
                        console.log('items', items);//debug
                        //错误定位
                        if(items.name!=null){
                            this.$refs.AddFormName.focus();
                            return false;
                        }
                        if(items.categoryId!=null){
                            this.$refs.AddFormCategoryId.focus();
                            return false;
                        }
                        if(items.price!=null){
                            this.$refs.AddFormPrice.focus();
                            return false;
                        }
                        if(items.nowPrice!=null){
                            this.$refs.AddFormNowPrice.focus();
                            return false;
                        }
                        if(items.stockNum!=null){
                            this.$refs.AddFormStockNum.focus();
                            return false;
                        }
                        return false;
                    }
                });
            },

            goodsAdd() {
                let urlParams = {};
                let send = {};
                let oper = this.oper;

                if (oper === 1) {
                    urlParams.url = cfg.service.project + cfg.service.saveGoodsInfo.url + '/' + cfg.service.saveGoodsInfo.action;
                    urlParams.txnId = cfg.service.saveGoodsInfo.txnId;
                } else {
                    urlParams.url = cfg.service.project + cfg.service.uptGoodsInfo.url + '/' + cfg.service.uptGoodsInfo.action;
                    urlParams.txnId = cfg.service.uptGoodsInfo.txnId;
                }
                let price = parseFloat(this.AddForm.price).toFixed(2);
                let nowPrice = parseFloat(this.AddForm.nowPrice).toFixed(2);
                let imgs = "";
                this.AddForm.imgs.forEach(item => {
                    imgs += item + ","
                });
                send.goodsId = this.AddForm.goodsId;
                send.categoryId = this.AddForm.categoryId;
                send.name = this.AddForm.name;
                send.sellPoint = this.AddForm.sellPoint;
                send.picture = this.AddForm.picture;
                send.imgs = imgs;
                send.unit = this.AddForm.unit;
                send.stockNum = this.AddForm.stockNum;
                send.price = price;
                send.nowPrice = nowPrice;
                send.memo = this.AddForm.memo;
                if(this.AddForm.videos!=null&&this.AddForm.videos!==''){
                    send.videos=this.AddForm.videos;
                }
                urlParams.header = {
                    operFlag: '1',
                };

                urlParams.signArray = {
                    goodsId: this.AddForm.goodsId,
                    categoryId: this.AddForm.categoryId,
                    imgs: imgs,
                    price: price,
                    picture: send.picture,
                    nowPrice: nowPrice,
                };

                if(this.AddForm.videos!=null&&this.AddForm.videos!==''){
                    urlParams.signArray = {
                        goodsId: this.AddForm.goodsId,
                        categoryId: this.AddForm.categoryId,
                        imgs: imgs,
                        price: price,
                        picture: send.picture,
                        nowPrice: nowPrice,
                        videos:this.AddForm.videos
                    };
                }

                if (oper === 1) {
                    urlParams.signArray.stockNum = this.AddForm.stockNum;
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
                        if (oper === 1) {
                            that.$message.success("新增成功");
                            this.oper=2;
                            //刷新页面
                            pageBus.$emit("goodId", this.goodId);
                            //打开标签页
                            pageBus.$emit("disable", false);
                        } else {
                            that.$message.success("修改成功");
                            //修改成功后，将保存按钮不可用
                            this.saveDisabled=true;
                        }
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            goodsUpt() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.goodsUpt.url + '/' + cfg.service.goodsUpt.action;
                send.TxnId = cfg.service.goodsUpt.txnId;

                send.Id = this.AddForm.Id;
                send.Name = this.AddForm.Name;
                send.Person = this.AddForm.Person;
                send.Mobile = this.AddForm.Mobile;
                send.Addr = this.AddForm.Addr;
                send.PayBank = this.AddForm.PayBank;
                send.PayAccount = this.AddForm.PayAcc;
                send.Status = this.AddForm.Status;
                send.Memo = this.AddForm.Memo;
                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            that.$message.error(res.RespDesc);
                            return false;
                        }
                        that.$message.success("修改成功");
                        that.$store.commit('suppRefreshT');
                        console.log("hello, update");//debug
                        this.$router.go(-1);
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            deletePicTap(item, index){
                if(item==this.AddForm.picture){
                    this.$message.error("无法删除主图，请先选择其他图作为主图，然后再删除此图");
                    return;
                }
                this.AddForm.imgs.splice(index, 1);
                this.saveDisabled=false;
            },

            //查询商品分类
            typeQry() {
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
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        that.goodsTypeArray = res.data;
                        console.log("goodsTypeArray", this.goodsTypeArray);//debug
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            change: function (evt) {
                console.log(evt)
            },


            onMove({ relatedContext, draggedContext }) {
                console.log("hello, move");//debug
                this.saveDisabled=false;
            },

            uploadButton(event){
                //判断轮播信息数量，能否继续上传
                if(this.checkUploadButton()){
                    //能继续上传
                }else{
                    //不能继续上传
                    event.cancelBubble=true;
                }

            },

            checkUploadButton(){
                let num=this.AddForm.imgs.length;
                if(num<5){
                    return true;
                }else{
                    this.$message.error("商品轮播信息不能大于5条");
                    return false;
                }
            },

            deleteVideo(event){
                //阻止冒泡
                event.cancelBubble=true;
                //删除视频
                this.$confirm("是否删除视频", "删除视频", {
                    canfirmButtonText:"确定",
                    cancelButtonText: "取消",
                    type:'error'
                }).then(()=>{
                    //删除视频
                    this.AddForm.videos='';
                    this.goodsDeleteVideo();
                }).catch(()=>{

                });
            },

            goodsDeleteVideo() {
                let urlParams = {};
                let send = {};
                let oper = this.oper;

                if (oper === 1) {
                    urlParams.url = cfg.service.project + cfg.service.saveGoodsInfo.url + '/' + cfg.service.saveGoodsInfo.action;
                    urlParams.txnId = cfg.service.saveGoodsInfo.txnId;
                } else {
                    urlParams.url = cfg.service.project + cfg.service.uptGoodsInfo.url + '/' + cfg.service.uptGoodsInfo.action;
                    urlParams.txnId = cfg.service.uptGoodsInfo.txnId;
                }
                let price = parseFloat(this.AddForm.price).toFixed(2);
                let nowPrice = parseFloat(this.AddForm.nowPrice).toFixed(2);
                let imgs = "";
                this.AddForm.imgs.forEach(item => {
                    imgs += item + ","
                });
                send.goodsId = this.AddForm.goodsId;
                send.categoryId = this.AddForm.categoryId;
                send.name = this.AddForm.name;
                send.sellPoint = this.AddForm.sellPoint;
                send.picture = this.AddForm.picture;
                send.imgs = imgs;
                send.unit = this.AddForm.unit;
                send.stockNum = this.AddForm.stockNum;
                send.price = price;
                send.nowPrice = nowPrice;
                send.memo = this.AddForm.memo;
                send.videos=this.AddForm.videos;
                urlParams.header = {
                    operFlag: '1',
                };

                urlParams.signArray = {
                    goodsId: this.AddForm.goodsId,
                    categoryId: this.AddForm.categoryId,
                    imgs: imgs,
                    price: price,
                    picture: send.picture,
                    nowPrice: nowPrice,
                };

                if (oper === 1) {
                    urlParams.signArray.stockNum = this.AddForm.stockNum;
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
                        if (oper === 1) {
                            that.$message.success("新增成功");
                            this.oper=2;
                            //刷新页面
                            pageBus.$emit("goodId", this.goodId);
                            //打开标签页
                            pageBus.$emit("disable", false);
                        } else {
                            that.$message.success("修改成功");
                            //修改成功后，将保存按钮不可用
                            this.saveDisabled=true;
                        }
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
        }
    }
</script>

<style scoped>
    .list-name {
        color: #A0A0A0;

    }

    .drag-box-item {
        display: flex;
        flex-direction: row;
        background-color: #fff;
        margin-right: 16px;
        margin-top:5px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }

    .item-ul {
        padding: 0 8px;
        overflow-x: scroll;
        display: flex;
        flex-direction: row;
        margin-right:10px;
    }

    .item{
        margin-right: 10px;
        margin-top:10px;
        border:gray 1px solid;
        padding:2px;
    }

    .item-ul::-webkit-scrollbar {
        width: 0;
    }

    .drag-list-height{
        height:200px;
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

    .drag-list-video {
        list-style: none;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
        width: 300px;
    }

    .drag-list-img {
        height: 175px;
        width: 175px;
        border: 1px solid #EFF1F5;
    }

    .drag-list-button{
        margin-right:5px;
    }

    .form-bot {
        text-align: right;
        margin-top:5px;
    }

    .picture{
        margin-bottom: 10px;
        background-color: #fff;
    }


</style>
