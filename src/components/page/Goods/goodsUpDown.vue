<template>
    <div>
        <el-form :model="selectForm" label-width="100px">
            <el-row :gutter="10">
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="分类" prop="type">
                        <el-select class="elSelect" v-model="selectForm.categoryId" clearable placeholder="请选择分类"  @change="onRefresh">
                            <el-option
                                    v-for="item in goodsTypeArray"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.categoryId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="名称" prop="name">
                        <el-input maxlength="10" placeholder="请输入名称" v-model="selectForm.name" @change="onRefresh"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="left">
            <el-table :data="downTable" style="width:100%;" border stripe @selection-change="upSelectChange">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="主图" prop="picture">
                    <template slot-scope="scope">
                        <el-image style="height: 40px; width: 40px;" :src="uploadUrl + scope.row.goodsId + '/'+scope.row.picture" :preview-src-list="[uploadUrl + scope.row.goodsId + '/'+scope.row.picture]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="props">
                        <span :class="{status1:isTheStatus(props.row.status, 1), status2:isTheStatus(props.row.status, 2), status3:isTheStatus(props.row.status, 3), status4:isTheStatus(props.row.status, 4)}">{{showStatus(props.row.status)}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="middle">
            <div class="button1">
                <el-button type="success" icon="el-icon-right" @click="putOnOffGoodsConfirm(1)">上架</el-button>
            </div>
            <div class="button2">
                <el-button type="danger" icon="el-icon-back" @click="putOnOffGoodsConfirm(2)">下架</el-button>
            </div>
        </div>
        <div class="right">
            <el-table :data="upTable" style="width:100%;" border stripe @selection-change="downSelectChange">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="主图" prop="picture">
                    <template slot-scope="scope">
                        <el-image style="height: 40px; width: 40px;" :src="uploadUrl + scope.row.goodsId + '/'+scope.row.picture" :preview-src-list="[uploadUrl + scope.row.goodsId + '/'+scope.row.picture]"></el-image>
                        <!--<el-image v-image-preview style="height: 80px; width: 80px;" :src="uploadUrl + scope.row.goodsId + '/'+scope.row.picture"></el-image>-->
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="props">
                        <span :class="{status1:isTheStatus(props.row.status, 1), status2:isTheStatus(props.row.status, 2), status3:isTheStatus(props.row.status, 3), status4:isTheStatus(props.row.status, 4)}">{{showStatus(props.row.status)}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import cfg from '../../../config/cfg';
    import {sendServer} from '../../../util/common';
    import {
        qryGoodsInfo
    } from '../../../util/module';
    export default {
        name: "goodsUpDown",
        data(){
            return {
                selectForm:{},
                goodsTypeArray: [],
                upTable:[],
                downTable:[],
                CurPage: 1,   // 设置加载的第几次，默认是第一次
                limitNum: 100,        // 返回数据的个数
                AllCount: 0,    // 总条数
                page:0,
                total:0,
                goodsTable:[],
                upSelect:[],
                downSelect:[],
                uploadUrl:''
            }
        },

        created() {
            let mallId = localStorage.getItem('mallId') || '';
            this.uploadUrl = cfg.service.uploadUrl+'/' + mallId + '/';
            this.typeQry();
            this.initGoods();
        },

        computed:{
            listenGoodsTypeRefresh() {
                return this.$store.state.goodsTypeArray;
            },
        },

        watch:{
            listenGoodsTypeRefresh: function (newVal, oldVal) {
                this.goodsTypeArray = newVal;
            },
        },

        methods:{
            //初始化商品
            initGoods(){
                this.CurPage=1;
                this.total=0;
                this.page=0;
                this.goodsTable=[];
                this.upTable=[];
                this.downTable=[];
                this.goodsQryCycle();
            },

            //查询商品分类
            typeQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.getMallCategory.url + '/' + cfg.service.getMallCategory.action;
                urlParams.txnId = cfg.service.getMallCategory.txnId;
                send.categoryPid = '99';
                let signArray = {
                    categoryPid: '99'
                };
                urlParams.signArray = signArray;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        that.goodsTypeArray = res.data;
                        console.log("goodsTypeArray", this.goodsTypeArray);//debug
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            //商品查询
            goodsQry(){
                let params={};
                params.CurPage=this.CurPage;
                params.limitNum=this.limitNum;
                qryGoodsInfo(this, params).then((res)=>{
                    this.upTable=res.data.rows;
                    console.log("upTable", res);//debug
                }, (res)=>{
                    console.log("upTable error", res);//debug
                    this.$message.error(res.msg);
                });
            },

            //商品查询-循环
            goodsQryCycle(){
                let params={};
                params.CurPage=this.CurPage;
                params.limitNum=this.limitNum;
                if(this.selectForm.name!=null&&this.selectForm.name!==""){
                    params.name=this.selectForm.name;
                }
                if(this.selectForm.categoryId!=null&&this.selectForm.categoryId!==""){
                    params.categoryId=this.selectForm.categoryId;
                }
                qryGoodsInfo(this, params).then((res)=>{
                    this.goodsTable.push(...res.data.rows);
                    this.page=res.data.page;
                    this.total=res.data.total;
                    this.CurPage++;
                    if(this.CurPage<=this.total){
                        //循环查询，直到查到最后一个
                        this.goodsQryCycle();
                    }else{
                        //查询结束，将商品分成上架部分和未上架部分
                        this.goodsTable.forEach((value, index)=>{
                            if(value.status===1){
                                this.upTable.push(value);
                            }else{
                                this.downTable.push(value);
                            }
                        });
                        console.log("goodsTable", this.goodsTable);//debug
                        console.log("upTable", this.upTable);//debug
                        console.log("downTable", this.downTable);//debug
                    }
                }, (res)=>{
                    this.$message.error(res.msg);
                });
            },

            upSelectChange(val){
                this.upSelect=val;
            },

            downSelectChange(val){
                this.downSelect=val;
            },

            putOnOffGoodsConfirm(flag){
                let str="";
                if(flag===1){
                    str="上架";
                    if (this.upSelect.length === 0) {
                        this.$message.warning('请选择需要上架商品!');
                        return false;
                    }
                }else{
                    str="下架";
                    if (this.downSelect.length === 0) {
                        this.$message.warning('请选择需要下架商品!');
                        return false;
                    }
                }
                this.$confirm('此操作将全部选中商品批量'+ str+', 是否继续?', str, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.putOnOffBatch(flag);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'+str
                    })
                });
            },

            putOnOffBatch(flag){
                let multipleSelection=null;
                if(flag===1){
                    multipleSelection=this.upSelect;
                }else{
                    multipleSelection=this.downSelect;
                }
                console.log("multipleSelection", multipleSelection);//debug
                let urlParams={
                    header:{
                        operFlag:"1"
                    }
                };
                let send=[];
                urlParams.url=cfg.service.project+cfg.service.putOnOffGoods.url+"/"+cfg.service.putOnOffGoods.action;
                urlParams.txnId=cfg.service.putOnOffGoods.txnId;
                if(flag===1){
                    urlParams.header.operFlag="1";
                }else{
                    urlParams.header.operFlag="2";
                }
                urlParams.UnUserId=true;
                let userId=localStorage.getItem('userId') || '';
                multipleSelection.forEach(item => {
                    let GoodsInfo = {
                        goodsId: item.goodsId,
                        userId:userId
                    };
                    send.push(GoodsInfo);
                });

                urlParams.send=send;
                let that=this;
                sendServer(urlParams, this).then(res=>{
                        //成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        if(flag===1){
                            that.$message.success("上架成功");
                        }else{
                            that.$message.success("下架成功");
                        }
                        //刷新页面
                        this.initGoods();
                    },
                    res=>{
                        // 失败
                        that.$message.error('请求失败');
                        //刷新页面
                        this.initGoods();
                    });
            },

            isTheStatus(status, now){
                if(status===now){
                    return true;
                }else{
                    return false;
                }

            },

            //翻译状态
            showStatus(status){
                let strStatus="";
                switch(status){
                    case 1:
                        strStatus="上架";
                        break;
                    case 2:
                        strStatus="注销";
                        break;
                    case 3:
                        strStatus="下架";
                        break;
                    case 4:
                        strStatus="新增";
                        break;
                }
                return strStatus;
            },

            // 刷新数据
            onRefresh() {
                this.initGoods();
            },
        }
    }
</script>

<style scoped>
    .elSelect{
        width: 100%;
    }

    .left{
        width: 44%;
        height: 550px;
        float: left;
        OVERFLOW-Y: auto;
        border: 2px solid gray;
        border-radius:10px;
    }

    .middle{
        width: 10%;
        height: 550px;
        /*border: 1px solid red;*/
        float: left;
    }

    .right{
        width: 44%;
        height: 550px;
        float: left;
        OVERFLOW-Y: auto;
        border: 2px solid gray;
        border-radius:10px;
    }

    .button1{
        position: absolute;
        top: 46%;
        left: 50%;
        margin: -52px;
    }

    .button2{
        position: absolute;
        top: 70%;
        left: 50%;
        margin: -52px;
    }

    .status1{
        color:#409EFF;
    }

    .status2{
        color:#E6A23C;
    }

    .status3{
        color:red;
    }

    .status4{
        color:green;
    }
</style>
