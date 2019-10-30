<template>
    <div>
        <div>
            <el-button type="success" icon="el-icon-plus" style="margin-bottom: 10px" @click="showAddItem">新增</el-button>
        </div>
        <el-table :data="items" border stripe>
            <!--<el-table-column label="Id" prop="argName"></el-table-column>-->
            <el-table-column label="名称" prop="chnExplain"></el-table-column>
            <el-table-column label="值" prop="argValue"></el-table-column>
            <el-table-column label="图片" prop="pictureUrl">
                <template slot-scope="scope">
                    <el-image v-if="isPicture(scope.row.argName)" style="height: 80px; width: 80px;" :src="uploadUrl + scope.row.argValue + '/'+scope.row.pictureUrl" :preview-src-list="[uploadUrl + scope.row.argValue + '/'+scope.row.pictureUrl]"></el-image>
                </template>
            </el-table-column>
            <!--<el-table-column label="状态" prop="status"></el-table-column>-->
            <el-table-column label="操作">
                <template slot-scope="props">
                    <el-button v-if="!isPicture(props.row.argName)" type="warning" style="margin-right: 5px;" @click="showModiItem(props.row)">修改</el-button>
                    <el-button type="danger" @click="showDeleteItem(props.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增对话框 -->
        <el-dialog :visible.sync="addItemVisible" width="30%">
            <el-form label-width="80px" :model="itemForm" :rules="rules" ref="itemAddForm">
                <el-form-item label="名称" prop="argName">
                    <el-select v-model="itemForm.argName" style="width: 100%;"  @change="itemType">
                        <el-option v-for="item in options" :key="item.argName" :label="item.chnExplain" :value="item.argName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="值" prop="argValue">
                    <el-row  width="100%">
                        <el-col :span="20">
                            <el-input v-model="itemForm.argValue"></el-input>
                        </el-col>
                        <el-col :span="2">
                            <span  v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_closetime')">分钟</span>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_closetime')" label="快速选择" style="padding-right:10px">
                    <template sslot-scope="props">
                        <div>
                            <el-slider :max="6" :show-tooltip="false" :step="1" :marks="marks" v-model="sliderValue" show-stops @change="sliderChange"></el-slider>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button style="margin-right:5px" @click="addItemVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('itemAddForm')" >确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改对话框 -->
        <el-dialog :visible.sync="modiItemVisible" width="30%">
            <el-form label-width="80px" :model="itemForm" :rules="rules" ref="itemModiForm">
                <el-form-item label="名称">
                    <el-input v-model="itemForm.chnExplain" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="值" prop="argValue">
                    <el-row  width="100%">
                        <el-col :span="20">
                            <el-input v-model="itemForm.argValue"></el-input>
                        </el-col>
                        <el-col :span="2">
                            <span  v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_closetime')">分钟</span>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_closetime')" label="快速选择" style="padding-right:10px">
                    <template sslot-scope="props">
                        <div>
                            <el-slider :max="6" :show-tooltip="false" :step="1" :marks="marks" v-model="sliderValue" show-stops @change="sliderChange"></el-slider>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button style="margin-right:5px" @click="modiItemVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitModiForm('itemModiForm')" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getSysMallConfig,
        getMallContent,
        saveMallContent,
        delMallContentById,
        uptMallContent
    } from "../../../util/module";
    import cfg from '../../../config/cfg';
    export default {
        name: "mallSysArg",
        data(){
            var checkValue=(rule, value, callback)=>{
                console.log("rule", rule);//debug
                console.log("value", value);//debug
                if(this.itemForm.argName.startsWith('mall_order_closetime')){
                    if(value==null||value===''){
                        callback(new Error('请输入值'));
                        return false;
                    }
                    let reg = /^[0-9]*[0-9][0-9]*$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入大于等于0的数字'));
                        return false;
                    }
                    if(value>525600){
                        callback(new Error("不允许大于1年！"));
                        return false;
                    }
                }
                callback();
            };
            return {
                allItems:[],
                items:[],
                addItemVisible:false,
                itemForm:{
                    id:null,
                    argName:null,
                    argValue:'',
                    chnExplain:null,
                    mallId:null,
                    pictureUrl:null,
                    status:null
                },
                options:[],
                rules:{
                    argValue: [
                        {required:true, message:'请输入值', trigger:'blur'},
                        {validator:checkValue, trigger: 'blur'},
                    ],
                    argName: [
                        {required: true, message: '请选择类型', trigger: 'blur'},
                    ]
                },
                modiItemVisible:false,
                uploadUrl:'',
                sliderValue:0,
                marks:{
                    0:'无',
                    1:'15分钟',
                    2:'1小时',
                    3:'2小时',
                    4:'半天',
                    5:'1天',
                    6:'无'
                }
            }
        },

        created(){
            let mallId = localStorage.getItem('mallId') || '';
            this.uploadUrl = cfg.service.uploadUrl+'/' + mallId + '/';
            this.initData();
        },

        methods:{
            initData(){
                //清空数据
                this.allItems=[];
                this.items=[];
                this.options=[];
                //获取配置信息
                getSysMallConfig(this).then((res)=>{
                    res.data.forEach((value)=>{
                        let item={};
                        item.id='';
                        item.mallId='';
                        item.argName=value.engFlag;
                        item.argValue='';
                        item.chnExplain=value.chnExplain;
                        item.status=1;
                        item.pictureUrl='';
                        this.allItems.push(item);
                    });
                    console.log("allItems", this.allItems);//debug

                    //获取已配置信息
                    getMallContent(this).then((res)=>{
                        res.data.forEach((value)=>{
                            for(let i=0; i<this.allItems.length; i++){
                                if(this.allItems[i].argName===value.argName){
                                    this.allItems[i].id=value.id;
                                    this.allItems[i].argValue=value.argValue;
                                    this.allItems[i].pictureUrl=value.pictureUrl;
                                    this.allItems[i].status=value.status;
                                    this.allItems[i].mallId=value.mallId;
                                    break;
                                }
                            }
                        });
                        console.log("new allItems", this.allItems);//debug

                        this.allItems.forEach((value)=>{
                            if(value.argValue!==''){
                                this.items.push(value);
                            }else{
                                //不是首页图允许新增
                                if(!value.argName.startsWith('mall_a_picture')){
                                    this.options.push(value);
                                }
                            }
                        });
                        console.log("items", this.items);//debug
                    }, (res)=>{
                        this.$message.error(res.message);
                    });
                }, (res)=>{
                    this.$message.error(res.message);
                });
            },

            showAddItem(){
                this.addItemVisible=true;
                this.itemForm={
                    id:null,
                    argName:null,
                    argValue:'',
                    chnExplain:null,
                    mallId:null,
                    pictureUrl:null,
                    status:null
                };
            },

            showModiItem(item){
                this.modiItemVisible=true;
                this.itemForm={
                    id:item.id,
                    argName:item.argName,
                    argValue:item.argValue,
                    chnExplain:item.chnExplain,
                    mallId:item.mallId,
                    pictureUrl:item.pictureUrl,
                    status:item.status
                };
            },

            itemType(value){
                this.options.forEach((item)=>{
                    if(item.argName===value){
                        this.itemForm.argName=item.argName;
                        this.itemForm.chnExplain=item.chnExplain;
                        this.itemForm.status=item.status;
                        this.itemForm.mallId=localStorage.getItem("mallId")||'';
                    }
                });
                console.log("this.itemForm",this.itemForm);//debug
            },

            submitForm(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        this.addItem();
                    }else{
                        return false;
                    }
                });
            },

            submitModiForm(formName){
                console.log("测试！");//debug
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        console.log("继续！");//debug
                        this.modiItem();
                    }else{
                        console.log("出错！");//debug
                        return false;
                    }
                });
            },

            addItem(){
                let params={
                    userId:localStorage.getItem("usrId")||'',
                    argName:this.itemForm.argName,
                    argValue:this.itemForm.argValue
                };
                if(this.itemForm.pictureUrl!=null){
                    params.pictureUrl=this.itemForm.pictureUrl;
                }
                saveMallContent(this, params).then((res)=>{
                    this.addItemVisible=false;
                    this.$message.success("新增系统参数成功");
                    this.initData();
                }, (res)=>{
                    this.$message.error(res.msg);
                });
            },

            modiItem(){
                console.log("啦啦啦");//debug
                let params={
                    id:this.itemForm.id,
                    userId:localStorage.getItem("usrId")||'',
                    argValue:this.itemForm.argValue
                };
                uptMallContent(this, params).then((res)=>{
                    this.modiItemVisible=false;
                    this.$message.success("修改系统参数成功");
                    this.initData();
                }, (res)=>{
                    this.$message.error(res.msg);
                });
            },

            showDeleteItem(value){
                this.$confirm('此操作将删除系统参数，是否继续？', '参数删除', {
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    Type:'error'
                }).then(()=>{
                    this.deleteItem(value);
                }).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'取消删除'
                    });
                });
            },

            deleteItem(value){
                let params={
                    id:value.id,
                    userId:localStorage.getItem("userId")||''
                };
                delMallContentById(this, params).then((res)=>{
                    this.$message.success("删除参数成功");
                    this.initData();
                }, (res)=>{
                    this.$message.error(res.msg);
                });
            },

            isPicture(value){
                if(value.startsWith('mall_a_picture')){
                    return true;
                }else{
                    return false;
                }
            },

            sliderChange(data){
                console.log("hello, data", data);//debug
                //默认1年
                let minutes=525600;
                switch(data){
                    case 0:
                        break;
                    case 1:
                        minutes=15;
                        break;
                    case 2:
                        minutes=60;
                        break;
                    case 3:
                        minutes=120;
                        break;
                    case 4:
                        minutes=720;
                        break;
                    case 5:
                        minutes=1440;
                        break;
                    case 6:
                        break;
                    default:
                        break;
                }
                this.itemForm.argValue=minutes;
            },
        }
    }
</script>

<style scoped>
    .button-right{
        float: right;
    }

    .el-slider__marks-text{
        width:30px;
    }
</style>
