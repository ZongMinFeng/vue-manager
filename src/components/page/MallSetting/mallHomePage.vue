<template>
    <div>
        <!--<div class="pictureSpan">-->
            <!--<span >拖动调换轮播图顺序</span>-->
        <!--</div>-->
        <vuedraggable v-model="list" @remove="removeHandle">
            <transition-group tag="div" class="item-ul">
                <div v-for="(item, index) in allItems" :key="item.argName" class="item">
                    <h3 class="item-title" :title="item.goodName">{{item.chnExplain}}{{item.goodName?':'+item.goodName.substring(0, 6):''}}</h3>
                    <div class="img-div">
                        <img v-if="item.pictureUrl!=null&&item.pictureUrl!==''" class="drag-list-img" :src="ip+'/' + mallId + '/' + item.argValue + '/'+item.pictureUrl"/>
                        <div v-else class="pleaseNew"><h3  >暂无图片！请点击左下角新增按钮，新增{{item.chnExplain}}的图片。</h3></div>
                    </div>
                    <div class="item-line"></div>
                    <div class="item-bottom">
                        <el-button v-if="item.argValue!=null&&item.argValue!==''" type="warning" icon="el-icon-edit" @click="clickk_update(item)">修改</el-button>
                        <el-button v-else type="success" icon="el-icon-share" @click="clickk_add(item)">新增</el-button>
                        <!--<el-button  type="danger" icon="el-icon-delete" style="margin-left: 10px;" @click="click_delete(item)">删除</el-button>-->
                        <el-upload
                                class="el-upload"
                                :action="uploadUrl"
                                multiple
                                list-type="fileList"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload"
                                :http-request="handelPicturePost">
                            <el-button v-if="item.argValue!=null&&item.argValue!==''" type="primary" icon="el-icon-upload" @click="click_change(item)">上传</el-button>
                        </el-upload>
                    </div>
                </div>
            </transition-group>
        </vuedraggable>
        <div>
            <el-dialog title="双击商品，选择设置的图片" :visible.sync="GoodSelectVisible">
                <GoodSelect></GoodSelect>
            </el-dialog>

            <el-dialog title="单击蓝色对勾选择首页图" :visible.sync="PictureSelectVisible" >
                <PictureSelect :title="goodInfo.name" :data="pictureList"></PictureSelect>
            </el-dialog>
        </div>
    </div>


</template>

<script>
    import vuedraggable from 'vuedraggable';
    import cfg from "../../../config/cfg";
    import {sendServer} from "../../../util/common";
    import PictureSelect from "../Select/PictureSelect";
    import GoodSelect from "../Select/GoodSelect";
    import pageBus from "../PageBus";
    import {
        getGoodsInfoById,
        delMallIndexById,
        getSysMallConfig,
        getMallContent,
        saveMallContent,
        uptMallContent
    } from "../../../util/module";
    export default {
        name: "mallHomePage",
        components: {vuedraggable, PictureSelect, GoodSelect},
        props: {
        },
        data() {
            return {
                list:[
                    {id:'1', argName:'mall_a_picture1', argValue:'', createDate:'', mallId:'', modiDate:'', modiUserid:'', pictureUrl:'', status:null, userId:'', goodName:''},
                    {id:'2', argName:'mall_a_picture2', argValue:'', createDate:'', mallId:'', modiDate:'', modiUserid:'', pictureUrl:'', status:null, userId:'', goodName:''},
                    {id:'3', argName:'mall_a_picture3', argValue:'', createDate:'', mallId:'', modiDate:'', modiUserid:'', pictureUrl:'', status:null, userId:'', goodName:''}
                ],
                mallId:'',
                ip:cfg.service.uploadUrl,
                GoodSelectVisible:false,
                PictureSelectVisible:false,
                pictureList:[
                    // {id:1, src:'http://111.231.202.32:10080/190415H9PY655CDP/190520HAT1KA7H6W/62.jpg'},
                    // {id:2, src:'http://111.231.202.32:10080/190415H9PY655CDP/190520HAT1KA7H6W/62.jpg'}
                ],
                goodInfo:{

                },
                indexPicture:{},
                addFlag:2,
                uploadUrl:'',
                selectIndex:0,
                allItems:[],
            }
        },

        created(){
            this.mallId = localStorage.getItem('mallId') || '';
            // this.initList();
            this.initData();
            pageBus.$on(
                "Response",
                data=>{
                    this.PictureSelectVisible=true;
                    this.goodInfo=data;
                    let length=data.imgs.length;
                    if(length<5){
                        return;
                    }
                    let imgs=data.imgs.substring(0, length-1).split(",");
                    if(imgs.length<1){
                        return;
                    }
                    //清空数组
                    this.pictureList=[];
                    let tmp=[];
                    for(let i=0; i<imgs.length; i++){
                        let item={id:null, src:null};
                        item.id=imgs[i];
                        item.src=this.ip+'/'+this.mallId+'/'+data.goodsId+'/'+imgs[i];
                        tmp.push(item);
                    }
                    if(data.picture.startsWith('M')){
                        let item={id:null, src:null};
                        item.id=data.picture;
                        item.src=this.ip+'/'+this.mallId+'/'+data.goodsId+'/'+data.picture;
                        tmp.push(item);
                    }
                    this.pictureList=tmp;
                }
            );

            pageBus.$on(
                "PictureSelect",
                data=>{
                    let that=this;
                    if(this.addFlag===1){
                        //增加首页轮播图内容
                        let params={};
                        params.userId=localStorage.getItem("userId")||'';
                        params.argName=this.indexPicture.argName;
                        params.argValue=this.goodInfo.goodsId;
                        params.pictureUrl=data.id;
                        params.signFlag='Y';
                        saveMallContent(this, params).then(res=>{
                            this.$message.success("新增首页图成功");
                            //关闭对话框
                            this.PictureSelectVisible=false;
                            this.GoodSelectVisible=false;
                            //刷新页面，重新请求首页内容，获取新增记录的id
                            this.initData();
                        }, res=>{
                            this.$message.error(res.msg);
                        });
                    }else{
                        //修改首页轮播图内容
                        let params={};
                        params.userId=localStorage.getItem("userId")||'';
                        params.argName=this.indexPicture.argName;
                        params.argValue=this.goodInfo.goodsId;
                        params.pictureUrl=data.id;
                        params.id=this.indexPicture.id;
                        params.signFlag='Y';
                        uptMallContent(this, params).then(res=>{
                            this.$message.success("修改首页图成功");
                            //关闭对话框
                            this.PictureSelectVisible=false;
                            this.GoodSelectVisible=false;
                            //刷新页面，重新请求首页内容，获取新增记录的id
                            this.initData();
                        }, res=>{
                            this.$message.error(res.msg);
                        });
                    }
                }
            );
        },

        beforeDestroy(){
            pageBus.$off('Response');
            pageBus.$off('PictureSelect');
        },

        methods: {
            initData(){
                //清空数据
                this.allItems=[];
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
                        item.goodName='';
                        item.signFlag=value.signFlag;
                        if(item.argName.startsWith('mall_a_picture')){
                            this.allItems.push(item);
                        }
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
                        //获取所有首页图商品名字
                        this.getGoodNames();
                    }, (res)=>{
                        this.$message.error(res.message);
                    });
                }, (res)=>{
                    this.$message.error(res.message);
                });
            },

            removeHandle(event){
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            },

            //修改
            clickk_update(item){
                this.GoodSelectVisible=true;
                this.indexPicture=item;
                this.setSelectIndex(item);
                this.addFlag=2;
                //通知商户选择组件刷新数据
                pageBus.$emit("GoodSelectOnRefresh", "refresh");
            },

            //新增
            clickk_add(item){
                this.GoodSelectVisible=true;
                this.indexPicture=item;
                this.setSelectIndex(item);
                this.addFlag=1;
            },

            //删除
            click_delete(item){
                delMallIndexById(this, item.id).then(
                    (res)=>{
                    },
                    (res)=>{
                    }
                );
            },

            //重新上传图片
            click_change(item){
                this.setSelectIndex(item);
            },

            setSelectIndex(item){
                let index=0;
                switch(item.argName){
                    case 'mall_a_picture1':
                        index = 0;
                        break;
                    case 'mall_a_picture2':
                        index = 1;
                        break;
                    case 'mall_a_picture3':
                        index = 2;
                        break;
                }
                this.selectIndex=index;
            },

            getGoodNames(){
                this.allItems.forEach((value, index)=>{
                    if(value.argValue!=null&&value.argValue!==''){
                        //获取商品名称
                        let params={};
                        params.goodsId=value.argValue;
                        getGoodsInfoById(this, params).then(
                            (res)=>{
                                this.allItems[index].goodName=res.data.name;
                            }
                        );
                    }
                });
            },

            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 4;

                if(this.allItems[this.selectIndex].argValue==null||this.allItems[this.selectIndex].argValue===""){
                    this.$message.error('请先新增');
                    return false;
                }

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 4MB!');
                }
                return isJPG && isLt2M;
            },

            handelPicturePost(param) {
                let index = 'I';
                let urlParams = {};
                urlParams.url = cfg.service.project + cfg.service.sendGoodsFile.url + '/' + cfg.service.sendGoodsFile.action;
                let fileType = param.file.type === 'image/jpeg' ? 'jpg' : 'mp4';
                urlParams.url += '?goodsId=' + this.allItems[this.selectIndex].argValue;
                urlParams.url += '&fileType=' + fileType + '&index=' + index;
                urlParams.txnId = cfg.service.sendGoodsFile.txnId;
                let goodsFileNames = [];
                goodsFileNames.push(param.file.name);

                // FormData 对象
                let send = new FormData();
                // 文件对象
                send.append("goodsFileNames", param.file);
                // 其他参数

                urlParams.header = {
                    operFlag: '2',
                    'Content-Type': 'multipart/form-data'
                };
                urlParams.UnUserId = true;

                urlParams.signArray = {
                    goodsId: this.allItems[this.selectIndex].argValue,
                    fileType:fileType,
                    index:index,
                };

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        // that.$message.success("上传成功");//debug
                        this.allItems[this.selectIndex].pictureUrl=res.data.filenames;
                        this.indexPicture=this.allItems[this.selectIndex];
                        this.updatePicture();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            getTime(){
                return new Date().getTime();
            },

            updatePicture(){
                //修改首页内容
                let params={};
                params.userId=localStorage.getItem("userId")||'';
                params.argName=this.indexPicture.argName;
                params.argValue=this.indexPicture.argValue;
                params.pictureUrl=this.indexPicture.pictureUrl;
                params.id=this.indexPicture.id;
                uptMallContent(this, params).then(res=>{
                    this.$message.success("修改首页图成功");
                    //关闭对话框
                    this.PictureSelectVisible=false;
                    this.GoodSelectVisible=false;
                    //刷新页面，重新请求首页内容，获取新增记录的id
                    this.initData();
                }, res=>{
                    this.$message.error(res.msg);
                });
            },

            checkArgName(argName){
                let name='';
                switch(argName){
                    case 'mall_a_picture1':
                        name='轮播图1';
                        break;
                    case 'mall_a_picture2':
                        name='轮播图2';
                        break;
                    case 'mall_a_picture3':
                        name='轮播图3';
                        break;
                }
                return name;
            }
        }
    }
</script>

<style scoped>
    .pictureSpan{
        margin-left:10px;
        margin-bottom:10px;
    }

    .pictureSpan>span{
        color: #405060;
    }

    .item-ul {
        display: flex;
        flex-direction: row;
    }

    .item{
        width: 250px;
        height: 195px;
        border:1px solid #3c3f41;
        margin-right:10px;
        padding:10px;
    }

    .img-div{
        /*height:280px;*/
    }

    .drag-list-img {
        width: 100%;
        height: 114px;
    }

    .item-title{
        text-align: center;
        margin-bottom: 5px;
    }

    .item-line{
        height:1px;
        background-color: #2c3e50;
        margin-top: 6px;
    }

    .item-bottom{
        padding-top:10px;
    }

    .item-bottom-div{
        width: 30px;
        margin-right: 10px;
    }

    .item-bottom-img{
        width: 30px;
        margin-right: 10px;
    }

    .el-upload{
        width: 30px;
        margin-left: 10px;
    }

    .pleaseNew{
        text-align: center;
        margin-left:25px;
        margin-right:25px;
        height: 118px;
    }
</style>
