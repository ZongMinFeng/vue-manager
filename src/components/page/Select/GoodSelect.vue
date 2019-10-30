<template>
    <div>
        <el-form :model="selectForm" label-width="100px">
            <el-row :gutter="10">
                <el-col :sm="24" :md="12" :xl="8">
                    <el-form-item label="名称" prop="name">
                        <el-input maxlength="10" placeholder="请输入名称" v-model="selectForm.name" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="gridData" border class="table"
                  @row-dblclick="chooseDoubleClick">
            <el-table-column property="goodsId" label="商品编号" width="160"></el-table-column>
            <el-table-column label="商品主图" width="120" align="center">
                <template slot-scope="scope"><img style="height: 40px;background-color: white;" :src="uploadUrl + scope.row.goodsId + '/'+scope.row.picture"></template>
            </el-table-column>
            <el-table-column property="name" label="商品名称"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           :page-sizes="[5, 10, 20, 30, 40]"
                           :page-size="limitNum"
                           layout="total,sizes, prev, pager, next"
                           :total="AllCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import cfg from "../../../config/cfg";
    import {sendServer} from "../../../util/common";
    import PictureSelect from "../Select/PictureSelect";
    import pageBus from "../PageBus";

    export default {
        name: "GoodSelect",
        props: {
            request:''
        },
        components:{PictureSelect},
        data() {
            return{
                selectForm:{},
                gridData: [
                   //  {
                   //    goodsId: '190520HAT1KA7H6W',
                   //     name: '兰博基尼',
                   // }, {
                   //     goodsId: '190516HDCPN9P568',
                   //     name: '飞行堡垒',
                   //  }, {
                   //     goodsId: '190516G62YX7TTR4',
                   //     name: '电风扇',
                   // }
                ],
                CurPage: 1,   // 设置加载的第几次，默认是第一次
                limitNum: 5,        // 返回数据的个数
                AllCount: 0,    // 总条数
                goodInfo:{

                },
                response:{
                    goodInfo:null,
                    pictureList:[]
                },
                uploadUrl:'',
            }
        },

        created(){
            console.log("props", this.request);//debug
            this.goodsQry();
            pageBus.$on("GoodSelectOnRefresh",(res)=>{
                // console.log("hello, GoodSelectOnRefresh");//debug
                this.onRefresh();
            });
            let mallId = localStorage.getItem('mallId') || '';
            this.uploadUrl = cfg.service.uploadUrl+'/' + mallId + '/';
        },

        beforeDestroy(){
            pageBus.$off('GoodSelectOnRefresh');
        },

        watch:{
            selectForm: {
                deep:true,
                handler:function(val, oldVal){
                    this.onRefresh();
                }
            }
        },

        methods:{
            /**
             * 商品选择对话框行被双击
             * @param row
             */
            chooseDoubleClick(row){
                console.log("row", row);//debug
                pageBus.$emit("Response", row);
            },

            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.goodsQry();
            },

            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.goodsQry();
            },

            // 商品基础信息—分页查询—不验签
            goodsQry() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.qryGoodsInfo.url + '/' + cfg.service.qryGoodsInfo.action;
                urlParams.url += '?page=' + this.CurPage + '&pageSize=' + this.limitNum;
                urlParams.txnId = cfg.service.qryGoodsInfo.txnId;
                if(this.selectForm.name!=null&&this.selectForm.name!==""){
                    send.name=this.selectForm.name;
                }
                //状态为上架
                send.status=1;
                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.status !== 200 && res.status !== 400) {
                            that.$message.error(res.msg);
                            return false;
                        }
                        console.log("res:", res);
                        that.gridData = res.data.rows;
                        that.AllCount = parseInt(res.data.records);
                        //发送准备好通知
                        pageBus.$emit("GoodSelectOk", "ok");
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },

            onRefresh(){
                this.goodsQry();
            },
        }

    }
</script>

<style scoped>
    .table{
        /*height: 200px;*/
    }

    .middle{
        margin-bottom:10px;
    }
</style>
