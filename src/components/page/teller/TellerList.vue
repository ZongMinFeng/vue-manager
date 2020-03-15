<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="success" style="margin-bottom: 10px;" icon="el-icon-plus" :disabled='addDisabled'
                       @click="onAddNewTap">新增
            </el-button>
        </div>
        <el-table :data="tableData"
                  stripe
                  size='medium'
                  border>
            <el-table-column prop="userName" label="名称"></el-table-column>
            <el-table-column label="手机号">
                <template slot-scope="props">
                    {{argValueDisplay(props.row.userPhone)}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="props">
                    <div>
                        <el-button type="danger" @click="deleteTap(props.row.userId)" >删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="pageSize"
                           layout="total,sizes, prev, pager, next"
                           :total="AllCount">
            </el-pagination>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" >
            <el-form :model="dialogForm" label-width="80px" ref="dialogForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="手机号" prop="userPhone"
                                      :rules="[{required: true, message:'手机号不能为空', trigger:'blur'},
                                      {validator: checkUserPhone, trigger: 'blur'},]">
                            <el-input v-model="dialogForm.userPhone" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="名称" prop="userName"
                                      :rules="[{required: true, message:'名字不能为空', trigger:'blur'}]">
                            <el-input v-model="dialogForm.userName" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" type="dialog-footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="dialogFormConfirm">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="passwordTitle" :visible.sync="passwordVisible" >
            <el-card>
                {{passwordInfo.nickName}}<span>初始密码：</span>{{passwordInfo.randomKey}}
            </el-card>
        </el-dialog>
    </div>
</template>

<script>
    import GwRegular from '@/Gw/GwRegular.js';
    import {saveOper, getOper, delOperById} from '@/util/module.js';
    export default {
        name: "TellerList.vue",
        data() {
            return {
                tableData:[],
                flag:1,//1新增 2修改
                dialogVisible:false,
                dialogForm:{
                    userPhone:null,
                    userName:null,
                },
                addDisabled:false,
                page: 1,   // 设置加载的第几次，默认是第一次
                pageSize: 10,        // 返回数据的个数
                AllCount: 0,    // 总条数
                passwordTitle:'初始密码查看',
                passwordVisible:false,
                passwordInfo:{
                    nickName:null,
                    randomKey:null
                },
            };
        },

        computed:{
            dialogTitle(){
                if (this.flag === 1) {
                    return '新增';
                }else{
                    return '修改';
                }
            },
        },

        created(){
            this.initData();
        },

        methods:{
            initData() {
                let params={};
                params.page=this.page;
                params.pageSize=this.pageSize;
                getOper(this, params).then(
                    (res)=>{
                        // console.log("res", res);//debug
                        this.tableData=res.data.rows;
                        this.AllCount=res.data.records;
                    },
                    (res)=>{

                    }
                ).catch();
            },

            //值特殊化显示
            argValueDisplay(userPhone){
                let valueDisplay='';
                valueDisplay=userPhone.substring(0, 3)+'-'+userPhone.substring(3, 7)+'-'+userPhone.substring(7, 11);
                return valueDisplay;
            },

            onAddNewTap(){
              this.flag=1;
              this.dialogVisible=true;
            },

            checkUserPhone(rule, userPhone, callback){
                if (!GwRegular.phone.test(userPhone)) {
                    callback(new Error('请输入正确手机号'));
                }
                callback();
            },

            dialogFormConfirm(){
                this.$refs['dialogForm'].validate((valid)=>{
                    if(valid){
                        this.dialogFormCommit();
                    }else{
                        return false;
                    }
                });
            },

            dialogFormCommit(){
                let params={};
                params.userPhone=this.dialogForm.userPhone;
                params.userName=this.dialogForm.userName;
                saveOper(this, params).then(
                    (res)=>{
                        this.$message.success('新增成功！');
                        this.dialogVisible=false;
                        this.initData();
                        this.passwordInfo=res.data;
                        this.passwordVisible=true;
                    },
                    (res)=>{
                        if (res.msg !== null) {
                            this.$message.error(res.msg);
                        }else{
                            this.$message.error('新增失败！');
                        }
                    }
                ).catch();
            },

            // 分页导航
            handleCurrentChange(options) {
                this.page = options;
                this.initData();
            },

            // 每页条数改变
            handleSizeChange(options) {
                this.pageSize = options;
                this.initData();
            },

            deleteTap(id){
                this.$confirm('此操作将删除操作员，是否确认？', '删除操作员', {
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(
                    ()=>{
                        this.delete(id);
                    }
                ).catch();
            },

            delete(id) {
                let params={};
                params.specUserId=id;
                delOperById(this, params).then(
                    (res)=>{
                        this.$message.success('删除成功！');
                        //重置从第一页开始查询
                        this.page=1;
                        this.initData();
                    },
                    (res)=>{
                        if (res.msg !== null) {
                            this.$message.error(res.msg);
                        }else{
                            this.$message.error('删除失败！');
                        }
                    }
                ).catch();
            },
        }
    }
</script>

<style scoped>

</style>
