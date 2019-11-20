<template>
    <div class="container">
        <div style="height: 50px;">
            <el-button v-show="!addItemVisible" type="success" icon="el-icon-plus" style="float: left;" @click="showAddItem">新增系统参数</el-button>
            <div class="btn-div" v-for="(item) in items">
                <el-button type="primary"  v-if="item.argName!=null&&item.argName.startsWith('config_service_phone')"  @click="showPhontItem">客服电话</el-button>
                <el-button type="primary" v-if="item.argName!=null&&item.argName.startsWith('mall_order_closetime')"  @click="showTimeItem">超时设置</el-button>
                <el-button type="primary" v-if="item.argName!=null&&item.argName.startsWith('mall_order_memos')"  @click="showMemosItem">备注标签设置</el-button>
                <el-button type="primary" v-if="item.argName!=null&&item.argName.startsWith('mall_order_minamt')"  @click="showAmtItem">每单最小金额</el-button>
            </div>
        </div>

        <!--新增样式-->
        <div v-if="addItemVisible" style="width: 100%;">
            <el-card class="form-container" shadow="never"  >
                <el-form label-width="80px" :model="itemForm" :rules="rules" ref="itemAddForm">
                    <el-form-item label="名称" prop="argName">
                        <el-select v-model="itemForm.argName" style="width: 100%;"  @change="itemType">
                            <el-option v-for="item in options" :key="item.argName" :label="item.chnExplain" :value="item.argName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_memos')" label="值">
                        <el-row>
                            <el-col :span="20">
                                <el-input v-model="argValueMemos" maxlength="20"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-button   type="primary" style="margin-left: 20px" @click="addRemock">添加</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item v-else label="值" prop="argValue">
                        <el-row>
                            <el-col :span="20">
                                <el-input v-model="itemForm.argValue" maxlength="20"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <span  v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_closetime')">分钟</span>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item  v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_memos')" style="padding-right:10px">
                            <div>
                                <el-tag v-if="tags" style="margin: 10px;" v-for="tag in tags"
                                        :key="tag"
                                        closable @close="handleClose(tag)">
                                    {{tag}}
                                </el-tag>
                            </div>
                    </el-form-item>
                    <el-form-item v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_closetime')" label="快速选择" style="padding-right:10px">
                        <template sslot-scope="props">
                            <div>
                                <el-slider :max="6" :show-tooltip="false" :step="1" :marks="marks" v-model="sliderValue" show-stops @change="sliderChange"></el-slider>
                            </div>
                        </template>
                    </el-form-item>
                </el-form>
                <span class="dialog-footer" style="float: right;margin-top: 30px;">
                <el-button style="margin-right:5px" @click="addItemClear">取 消</el-button>
                <el-button type="primary" @click="submitForm('itemAddForm')" >确 定</el-button>
                 </span>
            </el-card>
        </div>


        <!--列表样式-->
        <div v-if="showItemVisible">
                <el-table :data="setItemArray" border stripe current-row-key="argName">
                    <el-table-column label="名称" prop="chnExplain"></el-table-column>

                    <el-table-column label="值" >
                        <template  slot-scope="scope">
                            <el-tag v-if="scope.row.argName.startsWith('mall_order_memos')"  style="margin: 10px;" v-for="tag in tags"
                                    :key="tag"
                            >
                                {{tag}}
                            </el-tag>
                            <span v-else>{{scope.row.argValue}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="props">
                            <el-button v-if="!isPicture(props.row.argName)" type="warning" style="margin-right: 5px;" @click="showModiItem(props.row)">修改</el-button>
                            <el-button type="danger" @click="showDeleteItem(props.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </div>


        <!-- 修改对话框 -->
        <el-dialog :visible.sync="modiItemVisible" width="30%">
            <el-form label-width="80px" :model="itemForm" :rules="rules" ref="itemModiForm">
                <el-form-item label="名称">
                    <el-input v-model="itemForm.chnExplain" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="值" prop="argValue">
                    <el-row  width="100%">
                        <el-col :span="20">
                            <el-input v-if="itemForm.argName!=null&&!itemForm.argName.startsWith('mall_order_memos')" v-model="itemForm.argValue"  maxlength="11"></el-input>

                            <el-input v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_memos')" v-model="argValueMemos"  maxlength="20"></el-input>

                        </el-col>
                        <el-col :span="2">
                            <span  v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_closetime')">分钟</span>
                            <el-button  v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_memos')" type="primary" style="margin-left: 20px" @click="addRemock">添加</el-button>

                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item  v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_memos')" style="padding-right:10px">
                    <div>
                        <el-tag v-if="tags" style="margin: 10px;" v-for="tag in tags"
                                :key="tag"
                                closable @close="handleClose(tag)">
                            {{tag}}
                        </el-tag>
                    </div>
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
                <el-button style="margin-right:5px" @click="submitModiFormClear('itemModiForm')">取 消</el-button>
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
        name: "mallSysArgSet",
        data(){
            var checkValue=(rule, value, callback)=>{
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
                setItemArray:[],    //当前按钮状态应显示的对应数据信息
                tags:[],            //标签数组
                showItemVisible:false,
                showFlag:'',       //当前按钮状态
                argValueMemos:'',  //备注修改框值
                addItemVisible:true,     //显示新增样式
                itemForm:{
                    id:null,
                    argName:null,
                    argValue:'',
                    chnExplain:null,
                    mallId:null,
                    pictureUrl:null,
                    status:null,
                    signFlag:null
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
                        item.signFlag=value.signFlag;
                        this.allItems.push(item);
                    });

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
                                    this.allItems[i].signFlag=value.signFlag;
                                    break;
                                }
                            }
                        });

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
                        console.log("options", this.options);//debug


                        this.setItemArray = [];
                        this.items.forEach(value => {
                            if(value.argName.startsWith(this.showFlag)){
                                this.setItemArray.push(value);
                            }
                        })

                    }, (res)=>{
                        this.$message.error(res.message);
                    });
                }, (res)=>{
                    this.$message.error(res.message);
                });
            },

            //新增
            showAddItem(){
                this.addItemVisible = true;
                this.showItemVisible = false;
                this.tags = [];
                this.itemForm={
                    id:null,
                    argName:null,
                    argValue:'',
                    chnExplain:null,
                    mallId:null,
                    pictureUrl:null,
                    status:null,
                    signFlag:null
                };
            },

            //取消
            addItemClear(){
                this.tags = [];
                this.itemForm={
                    id:null,
                    argName:null,
                    argValue:'',
                    chnExplain:null,
                    mallId:null,
                    pictureUrl:null,
                    status:null,
                    signFlag:null
                };
            },

            //客服电话显示
            showPhontItem(){
                this.addItemVisible = false;
                this.showItemVisible = true;
                this.setItemArray = [];
                this.showFlag = 'config_service_phone';
                this.items.forEach(value => {
                    if(value.argName.startsWith('config_service_phone')){
                        this.setItemArray.push(value);
                    }
                });
                console.log("setItemArray", this.setItemArray);//debug
            },

            //超时显示
            showTimeItem(){
                this.addItemVisible = false;
                this.showItemVisible = true;
                this.showFlag = 'mall_order_closetime';
                this.setItemArray = [];
                this.items.forEach(value => {
                    if(value.argName.startsWith('mall_order_closetime')){
                        this.setItemArray.push(value);
                    }
                });
            },

            showAmtItem(){
                this.addItemVisible = false;
                this.showItemVisible = true;
                this.showFlag = 'mall_order_minamt';
                this.setItemArray = [];
                this.items.forEach(value => {
                    if(value.argName.startsWith('mall_order_minamt')){
                        this.setItemArray.push(value);
                    }
                });
                console.log("setItemArray amt", this.setItemArray);//debug
            },

            //备注标签显示
            showMemosItem(){
                this.addItemVisible = false;
                this.showItemVisible = true;
                this.showFlag = 'mall_order_memos';
                let momes = [];
                this.setItemArray = [];
                this.items.forEach(value => {
                    if(value.argName.startsWith('mall_order_memos')){
                        this.setItemArray.push(value);
                        let memo =  JSON.parse(value.argValue)
                        for (var memoItem in memo) {
                            momes.push(memo[memoItem]); //key所对应的value 
                        }
                    }
                });
                console.log(' this.setItemArray.push(value);',  this.setItemArray );//debug

                this.tags = momes;
                console.log(' this.tags ', this.tags )
            },



            //添加备注标签
            addRemock(){
                if(this.argValueMemos.trim()){
                    console.log('this.tags.length',this.tags.length)
                    if (this.tags.indexOf(this.argValueMemos) == -1) {
                        if(this.tags.length>=15){
                            this.$message.error('备注标签超出个数限制');
                        }else{
                            this.tags.unshift(this.argValueMemos);
                        }
                    }
                }
            },

            //清空某备注标签
            handleClose(options){
                this.tags.forEach((item,index) => {
                    if(item === options){
                        this.tags.splice(index,1)
                    }
                })
            },

            showModiItem(item){
                this.modiItemVisible=true;
                let momes = []
                this.argValueMemos = ''
                if (item.argName.startsWith('mall_order_memos')) {
                    let memo =  JSON.parse(item.argValue)
                    for (var memoItem in memo) {
                        momes.push(memo[memoItem]); //key所对应的value 
                    }
                }
                this.tags = momes
                this.itemForm={
                    id:item.id,
                    argName:item.argName,
                    argValue:item.argValue,
                    chnExplain:item.chnExplain,
                    mallId:item.mallId,
                    pictureUrl:item.pictureUrl,
                    status:item.status,
                    signFlag:item.signFlag
                };
            },

            itemType(value){
                this.tags = [];
                this.options.forEach((item)=>{
                    if(item.argName===value){
                        this.itemForm.argName=item.argName;
                        this.itemForm.chnExplain=item.chnExplain;
                        this.itemForm.status=item.status;
                        this.itemForm.signFlag=item.signFlag;
                        this.itemForm.mallId=localStorage.getItem("mallId")||'';
                    }
                });
            },

            submitForm(formName){
                this.$refs[formName].validate((valid)=>{
                    if(this.itemForm.argName.startsWith('mall_order_memos')){
                        if (this.argValueMemos.trim()&&this.tags.indexOf(this.argValueMemos) === -1) {
                            this.itemForm.argValue =  this.argValueMemos
                            if(this.tags.length>=15){
                                this.$message.error('备注标签超出个数限制');
                                return false
                            }else{
                                this.tags.unshift(this.itemForm.argValue);
                            }
                        }else if(this.tags.length ===0 ){
                            return false;
                        }else if(this.tags.length>15){
                            this.$message.error('备注标签超出个数限制');
                            return false;
                        }
                        let jsonstr = "{";
                        for(let i=0; i<this.tags.length; i++){
                            jsonstr +="\"memo"+(i+1)+"\":" + "\""+this.tags[i]+ "\""+','
                        }
                        jsonstr = jsonstr.substring(0, jsonstr.length - 1)+"}";
                        this.itemForm.argValue = jsonstr;
                        this.addItem();
                    }else{
                        if(valid){
                            this.addItem();
                        }else{
                            return false;
                        }
                    }
                });
            },

            submitModiForm(formName){
                this.$refs[formName].validate((valid)=>{
                    if(this.itemForm.argName.startsWith('mall_order_memos')){
                        if (this.argValueMemos.trim()&&this.tags.indexOf(this.argValueMemos) == -1) {
                            this.itemForm.argValue =  this.argValueMemos
                            if(this.tags.length>=15){
                                this.$message.error('备注标签超出个数限制');
                                return false
                            }else{
                                this.tags.unshift(this.itemForm.argValue);
                            }
                        }else if(this.tags.length ===0 ){
                            this.$message.error('请输入值');
                            return false;
                        }else if(this.tags.length>15){
                            this.$message.error('备注标签超出个数限制');
                            return false;
                        }
                        let jsonstr = "{";
                        for(let i=0; i<this.tags.length; i++){
                            jsonstr +="\"memo"+(i+1)+"\":" + "\""+this.tags[i]+ "\""+','
                        }
                        jsonstr = jsonstr.substring(0, jsonstr.length - 1)+"}";
                        this.itemForm.argValue = jsonstr;
                        this.modiItem();
                    }else{
                        if(valid){
                            console.log("继续！");//debug
                            this.modiItem();
                        }else{
                            console.log("出错！");//debug
                            return false;
                        }
                    }

                });
            },

            submitModiFormClear(){
                this.modiItemVisible=false;
                let momes =[];
                this.items.forEach(value => {
                    if(value.argName.startsWith('mall_order_memos')){
                        let memo =  JSON.parse(value.argValue)
                        for (var memoItem in memo) {
                            momes.push(memo[memoItem]); //key所对应的value 
                        }
                    }
                })
                this.tags = momes
            },

            addItem(){
                let params={
                    userId:localStorage.getItem("usrId")||'',
                    argName:this.itemForm.argName,
                    argValue:this.itemForm.argValue,
                    signFlag:this.itemForm.signFlag

                };
                if(this.itemForm.pictureUrl!=null){
                    params.pictureUrl=this.itemForm.pictureUrl;
                }
                saveMallContent(this, params).then((res)=>{
                    this.$message.success("新增系统参数成功");
                    this.tags = [];
                    this.argValueMemos = ''
                    this.itemForm={
                        id:null,
                        argName:null,
                        argValue:'',
                        chnExplain:null,
                        mallId:null,
                        pictureUrl:null,
                        status:null,
                        signFlag:null
                    };
                    this.initData();
                }, (res)=>{
                    this.$message.error(res.msg);
                });
            },

            modiItem(){
                let params={
                    id:this.itemForm.id,
                    userId:localStorage.getItem("usrId")||'',
                    argValue:this.itemForm.argValue,
                    signFlag:this.itemForm.signFlag

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
                    this.setItemArray=[];
                    this.showItemVisible = false;
                    this.addItemVisible = true;
                    this.tags = [];
                    this.argValueMemos = ''
                    this.itemForm={
                        id:null,
                        argName:null,
                        argValue:'',
                        chnExplain:null,
                        mallId:null,
                        pictureUrl:null,
                        status:null,
                        signFlag:null
                    };
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

    .btn-div{
        /*display: inline-block;*/
        float: right;
        padding-left: 10px;
        padding-right: 10px;
    }
    .form-container{
        position: relative;
        left: 0;
        right: 0;
        width: 720px;
        padding: 35px 35px 15px;
        margin: 20px auto;
    }

</style>
