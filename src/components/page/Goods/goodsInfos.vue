<template>
    <div>
        <el-tabs type="border-card" v-model="activeName" :before-leave="beforeLeave">
            <el-tab-pane label="基础" name="first">
                <goods-base :data="{goodId:goodId}" ></goods-base>
            </el-tab-pane>
            <el-tab-pane label="详情" :disabled="disable2" name="second">
                <goods-desc :data="{goodId:goodId}"></goods-desc>
            </el-tab-pane>
            <el-tab-pane label="规格" :disabled="disable3"  name="third">
                <goods-spec :data="{goodId:goodId}"></goods-spec>
            </el-tab-pane>
            <el-tab-pane label="系列" :disabled="disable4"  name="fourth">
                <goods-serials-tab :data="{goodId:goodId}"></goods-serials-tab>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import goodsBase from "./goodsBase";
    import goodsDesc from "./goodsDesc";
    import goodsSpec from "./goodsSpec";
    import goodsSerialsTab from "../GoodsSerials/GoodsSerials";
    import pageBus from "../PageBus";
    export default {
        name: "goodsInfos",
        components:{goodsBase, goodsDesc, goodsSpec, goodsSerialsTab},
        data(){
            return{
                oper:2,//1.新增，2.修改
                goodId:null,
                activeName:'fourth',
                disable2:true,
                disable3:true,
                disable4:true,
                changes:{
                    nextReady:null,
                    mem1:{
                        change:false,
                        answer:false
                    },
                    mem2:{
                        change:false,
                        answer:false
                    },
                    mem3:{
                        change:false,
                        answer:true
                    },
                    mem4:{
                        change:false,
                        answer:true
                    },
                },
                changeTabs:{
                    needCheck:true,
                    nextReady:null,
                    mem1:{
                        change:false,
                        answer:false
                    },
                    mem2:{
                        change:false,
                        answer:false
                    },
                    mem3:{
                        change:false,
                        answer:true
                    },
                    mem4:{
                        change:false,
                        answer:true
                    },
                },
                timer:null,
                checkNum:0,
                firstInit:true
            }
        },

        created(){
            console.log("query", this.$route.query);//debug
            this.activeName='first';
            pageBus.$on('disable',(data)=>{
                this.disable2=data;
                this.disable3=data;
                this.disable4=data;
            });
            pageBus.$on('change1', (data)=>{
                this.changes.mem1.answer=true;
                this.changes.mem1.change=data;
            });
            pageBus.$on('change2', (data)=>{
                this.changes.mem2.answer=true;
                this.changes.mem2.change=data;
            });
            pageBus.$on('changeTab1Resp', (data)=>{
                console.log("changeTab1Resp hello", data);//debug
                this.changeTabs.needCheck=false;
                if(data===true){
                    //基础信息有修改
                    console.log("基础信息有修改");//debug
                    this.$confirm('您还未保存基础信息页面内容，确定需要退出吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 选择确定
                        pageBus.$emit('cancelChange1');
                        this.activeName=this.changeTabs.nextReady;
                    }, ()=>{
                        //选择取消
                        this.changeTabs.needCheck=true;
                    })
                }else{
                    this.activeName=this.changeTabs.nextReady;
                }
            });
            pageBus.$on('changeTab2Resp', (data)=>{
                console.log("changeTab1Resp hello", data);//debug
                this.changeTabs.needCheck=false;
                if(data===true){
                    //基础信息有修改
                    console.log("基础信息有修改");//debug
                    this.$confirm('您还未保存详情页面内容，确定需要退出吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 选择确定
                        pageBus.$emit('cancelChange2');
                        this.activeName=this.changeTabs.nextReady;
                    }, ()=>{
                        //选择取消
                        this.changeTabs.needCheck=true;
                    })
                }else{
                    this.activeName=this.changeTabs.nextReady;
                }
            });
            pageBus.$on('changeTab3Resp', (data)=>{
                console.log("changeTab3Resp hello", data);//debug
                this.changeTabs.needCheck=false;
                if(data===true){
                    //基础信息有修改
                    console.log("规格有修改");//debug
                    this.$confirm('您还未保存规格页面内容，确定需要退出吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 选择确定
                        pageBus.$emit('cancelChange3');
                        this.activeName=this.changeTabs.nextReady;
                    }, ()=>{
                        //选择取消
                        this.changeTabs.needCheck=true;
                    })
                }else{
                    this.activeName=this.changeTabs.nextReady;
                }
            });
        },

        mounted(){
            console.log("hello, goodsInfos mounted");
            //必须放在这里进行数据初始化，goodsBase、goodsDesc、goodsSpec、GoodsSerials需要时间进行pageBus的监听
            if(this.firstInit){
                this.init();
                this.firstInit=false;
            }
        },

        destroyed(){
            console.log("goodsInfos destroyed!");//debug
        },

        beforeRouteLeave: function(to, from , next){
            next(false);
            pageBus.$emit('change');
            this.changes.nextReady=next;
            //启动定时器，每隔100毫秒检测下子组件有没有回答修改内容,6次后停止定时器
            this.timer = setInterval(this.checkChanges, 100);
        },

        methods:{
            init(){
                console.log("query", this.$route.query);//debug
                let goodId=this.$route.query.goodId;
                if(goodId==null){
                    let oper=this.$route.query.oper;
                    if(oper!=null){
                        this.goodId=null;
                        this.activeName="first";
                        this.disable2=true;
                        this.disable3=true;
                        this.disable4=true;
                    }
                }else{
                    this.goodId=goodId;
                    this.disable2=false;
                    this.disable3=false;
                    this.disable4=false;
                }
                pageBus.$emit("goodId", this.goodId);

                let activeName=this.$route.query.flag;
                if(activeName!=null){
                    this.activeName=activeName;
                }
            },

            checkChanges(){
                //如果都有应答，那么停止定时器
                let c1=this.changes.mem1.answer;
                let c2=this.changes.mem1.answer;
                let c3=this.changes.mem1.answer;
                let c4=this.changes.mem1.answer;
                let haveChange=false;
                if(c1 && c2 && c3 && c4){
                    if(this.timer!=null){
                        clearInterval(this.timer);
                        console.log("停止计时器");//debug
                    }
                    if(this.changes.mem1.change===true){
                        //基础信息有修改
                        console.log("基础信息有修改");//debug
                        haveChange=true;
                        this.$confirm('您还未保存基础信息页面内容，确定需要退出吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            // 选择确定
                            this.changes.nextReady();
                        })
                    }
                    if(this.changes.mem2.change===true){
                        //详情有修改
                        console.log("详情有修改");//debug
                        haveChange=true;
                        this.$confirm('您还未保存详情页面内容，确定需要退出吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            // 选择确定
                            this.changes.nextReady();
                        })
                    }
                    if(!haveChange){
                        if(this.changes.nextReady!=null){
                            this.changes.nextReady();
                        }
                    }
                }
                //超时，停止计时器
                if(this.checkNum>5){
                    if(this.timer!=null){
                        clearInterval(this.timer);
                        console.log("超时，停止计时器");//debug
                    }
                    if(this.changes.nextReady!=null){
                        this.changes.nextReady();
                    }
                }
                this.checkNum++;
            },

            //切换tab项前检查
            beforeLeave(event){
                console.log("hello, beforeLeave!", event);//debug
                console.log("now", this.activeName);//debug
                let canReturn=true;
                console.log("this.changeTabs.needCheck", this.changeTabs.needCheck);//debug
                if(this.changeTabs.needCheck===true){
                    this.changeTabs.nextReady=event;
                    switch(this.activeName){
                        case 'first':
                            canReturn=false;
                            //询问基础页有没有变化
                            pageBus.$emit("changeTab1");
                            break;
                        case 'second':
                            canReturn=false;
                            //询问详情页有没有变化
                            pageBus.$emit("changeTab2");
                            break;
                        case 'third':
                            canReturn=false;
                            //询问详情页有没有变化
                            pageBus.$emit("changeTab3");
                            break;
                    }
                }else{
                    this.changeTabs.needCheck=true;
                }
                console.log("canReturn", canReturn);//debug
                return canReturn;
            }
        }
    }
</script>

<style scoped>

</style>
