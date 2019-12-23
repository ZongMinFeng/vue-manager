<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>用户活动每日统计（不选择日期默认为昨天）</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div>
                <el-checkbox-group v-model="checkboxGroup1">
                    <el-checkbox-button v-for="city in cities" :label="city.id" :key="city.id">{{city.name}}
                    </el-checkbox-button>
                </el-checkbox-group>
            </div>
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
                <el-table-column prop="Date" sortable="custom" label="日期" width="100"></el-table-column>
                <el-table-column prop="Type" sortable="custom" label="支付方式"></el-table-column>
                <el-table-column prop="SaleCnt" sortable="custom" label="消费总笔数"></el-table-column>
                <el-table-column prop="SaleAmt" sortable="custom" label="消费总金额"></el-table-column>
                <el-table-column prop="RefCnt" sortable="custom" label="退货总笔数"></el-table-column>
                <el-table-column prop="RefAmt" sortable="custom" label="退货总金额"></el-table-column>
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
                cities: [{
                    id: 1,
                    name: '现金'
                }, {
                    id: 2,
                    name: '支付宝'
                }, {
                    id: 3,
                    name: '微信'
                }, {
                    id: 4,
                    name: '银行卡'
                }],
                checkboxGroup1: [],
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
                RptSumSaleCnt: '0',	// 消费总笔数总计
                RptSumSaleAmt: '0',	// 消费总金额总计
                RptSumRefCnt: '0',	// 退货总笔数总计
                RptSumRefAmt: '0',	// 退货总金额总计
                CurPage: 1,   // 设置加载的第几次，默认是第一次
                limitNum: 10,        // 返回数据的个数
                AllCount: 0,    // 总条数
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
            this.payTypeDayDetail();
        },
        computed: {},
        methods: {
            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.payTypeDayDetail();
            },
            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.payTypeDayDetail();
            },
            // 统计

            getSummaries(param) {
                // const {columns, data} = param;
                const sums = [];
                sums[0] = '合计';
                // sums[1] = '<button>12312</button>'
                sums[1] = '';
                sums[2] = this.RptSumSaleCnt;
                sums[3] = this.RptSumSaleAmt;
                sums[4] = this.RptSumRefCnt;
                sums[5] = this.RptSumRefAmt;
                return sums;
            },
            // 刷新数据
            onRefresh() {
                // this.$router.push({
                //     path: 'tabs'
                // })
                this.payTypeDayDetail();
            },
            // 日期发生改变
            onDateChange() {
                this.CurPage = 1;
                this.payTypeDayDetail();
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
                    case 'Type':
                        this.OrderBy = '2';
                        break;
                    case 'SaleCnt':
                        this.OrderBy = '3';
                        break;
                    case 'SaleAmt':
                        this.OrderBy = '4';
                        break;
                    case 'RefCnt':
                        this.OrderBy = '5';
                        break;
                    case 'RefAmt':
                        this.OrderBy = '6';
                        break;
                    default:
                        this.OrderBy = '1';
                }
                this.CurPage = 1;
                this.payTypeDayDetail();
            },
            //3.2.1	用户活动每日统计
            payTypeDayDetail() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.payTypeDayDetail.url + '/' + cfg.service.payTypeDayDetail.action;
                send.TxnId = cfg.service.payTypeDayDetail.txnId;
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
                        that.tabledateArray = res.PayTypeSum;
                        that.AllCount = parseInt(res.AllCount);
                        that.RptSumSaleCnt = res.RptSumSaleCnt || '0';
                        that.RptSumSaleAmt = res.RptSumSaleAmt || '0';
                        that.RptSumRefCnt = res.RptSumRefCnt || '0';
                        that.RptSumRefAmt = res.RptSumRefAmt || '0';

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
    }
</style>
