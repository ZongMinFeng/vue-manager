<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="success" icon="el-icon-plus" @click="onAddNewTap">新增</el-button>
                <el-button type="danger" @click="onDelBatchTap">批量删除</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="onRefresh" class="search-btn">刷新</el-button>
            </div>
            <el-table :data="tableDateArray"
                      size="medium"
                      class="table"
                      stripe
                      border
                      @sort-change="onSortChange"
                      @selection-change="handleSelectionChange"
                      row-key="Id"
                      :expand-row-keys="expands"
                      @row-click="rowClick">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="联系人" class="aaa">
                                <span>{{ props.row.Person }}</span>
                            </el-form-item>
                            <el-form-item label="联系电话">
                                <span>{{ props.row.Mobile }}</span>
                            </el-form-item>
                            <el-form-item label="联系地址">
                                <span>{{ props.row.Addr }}</span>
                            </el-form-item>
                            <el-form-item label="付款开户行">
                                <span>{{ props.row.PayBank }}</span>
                            </el-form-item>
                            <el-form-item label="付款账户">
                                <span>{{ props.row.PayAcc }}</span>
                            </el-form-item>
                            <el-form-item label="备注信息">
                                <span>{{ props.row.Memo }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="SuppId" sortable="custom" label="供货商ID" width="110"></el-table-column>
                <el-table-column prop="Name" sortable="custom" label="名称"></el-table-column>
                <el-table-column prop="OperDate" label="时间"></el-table-column>
                <el-table-column prop="PayAcc" sortable="custom" label="状态" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.Status === '1'" type="success"
                                disable-transitions>正常
                        </el-tag>
                        <el-tag v-else-if="scope.row.Status === '2'" type="warning"
                                disable-transitions>禁用
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="props">
                        <!--<el-button type="primary" size="small" plain @click="onUserDetail(props.row.Id)">详情-->
                        <!--</el-button>-->
                        <el-button type="warning" size="small" plain @click="onEditTap(props.row)">修改</el-button>
                        <el-button type="danger" size="small" plain @click="onDeleteTap(props.row.SuppId)">删除
                        </el-button>
                    </template>
                </el-table-column>
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
    import {setTitle} from '../../../util/pub';
    import cfg from '../../../config/cfg';
    // import routeArray from '../../../config/routeArray';
    // let routeArray = require("./../../config/routeArray.js");

    export default {
        data() {
            return {
                SortChangeId: null,
                SortChangeOrder: null,
                tableDateArray: [],
                multipleSelection: [],
                CurPage: 1,   // 设置加载的第几次，默认是第一次
                limitNum: 10,        // 返回数据的个数
                AllCount: 0,    // 总条数
                expands: [],
                rules: {
                    Name: [
                        {required: true, message: '请输入供货商名称', trigger: 'blur'},
                    ]
                },

            }
        },
        created() {
            this.supplierQry();
        },
        computed: {
            listenSuppRefresh() {
                return this.$store.state.suppRefreshFlag;
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.supplierQry();
            },
            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.supplierQry();
            },
            // 刷新数据
            onRefresh() {
                this.supplierQry();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 新增
            onAddNewTap() {
                // this.reload();
                this.expands = [];
                setTitle('/addSupplier','新增供货商');
                this.$router.push('/addSupplier');
            },
            // 排序
            onSortChange(options) {
                this.SortChangeId = options.prop;
                this.SortChangeOrder = options.order;
                this.supplierQry();
            },
            // 点击行
            rowClick(row, event, column) {
                let nodeName = event.target.nodeName;
                if (nodeName === 'SPAN' || nodeName === 'BUTTON') {
                    return true;
                }
                Array.prototype.remove = function (val) {
                    let index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                if (this.expands.indexOf(row.SuppId) < 0) {
                    this.expands.push(row.SuppId);
                } else {
                    this.expands.remove(row.SuppId);
                }
            },
            // 修改
            onEditTap(row) {
                this.expands = [];
                setTitle('/addSupplier','修改供货商');
                this.$router.push({path: '/addSupplier', query: row});
            },
            // 删除用户
            onDeleteTap(SuppId) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.supplierDel(1, SuppId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
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
                    this.supplierDel(2);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //3.2.3	查询供货商
            supplierQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.supplierQry.url + '/' + cfg.service.supplierQry.action;
                send.TxnId = cfg.service.supplierQry.txnId;
                send.CustQryNum = this.limitNum.toString();
                send.CurPage = this.CurPage.toString();
                send.OrderBy = this.OrderBy;
                send.OrderFlag = this.OrderFlag;

                if (this.SortChangeId) {
                    if (this.SortChangeId === 'SuppId') {
                        send.OrderBy = '1';
                    } else if (this.SortChangeId === 'Name') {
                        send.OrderBy = '2';
                    } else if (this.SortChangeId === 'Status') {
                        send.OrderBy = '3';
                    }
                    if (this.SortChangeOrder === 'ascending') {
                        send.OrderFlag = '1';
                    } else if (this.SortChangeOrder === 'descending') {
                        send.OrderFlag = '2';
                    }
                }
                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            that.$message.error(res.RespDesc);
                            return false;
                        }
                        if(res.Supp) {
                            res.Supp.forEach(item => {
                                item.OperDate = item.OperDate.replace(/-/g, " ");
                                if(!item.OperUserName) {
                                    item.OperUserName = item.OperUserMobile;
                                }
                            });
                        }
                        that.tableDateArray = res.Supp;
                        that.AllCount = parseInt(res.AllCount);
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            //3.2.6	删除供货商
            supplierDel(flag, SuppId) {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.supplierDel.url + '/' + cfg.service.supplierDel.action;
                send.TxnId = cfg.service.supplierDel.txnId;
                let Supp = [];
                if (flag === 1) {
                    send.SuppId = SuppId;
                    let SuppInfo = {
                        SuppId: SuppId
                    };
                    Supp.push(SuppInfo)
                } else {
                    this.multipleSelection.forEach(item => {
                        let SuppInfo = {
                            SuppId: item.SuppId
                        };
                        Supp.push(SuppInfo)
                    })
                }
                send.Count = Supp.length.toString();
                send.Supp = Supp;
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
                        that.supplierQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
        },
        watch: {
            listenSuppRefresh: function (newVal, oldVal) {
                if (!newVal) {
                    return true;
                }
                this.supplierQry();
                this.$store.commit('suppRefreshF');
            }
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
    }

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand > .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

</style>
