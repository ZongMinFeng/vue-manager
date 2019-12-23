<template>
    <div>
        <div class="list-name">商品详情操作</div>
        <div class="top-btn">
            <el-upload
                    :action="uploadUrl"
                    multiple
                    list-type="fileList"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :http-request="handelPicturePost">
                <el-button size="small" type="primary">添加图片</el-button>
            </el-upload>
            <el-button size="small" type="primary" class="top-btn-right" @click="onAddTextTap">添加文字</el-button>
            <el-button size="small" type="primary" :disabled="saveDisabled" class="top-btn-right" @click="onSaveTap" style="margin-left: 10px;">
                保存
            </el-button>
            <el-button size="small" type="danger" class="top-btn-right" @click="onTruncatTap" style="margin-left: 10px;">清空</el-button>
        </div>
        <div class="list-name">详情样式展示</div>
        <div class="drag-box-item">
            <draggable v-model="goodsDesc" :move="onMove">
                <transition-group tag="div" id="goodsDesc" class="item-ul" >
                        <div v-for="(item,index) in goodsDesc" :key="index"  class="drag-list-desc">
                            <div v-if="item.flag===1" class="drag-list-img-div-desc">
                                <img :src="uploadUrl+item.cont" class="drag-list-img-desc" :class="index==0?'drag-list-top':(index==goodsDesc.length-1?'drag-list-bottom':'{}')"/>
                            </div>
                            <div v-else class="drag-list-text-desc" :class="index==0?'drag-list-top':(index==goodsDesc.length-1?'drag-list-bottom':'{}')">{{item.cont}}</div>
                            <el-button type="danger" class="drag-list-button-desc" @click="deletePicTap(item, index)">删除</el-button>
                        </div>
                </transition-group>
            </draggable>
        </div>
    </div>
</template>

<script>
    import {sendServer} from '../../../util/common';
    import {genBarCode} from '../../../util/module';
    import cfg from '../../../config/cfg';
    import draggable from 'vuedraggable'
    import {
        getGoodsDescById,
    } from '../../../util/module';
    import pageBus from "../PageBus";

    export default {
        data() {
            return {
                uploadUrl: '',
                goodsId: '',
                oper: null,  // 1: 新增，2：修改
                goodsDesc: [],
                goodId:null,
                saveDisabled:true
            }
        },

        props:{
            data:null
        },

        created() {
            pageBus.$on("goodId", (goodId)=>{
                this.goodId=goodId;
                this.initData();
            });
            pageBus.$on("change", ()=>{
                pageBus.$emit('change2', !this.saveDisabled);
            });
            pageBus.$on("changeTab2", ()=>{
                pageBus.$emit('changeTab2Resp', !this.saveDisabled);
            });
            pageBus.$on('cancelChange2', ()=>{
                this.saveDisabled=true;
            });
        },

        beforeDestroy(){
            pageBus.$off("goodId");
            pageBus.$off("change",);
            pageBus.$off("changeTab2",);
            pageBus.$off("cancelChange2",);
        },

        components: {
            draggable
        },

        methods: {
            initData() {
                this.saveDisabled=true;
                if(this.goodId==null){
                    this.goodsDesc=[];
                    return;
                }
                getGoodsDescById(this, this.goodId).then((goodsDesc) => {
                    if(goodsDesc.data!=null){
                        this.goodsDesc = JSON.parse(goodsDesc.data.goodsDesc || '[]');
                    }else{
                        this.goodsDesc=null;
                    }
                    this.oper = this.goodsDesc ? 2 : 1;
                    let mallId = localStorage.getItem('mallId') || '';
                    this.uploadUrl = cfg.service.uploadUrl+'/' + mallId + '/' + this.goodId + '/';
                }, (res) => {
                    this.$message.error("获取商品详细信息失败");
                });
            },

            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 4;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 4MB!');
                }
                return isJPG && isLt2M;
            },
            handelPicturePost(param) {
                //没有goodId，先保存
                if(this.goodId==null){
                    this.$message.error("请在基础设置先新增商品！");
                    return;
                }

                let urlParams = {};
                let index = 'D';
                // let send = {};
                urlParams.url = cfg.service.project + cfg.service.sendGoodsFile.url + '/' + cfg.service.sendGoodsFile.action;
                let fileType = param.file.type === 'image/jpeg' ? 'jpg' : 'mp4';
                urlParams.url += '?fileType=' + fileType + '&index=' + index;
                // if(this.AddForm.goodsId) {
                urlParams.url += '&goodsId=' + this.goodId;
                // }
                urlParams.txnId = cfg.service.sendGoodsFile.txnId;

                let goodsFileNames = [];
                goodsFileNames.push(param.file.name);

                // FormData 对象
                let send = new FormData();
                // 文件对象
                send.append("goodsFileNames", param.file);
                // 其他参数

                urlParams.header = {
                    operFlag: '1',
                    'Content-Type': 'multipart/form-data'
                };
                urlParams.UnUserId = true;

                urlParams.signArray = {
                    goodsId: this.goodId,
                    index: index,
                    fileType: fileType
                };
                // urlParams.form = send;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        that.$message.success("上传成功");
                        let filenames = res.data.filenames;
                        if (filenames) {
                            let fileArray = res.data.filenames.split(',');
                            if (!fileArray[fileArray.length - 1]) {
                                fileArray.splice(fileArray.length - 1, 1);
                            }
                            let goodsDesc = that.goodsDesc || [];
                            fileArray.forEach(item => {
                                let fileInfo = {
                                    flag: 1,
                                    cont: item
                                };
                                goodsDesc.push(fileInfo);
                            });
                            that.goodsDesc = goodsDesc;
                        }
                        this.saveDisabled=false;
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
            onAddTextTap() {
                //没有goodId，先保存
                if(this.goodId==null){
                    this.$message.error("请在基础设置先新增商品！");
                    return;
                }
                this.$prompt('请输入文字', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '不能为空'
                }).then(({value}) => {
                    // this.$message({
                    //     type: 'success',
                    //     message: '添加成功'
                    // });
                    let goodsDesc = this.goodsDesc || [];
                    let fileInfo = {
                        flag: 2,
                        cont: value
                    };
                    goodsDesc.push(fileInfo);
                    this.goodsDesc = goodsDesc;
                    this.saveDisabled=false;
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },

            onSaveTap() {
                //没有goodId，先保存
                if(this.goodId==null){
                    this.$message.error("请在基础设置先新增商品！");
                    return;
                }
                let urlParams = {};
                let send = {};
                let oper = this.oper;

                urlParams.url = cfg.service.project + cfg.service.saveGoodsDesc.url + '/' + cfg.service.saveGoodsDesc.action;
                urlParams.txnId = cfg.service.saveGoodsDesc.txnId;

                send.goodsId = this.goodId;
                send.goodsDesc = JSON.stringify(this.goodsDesc);
                urlParams.header = {
                    operFlag: oper,
                };

                urlParams.signArray = {
                    goodsId: this.goodId,
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
                        if (oper === 1) {
                            that.$message.success("新增成功");
                        } else {
                            that.$message.success("修改成功");
                        }
                        this.oper=2;
                        this.saveDisabled=true;
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            //清空数据
            onTruncatTap(){
                this.$confirm('是否清空数据? 确定清空后点击保存', "清空", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'error'
                }).then(
                    ()=>{
                        this.goodsDesc=[];
                        this.saveDisabled=false;
                    }
                ).catch(()=>{
                    this.$message({
                        type:'info',
                        message:'已取消'
                    });
                });
            },

            deletePicTap(item, index){
                this.goodsDesc.splice(index, 1);
                this.saveDisabled=false;
            },

            onMove(){
                this.saveDisabled=false;
            }
        },

    }
</script>

<style>
    .list-name {
        color: #A0A0A0;
        padding: 10px 0;
    }

    .top-btn {
        display: flex;
        flex-direction: row;
        padding-bottom: 10px;
    }

    .top-btn-right {
        margin-left: 10px;
    }

    .drag-box-item {
        display: flex;
        flex-direction: column;
        /*background-color: #eff1f5;*/
        margin-right: 16px;
        /*border-radius: 6px;*/
        /*border: 1px #e1e4e8 solid;*/
    }

    .item-ul{
        /*padding: 0 8px 8px;*/
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
    }

    .drag-list-desc {
        display: flex;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
        /*width: 300px;*/
    }

    .drag-list-img-div-desc{
        float: left;
        width:300px;
    }

    .drag-list-img-desc {
        /*border: 1px #e1e4e8 solid;*/
        border-left: 1px solid #e1e4e8; border-right: 1px solid #e1e4e8;
        width: 100%;
        height: auto;
        margin:0px;
        padding:0px;
        float:left;
    }

    .drag-list-top {
        border-top: 1px solid #e1e4e8;
    }

    .drag-list-bottom {
        border-bottom: 1px solid #e1e4e8;
    }

    .drag-list-text-desc {
        float: left;
        /*border: 1px #e1e4e8 solid;*/
        border-left: 1px solid #e1e4e8; border-right: 1px solid #e1e4e8;
        text-align: center;
        padding: 10px 0;
        width: 300px;
    }

    .drag-list-text-desc>text{
        width:300px;
    }

    .drag-list-button-desc{
        margin-left:5px;
        float: left;
        height:35px;
    }
</style>
