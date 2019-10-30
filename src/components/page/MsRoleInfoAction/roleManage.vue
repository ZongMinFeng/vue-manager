<template>
    <div class="table">

        <div class="container">
            <div class="handle-box">
                <el-button type="success" icon="el-icon-plus" @click="onAddRole">新增</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="onRefresh" class="search-btn">刷新</el-button>
            </div>
            <el-table :data="tableDateArray"
                      size="medium"
                      class="table"
                      stripe
                      border
                      ref="multipleTable">
                <el-table-column prop="Id" label="角色ID"></el-table-column>
                <el-table-column prop="Name" label="角色名"></el-table-column>
                <el-table-column prop="Desc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="props">
                        <el-button type="primary" size="small" plain @click="onRoleDetail(props.row.Id)">详情</el-button>
                        <el-button type="warning" size="small" plain @click="onRoleEdit(props.row)">修改</el-button>
                        <el-button type="danger" size="small" plain @click="onRoleDelete(props.row.Id)">删除</el-button>
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
            <el-dialog
                :title="title[titleStatus]"
                :visible.sync="addRoleFlag"
                style="width:1000px;margin: 0 auto">
                <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="RoleName">
                        <el-input maxlength="50" placeholder="请输入角色名称" v-model="roleForm.RoleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="RoleDesc">
                        <el-input type="textarea" placeholder="请输入角色描述" maxlength="100" v-model="roleForm.RoleDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="Function">
                        <el-tree
                            :data="functionData"
                            show-checkbox
                            node-key="Id"
                            :default-expanded-keys="['99']"
                            ref="tree"
                            :props="defaultProps">
                        </el-tree>
                    </el-form-item>
                    <el-form-item class="form-bot">
                        <el-button @click="addRoleFlag = false">取 消</el-button>
                        <el-button type="primary" @click="addRoleConfirm('roleForm')">确 定</el-button>
                    </el-form-item>
                </el-form>

            </el-dialog>
            <el-dialog
                title="角色详情"
                :visible.sync="roleDetailFlag"
                style="width:1000px;margin: 0 auto">
                <div class="role-name">{{roleForm.RoleName}}</div>
                <div class="role-desc">{{roleForm.RoleDesc}}</div>
                <div class="role-text">角色详情：</div>
                <el-tree
                :data="functionDetailArray"
                node-key="Id"
                default-expand-all
                :props="defaultProps">
                </el-tree>
                <!--<el-form :model="roleForm"  ref="roleDetailForm" label-width="100px"-->
                         <!--class="demo-ruleForm">-->
                    <!--<el-form-item label="角色名称" prop="RoleName">-->
                        <!--&lt;!&ndash;<el-input maxlength="50" v-model="roleForm.RoleName"></el-input>&ndash;&gt;-->
                        <!--<span>roleForm.RoleName</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="角色描述" prop="RoleDesc">-->
                        <!--<span>roleForm.RoleDesc</span>-->
                        <!--&lt;!&ndash;<el-input type="textarea" maxlength="100" v-model="roleForm.RoleDesc"></el-input>&ndash;&gt;-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="权限" prop="Function">-->
                        <!--<el-tree-->
                            <!--:data="functionData"-->
                            <!--node-key="Id"-->
                            <!--:default-expanded-keys="['99']"-->
                            <!--ref="tree"-->
                            <!--:props="defaultProps">-->
                        <!--</el-tree>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->

            </el-dialog>

        </div>
    </div>
</template>

<script>
    import {sendServer} from '../../../util/common';
    import cfg from '../../../config/cfg';
    import {listToTree, contains} from '../../../util/pub';

    export default {
        data() {
            return {
                tableDateArray: [],
                CurPage: 1,   // 设置加载的第几次，默认是第一次
                limitNum: 10,        // 返回数据的个数
                AllCount: 0,    // 总条数
                addRoleFlag: false,
                roleDetailFlag: false,
                title: ['新增角色', '修改角色'],
                titleStatus: 0,
                RoleId: '',
                functionChecked: [],
                roleForm: {
                    RoleName: '',
                    RoleDesc: '',
                    Function: [],
                },
                rules: {
                    RoleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                    ]
                },
                functionData: [],
                functionDetailArray:[],
                defaultProps: {
                    children: 'menuBeans',
                    label: 'Name'
                }

            }
        },
        created() {
            this.rolesMngQry();
        },
        computed: {},
        methods: {
            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.rolesMngQry();
            },
            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.rolesMngQry();
            },
            // 刷新数据
            onRefresh() {
                // this.$router.push({
                //     path: 'tabs'
                // })
                this.rolesMngQry();
            },
            // 初始化roleForm
            initRoleForm() {
                this.roleForm = {
                    RoleName: '',
                    RoleDesc: '',
                    Function: []
                };
            },
            // 角色新增
            onAddRole() {
                this.titleStatus = 0;
                // 初始化数据
                this.initRoleForm();
                let that = this;
                this.functionsQry().then(
                    () => {
                        that.addRoleFlag = true;
                        that.$nextTick(() => {
                            that.$refs.tree.setCheckedKeys([]);
                        })
                    }, () => {

                    });

            },
            // 新增角色确认
            addRoleConfirm(roleForm) {
                let that = this;
                this.$refs[roleForm].validate((valid) => {
                    if (valid) {
                        if (that.titleStatus === 0) {
                            that.roleMngAdd();

                        } else {
                            that.roleMngUpt();
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 查看详情
            onRoleDetail(Id) {
                // 角色查询
                let that = this;
                this.roleMngQry(Id).then(
                    (res) => {
                        let tree = listToTree("Id", "ParentId", res.Function);
                        that.functionDetailArray = tree;
                        that.roleForm = {
                            RoleName: res.RoleName,
                            RoleDesc: res.RoleDesc || '',
                            Function: []
                        };
                        that.roleDetailFlag = true;
                    }, () => {

                    }
                );


            },
            // 修改角色
            onRoleEdit(row) {
                this.titleStatus = 1;
                // 初始化数据
                this.RoleId = row.Id;

                let that = this;
                this.functionsQry().then(
                    (totFunction) => {
                        // 角色查询
                        that.roleMngQry(row.Id).then(
                            (res) => {
                                let checkFunction = [];
                                if (res.Function && res.Function.length > 0) {
                                    res.Function.forEach(item => {
                                        let checkFlag = true;
                                        for(let i=0;i<totFunction.length; i++) {
                                            if(totFunction[i].ParentId === item.Id) {
                                                checkFlag = false;
                                                break;
                                            }
                                        }
                                        if(checkFlag) {
                                            checkFunction.push(item.Id);
                                        }
                                    });
                                }
                                that.roleForm = {
                                    RoleName: res.RoleName,
                                    RoleDesc: res.RoleDesc || '',
                                    Function: []
                                };
                                that.addRoleFlag = true;
                                that.$nextTick(() => {
                                    that.$refs.tree.setCheckedKeys(checkFunction);
                                })

                            }, () => {

                            }
                        );

                    }, () => {

                    });
            },
            // 删除角色
            onRoleDelete(Id) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.roleMngDel(Id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //3.1.9	 角色列表查询
            rolesMngQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.rolesMngQry.url + '/' + cfg.service.rolesMngQry.action;
                send.TxnId = cfg.service.rolesMngQry.txnId;
                send.CustQryNum = this.limitNum.toString();
                send.CurPage = this.CurPage.toString();
                send.OrderBy = this.OrderBy;
                send.OrderFlag = this.OrderFlag;


                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            that.$message.error(res.RespDesc);
                            return false;
                        }
                        that.tableDateArray = res.Roles;
                        that.AllCount = parseInt(res.AllCount);

                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            //3.1.4	 功能列表查询
            functionsQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.functionsQry.url + '/' + cfg.service.functionsQry.action;
                send.TxnId = cfg.service.functionsQry.txnId;

                urlParams.send = send;
                let that = this;
                return new Promise((resolve, reject) => {
                    sendServer(urlParams, this).then(
                        (res) => {
                            // 成功
                            if (res.RespCode !== '0000') {
                                that.$message.error(res.RespDesc);
                                reject(false);
                                return false;
                            }
                            let list = res.Function;
                            let root = {
                                Id: '99',
                                Name: '全选'
                            };
                            list.push(root);
                            let tree = listToTree("Id", "ParentId", list);
                            that.functionData = tree;
                            resolve(list)
                        }, (res) => {
                            // 失败
                            that.$message.error('请求失败');
                            reject(false);
                        }
                    );
                })
            },
            //3.1.12	角色新增
            roleMngAdd() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.roleMngAdd.url + '/' + cfg.service.roleMngAdd.action;
                send.TxnId = cfg.service.roleMngAdd.txnId;
                // this.getCheckedKeys();
                // let functionChecked = this.functionChecked;
                let functionChecked = this.$refs.tree.getCheckedNodes();
                let Function = [];
                functionChecked.forEach(item => {
                    if(item.Id !=='99') {
                        let functionItem = {
                            Id: item.Id
                        };
                        Function.push(functionItem);
                    }

                });
                send.FunctionNum = '0';
                if (Function.length > 0) {
                    send.FunctionNum = Function.length.toString();
                    send.Function = Function;
                }
                send.RoleName = this.roleForm.RoleName;
                if (this.roleForm.RoleDesc) {
                    send.RoleDesc = this.roleForm.RoleDesc;
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
                        that.$message.success("新增成功");
                        that.addRoleFlag = false;
                        that.rolesMngQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            // 3.1.11	角色修改
            roleMngUpt() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.roleMngUpt.url + '/' + cfg.service.roleMngUpt.action;
                send.TxnId = cfg.service.roleMngUpt.txnId;
                let functionChecked = this.$refs.tree.getCheckedNodes();
                let Function = [];
                functionChecked.forEach(item => {
                    if(item.Id !=='99') {
                        let functionItem = {
                            Id: item.Id
                        };
                        Function.push(functionItem);
                    }

                });
                send.FunctionNum = '0';
                if (Function.length > 0) {
                    send.FunctionNum = Function.length.toString();
                    send.Function = Function;
                }
                send.RoleName = this.roleForm.RoleName;
                if (this.roleForm.RoleDesc) {
                    send.RoleDesc = this.roleForm.RoleDesc;
                }
                send.RoleId = this.RoleId;

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
                        that.addRoleFlag = false;
                        that.rolesMngQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            //3.1.13	角色删除
            roleMngDel(Id) {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.roleMngDel.url + '/' + cfg.service.roleMngDel.action;
                send.TxnId = cfg.service.roleMngDel.txnId;
                send.RoleId = Id;
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
                        that.rolesMngQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            //3.1.10	角色查询
            roleMngQry(Id) {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.roleMngQry.url + '/' + cfg.service.roleMngQry.action;
                send.TxnId = cfg.service.roleMngQry.txnId;
                send.RoleId = Id;

                urlParams.send = send;
                let that = this;
                return new Promise((resolve, reject) => {
                    sendServer(urlParams, this).then(
                        (res) => {
                            // 成功
                            if (res.RespCode !== '0000') {
                                that.$message.error(res.RespDesc);
                                reject(false);
                                return false;
                            }
                            // let list = res.Function;
                            // let tree = listToTree("Id", "ParentId", list);
                            // that.roleMngFunctionTree = tree;
                            // that.roleMng = res;
                            resolve(res)
                        }, (res) => {
                            // 失败
                            that.$message.error('请求失败');
                            reject(false);
                        }
                    );
                })
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

    .role-name {
        font-size: 30px;
        text-align: center;
    }
    .role-desc {
        text-align: center;
        margin-top: 10px;
    }
    .role-text {
        font-size: 20px;
        color: #000;
        padding: 10px 10px;
        margin: 10px 0;

        background-color: #f3f3f3;
        /*border-top: 2px solid #f3f3f3;*/
        /*border-bottom: 2px solid #f3f3f3;*/
    }
</style>
