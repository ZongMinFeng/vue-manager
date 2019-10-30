<template>
    <div class="table">
        <div class="container">
            <el-form :model="selectForm" label-width="100px">
                <el-row :gutter="10">
                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="分类" prop="type">
                            <el-select class="elSelect" v-model="selectForm.categoryId" clearable placeholder="请选择分类" @change="onRefresh">
                                <el-option
                                        v-for="item in goodsTypeArray"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.categoryId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="名称" prop="name">
                            <el-input maxlength="10" placeholder="请输入名称" v-model="selectForm.name"
                                      @change="onRefresh"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="价格起始值" prop="begPrice">
                            <el-input maxlength="10" placeholder="请输入最小金额" v-model="selectForm.begPrice"
                                      @change="onRefresh"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="价格结束值" prop="endPrice">
                            <el-input maxlength="10" placeholder="请输入最大金额" v-model="selectForm.endPrice"
                                      @change="onRefresh"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="现价起始值" prop="begPrice">
                            <el-input maxlength="10" placeholder="请输入最小金额" v-model="selectForm.begNowPrice"
                                      @change="onRefresh"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="现价结束值" prop="endPrice">
                            <el-input maxlength="10" placeholder="请输入最大金额" v-model="selectForm.endNowPrice"
                                      @change="onRefresh"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="销量起始值" prop="begSellCount">
                            <el-input maxlength="10" placeholder="请输入最小数量" v-model="selectForm.begSellCount"
                                      @change="onRefresh"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="24" :md="12" :xl="8">
                        <el-form-item label="销量结束值" prop="endSellCount">
                            <el-input maxlength="10" placeholder="请输入最大数量" v-model="selectForm.endSellCount"
                                      @change="onRefresh"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div class="handle-box">
                <el-button type="success" icon="el-icon-plus" @click="onAddNewTap">新增</el-button>
                <!--<el-button type="warning"  style="margin-left: 10px" @click="putOnOffGoodsConfirm(1)">批量上架</el-button>-->
                <!--<el-button type="warning"  style="margin-left: 10px" @click="putOnOffGoodsConfirm(2)">批量下架</el-button>-->
                <el-button type="primary"  style="margin-left: 10px; float: right;" :loading="downloadLoading" @click="handleDownload">导出Excel</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="onRefresh" class="search-btn">刷新</el-button>
            </div>
            <div>
                <el-table :data="tableDateArray"
                          size="medium"
                          class="table"
                          stripe
                          border
                          @sort-change="onSortChange"
                          @selection-change="handleSelectionChange"
                          @expand-change="expChange"
                          @row-dblclick="rowDblclick">
                    <!--<el-table-column type="selection" width="60" align="center"></el-table-column>-->
                    <el-table-column prop="goodsId" label="商品ID" width="170"></el-table-column>
                    <el-table-column label="商品主图" width="120" align="center">
                        <template slot-scope="scope">
                            <img style="height: 80px; width: 80px;background-color: white;"  :preview="scope.$index" :src="uploadUrl + scope.row.goodsId + '/'+scope.row.picture" >
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" width="200"></el-table-column>
                    <el-table-column label="商品价格" width="120">
                        <template slot-scope="props">
                            <p>{{formatPrice(props.row.price)}}元</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品现价" width="120">
                        <template slot-scope="props">
                            <p>{{formatPrice(props.row.nowPrice)}}元</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sellCount" label="销量" width="60"></el-table-column>
                    <el-table-column  label="库存" width="165">
                    <template slot-scope="props">
                    <div class="stock-div">
                        <div>
                            <p v-if="props.row.isSerial==='N'" class="stock" >可用库存: {{props.row.stockNum-props.row.lockNum}}</p>
                            <p v-if="props.row.isSerial==='N'"  class="stock" >总库存: {{props.row.stockNum}}</p>
                            <p v-if="props.row.isSerial==='N'" style="color: red;"  class="stock" >锁定库存: {{props.row.lockNum}}</p>
                        </div>
                        <el-button v-if="props.row.isSerial==='N'" type="primary" style="margin-left: 5px;" icon="el-icon-edit" circle @click="upStock(props.row)"></el-button>
                        <el-button v-else @click="doInfos2(props.$index, 'fourth')">系列信息</el-button>
                    </div>
                    </template>
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                    <template slot-scope="props">
                        <span :class="{status1:isTheStatus(props.row.status, 1), status2:isTheStatus(props.row.status, 2), status3:isTheStatus(props.row.status, 3), status4:isTheStatus(props.row.status, 4)}">{{showStatus(props.row.status)}}</span>
                        <el-switch style="margin-left: 5px;" v-model="props.row.status" :active-value="1" :inactive-value="3" @change="switchStatus(props.row)"></el-switch>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140">
                    <template slot-scope="props">
                        <p>
                            <el-button style="width: 90px;" type="primary" @click="doInfos(props.$index, null)">查看●修改</el-button>
                        </p>
                        <p style="margin-top: 5px;" v-if="props.row.status===3&&(props.row.lockNum==null||props.row.lockNum===0)">
                            <el-button type="danger" style="width: 90px;" @click="delGoodCheck(props.row)">删除</el-button>
                        </p>
                    </template>
                </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"
                               :page-sizes="[10, 20, 30, 40]"
                               :page-size="limitNum"
                               layout="total,sizes, prev, pager, next"
                               :total="AllCount">
                </el-pagination>
            </div>

        </div>
        <el-dialog
                title="规格参数"
                :visible.sync="GoodsParamsFlag"
                style="width:1000px;margin: 0 auto">
            <div>
                <div class="param-top">
                    <el-button v-if="paramDataId" type="danger" @click="delParamTap">删除</el-button>
                    <el-button type="success" @click="saveParamTap" style="margin-left: 10px">保存</el-button>
                </div>
                <div>
                    <div v-for="(item, i) in GoodsParamsForm">
                        <el-row class="param-list">
                            <el-col :span="12">
                                <div>{{item.group}}</div>
                            </el-col>
                        </el-row>
                        <div v-for="(item1, j) in item.params">
                            <el-row class="param-list">
                                <el-col :span="3" class="param-list-test">
                                    {{item1.name}}
                                </el-col>
                                <el-col :span="9">
                                    <el-input v-model="item1.value" placeholder="请输入参数"></el-input>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="库存调整" :visible.sync="stockVisible" width="30%" >
            <el-form :model="stockForm" label-width="80px" :rules="stockRules" ref="stockForm">
                <el-form-item label="商品名称" prop="name">
                    <el-input :disabled="true" v-model="stockForm.name"></el-input>
                </el-form-item>
                <el-form-item label="当前库存" prop="stockNum">
                    <el-input v-model="stockForm.stockNum"></el-input>
                </el-form-item>
                <el-form-item label="锁定库存" prop="lockNum">
                    <el-input v-model="stockForm.lockNum"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stockVisible = false">取 消</el-button>
                <el-button type="primary" style="margin-left: 20px;" :disabled="stockFormUpdate" @click="OnUpStock()">修 改</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="系列信息"
                :visible.sync="goodDetailVisible"
                width="60%">
            <div>
                <span>商品名称：</span>
                <span>{{goodDetail.name}}</span>
                <el-button style="float: right;" type="primary" @click="doInfosSerials(goodDetail.goodsId, 'fourth')">修改系列</el-button>
            </div>
            <el-table  :data="goodDetail.goodsSerials" size="medium" style="margin-top: 20px;" stripe border>
                <el-table-column label="系列 ID" prop="specGoodsId"></el-table-column>
                <el-table-column label="系列主图" width="120" align="center">
                    <template slot-scope="scope"><img v-if="scope.row.specPic!=null&&scope.row.specPic!==''"  :preview="scope.$index" style="height: 80px; width: 80px;background-color: white;" :src="serialsUrl + '/'+scope.row.specPic"></template>
                </el-table-column>
                <el-table-column label="颜色" prop="specColor"></el-table-column>
                <el-table-column label="尺寸" prop="specSize"></el-table-column>
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
                <el-table-column  label="库存" width="165" >
                    <template slot-scope="props">
                        <div class="stock-div">
                            <div>
                                <p>可用库存: {{props.row.stockNum-props.row.lockNum}}</p>
                                <p>总库存: {{props.row.stockNum}}</p>
                                <p style="color: red;">锁定库存: {{props.row.lockNum}}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>-->
            <!--</span>-->
        </el-dialog>
    </div>
</template>

<script>
    import {sendServer} from '../../../util/common';
    import {
        getMallCategory,
        uptGoodsStock,
        getGoodsDescById,
        getGoodsParamsById,
        getCateParamByCateId,
        putOnOffBatch,
        delGoodsInfoById,
        qryGoodsInfo,
        getGoodsInfoById
    } from '../../../util/module';
    import cfg from '../../../config/cfg';
    import _String from '../../../util/string';

    export default {
        data() {
            let checkStockNum=(rule, stockNum, callback)=>{
                if(stockNum-this.goodInfo.stockNum<0){
                    callback(new Error('库存不能比原来小!'));
                    return false;
                }
                let reg = /^[0-9]*[0-9][0-9]*$/;
                if (!reg.test(stockNum)) {
                    callback(new Error('请输入大于等于0的数字'));
                }
                callback();
            };

            let checkLockNum=(rule, lockNum, callback)=>{
                if(lockNum-this.goodInfo.stockNum>0.01){
                    callback(new Error('锁定库存不能比当前库存大!'));
                    return false;
                }
                let reg = /^[0-9]*[0-9][0-9]*$/;
                if (!reg.test(lockNum)) {
                    callback(new Error('请输入大于等于0的数字'));
                }
                callback();
            };
            return {
                goodsTypeSelect: '',
                GoodsParamsFlag: false,
                SortChangeId: null,
                SortChangeOrder: null,
                tableDateArray: [],
                goodsSerialsArrays:{},
                multipleSelection: [],
                goodsId: '',
                paramDataId: '',
                goodsTypeArray: [],
                CurPage: 1,   // 设置加载的第几次，默认是第一次
                limitNum: 10,        // 返回数据的个数
                AllCount: 0,    // 总条数
                expands: [],
                GoodsParamsForm: [],
                rules: {
                    Name: [
                        {required: true, message: '请输入供货商名称', trigger: 'blur'},
                    ]
                },
                stockRules:{
                    stockNum:[
                        {required:true, message:'请输入当前库存', trigger:'blur'},
                        {validator: checkStockNum, trigger: 'blur'},
                    ],
                    lockNum:[
                        {required:true, message:'请输入锁定库存', trigger:'blur'},
                        {validator: checkLockNum, trigger: 'blur'},
                    ]
                },
                selectForm:{},
                stockVisible:false,
                stockForm:{
                    name:'兰博基尼',
                    stockNum:233,
                    lockNum:0
                },
                goodInfo:null,
                uploadUrl:'',
                downloadLoading:false,
                allData:[],
                allPage:1,
                allTotal:0,
                allPageSize:40,
                filename:'商品信息',
                goodDetail:{
                    goodsId:'',
                    goodsSerials:[]
                },
                goodDetailVisible:false,
                serialsUrl:'',
            }
        },
        created() {
            let mallId = localStorage.getItem('mallId') || '';
            this.uploadUrl = cfg.service.uploadUrl+'/' + mallId + '/';
            this.typeQry();
            this.goodsQry();
        },
        computed: {
            listenGoodsRefresh() {
                return this.$store.state.goodsRefreshFlag;
            },
            listenGoodsTypeRefresh() {
                return this.$store.state.goodsTypeArray;
            },
            stockFormUpdate(){
                if(this.stockForm.stockNum==null || this.goodInfo==null){
                    return true;
                }
                //stockNumUp，lockNumUp值被改变为true
                let stockNumUp=false;
                let lockNumUp=false;
                if(Math.abs(this.stockForm.stockNum-this.goodInfo.stockNum)>0.01){
                    stockNumUp = true;
                }
                if(Math.abs(this.stockForm.lockNum-this.goodInfo.lockNum)>0.01){
                    lockNumUp = true;
                }
                if(stockNumUp||lockNumUp){
                    return false;
                }else{
                    return true;
                }
            }
        },

        watch: {
            listenGoodsRefresh: function (newVal, oldVal) {
                if (!newVal) {
                    return true;
                }
                this.goodsQry();
                this.$store.commit('goodsRefreshF');
            },
            listenGoodsTypeRefresh: function (newVal, oldVal) {
                console.log('listenGoodsTypeRefresh', newVal);//debug
                this.goodsTypeArray = newVal;
            },
            $route(newValue, oldValue) {
                if (newValue.path === "/goodsManage") {
                    this.goodsQry()
                }
            }
        },

        methods: {
            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.goodsQry();
            },

            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.goodsQry();
            },

            // 刷新数据
            onRefresh() {
                this.goodsQry();
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            initGoods() {
                // this.goodsTypeInfoMore(this);
            },

            // 新增
            onAddNewTap() {
                let that = this;
                getMallCategory(this).then((res) => {
                    that.$store.commit('setGoodsTypeArray', res.data);
                    that.$router.push({path:'/goodsInfos',  query:{oper:1}});
                }, (res) => {
                    that.$message.error('请求失败');
                })
            },

            // 系列信息新增
            onAddItemNewTap(goodsId) {
                let that = this;
                let Params = {
                    goodsId: goodsId,
                    oper: 1    // 1:新增，2:修改
                };
                that.$router.push({path: '/addGoodsItem', query: Params});
            },

            // 排序
            onSortChange(options) {
                this.SortChangeId = options.prop;
                this.SortChangeOrder = options.order;
                this.goodsQry();
            },

            // 详情
            onDetailTap(row) {
                let that = this;
                getGoodsDescById(this, row.goodsId).then((goodsDesc) => {
                    let query = {};
                    query.data = goodsDesc.data;
                    query.goodsId = row.goodsId;
                    that.$router.push({path: '/goodsDesc', query: query || null});
                }, (res) => {

                });
            },

            onParamsTap(row) {
                console.log("row:", row)
                let that = this;
                this.goodsId = row.goodsId;
                getGoodsParamsById(this, row.goodsId).then((res) => {
                    console.log("res:", res)
                    if (res.status === 400) {
                        getCateParamByCateId(this, row.categoryId).then((res) => {
                            if (res.status !== 200 && res.status !== 400) {
                                that.$message.error(res.msg);
                                return false;
                            }
                            if(res.status==400){
                                that.$message.error('没有规格参数');
                                return false;
                            }
                            let paramData = res.data.paramData;
                            console.log("paramData:", paramData)
                            let Param = [];
                            if (paramData) {
                                Param = JSON.parse(paramData)
                            } else {
                                that.$message.error('没有规格参数');
                                return false;
                            }
                            console.log("Param:", Param)
                            this.GoodsParamsForm = Param;
                            this.GoodsParamsFlag = true;
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
                        console.log("Param:", Param)
                        this.GoodsParamsForm = Param;
                        this.GoodsParamsFlag = true;
                        this.paramDataId = res.data.id;
                    }

                }, (res) => {
                    that.$message.error('请求失败');
                })
            },

            // 修改
            onEditTap(row) {
                console.log("row:", row)
                let that = this;
                getMallCategory(this).then((res) => {
                    that.$store.commit('setGoodsTypeArray', res.data);
                    let Params = {
                        goodsInfo: row,
                        oper: 2   // 1:新增，2:修改
                    };
                    that.$router.push({path: '/addGoods', query: Params});

                }, (res) => {
                    that.$message.error('请求失败');
                })
            },

            // 删除
            onDeleteTap(Id) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.goodsDel(1, Id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                });
            },
            // 批量删除
            onDelBatchTap() {
                if (this.multipleSelection.length === 0) {
                    this.$message.warning('请选择需要删除的记录');
                    return false;
                }
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.goodsDel(2);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },

            goodsIdQry(Id) {
                return new Promise((resolve, reject) => {
                    let urlParams = {};
                    let send = {};
                    urlParams.url = cfg.service.project + cfg.service.getGoodsDescById.url + '/' + cfg.service.getGoodsDescById.action;
                    urlParams.txnId = cfg.service.getGoodsDescById.txnId;
                    send.Id = Id;
                    urlParams.send = send;
                    // 与server通信，
                    sendServer(urlParams, this).then(
                        (res) => {
                            // 成功
                            if (res.RespCode !== cfg.resp.success.code) {
                                reject(false); // 失败回调
                                return false;
                            }
                            res.Id = Id;
                            resolve(res)
                        }, (res) => {
                            // 失败
                            reject(false)

                        }
                    );

                })
            },

            // 商品基础信息—分页查询—不验签
            goodsQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.qryGoodsInfo.url + '/' + cfg.service.qryGoodsInfo.action;
                urlParams.url += '?page=' + this.CurPage + '&pageSize=' + this.limitNum;
                urlParams.txnId = cfg.service.qryGoodsInfo.txnId;
                if(this.selectForm.name!=null&&this.selectForm.name!==""){
                    send.name=this.selectForm.name;
                }
                if(this.selectForm.categoryId!=null&&this.selectForm.categoryId!==""){
                    send.categoryId=this.selectForm.categoryId;
                }
                if(this.selectForm.begPrice!=null&&this.selectForm.begPrice!==""){
                    send.begPrice=this.selectForm.begPrice;
                }
                if(this.selectForm.endPrice!=null&&this.selectForm.endPrice!==""){
                    send.endPrice=this.selectForm.endPrice;
                }
                if(this.selectForm.begNowPrice!=null&&this.selectForm.begNowPrice!==""){
                    send.begNowPrice=this.selectForm.begNowPrice;
                }
                if(this.selectForm.endNowPrice!=null&&this.selectForm.endNowPrice!==""){
                    send.endNowPrice=this.selectForm.endNowPrice;
                }
                if(this.selectForm.begSellCount!=null&&this.selectForm.begSellCount!==""){
                    send.begSellCount=this.selectForm.begSellCount;
                }
                if(this.selectForm.endSellCount!=null&&this.selectForm.endSellCount!==""){
                    send.endSellCount=this.selectForm.endSellCount;
                }
                // send.OrderBy = this.OrderBy;
                // send.OrderFlag = this.OrderFlag;
                // let signArray = {
                //     categoryPid: '99'
                // };
                // urlParams.signArray = signArray;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        console.log("res:", res)
                        // res.Users.forEach(item => {
                        //     item.CreateDate = item.CreateDate.replace(/-/g, " ");
                        //     item.ModifyDate = item.ModifyDate.replace(/-/g, " ");
                        // });
                        that.tableDateArray = res.data.rows;
                        console.log("tableDateArray", this.tableDateArray);//debug
                        that.AllCount = parseInt(res.data.records);
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            //删除商品
            goodsDel(flag, Id) {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.goodsDel.url + '/' + cfg.service.goodsDel.action;
                send.TxnId = cfg.service.goodsDel.txnId;
                let Goods = [];
                if (flag === 1) {
                    let GoodsInfo = {
                        Id: Id
                    };
                    Goods.push(GoodsInfo)
                } else {
                    this.multipleSelection.forEach(item => {
                        let GoodsInfo = {
                            Id: item.Id
                        };
                        Goods.push(GoodsInfo)
                    })
                }
                send.Count = Goods.length;
                send.Goods = Goods;
                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            that.$message.error(res.RespDesc);
                            return false;
                        }
                        that.$message.success("删除成功");
                        that.goodsQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            saveParamTap() {
                console.log("GoodsParamsForm:", this.GoodsParamsForm)
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.saveGoodsParams.url + '/' + cfg.service.saveGoodsParams.action;
                urlParams.txnId = cfg.service.saveGoodsParams.txnId;

                urlParams.header = {
                    operFlag: '1',
                };

                urlParams.signArray = {
                    goodsId: this.goodsId,
                };

                if (this.paramDataId) {
                    send.id = this.paramDataId;
                    urlParams.header.operFlag = '2';
                    urlParams.signArray.id = this.paramDataId;
                }
                send.goodsId = this.goodsId;
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
                        that.GoodsParamsFlag = false;
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
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
                        that.GoodsParamsFlag = false;
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            //expend展开事件
            expChange(row, expandedRows){
                if(this.goodsSerialsArrays[row.goodsId]!=null){
                    console.log("系列缓存", this.goodsSerialsArrays[row.goodsId]);
                    return;
                }
                console.log("row:",row);//debug
                console.log("expandedRows:",expandedRows);//debug
                //获取此行goodsId的系列信息
                this.getGoodsSerials(row.goodsId);
                // this.goodsSerialsArrays[row.goodsId]=this.getGoodsSerials(row.goodsId);
                // this.goodsSerialsArrays[row.goodsId]=[//debug
                //     {specColor:"黄色", specSize:"十寸"}//debug
                // ];//debug
                console.log("row.goodsId", row.goodsId);
                console.log("系列", this.goodsSerialsArrays[row.goodsId]);
            },

            //获取商品系列信息
            getGoodsSerials(goodsId){
                let that = this;
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.getGoodsInfoById.url + '/' + cfg.service.getGoodsInfoById.action;
                urlParams.txnId = cfg.service.getGoodsInfoById.txnId;
                send.goodsId=goodsId;
                urlParams.send = send;
                console.log("urlParams",urlParams);//debug
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        if(res.data["isSerial"]!=null&&res.data["isSerial"]==="Y"){
                            //有系列信息，返回系列详细信息
                            console.log("goodsSerials", res.data["goodsSerials"]);//debug
                            console.log("goodsId", goodsId);
                            that.goodsSerialsArrays[goodsId]=res.data["goodsSerials"];
                            //更新系列data信息
                            // that.$refs.goodsId.data=that.goodsSerialsArrays[goodsId];
                            console.log("ref",that.$refs[goodsId]);//debug
                            // that.$refs[goodsId].data=that.goodsSerialsArrays[goodsId];
                            return res.data["goodsSerials"];
                        }else{
                            //没有系列系列信息，返回空
                            return {};
                        }
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            //行被双击
            rowDblclick(row){
                // let Params={
                //     goodsId:row.goodsId
                // };
                // this.$router.push({path:'/GoodsSerials', query:Params});
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

            //翻译状态
            showStatus(status){
                let strStatus="";
                switch(status){
                    case 1:
                        strStatus="上架";
                        break;
                    case 2:
                        strStatus="注销";
                        break;
                    case 3:
                        strStatus="下架";
                        break;
                    case 4:
                        strStatus="新增";
                        break;
                }
                return strStatus;
            },

            //上架和下架
            onShoppingTap(row){
                console.log("row", row);//debug
                let urlParams={
                    header:{
                        operFlag:"1"
                    }
                };
                let send=[];
                urlParams.url=cfg.service.project+cfg.service.putOnOffGoods.url+"/"+cfg.service.putOnOffGoods.action;
                urlParams.txnId=cfg.service.putOnOffGoods.txnId;
                if(row.status===1){
                    urlParams.header.operFlag="2";
                }else{
                    urlParams.header.operFlag="1";
                }
                urlParams.UnUserId=true;
                let sendOne={};
                sendOne.goodsId=row.goodsId;
                sendOne.userId=localStorage.getItem('userId') || '';
                send.push(sendOne);
                urlParams.send=send;
                let that=this;
                sendServer(urlParams, this).then(res=>{
                    //成功
                    if (res.status !== 200 && res.status !== 400) {
                        that.$message.error(res.msg);
                        return false;
                    }
                    //刷新页面
                    this.goodsQry();
                },
                res=>{
                    // 失败
                    that.$message.error('请求失败');
                });
            },

            doInfos(index, flag){
                let goodInfo={};
                goodInfo=this.tableDateArray[index];
                let goodId=goodInfo.goodsId;
                console.log("flag", flag);//debug
                if(flag==null){
                    this.$router.push({path:'/goodsInfos', query:{goodId:goodId}});
                }else{
                    this.$router.push({path:'/goodsInfos', query:{goodId:goodId, flag:flag}});
                }

            },

            //展示系列dialog
            doInfos2(index, flag){
                let goodInfo={};
                goodInfo=this.tableDateArray[index];
                //获取good详细信息
                let params={};
                params.goodsId=goodInfo.goodsId;
                getGoodsInfoById(this, params).then(res=>{
                    this.goodDetail=res.data;
                    this.goodDetailVisible=true;
                    let mallId = localStorage.getItem('mallId') || '';
                    this.serialsUrl = cfg.service.uploadUrl+'/' + mallId + '/' + goodInfo.goodsId ;
                    console.log("goodDetail", this.goodDetail);//debug
                }, res=>{
                    this.$message.error(res.msg);
                });
            },

            doInfosSerials(goodsId, flag){
                let goodId=goodsId;
                if(flag==null){
                    this.$router.push({path:'/goodsInfos', query:{goodId:goodId}});
                }else{
                    this.$router.push({path:'/goodsInfos', query:{goodId:goodId, flag:flag}});
                }
            },

            putOnOffGoodsConfirm(flag){
                if (this.multipleSelection.length === 0) {
                    this.$message.warning('请选择需要上架或下架的商品!');
                    return false;
                }
                let str="";
                if(flag==1){
                    str="上架";
                }else{
                    str="下架";
                }
                this.$confirm('此操作将全部选中商品批量'+ str+', 是否继续?', str, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.putOnOffBatchBatch(flag);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'+str
                    })
                });
            },

            putOnOffBatchBatch(flag){
                console.log("multipleSelection", this.multipleSelection);//debug
                let urlParams={
                    header:{
                        operFlag:"1"
                    }
                };
                let send=[];
                urlParams.url=cfg.service.project+cfg.service.putOnOffGoods.url+"/"+cfg.service.putOnOffGoods.action;
                urlParams.txnId=cfg.service.putOnOffGoods.txnId;
                if(flag===1){
                    urlParams.header.operFlag="1";
                }else{
                    urlParams.header.operFlag="2";
                }
                urlParams.UnUserId=true;
                let userId=localStorage.getItem('userId') || '';
                this.multipleSelection.forEach(item => {
                    let GoodsInfo = {
                        goodsId: item.goodsId,
                        userId:userId
                    };
                    send.push(GoodsInfo);
                });

                urlParams.send=send;
                let that=this;
                sendServer(urlParams, this).then(res=>{
                        //成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        if(flag==1){
                            that.$message.success("上架成功");
                        }else{
                            that.$message.success("下架成功");
                        }
                        //刷新页面
                        this.goodsQry();
                    },
                    res=>{
                        // 失败
                        that.$message.error('请求失败');
                    });
            },

            upStock(row){
                console.log("row", row);//debug
                this.goodInfo=row;
                // this.stockForm=row;
                this.stockForm.name=row.name;
                this.stockForm.stockNum=row.stockNum;
                this.stockForm.lockNum=row.lockNum;
                this.stockForm.goodsId=row.goodsId;
                this.stockVisible=true;
            },

            OnUpStock(){
                console.log("stockForm", this.stockForm);//debug
                let stockNum=this.stockForm.stockNum;
                let lockNum=this.stockForm.lockNum;
                if(Math.abs(stockNum-this.goodInfo.stockNum)<0.01){
                    stockNum=null;
                }
                if(Math.abs(lockNum-this.goodInfo.lockNum)<0.01){
                    lockNum=null;
                }
                uptGoodsStock(this, this.stockForm.goodsId, stockNum, lockNum).then(
                    (res)=>{
                        this.$message.success("库存修改成功");
                        this.stockVisible=false;
                        this.onRefresh();
                    },
                    (res)=>{
                        this.$message.error("库存修改失败");
                    }
                );
            },

            isTheStatus(status, now){
                if(status===now){
                    return true;
                }else{
                    return false;
                }

            },

            switchStatus(item){
                console.log("switchStatus row", item);//debug
                let str='';
                if(item.status===1){
                    str='上架';
                }else{
                    str='下架';
                }
                this.$confirm("此操作将"+str+"商品， 是否确认", "商品"+str, {
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'error'
                }).then(()=>{
                    let userId=localStorage.getItem('userId')||'';
                    let GoodsInfo = {
                        goodsId: item.goodsId,
                        userId:userId
                    };
                    let goods=[];
                    goods.push(GoodsInfo);
                    let params={};
                    params.goods=goods;
                    if(item.status===1){
                        //上架
                        params.operFlag='1';
                    }else{
                        //下架
                        params.operFlag='2';
                    }
                    //上架或下架
                    putOnOffBatch(this, params).then(res=>{
                        //成功，不做任何事
                    }, res=>{
                        this.$message.error(res.msg);
                    });
                }).catch(()=>{
                    if(item.status===1){
                        item.status=3;
                    }else{
                        item.status=1;
                    }
                });
            },

            //删除商品by id
            delGood(item){
                console.log("item", item);//debug
                let params={};
                params.goodsId=item.goodsId;
                params.userId=localStorage.getItem('userId')||'';
                delGoodsInfoById(this, params).then(res=>{
                    this.$message.success('删除商品成功');
                    //成功后刷新页面
                    this.goodsQry();
                }, res=>{
                    this.$message.error(res.msg);
                });
            },

            //删除商品确认
            delGoodCheck(item){
                this.$confirm('此操作将删除商品，是否继续?', '删除商品', {
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'error'
                }).then(()=>{
                    this.delGood(item);
                }).catch(()=>{
                    //delGood有提示，这里不做任何事
                });
            },

            //导出Excel
            handleDownload(){
                this.downloadLoading=true;
                //清空数据
                this.allData=[];
                //获取所有商品数据
                this.GoodsQryAll();
            },

            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },

            //一次性获取所有商品数据
            GoodsQryAll(){
                let params={};
                params.page=this.allPage;
                params.pageSize=this.allPageSize;
                params.name=this.selectForm.name;
                params.categoryId=this.selectForm.categoryId;
                params.begPrice=this.selectForm.begPrice;
                params.endPrice=this.selectForm.endPrice;
                params.begNowPrice=this.selectForm.begNowPrice;
                params.endNowPrice=this.selectForm.endNowPrice;
                params.begSellCount=this.selectForm.begSellCount;
                params.endSellCount=this.selectForm.endSellCount;
                qryGoodsInfo(this, params).then(res=>{
                    this.allData.push(...res.data.rows);
                    this.allTotal=res.data.total;
                    this.allPage++;
                    if(this.allPage<=this.allTotal){
                        this.GoodsQryAll();
                    }else{
                        console.log("所有商品数据", this.allData);//debug
                        import('@/vendor/Export2Excel').then(excel => {
                            const tHeader=['商品ID', '名称', '价格', '现价', '销量', '总库存', '锁定库存', '状态'];
                            const filterVal=['goodsId', 'name', 'price', 'nowPrice', 'sellCount', 'stockNum', 'lockNum', 'status'];
                            const list=this.allData;
                            const data=this.formatJson(filterVal, list);
                            excel.export_json_to_excel({
                                header: tHeader,
                                data,
                                filename: this.filename,
                                autoWidth: this.autoWidth,
                                bookType: this.bookType
                            });
                        });
                        this.downloadLoading=false;
                    }
                }, res=>{
                    this.downloadLoading=false;
                    this.$message.error('获取商品数据失败！ '+res.msg);
                });
            },

            //格式化金额
            formatPrice(price){
                return _String.number_format(price, 2);
            },

        }

    }

</script>

<style>
    .handle-box {
        margin-top: 10px;
        margin-bottom: 20px;
        display: inline-block;
        width: 100%;
    }

    .table {
        width: 100%;
    }

    .search-btn {
        float: right;
        margin-left: 5px;
    }

    .demo-table-expand {
        font-size: 0;
    }

    .button {
        margin-bottom: 20px;
    }

    .goodsItemTable {
        border: solid 1px #EBEEF5;
    }

    .demo-table-expand label {
        width: 90px;
        /*color: #99a9bf;*/
        color: red
    }

    .demo-table-expand > .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .popover-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .popover-btn button {
        width: 100%;
        margin: 0;
        border: 0;
    }

    .el-button + .el-button {
        margin-left: 0;
    }

    .name-wrapper {
        /*padding: 10px;*/
    }

    .param-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 5px 0;
    }

    .param-list-test {
        margin-left: 10px;
    }

    .param-top {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .textShow{
        margin-left:2px;
        margin-bottom:10px;
    }

    .item-bottom-img{
        width: 30px;
        margin-right: 10px;
    }

    .stock-div{
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        -webkit-justify-content: center;
        justify-content: center;
    }

    .stock{

    }

    .status1{
        color:#409EFF;
    }

    .status2{
        color:#E6A23C;
    }

    .status3{
        color:red;
    }

    .status4{
        color:green;
    }

    .elSelect{
        width: 100%;
    }

</style>
