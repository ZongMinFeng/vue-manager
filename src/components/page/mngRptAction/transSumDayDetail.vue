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
                <el-table-column prop="Date" sortable="custom" label="日期" width="80"></el-table-column>
                <el-table-column prop="Cnt" sortable="custom" label="消费交易总笔数"></el-table-column>
                <el-table-column prop="TotalAmt" sortable="custom" label="消费商品总金额"></el-table-column>
                <el-table-column prop="RealAmt" sortable="custom" label="实付金额"></el-table-column>
                <el-table-column prop="RCnt" sortable="custom" label="退货总笔数"></el-table-column>
                <el-table-column prop="RTotalAmt" sortable="custom" label="退货商品金额"></el-table-column>
                <el-table-column prop="RRealAmt" sortable="custom" label="实退金额"></el-table-column>
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
                RptSumTransCnt : 0,	        // 消费交易总笔数总计
                RptSumTransTotalAmt : 0,	// 消费商品总金额总计
                RptSumTransRealAmt : 0,	    // 实付金额总计
                RptSumRTransCnt : 0,	    // 退货总笔数总计
                RptSumRTransTotalAmt : 0,	// 退货商品金额总计
                RptSumRTransRealAmt : 0,	// 实退金额总计
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
            this.transSumDayDetail();
        },
        computed: {},
        methods: {
            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.transSumDayDetail();
            },
            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.transSumDayDetail();
            },
            // 统计
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                sums[0] = '合计';
                sums[1] = this.RptSumTransCnt;
                sums[2] = this.RptSumTransTotalAmt;
                sums[3] = this.RptSumTransRealAmt;
                sums[4] = this.RptSumRTransCnt;
                sums[5] = this.RptSumRTransTotalAmt;
                sums[6] = this.RptSumRTransRealAmt;
                return sums;
            },
            // 刷新数据
            onRefresh() {
                // this.$router.push({
                //     path: 'tabs'
                // })
                this.transSumDayDetail();
            },
            // 日期发生改变
            onDateChange() {
                this.CurPage = 1;
                this.transSumDayDetail();
            },
            // 排序发生改变
            onSoreChange(options) {
                console.log("options:", options);
                let order = options.order;
                let prop = options.prop;
                switch(order)
                {
                    case 'ascending':
                        this.OrderFlag = '1';
                        break;
                    case 'descending':
                        this.OrderFlag = '2';
                        break;
                    default:
                        this.OrderFlag = '2';
                }
                switch(prop)
                {
                    case 'Date':
                        this.OrderBy = '1';
                        break;
                    case 'Cnt':
                        this.OrderBy = '2';
                        break;
                    case 'TotalAmt':
                        this.OrderBy = '3';
                        break;
                    case 'RealAmt':
                        this.OrderBy = '4';
                        break;
                    case 'RCnt':
                        this.OrderBy = '5';
                        break;
                    case 'RTotalAmt':
                        this.OrderBy = '6';
                        break;
                    case 'RRealAmt':
                        this.OrderBy = '7';
                        break;
                    default:
                        this.OrderBy = '1';
                }
                this.CurPage = 1;
                this.transSumDayDetail();
            },
            //3.2.1	用户活动每日统计
            transSumDayDetail() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.transSumDayDetail.url + '/' + cfg.service.transSumDayDetail.action;
                send.TxnId = cfg.service.transSumDayDetail.txnId;
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
                        console.log("res:", res)

                        if (res.RespCode !== '0000') {
                            this.$message.error(res.RespDesc);
                            return false;
                        }
                        that.tabledateArray = res.TransSum;
                        that.AllCount = parseInt(res.AllCount);

                        that.RptSumTransCnt = res.RptSumTransCnt || '0';
                        that.RptSumTransTotalAmt = res.RptSumTransTotalAmt || '0';
                        that.RptSumTransRealAmt = res.RptSumTransRealAmt || '0';
                        that.RptSumRTransCnt = res.RptSumRTransCnt || '0';
                        that.RptSumRTransTotalAmt = res.RptSumRTransTotalAmt || '0';
                        that.RptSumRTransRealAmt = res.RptSumRTransRealAmt || '0';

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
