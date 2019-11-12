<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="success" style="margin-bottom: 10px;" icon="el-icon-plus" :disabled='addDisabled'
                       @click="onAddNewTap">新增
            </el-button>
        </div>

        <el-table :data="tableData"
                  size="medium"
                  stripe
                  border>
            <el-table-column prop="shopName" label="名称"></el-table-column>
            <el-table-column prop="province" label="省"></el-table-column>
            <el-table-column prop="city" label="市"></el-table-column>
            <el-table-column prop="area" label="区"></el-table-column>
            <el-table-column prop="street" label="街道"></el-table-column>
            <el-table-column prop="shopAddress" label="详细地址"></el-table-column>
            <el-table-column label="创建时间" width="160">
                <template slot-scope="props">
                    <span>{{num2Date(props.row.createDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="zipCode" label="邮编"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="props">
                    <span v-if="props.row.status!==1" style="color: red;">{{getStatus(props.row.status)}}</span>
                    <span v-else>{{getStatus(props.row.status)}}</span>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" >
            <el-form :model="dialogForm" label-width="80px" ref="dialogForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="店铺名称" prop="shopName"
                                      :rules="[{required: true, message:'店铺名称不能为空', trigger:'blur'}]">
                            <el-input v-model="dialogForm.shopName" placeholder="请输入店铺名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2">
                        <el-form-item label="地址:">
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="省" label-width="40px" prop="province">
                            <el-input v-model="dialogForm.province" placeholder="请输入省"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="市" label-width="40px" prop="city">
                            <el-input v-model="dialogForm.city" placeholder="请输入市"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="区" label-width="40px" prop="area">
                            <el-input v-model="dialogForm.area" placeholder="请输入市"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="街道" label-width="50px" prop="street">
                            <el-input v-model="dialogForm.street" placeholder="请输入街道"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="详细地址" prop="shopAddress"
                                      :rules="[{required: true, message:'详细地址不能为空', trigger:'blur'}]">
                            <el-input v-model="dialogForm.shopAddress" placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div id="container" style="width:600px;height:500px; border: 1px solid red;"></div>
            <span slot="footer" type="dialog-footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="dialogFormConfirm">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {getMallShop, saveShop} from "@/util/module.js";
    import {num2Date} from "@/Gw/GwString.js";

    export default {
        name: "ShopList",
        data() {
            return {
                tableData: [],
                addDisabled: false,
                flag: 1, //1:新增 2:修改
                dialogForm: {
                    shopName: null,
                    province: null,
                    city: null,
                    area: null,
                    street: null,
                    shopAddress: null
                },
                dialogVisible: false,
                map:null,
            }
        },

        computed: {
            dialogTitle() {
                if (this.flag === 1) {
                    return '新增';
                } else {
                    return '修改';
                }
            }
        },

        created() {
            this.initData();
        },

        mounted() {
            if (document.getElementById("container")!==null){
                this.init();
            }
        },

        beforeUpdate(){
            if (document.getElementById("container")!==null){
                this.init();
            }
        },

        methods: {
            initData() {
                let params = {};
                getMallShop(this, params).then(
                    (res) => {
                        console.log("shopList res", res);//debug
                        this.tableData = res.data;
                    },
                    (res) => {

                    }
                ).catch();
            },

            init() {
                //步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
                //设置地图中心点
                var myLatlng = new qq.maps.LatLng(39.916527,116.397128);
                //定义工厂模式函数
                var myOptions = {
                    zoom: 8,               //设置地图缩放级别
                    center: myLatlng,      //设置中心点样式
                    mapTypeId: qq.maps.MapTypeId.ROADMAP  //设置地图样式详情参见MapType
                };
                //获取dom元素添加地图信息
                this.map = new qq.maps.Map(document.getElementById("container"), myOptions);
            },

            onAddNewTap() {
                this.dialogVisible = true;
            },

            getStatus(status) {
                let statusStr = '未知';
                switch (status) {
                    case 1:
                        statusStr = '正常';
                        break;
                    case 2:
                        statusStr = '注销';
                        break;
                    case 3:
                        statusStr = '停用';
                        break;
                }
                return statusStr;
            },

            num2Date(createDate) {
                return num2Date(createDate);
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
                params.userId=localStorage.getItem("userId");
                if (this.dialogForm.province!=null){
                    params.province=this.dialogForm.province;
                }
                if (this.dialogForm.city!=null){
                    params.city=this.dialogForm.city;
                }
                if (this.dialogForm.area!=null){
                    params.area=this.dialogForm.area;
                }
                if (this.dialogForm.street!=null){
                    params.street=this.dialogForm.street;
                }
                if (this.dialogForm.shopName!=null){
                    params.shopName=this.dialogForm.shopName;
                }
                if (this.dialogForm.shopAddress!=null){
                    params.shopAddress=this.dialogForm.shopAddress;
                }
                saveShop(this, params).then(
                    (res)=>{
                        console.log("新增店铺返回", res);//debug
                        this.$message.success("新增店铺成功!");
                        this.initData();
                        this.dialogVisible=false;
                    },
                    (res)=>{
                        console.log("新增店铺返回", res);//debug
                        if (res.msg!=null){
                            this.$message.error(res.msg);
                        }
                    }
                ).catch();
            },
        }
    }
</script>

<style scoped>
    .mapClass{
        width: 400px;
        height: 300px;
        border: 1px solid red;
    }
</style>
