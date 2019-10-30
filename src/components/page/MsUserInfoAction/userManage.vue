<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="success" icon="el-icon-plus" @click="onAddUser">新增</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="onRefresh" class="search-btn">刷新</el-button>
            </div>
            <el-table :data="tableDateArray"
                      size="medium"
                      class="table"
                      stripe
                      border
                      ref="multipleTable">
                <el-table-column prop="UserId" label="用户ID" width="110"></el-table-column>
                <el-table-column prop="UserMobile" label="手机号" width="110"></el-table-column>
                <el-table-column prop="Name" label="姓名"></el-table-column>
                <el-table-column prop="CreateDate" label="创建时间"></el-table-column>
                <el-table-column prop="ModifyDate" label="修改时间"></el-table-column>
                <el-table-column prop="ModifyUser" label="修改人"></el-table-column>
                <el-table-column prop="Status" label="状态" width="70">

                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.Status === '1'" type="success"
                                disable-transitions>正常
                        </el-tag>
                        <el-tag v-else-if="scope.row.Status === '2'" type="warning"
                                disable-transitions>注销
                        </el-tag>
                        <el-tag v-else type="danger"
                                disable-transitions>停用
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="props">
                        <el-button type="primary" size="small" plain @click="onUserDetail(props.row.UserId)">详情
                        </el-button>
                        <el-button type="warning" size="small" plain @click="onUserEdit(props.row)">修改</el-button>
                        <el-button type="danger" size="small" plain @click="onUserDelete(props.row.UserId)">删除
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
            <el-dialog
                :title="title[titleStatus]"
                :visible.sync="addUserFlag"
                style="width:1000px;margin: 0 auto">
                <el-form :model="userAddForm" :rules="rules" ref="userAddForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="手机号" prop="UserMobile">
                        <el-input maxlength="11" placeholder="请输入已注册过的手机号" v-model="userAddForm.UserMobile">
                            <el-button slot="append" icon="el-icon-search" @click="onMobileQry"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="UserName">
                        <el-input maxlength="100" placeholder="请输入姓名" v-model="userAddForm.UserName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-checkbox-group v-model="checkList" class="role-list" size="medium">
                            <el-checkbox-button v-for="column in rolesData" :label="column.Id" :key="column.Id"
                                                class="role-list-row">{{column.Name}}
                            </el-checkbox-button>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item class="form-bot">
                        <el-button @click="addUserFlag = false">取 消</el-button>
                        <el-button type="primary" @click="addUserConfirm('userAddForm')">确 定</el-button>
                    </el-form-item>
                </el-form>

            </el-dialog>
            <el-dialog
                title="用户详情"
                :visible.sync="userDetailFlag"
                style="width:1000px;margin: 0 auto">
                <el-row>
                    <el-col :span="12">手机号：</el-col>
                    <el-col :span="12">{{userAddForm.UserMobile}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">姓名：</el-col>
                    <el-col :span="12">{{userAddForm.UserName}}</el-col>
                </el-row>
                <div class="role-text">角色：</div>
                <el-table :data="rolesData"
                          size="medium"
                          stripe
                          :show-header=false
                          ref="multipleTable">
                    <el-table-column prop="Name" label="角色名称"></el-table-column>
                </el-table>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import {sendServer} from '../../../util/common';
    import cfg from '../../../config/cfg';

    export default {
        data() {
            return {
                tableDateArray: [],
                CurPage: 1,   // 设置加载的第几次，默认是第一次
                limitNum: 10,        // 返回数据的个数
                AllCount: 0,    // 总条数
                addUserFlag: false,
                userDetailFlag: false,
                title: ['新增用户', '修改用户'],
                titleStatus: 0,
                UserId: '',
                functionChecked: [],
                checkList: [],
                userAddForm: {
                    UserMobile: '',
                    UserName: ''
                },
                rules: {
                    UserMobile: [
                        {required: true, message: '请输入11位手机号', trigger: 'blur'},
                        {len: 11, message: '请输入11位手机号', trigger: 'blur'},
                    ],
                    UserName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                    ]
                },
                functionData: [],
                rolesData: [],
                functionDetailArray: [],
                defaultProps: {
                    children: 'menuBeans',
                    label: 'Name'
                }

            }
        },
        created() {
            this.usersMngQry();
        },
        computed: {},
        methods: {
            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.usersMngQry();
            },
            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.usersMngQry();
            },
            // 刷新数据
            onRefresh() {
                this.usersMngQry();
            },
            // 初始化userAddForm
            initUserAddForm() {
                this.userAddForm = {
                    RoleName: '',
                    RoleDesc: ''
                };
                this.checkList = [];
            },
            // 用户新增
            onAddUser() {
                this.titleStatus = 0;
                // 初始化数据
                this.initUserAddForm();
                let that = this;
                this.rolesMngQry().then(
                    (res) => {
                        that.rolesData = res.Roles || [];
                        console.log("that.rolesData:", that.rolesData)
                        that.addUserFlag = true;
                    }, () => {

                    });

            },
            // 新增用户确认
            addUserConfirm(userAddForm) {
                let that = this;
                this.$refs[userAddForm].validate((valid) => {
                    if (valid) {
                        if (that.titleStatus === 0) {
                            that.userMngAdd();

                        } else {
                            that.userMngUpt();
                        }
                    } else {
                        return false;
                    }
                });
            },
            onMobileQry() {
                // this.userMngQry();
            },

            // 查看详情
            onUserDetail(UserId) {
                // 用户查询
                let that = this;
                this.userMngQry(UserId).then(
                    (res) => {
                        that.userAddForm = {
                            UserMobile: res.SpcifyMobile,
                            UserName: res.UserName
                        };
                        // that.userAddForm = {
                        //     RoleName: res.RoleName,
                        //     RoleDesc: res.RoleDesc || '',
                        //     Function: []
                        // };
                        that.rolesData = res.Roles || [];
                        that.userDetailFlag = true;
                    }, () => {
                    }
                );
            },
            // 修改角色
            onUserEdit(row) {
                this.titleStatus = 1;
                // 初始化数据
                this.UserId = row.UserId;
                let that = this;
                this.userMngQry(row.UserId).then(
                    (res) => {
                        that.userAddForm = {
                            UserMobile: res.SpcifyMobile,
                            UserName: res.UserName
                        };
                        // let tree = listToTree("Id", "ParentId", res.Function);
                        // that.functionDetailArray = tree;
                        // that.userAddForm = {
                        //     RoleName: res.RoleName,
                        //     RoleDesc: res.RoleDesc || '',
                        //     Function: []
                        // };
                        that.checkList = [];
                        res.Roles.forEach(item => {
                            that.checkList.push(item.Id)
                        });
                        this.rolesMngQry().then(
                            (res1) => {
                                that.rolesData = res1.Roles || [];
                                that.addUserFlag = true;
                            }, () => {

                            });
                    }, () => {
                    }
                );
            },
            // 删除用户
            onUserDelete(Id) {
                this.$message.error('功能未实现');
                return true;
                // this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'error'
                // }).then(() => {
                //     this.roleMngDel(Id);
                // }).catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '已取消删除'
                //     })
                // })
            },
            //3.1.9	 角色列表查询
            usersMngQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.usersMngQry.url + '/' + cfg.service.usersMngQry.action;
                send.TxnId = cfg.service.usersMngQry.txnId;
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
                        res.Users.forEach(item=> {
                            item.CreateDate = item.CreateDate.replace(/-/g, " ");
                            item.ModifyDate = item.ModifyDate.replace(/-/g, " ");
                        });
                        that.tableDateArray = res.Users;
                        that.AllCount = parseInt(res.AllCount);
                        console.log("res:", res)
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            //角色列表查询
            rolesMngQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.rolesMngQry.url + '/' + cfg.service.rolesMngQry.action;
                send.TxnId = cfg.service.rolesMngQry.txnId;
                send.CurPage = '1';
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
                            resolve(res)
                        }, (res) => {
                            // 失败
                            that.$message.error('请求失败');
                            reject(false);
                        }
                    );
                })
            },
            // 3.1.15	用户查询
            userMngQry(userId) {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.userMngQry.url + '/' + cfg.service.userMngQry.action;
                send.TxnId = cfg.service.userMngQry.txnId;

                send.SpcifyUserId = userId;

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
                            resolve(res)
                        }, (res) => {
                            // 失败
                            that.$message.error('请求失败');
                            reject(false);
                        }
                    );
                })
            },
            //3.1.16	用户新增
            userMngAdd() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.userMngAdd.url + '/' + cfg.service.userMngAdd.action;
                send.TxnId = cfg.service.userMngAdd.txnId;

                send.SpcifyMobile = this.userAddForm.UserMobile;
                send.UserName = this.userAddForm.UserName;
                send.RolesNum = '0';
                console.log("checkList:", this.checkList);
                let Roles = [];
                this.checkList.forEach(item => {
                    let role = {
                        Id: item
                    };
                    Roles.push(role);
                });
                send.Roles = Roles;
                send.RolesNum = Roles.length.toString();

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
                        that.addUserFlag = false;
                        that.usersMngQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            // 3.1.11	角色修改
            userMngUpt() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.userMngUpt.url + '/' + cfg.service.userMngUpt.action;
                send.TxnId = cfg.service.userMngUpt.txnId;

                send.SpcifyUserId = this.UserId;
                send.SpcifyMobile = this.userAddForm.UserMobile;
                send.UserName = this.userAddForm.UserName;
                send.RolesNum = '0';
                let Roles = [];
                this.checkList.forEach(item => {
                    let role = {
                        Id: item
                    };
                    Roles.push(role);
                });
                send.Roles = Roles;
                send.RolesNum = Roles.length.toString();
                console.log("send:", send)
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
                        that.addUserFlag = false;
                        that.usersMngQry();
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
                send.UserId = Id;
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
                        that.usersMngQry();
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

    .role-text {
        font-size: 20px;
        color: #000;
        padding: 10px 10px;
        margin: 10px 0;
        background-color: #f3f3f3;
    }

    .role-list {
    }

    .role-list-row {
        margin-top: 10px;
        border-radius: 0;
    }
</style>
