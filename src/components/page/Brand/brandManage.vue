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
                      row-key="BrandId"
                      :expand-row-keys="expands"
                      @row-click="rowClick">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="备注信息">
                                <span>{{ props.row.Memo }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="BrandId" sortable="custom" label="品牌ID" width="110"></el-table-column>
                <el-table-column prop="Name" sortable="custom" label="名称"></el-table-column>
                <el-table-column prop="OperUserName"  label="操作员"></el-table-column>
                <el-table-column prop="OperDate"  label="修改时间"></el-table-column>

                <el-table-column label="操作" width="150">
                    <template slot-scope="props">
                        <el-button type="warning" size="small" plain @click="onEditTap(props.row)">修改</el-button>
                        <el-button type="danger" size="small" plain @click="onDeleteTap(props.row.BrandId)">删除
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
    import cfg from '../../../config/cfg';
    import {setTitle} from '../../../util/pub';

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
                        {required: true, message: '请输入品牌名称', trigger: 'blur'},
                    ]
                },

            }
        },
        created() {
            this.brandQry();
        },
        computed: {
            listenBrandRefresh() {
                return this.$store.state.brandRefreshFlag;
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.brandQry();
            },
            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.brandQry();
            },
            // 刷新数据
            onRefresh() {
                this.brandQry();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 新增
            onAddNewTap() {
                this.expands = [];
                setTitle('/addBrand','新增品牌');
                this.$router.push('/addBrand');
            },
            // 排序
            onSortChange(options) {
                this.SortChangeId = options.prop;
                this.SortChangeOrder = options.order;
                this.brandQry();
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
                if (this.expands.indexOf(row.BrandId) < 0) {
                    this.expands.push(row.BrandId);
                } else {
                    this.expands.remove(row.BrandId);
                }
            },
            // 修改
            onEditTap(row) {
                this.expands = [];
                setTitle('/addBrand','修改品牌');
                this.$router.push({path: '/addBrand', query: row});
            },
            // 删除用户
            onDeleteTap(BrandId) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.brandDel(1, BrandId);
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
                    this.brandDel(2);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //3.2.3	查询供货商
            brandQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.brandQry.url + '/' + cfg.service.brandQry.action;
                send.TxnId = cfg.service.brandQry.txnId;
                send.CustQryNum = this.limitNum.toString();
                send.CurPage = this.CurPage.toString();
                send.OrderBy = this.OrderBy;
                send.OrderFlag = this.OrderFlag;

                if (this.SortChangeId) {
                    if (this.SortChangeId === 'BrandId') {
                        send.OrderBy = '1';
                    } else if (this.SortChangeId === 'Name') {
                        send.OrderBy = '2';
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
                        if(res.Brand) {
                            res.Brand.forEach(item => {
                                item.OperDate = item.OperDate.replace(/-/g, " ");
                                if(!item.OperUserName) {
                                    item.OperUserName = item.OperUserMobile;
                                }
                            });
                        }
                        that.tableDateArray = res.Brand;
                        that.AllCount = parseInt(res.AllCount);
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            //3.2.10	删除品牌 
            brandDel(flag, BrandId) {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.brandDel.url + '/' + cfg.service.brandDel.action;
                send.TxnId = cfg.service.brandDel.txnId;
                let Brand = [];
                if (flag === 1) {
                    send.BrandId = BrandId;
                    let BrandInfo = {
                        BrandId: BrandId
                    };
                    Brand.push(BrandInfo)
                } else {
                    this.multipleSelection.forEach(item => {
                        let BrandInfo = {
                            BrandId: item.BrandId
                        };
                        Brand.push(BrandInfo)
                    })
                }
                send.Count = Brand.length.toString();
                send.Brand = Brand;
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
                        that.brandQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
        },
        watch: {
            listenBrandRefresh: function (newVal, oldVal) {
                if (!newVal) {
                    return true;
                }
                this.brandQry();
                this.$store.commit('brandRefreshF');
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
