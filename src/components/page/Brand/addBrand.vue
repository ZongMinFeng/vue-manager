<template>
    <div class="container">
        <el-form :span="6" :model="AddForm" :rules="rules" ref="AddForm" label-width="100px"
                 size="mini"
                 class="demo-ruleForm">
            <el-form-item label="品牌名称" prop="Name">
                <el-col :sm="24" :md="12">
                    <el-input maxlength="50" placeholder="请输入品牌名称" v-model="AddForm.Name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="备注信息" prop="Memo">
                <el-col :sm="24" :md="12">
                    <el-input type="textarea" maxlength="200" placeholder="请输入备注信息" v-model="AddForm.Memo"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item class="form-bot">
                <el-button @click="$router.go(-1)">取 消</el-button>
                <el-button type="primary" @click="addConfirm()">确 定</el-button>
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
                    BrandId: '',
                    Name: '',
                    Memo: ''
                },
                rules: {
                    Name: [
                        {required: true, message: '请输入品牌名称', trigger: 'blur'},
                    ]
                },
            }
        },
        methods: {
            addConfirm() {
                if (this.AddForm.BrandId) {
                    this.brandUpt();
                } else {
                    this.brandAdd();
                }
            },
            //新增品牌
            brandAdd() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.brandAdd.url + '/' + cfg.service.brandAdd.action;
                send.TxnId = cfg.service.brandAdd.txnId;

                send.Name = this.AddForm.Name;
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
                        that.$store.commit('brandRefreshT');
                        that.$router.go(-1)
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            //修改品牌
            brandUpt() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.brandUpt.url + '/' + cfg.service.brandUpt.action;
                send.TxnId = cfg.service.brandUpt.txnId;

                send.BrandId = this.AddForm.BrandId;
                send.Name = this.AddForm.Name;
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
                        that.$store.commit('brandRefreshT');
                        this.$router.go(-1)
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            initBrand() {
                let query = this.$route.query || {};
                if (query && query.BrandId) {
                    this.AddForm = {
                        BrandId: query.BrandId,
                        Name: query.Name,
                        Memo: query.Memo || ''
                    }
                } else {
                    this.AddForm = {
                        Id: '',
                        Name: '',
                        Memo: ''
                    }
                }
            }
        },
        created() {
            this.initBrand()
        },
        watch: {
            $route(newValue, oldValue){
                if(newValue.path === "/addBrand") {
                    this.initBrand()
                }
            }
        }
    }
</script>

<style scoped>
    .form-bot {
        text-align: right;
    }
</style>
