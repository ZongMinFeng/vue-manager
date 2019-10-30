<template>
    <div class="container">
        <el-form :span="6" :model="AddForm" :rules="rules" ref="AddForm" label-width="100px"
                 size="mini"
                 class="demo-ruleForm">
            <el-form-item label="供货商名称" prop="Name">
                <el-col :sm="24" :md="12">
                    <el-input maxlength="50" placeholder="请输入供货商名称" v-model="AddForm.Name"></el-input>
                </el-col>

            </el-form-item>
            <el-form-item label="联系人" prop="Person">
                <el-col :sm="24" :md="12">
                    <el-input maxlength="30" placeholder="请输入联系人名称" v-model="AddForm.Person"></el-input>
                </el-col>

            </el-form-item>
            <el-form-item label="联系电话" prop="Mobile">
                <el-col :sm="24" :md="12">
                    <el-input maxlength="20" placeholder="请输入联系电话" v-model="AddForm.Mobile"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="联系地址" prop="Addr">
                <el-col :sm="24" :md="12">
                    <el-input maxlength="100" placeholder="请输入联系地址" v-model="AddForm.Addr"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="付款开户行" prop="PayBank">
                <el-col :sm="24" :md="12">
                    <el-input maxlength="40" placeholder="请输入付款开户行" v-model="AddForm.PayBank"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="付款账户" prop="PayAcc">
                <el-col :sm="24" :md="12">
                    <el-input maxlength="20" placeholder="请输入付款账户" v-model="AddForm.PayAcc"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="备注信息" prop="Memo">
                <el-col :sm="24" :md="12">
                    <el-input type="textarea" maxlength="200" placeholder="请输入备注信息" v-model="AddForm.Memo"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item v-if="AddForm.SuppId" label="状态" prop="Status">
                <el-col :sm="24" :md="12" class="status-col">
                    <!--<el-switch-->
                        <!--v-model="AddForm.Status"-->
                        <!--active-color="#13ce66"-->
                        <!--inactive-color="#ff4949">-->
                    <!--</el-switch>-->
                    <el-switch
                        style="display: block"
                        v-model="AddForm.Status"
                        active-value="1"
                        inactive-value="2"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="正常"
                        inactive-text="禁用">
                    </el-switch>
                </el-col>
            </el-form-item>

            <el-form-item class="form-bot">
                <el-button @click="$router.go(-1)">取 消</el-button>
                <el-button type="primary" @click="addConfirm('AddForm')">确 定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {sendServer} from '../../../util/common';
    import cfg from '../../../config/cfg';

    export default {

        data() {
            return {
                AddForm: {
                    SuppId: '',
                    Name: '',
                    Person: '',
                    Mobile: '',
                    Addr: '',
                    PayBank: '',
                    PayAcc: '',
                    Status: '',
                    Memo: ''
                },
                rules: {
                    Name: [
                        {required: true, message: '请输入供货商名称', trigger: 'blur'},
                    ]
                },
            }
        },
        methods: {
            addConfirm(AddForm) {
                // this.$store.commit('suppRefreshT');
                // this.$router.go(-1)
                if (this.AddForm.SuppId) {
                    this.supplierUpt();
                } else {
                    this.supplierAdd();
                }

                // window.close();
            },
            //3.2.4	新增供货商
            supplierAdd() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.supplierAdd.url + '/' + cfg.service.supplierAdd.action;
                send.TxnId = cfg.service.supplierAdd.txnId;

                send.Name = this.AddForm.Name;
                send.Person = this.AddForm.Person;
                send.Mobile = this.AddForm.Mobile;
                send.Addr = this.AddForm.Addr;
                send.PayBank = this.AddForm.PayBank;
                send.PayAcc = this.AddForm.PayAcc;
                send.Memo = this.AddForm.Memo;

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
                        that.$store.commit('suppRefreshT');
                        that.$router.go(-1)
                        // that.addFlag = false;
                        // that.supplierQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            // 3.2.5	修改供货商
            supplierUpt() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.supplierUpt.url + '/' + cfg.service.supplierUpt.action;
                send.TxnId = cfg.service.supplierUpt.txnId;

                send.SuppId = this.AddForm.SuppId;
                send.Name = this.AddForm.Name;
                send.Person = this.AddForm.Person;
                send.Mobile = this.AddForm.Mobile;
                send.Addr = this.AddForm.Addr;
                send.PayBank = this.AddForm.PayBank;
                send.PayAccount = this.AddForm.PayAcc;
                send.Status = this.AddForm.Status;
                send.Memo = this.AddForm.Memo;
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
                        that.$store.commit('suppRefreshT');
                        this.$router.go(-1)
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            initSupp() {
                let query = this.$route.query || {};
                if (query && query.SuppId) {
                    this.AddForm = {
                        SuppId: query.SuppId,
                        Name: query.Name,
                        Person: query.Person || '',
                        Mobile: query.Mobile || '',
                        Addr: query.Addr || '',
                        PayBank: query.PayBank || '',
                        PayAcc: query.PayAcc || '',
                        Status: query.Status || '',
                        Memo: query.Memo || ''
                    }
                } else {
                    this.AddForm = {
                        SuppId: '',
                        Name: '',
                        Person:  '',
                        Mobile: '',
                        Addr: '',
                        PayBank: '',
                        PayAcc: '',
                        Status: '',
                        Memo: ''
                    }
                }
            }
        },
        created() {
            this.initSupp()
        },
        watch: {
            $route(newValue, oldValue){
                if(newValue.path === "/addSupplier") {
                    this.initSupp()
                }
            }
        }
    }
</script>

<style scoped>
    .form-bot {
        text-align: right;
    }
    .status-col {
        margin-top: 5px;
    }
</style>
