<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>用户活动每日统计（不选择日期默认为昨天）</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-date-picker
                    v-model="dateArray"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="onDateChange"
                    :picker-options="pickerOptions">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-refresh" @click="onRefresh" class="search-btn">刷新</el-button>
            </div>
            <el-table :data="tabledateArray"
                      @sort-change="onSoreChange"
                      size="medium"
                      class="table"
                      stripe
                      border
                      :summary-method="getSummaries"
                      show-summary
                      ref="multipleTable">
                <el-table-column prop="Date"  sortable="custom" label="日期" width="100"></el-table-column>
                <el-table-column prop="UserRgst" sortable="custom" label="注册用户数"></el-table-column>
                <el-table-column prop="StoreRgst" sortable="custom" label="注册店铺数"></el-table-column>
                <el-table-column prop="TidRgst" sortable="custom" label="绑定终端数"></el-table-column>
                <el-table-column prop="GoodsAdd" sortable="custom" label="商品添加数"></el-table-column>
                <el-table-column prop="GdsAddS" sortable="custom" label="添加商品店铺数"></el-table-column>
                <el-table-column prop="MobileLg" sortable="custom" label="小程序登陆用户数"></el-table-column>
                <el-table-column prop="PosLg" sortable="custom" label="POS登陆用户数"></el-table-column>
            </el-table>
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
    </div>
</template>

<script>
    import {sendServer} from '../../../util/common';
    import cfg from '../../../config/cfg';
    import moment from 'moment'

    export default {
        data() {
            return {
                tabledateArray: [],
                pickerOptions: {     // 日期筛选初始数据
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }],
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    },
                    onPick(time) {
                    }
                },
                RptSumUserRgst: 0,   // 注册用户数总计
                RptSumStoreRgst: 0,  // 注册店铺数总计
                RptSumTidRgst: 0,  // 绑定终端数总计
                RptSumGoodsAdd: 0,     // 商品添加数总计
                RptSumGdsAddS: 0, // 添加商品店铺数总计
                RptSumMobileLg: 0,   // 小程序登陆用户数总计
                RptSumPosLg: 0,  // POS登陆用户数总计
                CurPage: 1,         // 设置加载的第几次，默认是第一次
                limitNum: 10,       // 返回数据的个数
                AllCount: 0,        // 总条数
                multipleSelection: [],
                dateArray: [],
                OrderBy: '1',  //1：日期（默认） 2：注册用户数3：注册店铺数4：绑定终端数5：商品添加数  6：添加商品店铺数 7: 小程序登陆用户数 8: POS登陆用户数
                OrderFlag: '2'  //升降序：1：升序，2：降序（默认）

            }
        },
        created() {
            const transDate = moment().subtract(1, 'days');
            this.dateArray.push(transDate);
            this.dateArray.push(transDate);
            this.userOprDayDetail();
        },
        computed: {},
        methods: {
            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.userOprDayDetail();
            },
            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.userOprDayDetail();
            },
            // 刷新数据
            onRefresh() {
                // this.$router.push({
                //     path: 'tabs'
                // })
                this.userOprDayDetail();
            },
            // 日期发生改变
            onDateChange() {
                this.CurPage = 1;
                this.userOprDayDetail();
            },
            // 统计
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                sums[0] = '合计';
                sums[1] = this.RptSumUserRgst;
                sums[2] = this.RptSumStoreRgst;
                sums[3] = this.RptSumTidRgst;
                sums[4] = this.RptSumGoodsAdd;
                sums[5] = this.RptSumGdsAddS;
                sums[6] = this.RptSumMobileLg;
                sums[7] = this.RptSumPosLg;

                return sums;
            },
            // 排序发生改变
            onSoreChange(options) {
                let order = options.order;
                let prop = options.prop;
                switch (order) {
                    case 'ascending':
                        this.OrderFlag = '1';
                        break;
                    case 'descending':
                        this.OrderFlag = '2';
                        break;
                    default:
                        this.OrderFlag = '2';
                }
                switch (prop) {
                    case 'Date':
                        this.OrderBy = '1';
                        break;
                    case 'UserRgst':
                        this.OrderBy = '2';
                        break;
                    case 'StoreRgst':
                        this.OrderBy = '3';
                        break;
                    case 'TidRgst':
                        this.OrderBy = '4';
                        break;
                    case 'GoodsAdd':
                        this.OrderBy = '5';
                        break;
                    case 'GdsAddS':
                        this.OrderBy = '6';
                        break;
                    case 'MobileLg':
                        this.OrderBy = '7';
                        break;
                    case 'PosLg':
                        this.OrderBy = '8';
                        break;
                    default:
                        this.OrderBy = '1';
                }
                this.CurPage = 1;
                this.userOprDayDetail();
            },
            //3.2.1	用户活动每日统计
            userOprDayDetail() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.userOprDayDetail.url + '/' + cfg.service.userOprDayDetail.action;
                send.TxnId = cfg.service.userOprDayDetail.txnId;
                send.CustQryNum = this.limitNum.toString();
                send.CurPage = this.CurPage.toString();
                send.OrderBy = this.OrderBy;
                send.OrderFlag = this.OrderFlag;
                let dateArray = this.dateArray;

                if (dateArray && dateArray.length === 2 && dateArray[0] && dateArray[1]) {
                    send.BegDate = moment(dateArray[0]).format('YYYYMMDD');
                    send.EndDate = moment(dateArray[1]).format('YYYYMMDD');
                    // send.EndDate = '20180920';
                } else {
                    // let transDate = new Date().format('yyyyMMdd');
                    let transDate = moment(new Date()).format('YYYYMMDD');
                    send.BegDate = transDate;
                    send.EndDate = transDate;
                }

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            this.$message.error(res.RespDesc);
                            return false;
                        }
                        that.tabledateArray = res.UserActSum;
                        that.AllCount = parseInt(res.AllCount);

                        that.RptSumGdsAddS = res.RptSumGdsAddS || '0';
                        that.RptSumGoodsAdd = res.RptSumGoodsAdd || '0';
                        that.RptSumMobileLg = res.RptSumMobileLg || '0';
                        that.RptSumPosLg = res.RptSumPosLg || '0';
                        that.RptSumStoreRgst = res.RptSumStoreRgst || '0';
                        that.RptSumTidRgst = res.RptSumTidRgst || '0';
                        that.RptSumUserRgst = res.RptSumUserRgst || '0';
                    }, (res) => {
                        // 失败
                        this.$message.error('请求失败');
                    }
                );
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
        display: inline-block;
        width: 100%;
    }

    .table {
        width: 100%;
    }

    .search-btn {
        float: right;
    }
</style>
