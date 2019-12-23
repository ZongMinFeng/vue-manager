<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="success" style="margin-bottom: 10px;" icon="el-icon-plus" :disabled='addDisabled'
                       @click="onAddNewTap">新增
            </el-button>
        </div>

        <el-table :data="tableData"
                  stripe
                  border>
            <el-table-column prop="shopName" label="名称"></el-table-column>
            <el-table-column prop="province" label="省"></el-table-column>
            <el-table-column prop="city" label="市"></el-table-column>
            <el-table-column prop="area" label="区"></el-table-column>
            <el-table-column prop="street" label="街道"></el-table-column>
            <el-table-column prop="shopAddress" label="详细地址"></el-table-column>
            <!--<el-table-column prop="zipCode" label="邮编"></el-table-column>-->
            <el-table-column label="创建时间" width="160">
                <template slot-scope="props">
                    <span>{{num2Date(props.row.createDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="props">
                    <span v-if="props.row.status!==1" style="color: red;">{{getStatus(props.row.status)}}</span>
                    <span v-else>{{getStatus(props.row.status)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="props">
                    <div style="margin-bottom: 2px">
                        <el-button type="primary" @click="modiTap(props.row)" >修改</el-button>
                    </div>
                    <div>
                        <el-button type="danger" @click="deleteTap(props.row.shopId)" >删除</el-button>
                    </div>
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
                    <el-form-item label="地址">
                        <el-col :span="17">
                            <v-distpicker :province="dialogForm.province" :city="dialogForm.city" :area="dialogForm.area"
                                          @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea"></v-distpicker>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="街道" label-width="50px" prop="street">
                                <el-input v-model="dialogForm.street" placeholder="请输入街道"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row v-if="flag===1">
                    <el-col :span="24">
                        <el-form-item label="详细地址" prop="shopAddress"
                                      :rules="[{required: true, message:'详细地址不能为空', trigger:'blur'}]">
                            <el-input v-model="dialogForm.shopAddress" placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="6">-->
                    <!--<el-form-item label="邮编" prop="shopAddress"-->
                    <!--:rules="[{required: true, message:'详细地址不能为空', trigger:'blur'}]">-->
                    <!--<el-input v-model="dialogForm.shopAddress" placeholder="请输入详细地址"></el-input>-->
                    <!--</el-form-item>-->
                    <!--</el-col>-->
                </el-row>
                <el-row v-if="flag===2">
                    <el-col :span="18">
                        <el-form-item label="详细地址" prop="shopAddress"
                                      :rules="[{required: true, message:'详细地址不能为空', trigger:'blur'}]">
                            <el-input v-model="dialogForm.shopAddress" placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态" prop="status"
                                      :rules="[{required: true, message:'状态不能为空', trigger:'blur'}]">
                            <el-select v-model="dialogForm.status" placeholder="请选择状态" style="width: 100%;">
                                <el-option v-for="item in selections" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="6">-->
                        <!--<el-form-item label="邮编" prop="shopAddress"-->
                                      <!--:rules="[{required: true, message:'详细地址不能为空', trigger:'blur'}]">-->
                            <!--<el-input v-model="dialogForm.shopAddress" placeholder="请输入详细地址"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                </el-row>
            </el-form>
            <!--地图模块，使用v-show隐藏，未启用-->
            <div v-show="false" id="container" style="width:600px;height:500px; border: 1px solid red;"></div>
            <span slot="footer" type="dialog-footer">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button v-if='flag===1' type="primary" @click="dialogFormConfirm">确定</el-button>
                <el-button v-else type="primary" :disabled="modiDisable" @click="dialogFormConfirm">修改</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {getMallShop, saveShop, delShopById, uptShop} from "@/util/module.js";
    import {num2Date} from "@/Gw/GwString.js";
    import VDistpicker from 'v-distpicker';

    export default {
        name: "ShopList",

        components: {
            VDistpicker
        },

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
                    shopAddress: null,
                    status:null,
                },
                dialogFormOld: {
                    shopName: null,
                    province: null,
                    city: null,
                    area: null,
                    street: null,
                    shopAddress: null,
                    status:null,
                },
                dialogVisible: false,
                map:null,
                selections:[
                    {id:1, value:'正常'},
                    {id:2, value:'注销'},
                    {id:3, value:'停用'},
                ],
                province:null,
            }
        },

        computed: {
            dialogTitle() {
                if (this.flag === 1) {
                    return '新增';
                } else {
                    return '修改';
                }
            },

            modiDisable(){
                if (this.dialogFormOld.province !== this.dialogForm.province) {
                    return false;
                }
                if (this.dialogFormOld.city !== this.dialogForm.city) {
                    return false;
                }
                if (this.dialogFormOld.shopAddress !== this.dialogForm.shopAddress) {
                    return false;
                }
                if (this.dialogFormOld.shopName !== this.dialogForm.shopName) {
                    return false;
                }
                if (this.dialogFormOld.street !== this.dialogForm.street) {
                    return false;
                }
                if (this.dialogFormOld.area !== this.dialogForm.area) {
                    return false;
                }
                if (this.dialogForm.status!==this.dialogFormOld.status){
                    return false;
                }
                return true;
            },
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
                this.flag=1;
                this.dialogForm.province='江苏省';
                this.dialogForm.city='南京市';
                this.dialogForm.area='雨花台区';
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
                //新增
                if (this.flag === 1) {
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
                            this.$message.success("新增店铺成功!");
                            this.initData();
                            this.dialogVisible=false;
                        },
                        (res)=>{
                            if (res.msg!=null){
                                this.$message.error(res.msg);
                            }
                        }
                    ).catch();
                }else {
                    //修改
                    let params={};
                    params.userId=localStorage.getItem("userId");
                    params.shopId=this.dialogForm.shopId;
                    if (this.dialogForm.province!==this.dialogFormOld.province){
                        params.province=this.dialogForm.province;
                    }
                    if (this.dialogForm.city!==this.dialogFormOld.city){
                        params.city=this.dialogForm.city;
                    }
                    if (this.dialogForm.area!==this.dialogFormOld.area){
                        params.area=this.dialogForm.area;
                    }
                    if (this.dialogForm.street!==this.dialogFormOld.street){
                        params.street=this.dialogForm.street;
                    }
                    if (this.dialogForm.shopName!==this.dialogFormOld.shopName){
                        params.shopName=this.dialogForm.shopName;
                    }
                    if (this.dialogForm.shopAddress!==this.dialogFormOld.shopAddress){
                        params.shopAddress=this.dialogForm.shopAddress;
                    }
                    if (this.dialogForm.status!==this.dialogFormOld.status){
                        params.status=this.dialogForm.status;
                    }
                    uptShop(this, params).then(
                        (res)=>{
                            this.$message.success("修改店铺成功!");
                            this.initData();
                            this.dialogVisible=false;
                        },
                        (res)=>{
                            if (res.msg!=null){
                                this.$message.error(res.msg);
                            }
                        }
                    ).catch();
                }

            },

            modiTap(row){
                this.flag=2;
                this.dialogForm.area=row.area;
                this.dialogForm.city=row.city;
                this.dialogForm.createDate=row.createDate;
                this.dialogForm.latitude=row.latitude;
                this.dialogForm.longitude=row.longitude;
                this.dialogForm.mallId=row.mallId;
                this.dialogForm.modiDate=row.modiDate;
                this.dialogForm.province=row.province;
                this.dialogForm.shopAddress=row.shopAddress;
                this.dialogForm.shopId=row.shopId;
                this.dialogForm.shopName=row.shopName;
                this.dialogForm.status=row.status;
                this.dialogForm.street=row.street;
                this.dialogForm.zipCode=row.zipCode;
                //存旧数据
                this.dialogFormOld.area=row.area;
                this.dialogFormOld.city=row.city;
                this.dialogFormOld.createDate=row.createDate;
                this.dialogFormOld.latitude=row.latitude;
                this.dialogFormOld.longitude=row.longitude;
                this.dialogFormOld.mallId=row.mallId;
                this.dialogFormOld.modiDate=row.modiDate;
                this.dialogFormOld.province=row.province;
                this.dialogFormOld.shopAddress=row.shopAddress;
                this.dialogFormOld.shopId=row.shopId;
                this.dialogFormOld.shopName=row.shopName;
                this.dialogFormOld.status=row.status;
                this.dialogFormOld.street=row.street;
                this.dialogFormOld.zipCode=row.zipCode;

                this.province=row.province;

                this.dialogVisible=true;
            },

            deleteTap(shopId){
                this.$confirm('此操作将删除店铺，是否确认？', '删除店铺', {
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(
                    ()=>{
                        this.delete(shopId);
                    }
                ).catch();
            },

            delete(shopId){
                let params={};
                params.shopId=shopId;
                delShopById(this, params).then(
                    (res)=>{
                        this.$message.success('删除成功！');
                        this.initData();
                    },
                    (res)=>{
                        if (res.msg!=null){
                            this.$message.error(res.msg);
                        } else{
                            this.$message.error('删除失败！');
                        }
                    }
                ).catch();
            },

            onChangeProvince: function (a) {
                this.dialogForm.province=a.value;
            },

            onChangeCity: function (a) {
                this.dialogForm.city=a.value;
            },
            onChangeArea: function (a) {
                this.dialogForm.area=a.value;
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
