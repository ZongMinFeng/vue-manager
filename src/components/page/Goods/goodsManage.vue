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
                    <!--暂时没有销量，注释掉-->
                    <!--<el-col :sm="24" :md="12" :xl="8">-->
                        <!--<el-form-item label="现价起始值" prop="begPrice">-->
                            <!--<el-input maxlength="10" placeholder="请输入最小金额" v-model="selectForm.begNowPrice"-->
                                      <!--@change="onRefresh"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :sm="24" :md="12" :xl="8">-->
                        <!--<el-form-item label="现价结束值" prop="endPrice">-->
                            <!--<el-input maxlength="10" placeholder="请输入最大金额" v-model="selectForm.endNowPrice"-->
                                      <!--@change="onRefresh"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
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
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <!--<el-table-column prop="goodsId" label="商品ID" width="170"></el-table-column>-->
                    <el-table-column label="商品主图" width="120" align="center">
                        <template slot-scope="scope">
                            <img style="height: 80px; width: 80px;background-color: white;"  :preview="scope.$index" :src="uploadUrl + scope.row.goodsId + '/'+scope.row.picture" >
                        </template>
                    </el-table-column>
                    <el-table-column label="商品价格" width="140">
                        <template slot-scope="props">
                            <p v-if="Math.abs(props.row.price- props.row.nowPrice)<0.005">￥{{formatPrice(props.row.price)}}元</p>
                            <p v-if="!(Math.abs(props.row.price- props.row.nowPrice)<0.005)">原价：￥{{formatPrice(props.row.price)}}元</p>
                            <p v-if="!(Math.abs(props.row.price- props.row.nowPrice)<0.005)">现价：￥{{formatPrice(props.row.nowPrice)}}元</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="分类" width="100">
                        <template slot-scope="props">
                            {{getcCategory(props.row.categoryId)}}
                        </template>
                    </el-table-column>
                    <!--暂时没有销量，注释掉-->
                    <!--<el-table-column prop="sellCount" label="销量" width="60"></el-table-column>-->
                    <el-table-column  label="库存" width="220">
                    <template slot-scope="props">
                    <div class="stock-div">
                        <div>
                            <p v-if="props.row.isSerial==='N'"  class="stock" >总 库 存: {{showStock(props.row.unit, props.row.stockNum)}} {{props.row.unit}}</p>
                            <p v-if="props.row.isSerial==='N'" style="color: red;"  class="stock" ><span style="color: red;">锁定库存: {{showStock(props.row.unit, props.row.lockNum)}} {{props.row.unit}}</span></p>
                            <p v-if="props.row.isSerial==='N'" class="stock" ><span style="color: green;">可用库存: {{showStock(props.row.unit, props.row.stockNum-props.row.lockNum)}} {{props.row.unit}}</span></p>
                        </div>
                        <el-button v-if="props.row.isSerial==='N'" type="primary" style="margin-left: 5px;" icon="el-icon-edit" circle @click="upStockTap(props.row)"></el-button>
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
                    <el-table-column label="操作">
                    <template slot-scope="props">
                        <p>
                            <el-button style="width: 90px;" type="primary" @click="doInfos(props.$index, null)">查看●修改</el-button>
                        </p>
                        <!--有系列、锁定库存不允许删除商品-->
                        <p style="margin-top: 5px;" v-if="canDelete(props.row)">
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
            <el-form :model="stockForm" label-width="100px" ref="stockForm">
                <el-form-item label="商品名称" prop="name">
                    <el-input :disabled="true" v-model="stockForm.name"></el-input>
                </el-form-item>
                <el-form-item label="总库存:">
                    {{showStock5(stockForm.unit, stockForm.stockNumOld)}} {{stockForm.unit}}
                </el-form-item>
                <el-form-item label="锁定库存:">
                    <span style="color: red;">{{showStock5(stockForm.unit, stockForm.lockNum)}} {{stockForm.unit}}</span>
                </el-form-item>
                <el-form-item label="可用库存:">
                    <span style="color: green;">{{showStock5(stockForm.unit, stockForm.stockNumOld-stockForm.lockNum)}} {{stockForm.unit}}</span>
                </el-form-item>
                <el-form-item label="库存变动" prop="stockNum" :rules="[{validator:checkModiStockNum, trigger:'blur'}]">
                    <el-input v-model="stockForm.stockNum" placeholder="请输入要修改的库存"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stockVisible = false">取 消</el-button>
                <el-button type="danger" style="margin-left: 20px;" @click="OnUpStockDown()">销 货</el-button>
                <el-button type="primary" style="margin-left: 20px;" @click="OnUpStock()">补 货</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="系列信息"
                :visible.sync="goodDetailVisible"
                width="70%">
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
                <el-table-column :label="specName1" prop="specColor"></el-table-column>
                <el-table-column :label="specName2" prop="specSize"></el-table-column>
                <el-table-column label="原价">
                    <template slot-scope="props">
                        <p>￥{{formatPrice(props.row.specPrice)}}元</p>
                    </template>
                </el-table-column>
                <el-table-column label="现价">
                    <template slot-scope="props">
                        <p>￥{{formatPrice(props.row.specNowPrice)}}元</p>
                    </template>
                </el-table-column>
                <el-table-column  label="库存" width="180" >
                    <template slot-scope="props">
                        <div class="stock-div">
                            <div>
                                <p>总库存: {{showStock(goodDetail.unit, props.row.stockNum)}} {{goodDetail.unit}}</p>
                                <p style="color: red;">锁定库存: {{showStock(goodDetail.unit, props.row.lockNum)}} {{goodDetail.unit}}</p>
                                <p style="color: green;">可用库存: {{showStock(goodDetail.unit, (props.row.stockNum-props.row.lockNum))}} {{goodDetail.unit}}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
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
    import GwRegular from '@/Gw/GwRegular.js';
    import {unitNum} from "../../../Gw/GwString";
    import String from '@/util/string.js';
    import {itemByCons} from '@/Gw/GwArray.js';

    export default {
        data() {
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
                selectForm:{},
                stockVisible:false,
                stockForm:{
                    name:'兰博基尼',
                    stockNum:null,
                    stockNumOld:null,
                    lockNum:0,
                    unit:null,
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
                specName1:'颜色',
                specName2:'尺寸'
            }
        },
        created() {
            let mallId = localStorage.getItem('mallId') || '';
            let specNames=localStorage.getItem('specNames').split('||');
            if(specNames.length===1){
                this.specName1=specNames[0];
            }
            if(specNames.length===2){
                this.specName1=specNames[0];
                this.specName2=specNames[1];
            }
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
                this.goodsTypeArray = newVal;
            },
            $route(newValue, oldValue) {
                if (newValue.path === "/goodsManage") {
                    this.goodsQry()
                }
            }
        },

        methods: {
            //可删除条目
            canDelete(row){
                if (row.isSerial === 'Y') {
                    return false;
                }
                if (row.lockNum > 0) {
                    return false;
                }
                if (row.status !== 3) {
                    return false;
                }
                return true;
            },

            //获取分类名称
            getcCategory(id){
                let category=itemByCons(this.goodsTypeArray, id, 'categoryId');
                if (category == null) {
                    return null;
                }
                return category.name;
            },

            showStock(unit, stock){
                return unitNum(unit, String.unitNumDown(unit, stock));
            },

            showStock5(unit, stock){
                return String.unitNum5(unit, String.unitNumDown(unit, stock));
            },

            //库存修改，对库存的检查
            checkModiStockNum(rule, stockNum, callback){
                if (stockNum == null || this.stockForm.unit == null) {
                    callback(new Error('请输入值'));
                }
                switch (this.stockForm.unit) {
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

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        console.log("res:", res);
                        that.tableDateArray = res.data.rows;
                        //后台很坑的设置了重量单位为克，下发单位“斤”，数量却是“克”
                        // this.tableDateArray.forEach(item=>{
                        //     if (item.unit === '斤') {
                        //         item.stockNum=item.stockNum/500;
                        //         item.lockNum=item.lockNum/500;
                        //     }
                        // });
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
                //获取此行goodsId的系列信息
                this.getGoodsSerials(row.goodsId);
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
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        if(res.data["isSerial"]!=null&&res.data["isSerial"]==="Y"){
                            //有系列信息，返回系列详细信息
                            console.log("goodsId", goodsId);
                            that.goodsSerialsArrays[goodsId]=res.data["goodsSerials"];
                            //更新系列data信息
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
                        console.log('goodsTypeArray', this.goodsTypeArray);//debug
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

            upStockTap(row){
                this.goodInfo=row;
                this.stockForm.name=row.name;
                this.stockForm.stockNumOld=row.stockNum;
                this.stockForm.lockNum=row.lockNum;
                this.stockForm.goodsId=row.goodsId;
                this.stockForm.unit=row.unit;

                //初始化stockNum
                this.stockForm.stockNum=null;
                this.stockVisible=true;
            },

            //补货
            OnUpStock(){
                let flag=1;
                this.$refs['stockForm'].validate((valid)=>{
                    if (valid) {
                        this.upStock(flag);
                    }else{
                        return false;
                    }
                });
            },

            //销货
            OnUpStockDown(){
                let flag=2;
                this.$refs['stockForm'].validate((valid)=>{
                    if (valid) {
                        this.upStock(flag);
                    }else{
                        return false;
                    }
                });
            },

            upStock(flag){
                //后台很坑地设置了重量单位“克”，而下发的单位有可能是“斤”
                let stockNum = String.unitNumUp(this.stockForm.unit, this.stockForm.stockNum);
                if (flag===2) {
                    //销货，需要取反
                    stockNum=-stockNum;
                }
                //减库存时，不能将库存减为负数
                if (parseFloat(stockNum) + parseFloat(this.stockForm.stockNumOld) < -0.000005) {
                    this.$message.error('减库存时，不能将库存减为负数！');
                    return;
                }
                uptGoodsStock(this, this.stockForm.goodsId, stockNum).then(
                    (res)=>{
                        this.$message.success("库存修改成功");
                        this.stockVisible=false;
                        this.onRefresh();
                    },
                    (res)=>{
                        if (res.msg != null) {
                            this.$message.error(res.msg);
                        }else{
                            this.$message.error("库存修改失败");
                        }
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
                        import('@/vendor/Export2Excel').then(excel => {
                            const tHeader=['商品ID', '名称', '价格','起售价格', '现价', '销量', '总库存', '锁定库存', '状态'];
                            const filterVal=['goodsId', 'name', 'price', 'minPrice', 'nowPrice', 'sellCount', 'stockNum', 'lockNum', 'status'];
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

            //显示可用库存
            showUseStock(row){
                if(row==null){
                    return;
                }
                let stock=(row.stockNum-row.lockNum).toFixed(5);
                let newStock=0;
                switch (row.unit) {
                    //截取3位小数、不四舍五入
                    case '公斤':
                    case '斤':
                        newStock=Math.floor(stock*1000)/1000;
                        break;
                    default:
                        newStock=parseInt(stock);
                }
                return newStock;
            },

            showTotalStock(row){
                if(row==null){
                    return;
                }
                let stock=row.stockNum.toFixed(5);
                let newStock=0;
                switch (row.unit) {
                    default:
                        newStock=parseInt(stock);
                }
                return newStock;
            },

            showLockStock(row){
                if(row==null){
                    return;
                }
                let stock=row.lockNum.toFixed(5);
                let newStock=0;
                switch (row.unit) {
                    default:
                        newStock=parseInt(stock);
                }
                return newStock;
            },

            showNum(num, unit){
                if(num==null){
                    return;
                }
                let stock=num.toFixed(5);
                let newStock=0;
                switch (unit) {
                    //截取3位小数、不四舍五入
                    case '公斤':
                    case '斤':
                        newStock=Math.floor(stock*1000)/1000;
                        break;
                    default:
                        newStock=parseInt(stock);
                }
                return newStock;
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
