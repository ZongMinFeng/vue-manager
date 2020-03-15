<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="success" icon="el-icon-plus" @click="onAddNewTap">新增</el-button>
                <!--<el-button type="danger" @click="onDelBatchTap">批量删除</el-button>-->
                <el-button type="primary" icon="el-icon-refresh" @click="onRefresh" class="search-btn">刷新</el-button>
            </div>

            <div>
                <div class="drag-div-head">
                    <el-row>
                        <el-col :span="2" class="drag-col">
                            <b class="drag-div-head-sapn">序号</b>
                        </el-col>
                        <el-col :span="18" class="drag-col" >
                            <b class="drag-div-head-sapn">分类名称</b>
                        </el-col>
                        <el-col :span="4" class="drag-col">
                            <b class="drag-div-head-sapn">操作</b>
                        </el-col>
                    </el-row>
                </div>
                <draggable v-model="tableDateArray" :move="onMove">
                    <transition-group>
                        <div v-for="(item, index) in tableDateArray" :key="index" class="drag-div">
                            <el-row :class="{item:isSecond(index)}">
                                <el-col :span="2" class="drag-col">
                                    <div class="grid-content bg-purple">
                                        <span>{{index+1}}</span>
                                    </div>
                                </el-col>
                                <el-col :span="18" class="drag-col">
                                    <div class="grid-content bg-purple">
                                        <span>{{item.name}}</span>
                                    </div>
                                </el-col>
                                <el-col :span="4" class="drag-col">
                                    <div class="grid-content bg-purple-light">
                                        <el-button type="warning" size="small" plain @click="onEditTap(item)">修改</el-button>
                                        <el-button type="primary" size="small" plain style="margin-left: 10px" @click="onParamTap(item)">规格</el-button>
                                        <el-button type="danger" size="small" plain style="margin-left: 10px" @click="onDeleteTap(item.categoryId)">删除</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </transition-group>
                </draggable>
            </div>

            <el-dialog
                    :title="title[titleStatus]"
                    :visible.sync="addFlag"
                    v-dialogDrag
                    style="width:1000px;margin: 0 auto">
                <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="分类名称" prop="UserName">
                        <el-input maxlength="6" placeholder="请输入分类名称" v-model="addForm.Name"></el-input>
                    </el-form-item>
                    <el-form-item class="form-bot">
                        <el-button style="margin-right:5px" @click="addFlag = false">取 消</el-button>
                        <el-button type="primary" @click="addConfirmTap('addForm')">确 定</el-button>
                    </el-form-item>
                </el-form>

            </el-dialog>

            <el-dialog
                    :title="paramName + ' 规格'"
                    :visible.sync="paramFlag"
                    style="width:1000px;margin: 0 auto">
                <div>
                    <div>
                        <div v-for="(item, i) in paramData">
                            <el-row class="param-list">
                                <el-col :span="8">
                                </el-col>
                                <el-col :span="4">
                                    <h4>分组{{i+1}}</h4>
                                </el-col>
                                <el-col :span="9">
                                    <el-input v-model="item.group" placeholder="分组名"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    <el-button type="danger" style="margin-left: 10px;" @click="delParamTap(i)">删除分组</el-button>
                                </el-col>
                                <el-col :span="7">
                                </el-col>
                            </el-row>
                            <div v-for="(item1, j) in item.params">
                                <el-row class="param-list">
                                    <el-col :span="3">
                                        参数{{j+1}}
                                    </el-col>
                                    <el-col :span="15">
                                        <el-input v-model="item1.name" placeholder="请输入参数名称"></el-input>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button v-if="j>1 || item.params.length > 1" type="danger" class="param-add"
                                                   @click="delParamItemTap(i,j)">删除参数
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-row class="param-list">
                                <el-col :span="12">
                                    <el-button type="primary" class="param-add" @click="addParamItemTap(i)">添加参数</el-button>
                                </el-col>
                            </el-row>
                            <div class="line"></div>
                        </div>
                    </div>
                    <div class="param-top">
                        <el-button type="warning" @click="addParamTap">添加分组</el-button>
                        <el-button type="success" @click="saveParamTap">保存</el-button>
                    </div>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import {sendServer} from '../../../util/common';
    import {getCateParamByCateId} from '../../../util/module';
    import cfg from '../../../config/cfg';
    import draggable from "vuedraggable";

    export default {
        data() {
            return {
                SortChangeId: null,
                SortChangeOrder: null,
                categoryParamId: null,
                tableDateArray: [],
                multipleSelection: [],
                CurPage: 1,   // 设置加载的第几次，默认是第一次
                limitNum: 10,        // 返回数据的个数
                AllCount: 0,    // 总条数
                addFlag: false,
                paramFlag: false,
                title: ['新增商品分类', '修改商品分类'],
                titleStatus: 0,
                Id: '',
                paramName: '',
                addForm: {
                    Id: '',
                    Name: '',
                    sortOrder:1
                },
                rules: {
                    Name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                    ]
                },
                paramData: [],
                paramOperFlag: '1',
                search: '',
                sortOrderTypeArray:[{sortOrder:1},{sortOrder:2},{sortOrder:3},{sortOrder:4},{sortOrder:5},{sortOrder:6},
                    {sortOrder:7},{sortOrder:8},{sortOrder:9},{sortOrder:10},{sortOrder:11},{sortOrder:12},{sortOrder:13},
                    {sortOrder:14},{sortOrder:15},{sortOrder:16},{sortOrder:17},{sortOrder:18},{sortOrder:19},{sortOrder:20},],
                timeoutId:0
            }
        },
        created() {
            this.typeQry();
        },
        components:{draggable},
        methods: {
            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.typeQry();
            },
            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.typeQry();
            },
            // 刷新数据
            onRefresh() {
                this.typeQry();
            },
            // 排序
            onSortChange(options) {
                this.SortChangeId = options.prop;
                this.SortChangeOrder = options.order;
                this.supplierQry();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 初始化addForm
            initAddForm() {
                this.addForm = {
                    Id: '',
                    Name: '',
                    sortOrder:this.tableDateArray.length+1
                };
            },
            // 用户新增
            onAddNewTap() {
                this.titleStatus = 0;
                // 初始化数据
                this.initAddForm();
                let that = this;
                that.addFlag = true;
            },
            // 新增确认
            addConfirmTap(addForm) {
                let that = this;
                this.$refs[addForm].validate((valid) => {
                    if (valid) {
                        if (that.titleStatus === 0) {
                            that.typeAdd();

                        } else {
                            that.typeUpt();
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 添加分组
            addParamTap() {
                let paramDataInfo = {
                    group: "",
                    params: [{
                        name: ''
                    }]
                };
                this.paramData.push(paramDataInfo);
            },
            // 添加分组参数
            addParamItemTap(i) {
                let paramsInfo = {
                    name: ''
                };
                this.paramData[i].params.push(paramsInfo);
            },
            // 删除规格
            delParamTap(i) {
                this.paramData.splice(i, 1);
            },
            // 删除分组参数
            delParamItemTap(i, j) {
                this.paramData[i].params.splice(j, 1);
            },
            saveParamTap() {
                // this.paramData.forEach(item => {
                //     if(!item.group) {
                //
                //     }
                // })
                let that = this;
                if (!this.paramData.every(item => {
                        if (!item.group) {
                            that.$message.error('分组名称不能为空');
                            return false;
                        }
                        if (!item.params.every(item1 => {
                                return !!item1.name
                            })) {
                            that.$message.error('參數名称不能为空');
                            return false;
                        }
                        return true;
                    })) {
                    return false;
                }
                this.saveCateParam();
            },

            // 修改角色
            onEditTap(row) {
                this.titleStatus = 1;
                // 初始化数据
                this.Id = row.categoryId;
                let that = this;
                that.addForm = {
                    Id: row.categoryId,
                    Name: row.name,
                    sortOrder:row.sortOrder
                };
                that.addFlag = true;
            },
            // 规格
            onParamTap(row) {
                this.paramName = row.name;
                this.Id = row.categoryId;
                let that = this;

                getCateParamByCateId(this, row.categoryId).then(
                    (res) => {
                        if (!res.data) {
                            that.paramData = [];
                            that.paramOperFlag = '1';
                            that.categoryParamId = null;
                        } else {
                            that.paramOperFlag = '2';
                            that.categoryParamId = res.data.categoryParamId;
                            if(res.data.paramData) {
                                that.paramData = JSON.parse(res.data.paramData);
                            }
                        }
                        that.paramFlag = true;
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
                    this.typeDel(1, Id);
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
                    this.typeDel(2);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //3.2.11	查询商品分类
            typeQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.getMallCategory.url + '/' + cfg.service.getMallCategory.action;
                // urlParams.url += '?page=' + this.CurPage + '&pageSize=' + this.limitNum;
                urlParams.txnId = cfg.service.getMallCategory.txnId;
                // send.OrderBy = this.OrderBy;
                // send.OrderFlag = this.OrderFlag;
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
                        that.tableDateArray = res.data;
                        that.AllCount = res.data.length;
                        that.$store.commit('setGoodsTypeArray', res.data);
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            typeAdd() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.saveMallCategory.url + '/' + cfg.service.saveMallCategory.action;
                urlParams.txnId = cfg.service.saveMallCategory.txnId;

                send.name = this.addForm.Name;
                send.categoryPid = '99';
                send.sortOrder=this.addForm.sortOrder;

                urlParams.header = {
                    operFlag: '1'
                };

                urlParams.signArray = {
                    categoryPid: '99',
                    sortOrder:this.addForm.sortOrder
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
                        that.addFlag = false;
                        that.typeQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            typeUpt() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.saveMallCategory.url + '/' + cfg.service.saveMallCategory.action;
                urlParams.txnId = cfg.service.saveMallCategory.txnId;

                send.name = this.addForm.Name;
                send.categoryPid = '99';
                send.sortOrder = 1;
                send.categoryId = this.addForm.Id;
                send.sortOrder=this.addForm.sortOrder;

                urlParams.header = {
                    operFlag: '2'
                };

                urlParams.signArray = {
                    categoryPid: '99',
                    sortOrder: '1',
                    categoryId: this.addForm.Id,
                    sortOrder:this.addForm.sortOrder
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
                        that.$message.success("修改成功");
                        that.addFlag = false;
                        that.typeQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            //3.1.13	角色删除
            typeDel(flag, Id) {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.delMallCategory.url + '/' + cfg.service.delMallCategory.action;
                urlParams.txnId = cfg.service.delMallCategory.txnId;
                let GoodsType = [];
                send.categoryId = Id;
                urlParams.signArray = {
                    categoryId: Id
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
                        that.typeQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            saveCateParam() {
                let urlParams = {};
                let send = {};

                urlParams.url = cfg.service.project + cfg.service.saveCateParam.url + '/' + cfg.service.saveCateParam.action;
                urlParams.txnId = cfg.service.saveCateParam.txnId;

                send.categoryId = this.Id;
                send.categoryPid = '99';

                send.paramData = JSON.stringify(this.paramData);
                urlParams.signArray = {
                    categoryId: this.Id
                };
                urlParams.header = {
                    operFlag: this.paramOperFlag
                };
                if(this.categoryParamId) {
                    send.categoryParamId = this.categoryParamId;
                    urlParams.signArray.categoryParamId = this.categoryParamId;
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
                        that.paramFlag = false;
                        that.$message.success("保存成功");
                        // that.typeQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            //是否是第二行
            isSecond(index){
                if(index%2===1){
                    return true;
                }else{
                    return false;
                }
            },

            //重新排列商品分类
            onMove(){
                if(this.timeoutId!==0){
                    clearTimeout(this.timeoutId);
                }
                this.timeoutId=setTimeout(() => {
                    //更新商品分类序号
                    this.changeOrder();
                    this.timeoutId=0;
                }, 3000);
            },

            //更新商品分类序号
            changeOrder(){
                // console.log("商品分类信息", this.tableDateArray);//debug
                this.tableDateArray.forEach((val, index)=>{
                    // console.log("val.sortOrder", val.sortOrder);//debug
                    // console.log("index", index+1);//debug
                    // console.log("------------------------");//debug
                    if(val.sortOrder!==index+1){
                        this.typeUptIndex(val, index+1);
                    }
                });
            },

            typeUptIndex(val, order) {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.saveMallCategory.url + '/' + cfg.service.saveMallCategory.action;
                urlParams.txnId = cfg.service.saveMallCategory.txnId;

                send.name = val.name;
                send.categoryPid = '99';
                send.categoryId = val.categoryId;
                send.sortOrder=order;

                urlParams.header = {
                    operFlag: '2'
                };

                urlParams.signArray = {
                    categoryPid: '99',
                    categoryId: val.categoryId,
                    sortOrder:order
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
                        // that.$message.success("修改成功");
                        this.tableDateArray[order-1].sortOrder=order;
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

    .form-bot {
        text-align: right;
    }

    .param-list {
        padding: 10px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .param-add {
        margin-left: 10px;
    }

    .param-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 10px;
    }

    .line{
        border: 1px solid #464847;
        height: 0px;
        background: #464847;
    }

    .grid-content {
        min-height: 36px;
    }

    .bg-purple {
        vertical-align: middle;
     }

    .bg-purple>span {
        margin-top: 6px;
        margin-left: 5px;
        vertical-align: middle;
        display:inline-block;
    }

    .bg-purple-light {
    }

    .bg-purple-light>button {
        margin-top: 2px;
        margin-left: 5px;
    }

    .drag-div{
        border: 1px solid #EBEEF5;
    }

    .drag-div-head{
        border: 1px solid #EBEEF5;
        /*height: 34px;*/
    }

    .drag-div-head-sapn{
        margin-top: 10px;
        margin-left: 2px;
    }

    .item{
        background-color: #FAFAFA;
    }

    .drag-col{
        border: 1px solid #EBEEF5;
    }
</style>
