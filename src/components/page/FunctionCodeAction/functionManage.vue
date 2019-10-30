<template>
    <div class="table">
        <!--<div class="crumbs">-->
        <!--<el-breadcrumb separator="/">-->
        <!--<el-breadcrumb-item><i class="el-icon-tickets"></i>角色管理</el-breadcrumb-item>-->
        <!--</el-breadcrumb>-->
        <!--</div>-->

        <div class="container">
            <div class="handle-box">
                <el-button type="success" icon="el-icon-plus" @click="onAddFunction">新增</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="onRefresh" class="search-btn">刷新</el-button>
            </div>
            <table-tree
                :columns="columns"
                @deleteBtn="onDeleteFunction"
                @editBtn="onEditFunction"
                @addBtn="onAddSubFunction"
                @uptStatusBtn="onUptStatus"
                :tree-structure="true"
                :data-source="menuData">
            </table-tree>
            <el-dialog
                :title="title[titleStatus]"
                :visible.sync="addFunctionFlag"
                style="width:1000px;margin: 0 auto">
                <el-form :model="functionForm" :rules="rules" ref="functionForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="权限Id" prop="FuncId">
                        <el-input :disabled="titleStatus===0?false:true" placeholder="请输入权限Id，不可重复" maxlength="20"
                                  v-model="functionForm.FuncId"></el-input>
                    </el-form-item>
                    <el-form-item label="父权限Id" prop="FuncParentId">
                        <el-input maxlength="20" placeholder="请输入父权限Id，顶级权限输入：'99'" v-model="functionForm.FuncParentId"></el-input>
                    </el-form-item>
                    <el-form-item label="权限名" prop="FuncName">
                        <el-input maxlength="50" placeholder="请输入权限名称" v-model="functionForm.FuncName"></el-input>
                    </el-form-item>
                    <el-form-item label="权限描述" prop="FuncDesc">
                        <el-input maxlength="100" placeholder="请输入权限描述" type="textarea" v-model="functionForm.FuncDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="权限状态" prop="FuncStatus">
                        <el-select v-model="functionForm.FuncStatus" placeholder="权限状态">
                            <el-option label="开启" value="1"></el-option>
                            <el-option label="关闭" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="form-bot">
                        <el-button @click="addFunctionFlag = false">取 消</el-button>
                        <el-button type="primary" @click="addFunctionConfirm('functionForm')">确 定</el-button>
                    </el-form-item>
                </el-form>

            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {sendServer} from '../../../util/common';
    import {listToTree} from '../../../util/pub';
    import cfg from '../../../config/cfg';
    import tableTree from './../tree/tableTree'

    export default {
        data() {
            return {
                columns: [
                    {
                        text: '名称',
                        dataIndex: 'Name'
                    },
                    {
                        text: 'ID',
                        dataIndex: 'Id'
                    },
                    {
                        text: '父ID',
                        dataIndex: 'ParentId'
                    },
                    {
                        text: '描述',
                        dataIndex: 'Desc'
                    },
                    {
                        text: '状态',
                        dataIndex: 'Status'
                    }
                ],
                menuData: [],
                addFunctionFlag: false,
                title: ['新增权限', '修改权限'],
                titleStatus: 0,
                functionForm: {
                    FuncId: '',
                    FuncParentId: '99',
                    FuncName: '',
                    FuncDesc: '',
                    FuncStatus: '1'
                },
                rules: {
                    FuncId: [
                        {required: true, message: '请输入权限Id', trigger: 'blur'},
                    ],
                    FuncParentId: [
                        {required: true, message: "请输入父权限Id，顶级权限输入：'99'", trigger: 'blur'}
                    ],
                    FuncName: [
                        {required: true, message: "请输入权限名", trigger: 'blur'}
                    ],
                    FuncStatus: [
                        {required: true, message: "请选择权限状态", trigger: 'change'}
                    ]
                },
            }
        },
        created() {
            this.functionsQry();
        },
        computed: {},
        components: {
            tableTree
        },
        methods: {
            onDeleteFunction(FuncId) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.funcCodeDel(FuncId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            onUptStatus(FuncId, Status) {
                this.initFunctionForm();
                let text = '将状态改为开启, 是否继续?';
                this.functionForm.FuncParentId = '';
                this.functionForm.FuncId = FuncId;
                if (Status === '1') {
                    text = '将状态改为关闭, 是否继续?';
                    this.functionForm.FuncStatus = '2'
                }

                this.$confirm(text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.funcCodeUpt();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    })
                })
            },
            //初始化新增数据
            initFunctionForm() {
                this.functionForm = {
                    FuncId: '',
                    FuncParentId: '99',
                    FuncName: '',
                    FuncDesc: '',
                    FuncStatus: '1'
                }
            },
            // 新增权限确认
            addFunctionConfirm(functionForm) {
                this.$refs[functionForm].validate((valid) => {
                    if (valid) {
                        if (this.titleStatus === 0) {
                            this.funcCodeAdd();
                        } else {
                            this.funcCodeUpt();
                        }
                    } else {
                        // console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 新增根权限
            onAddFunction(FuncParentId) {
                this.titleStatus = 0;
                // 初始化数据
                this.initFunctionForm();
                this.addFunctionFlag = true;
            },
            // 新增根权限
            onAddSubFunction(FuncParentId) {
                if(!FuncParentId) {
                    return false;
                }
                this.titleStatus = 0;
                // 初始化数据
                this.initFunctionForm();
                // if (FuncParentId) {
                this.functionForm.FuncParentId = FuncParentId;
                // }
                this.addFunctionFlag = true;
            },
            onEditFunction(row) {
                this.titleStatus = 1;
                this.functionForm = {
                    FuncId: row.Id,
                    FuncParentId: row.ParentId,
                    FuncName: row.Name,
                    FuncDesc: row.Desc,
                    FuncStatus: row.Status
                };
                this.addFunctionFlag = true;
            },
            // 刷新数据
            onRefresh() {
                this.functionsQry();
            },
            //3.1.4	 功能列表查询
            functionsQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.functionsQry.url + '/' + cfg.service.functionsQry.action;
                send.TxnId = cfg.service.functionsQry.txnId;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            this.$message.error(res.RespDesc);
                            return false;
                        }
                        let list = res.Function;
                        let tree = listToTree("Id", "ParentId", list);
                        that.menuData = tree;
                    }, (res) => {
                        // 失败
                        this.$message.error('请求失败');
                    }
                );
            },
            // 3.1.7	 功能点新增
            funcCodeAdd() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.funcCodeAdd.url + '/' + cfg.service.funcCodeAdd.action;
                send.TxnId = cfg.service.funcCodeAdd.txnId;
                send.FuncId = this.functionForm.FuncId;
                send.FuncParentId = this.functionForm.FuncParentId;
                send.FuncName = this.functionForm.FuncName;
                if (this.functionForm.FuncDesc) {
                    send.FuncDesc = this.functionForm.FuncDesc;
                }
                send.FuncStatus = this.functionForm.FuncStatus;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            this.$message.error(res.RespDesc);
                            return false;
                        }
                        this.$message({
                            type: 'success',
                            message: '新增成功!'
                        });
                        that.addFunctionFlag = false;
                        that.initFunctionForm();
                        that.functionsQry();
                    }, (res) => {
                        // 失败
                        this.$message.error('请求失败');
                    }
                );
            },
            // 3.1.6	 功能点修改
            funcCodeUpt() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.funcCodeUpt.url + '/' + cfg.service.funcCodeUpt.action;
                send.TxnId = cfg.service.funcCodeUpt.txnId;
                send.FuncId = this.functionForm.FuncId;
                if (this.functionForm.FuncParentId) {
                    send.FuncParentId = this.functionForm.FuncParentId;
                }
                if (this.functionForm.FuncName) {
                    send.FuncName = this.functionForm.FuncName;
                }
                if (this.functionForm.FuncDesc) {
                    send.FuncDesc = this.functionForm.FuncDesc;
                }
                send.FuncStatus = this.functionForm.FuncStatus;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            this.$message.error(res.RespDesc);
                            return false;
                        }
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        that.addFunctionFlag = false;
                        that.initFunctionForm();
                        that.functionsQry();
                    }, (res) => {
                        // 失败
                        this.$message.error('请求失败');
                    }
                );
            },
            // 3.1.8	 功能点删除
            funcCodeDel(FuncId) {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.funcCodeDel.url + '/' + cfg.service.funcCodeDel.action;
                send.TxnId = cfg.service.funcCodeDel.txnId;
                send.FuncId = FuncId;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            this.$message.error(res.RespDesc);
                            return false;
                        }
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        that.functionsQry();
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

    .form-bot {
        text-align: right;
    }
</style>
