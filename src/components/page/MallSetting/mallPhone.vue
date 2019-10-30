<template>
    <div style=" width: 100%; height: 100%; background-color: white;">
        <el-card class="form-container" shadow="never">
            <el-row v-for="(item, index) in allItems">
                <el-col :span="5">
                    <div style="margin-top: 3px;">{{item.chnExplain}}</div>
                </el-col>
                <el-col :span="15">
                    <el-input style="width: 100%;" v-model="item.argValue"></el-input>
                </el-col>
                <el-col :span="4" v-if="item.argValue!==oldAllItems[index].argValue">
                    <el-button v-if="oldAllItems[index].argValue!=null&&oldAllItems[index].argValue!==''" type="primary" @click="savePhone(item)">保存</el-button>
                    <el-button v-else type="success" @click="addPhone(item)">新增</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>

</template>

<script>
    import {
        getSysMallConfig,
        getMallContent,
        saveMallContent,
        uptMallContent
    } from "../../../util/module";
    export default {
        name: "mallPhone",

        data(){
            return {
                allItems:[],
                oldAllItems:[],
            };
        },

        created(){
            this.initData();
        },

        methods:{
            initData(){
                //清空数据
                this.allItems=[];
                this.oldAllItems=[];
                //获取配置信息
                getSysMallConfig(this).then((res)=>{
                    console.log("getSysMallConfig", res.data);//debug
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
                        if(item.argName.startsWith('config_service_phone')){
                            this.allItems.push(item);
                        }

                        let item2={};
                        item2.id='';
                        item2.mallId='';
                        item2.argName=value.engFlag;
                        item2.argValue='';
                        item2.chnExplain=value.chnExplain;
                        item2.status=1;
                        item2.pictureUrl='';
                        item2.goodName='';
                        item2.signFlag=value.signFlag;
                        if(item2.argName.startsWith('config_service_phone')){
                            this.oldAllItems.push(item2);
                        }
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
                                    this.allItems[i].signFlag=value.signFlag;

                                    this.oldAllItems[i].id=value.id;
                                    this.oldAllItems[i].argValue=value.argValue;
                                    this.oldAllItems[i].pictureUrl=value.pictureUrl;
                                    this.oldAllItems[i].status=value.status;
                                    this.oldAllItems[i].mallId=value.mallId;
                                    this.oldAllItems[i].signFlag=value.signFlag;
                                    break;
                                }
                            }
                        });
                        console.log("new allItems", this.allItems);//debug
                        console.log("oldAllItems", this.oldAllItems);//debug
                    }, (res)=>{
                        this.$message.error(res.message);
                    });
                }, (res)=>{
                    this.$message.error(res.message);
                });
            },

            //修改客服电话
            savePhone(item){
                if(item.argValue===''){
                    this.$message.error('值不可为空');
                    return;
                }
                let params={
                    id:item.id,
                    userId:localStorage.getItem("usrId")||'',
                    argValue:item.argValue,
                    signFlag:item.signFlag,
                };
                uptMallContent(this, params).then((res)=>{
                    this.$message.success("修改客服电话成功");
                    this.initData();
                }, (res)=>{
                    this.$message.error(res.msg);
                });
            },

            //新增客服电话
            addPhone(item){
                if(item.argValue===''){
                    this.$message.error('值不可为空');
                    return;
                }
                let params={
                    userId:localStorage.getItem("usrId")||'',
                    argName:item.argName,
                    argValue:item.argValue,
                    signFlag:item.signFlag,
                };
                saveMallContent(this, params).then((res)=>{
                    this.$message.success("新增客服电话成功");
                    this.initData();
                }, (res)=>{
                    this.$message.error(res.msg);
                });
            },

        }
    }
</script>

<style scoped>
    .form-container{
        width: 500px;
        text-align:center;
        position:absolute;
        left: 50%;
        top:30%;
        margin-left:  -250px;
    }
</style>
