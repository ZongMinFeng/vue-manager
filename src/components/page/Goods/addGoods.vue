<template>
    <div class="container">
        <el-form :span="6" :model="AddForm" :rules="rules" ref="AddForm" label-width="100px"
                 size="mini">
            <!--商品名称-->
            <el-row :gutter="10">
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="商品名称" prop="name">
                        <el-input maxlength="20" placeholder="请输入商品名称" v-model="AddForm.name"
                                  @change="onNameChange(AddForm.name)"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="商品分类" prop="categoryId">
                        <el-select style="width:100%" v-model="AddForm.categoryId" placeholder="请选择"
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
                    <el-form-item label="商品单位" prop="unit">
                        <el-select
                                style="width:100%" v-model="AddForm.unit" placeholder="请选择"
                                @change="$refs.AddForm.validateField('unit')"
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
                    <el-form-item label="商品价格" prop="price">
                        <el-input maxlength="9" placeholder="请输入商品价格,如：1.00"
                                  v-model="AddForm.price"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="商品现价" prop="nowPrice">
                        <el-input maxlength="9" placeholder="请输入商品现价,如：1.00"
                                  v-model="AddForm.nowPrice"></el-input>
                    </el-form-item>
                </el-col>
                <el-col v-if="oper===1" :sm="24" :md="12" :xl="8">
                    <el-form-item label="商品库存" prop="stockNum">
                        <el-input maxlength="9" placeholder="请输入商品库存"
                                  v-model="AddForm.stockNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="商品卖点" prop="sellPoint">
                        <el-input maxlength="9" placeholder="请输入商品卖点"
                                  v-model="AddForm.sellPoint"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="list-name">商品轮播图</div>
            <el-upload
                    :action="uploadUrl"
                    multiple
                    list-type="fileList"
                    :show-file-list="false"
                    :http-request="handelPicturePost"
                    :before-upload="beforeAvatarUpload">
                <el-button size="small" type="primary">点击上传</el-button>
                <!--<i class="el-icon-plus"></i>-->
                <!--<el-button>test</el-button>-->
            </el-upload>
            <div v-if="AddForm.imgs.length > 0" class="drag-box-item">
                <draggable v-model="AddForm.imgs" @remove="removeHandle" :options="dragOptions">
                    <transition-group tag="div" id="AddForm.imgs" class="item-ul">
                        <div v-for="(item,index) in AddForm.imgs" :key="index">
                            <!--{{uploadUrl}}{{AddForm.imgs}}-->
                            <div class="drag-list">
                                <img :src="uploadUrl+item" class="drag-list-img"/>
                            </div>
                            <div v-if="item === AddForm.picture">主图</div>
                            <el-button v-else @click="onMainPicTap(item)">设为主图</el-button>
                        </div>
                    </transition-group>
                </draggable>
            </div>

            <div class="list-name">备注信息</div>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-input
                            type="textarea"
                            class="goods-memo"
                            :autosize="{ minRows: 2}"
                            placeholder="请输入备注信息"
                            v-model="AddForm.GoodsMemo">
                    </el-input>
            </el-col>
            </el-row>
            <el-form-item class="form-bot">
                <el-button @click="$router.go(-1)">取 消</el-button>
                <el-button type="primary" @click="addConfirm('AddForm')">确 定</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
                title="新增商品分类"
                :visible.sync="addTypeFlag"
                style="width:1000px;margin: 0 auto">
            <el-form :model="addTypeForm" :rules="rulesType" ref="addTypeForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="分类名称">
                    <el-input maxlength="100" placeholder="请输入分类名称" v-model="addTypeForm.Name"></el-input>
                </el-form-item>
                <el-form-item class="form-bot">
                    <el-button @click="addTypeFlag = false">取 消</el-button>
                    <el-button type="primary" @click="addTypeConfirmTap('addTypeForm')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    import {sendServer} from '../../../util/common';
    import {genBarCode} from '../../../util/module';
    // import {GetJP} from '../../../util/ChinesePY';
    import cfg from '../../../config/cfg';
    import draggable from 'vuedraggable'

    export default {

        data() {
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
            return {
                unitArray: ['件', '个', '只', '双', '套', '打', '箱', '卷', '袋', '包', '米', '厘米', '平方', '克', '千克'],
                goodsTypeArray: [],
                MultipleUnitFlag: false,
                addTypeFlag: false,
                addBrandFlag: false,
                errId: 0, // 1:规格，2：库存，3、4、5条码
                errNo: 0, // 循环包哪一层错误
                // specErrMsg: ['', '请输入商品规格', '请输入库存', '商品条码重复', '商品条码重复', '商品条码重复'],
                specErrMsg: '',
                AddForm: {},
                addTypeForm: {
                    Id: '',
                    Name: ''
                },
                addBrandForm: {
                    BrandId: '',
                    Name: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                    ],
                    TypeId: [
                        {required: true, message: '请选择分类', trigger: 'blur'},
                    ],
                    UnitName: [
                        {required: true, message: '请选择单位', trigger: 'blur'},
                    ],
                    Unit1: [
                        {validator: checkUnit, trigger: 'blur'},
                    ],
                    Unit2: [
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
                    RetailPrice: [
                        {required: true, message: '请选择零售价', trigger: 'blur'},
                        {validator: checkAmt, trigger: 'blur'},
                    ],
                    AssociatorPrice: [
                        {validator: checkAmt, trigger: 'blur'},
                    ],
                    PurchasePrice: [
                        {validator: checkAmt, trigger: 'blur'},
                    ]
                },
                rulesType: {
                    Name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                    ]
                },
                rulesBrand: {
                    Name: [
                        {required: true, message: '请输入商品品牌', trigger: 'blur'},
                    ]
                },
                dragOptions: {
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                todo: [
                    {
                        content: '开发图表组件'
                    },
                    {
                        content: '开发拖拽组件'
                    },
                    {
                        content: '开发权限测试组件'
                    }
                ],
                dialogImageUrl: '',
                dialogVisible: false,
                uploadUrl: '',
                oper: 1, // 1:新增，2:修改
            }
        },
        methods: {
            onTypeChangeTap(options) {
                if (options === 'NEW') {
                    this.AddForm.TypeId = '';
                    this.initAddTypeForm();
                    this.addTypeFlag = true;
                }
            },
            initAddTypeForm() {
                this.addTypeForm = {
                    Id: '',
                    Name: ''
                }
            },
            initAddBrandForm() {
                this.addBrandForm = {
                    BrandId: '',
                    Name: ''
                }
            },
            addTypeConfirmTap(addTypeForm) {
                let that = this;
                this.$refs[addTypeForm].validate((valid) => {
                    if (valid) {
                        that.typeAdd();
                    } else {
                        return false;
                    }
                });
            },
            addBrandConfirmTap(addBrandForm) {
                let that = this;
                this.$refs[addBrandForm].validate((valid) => {
                    if (valid) {
                        that.brandAdd();
                    } else {
                        return false;
                    }
                });
            },
            onMainPicTap(row) {
                let end = row.substr(row.lastIndexOf(".")+1);;
                if(end !== 'jpg') {
                    this.$message.error("只能设置图片为主图");
                    return false;
                }
              this.AddForm.picture = row;
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
            addConfirm(AddFormName) {
                let that = this;
                this.$refs[AddFormName].validate((valid) => {
                    if (valid) {
                        that.goodsAdd();
                    } else {
                        return false;
                    }
                });
            },
            typeAdd() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.saveMallCategory.url + '/' + cfg.service.saveMallCategory.action;
                urlParams.txnId = cfg.service.saveMallCategory.txnId;

                send.name = this.addTypeForm.Name;
                send.categoryPid = '99';
                send.sortOrder = 1;

                urlParams.header = {
                    operFlag: '1'
                };

                urlParams.signArray = {
                    categoryPid: '99',
                    sortOrder: '1'
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
                        that.$message.success("新增成功");
                        that.addTypeFlag = false;
                        let goodsTypeInfo = {
                            Id: res.Id,
                            Name: send.Name
                        };
                        that.goodsTypeArray.unshift(goodsTypeInfo);
                        that.AddForm.TypeId = res.Id;
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            // 3.2.4	新增供货商
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
                urlParams.header = {
                    operFlag: '1',
                };
                // urlParams.UnUserId = true;

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
                        } else {
                            that.$message.success("修改成功");
                        }

                        that.$store.commit('goodsRefreshT');
                        that.$router.push('/goodsManage');
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            // 3.2.5	修改供货商
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
                        this.$router.go(-1)
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            initGoods() {
                let goodsTypeArray = this.$store.state.goodsTypeArray || [];
                let goodsNewInfo = {
                    categoryId: 'NEW',
                    name: ''
                };
                let AddForm = {
                    goodsId: '',
                    categoryId: '',
                    name: '',
                    sellPoint: '',
                    picture: '',
                    imgs: [],
                    unit: '件',
                    stockNum: '',
                    price: '',
                    nowPrice: '',
                    memo: '',
                    rsv2: '',

                };
                if ((goodsTypeArray.length > 0 && goodsTypeArray[goodsTypeArray.length - 1].categoryId !== 'NEW') || goodsTypeArray.length === 0) {
                    goodsTypeArray.push(goodsNewInfo);
                }

                this.goodsTypeArray = goodsTypeArray;
                let query = this.$route.query || {};
                this.oper = query.oper;
                if (query && query.oper === 1) {
                    AddForm.goodsId = query.goodsId;
                    this.AddForm = AddForm
                } else {
                    let imgsTmp = query.goodsInfo.imgs;
                    if (imgsTmp) {
                        let imgs = imgsTmp.split(',');
                        if (!imgs[imgs.length - 1]) {
                            imgs.splice(imgs.length - 1, 1);
                        }
                        query.goodsInfo.imgs = imgs;
                    }

                    this.AddForm  = query.goodsInfo;

                }
                let mallId = localStorage.getItem('mallId') || '';

                this.uploadUrl = 'http://111.231.202.32:10080/' + mallId + '/' + this.AddForm.goodsId + '/';
            },
            removeHandle(event) {
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            },
            handleRemove(file, fileList) {
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handelPictureProgress(event, file, fileList) {

            },
            handelPicturePost(param) {
                let urlParams = {};
                let index = 'M';
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
                        that.$message.success("上传成功");
                        let filenames = res.data.filenames;
                        if (filenames) {
                            let fileArray = res.data.filenames.split(',');
                            if (!fileArray[fileArray.length - 1]) {
                                fileArray.splice(fileArray.length - 1, 1);
                            }
                            that.AddForm.imgs = that.AddForm.imgs.concat(fileArray);
                        }

                        // }
                        // that.addFlag = false;
                        // that.typeQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === "video/mp4";
                const isLt2M = file.size / 1024 / 1024 < 4;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 4MB!');
                }
                return isJPG && isLt2M;
            }

        },
        created() {
            this.initGoods()
        },
        computed: {

            // listenAddFormRetailPrice() {
            //     return this.AddForm.RetailPrice;
            // }
        },
        watch: {
            $route(newValue, oldValue) {
                if (newValue.path === "/addGoods") {
                    this.initGoods()
                }
            },
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

    .type-new-btn {
        /*padding: 7px 0;*/
        cursor: pointer;
        border-top: 1px solid #eee;
        color: #0FC09F;
    }

    .list-name {
        color: #A0A0A0;
        padding-top: 10px;
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

    .goods-memo {
        padding: 10px 0;
    }

    .drag-box-item {
        display: flex;
        flex-direction: row;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }

    .item-ul {
        padding: 0 8px 8px;
        /*height: 200px;*/
        overflow-x: scroll;
        display: flex;
        flex-direction: row;
    }

    .item-ul::-webkit-scrollbar {
        width: 0;
    }

    .drag-list {
        border: 1px #e1e4e8 solid;
        /*padding: 10px;*/
        /*margin: 5px;*/
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
        width: 175px;
        /*height: 175px;*/
    }

    .drag-list-img {
        /*height: 175px;*/
        /*width: 175px;*/
        /*width: auto;*/
        width: 100%;
        height: auto;
    }

    .drag-list:hover {
        border: 1px solid #20a0ff;
    }
</style>
