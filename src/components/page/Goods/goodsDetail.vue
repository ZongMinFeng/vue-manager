<template>
    <div class="container">
        <div class="goods-detail-top">
            <span class="goods-name">{{GoodsDetail.Name}}</span>
            <div>
                <el-button type="text" icon="el-icon-edit" @click="onEditTap()">修改</el-button>
                <el-button type="text" style="padding-left: 5px" icon="el-icon-delete" @click="onDeleteTap()">删除
                </el-button>
            </div>
        </div>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="4">
                <span>编码：</span>
                <span class="goods-detail-type">{{GoodsDetail.Id}}</span>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="4">
                <span>快捷拼音：</span>
                <span class="goods-detail-type">{{GoodsDetail.PyCode}}</span>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="4">
                <span>规格：</span>
                <span class="goods-detail-type">{{GoodsDetail.Spec}}</span>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="4">
                <span>分类：</span>
                <span class="goods-detail-type">{{GoodsDetail.TypeName}}</span>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="4">
                <span>品牌：</span>
                <span class="goods-detail-type">{{GoodsDetail.BrandName}}</span>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="4">
                <span>单位：</span>
                <span class="goods-detail-type">{{GoodsDetail.UnitName}}</span>
            </el-col>

        </el-row>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="4">
                <span>条码：</span>
                <el-popover v-if="GoodsDetail.BarCode"
                    placement="bottom"
                    trigger="click">
                    <div v-for="(unit, index) in GoodsDetail.UnitCalcArray" :key="index">
                        <span>{{unit.UnitName}}：</span>
                        <span>{{unit.BarCode}}</span>
                    </div>
                    <el-button class="barcode-btn"  slot="reference">{{GoodsDetail.BarCode}}</el-button>
                </el-popover>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="5" :xl="4">
                <span>货号：</span>
                <span class="goods-detail-type">{{GoodsDetail.CargoNum}}</span>
            </el-col>
        </el-row>
        <div class="list-name">商品价格</div>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
                <span>零售价：</span>
                <span class="goods-detail-type">{{GoodsDetail.RetailPrice}}</span>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="3">
                <span>会员价：</span>
                <span class="goods-detail-type">{{GoodsDetail.AssociatorPrice}}</span>
            </el-col>
        </el-row>
        <div class="list-name">商品预警</div>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8">
                <span>保质期预警：</span>
                <span v-if="GoodsDetail.ExpFlag === '2'" class="goods-detail-type">未开启</span>
                <span v-else>{{GoodsDetail.SafePeriod}}天</span>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8">
                <span>库存预警：</span>
                <span v-if="GoodsDetail.StockAlarmFlag === '2'" class="goods-detail-type">未开启</span>
                <span v-if="GoodsDetail.StockAlarmFlag === '1' && GoodsDetail.StockLimitUp" class="goods-detail-type">库存上限：{{GoodsDetail.StockLimitUp}}</span>
                <span v-if="GoodsDetail.StockAlarmFlag === '1' &&  GoodsDetail.StockLimitLow" class="goods-detail-type">库存下限：{{GoodsDetail.StockLimitLow}}</span>
            </el-col>
        </el-row>
        <div class="list-name">商品备注</div>
        <div>{{GoodsDetail.GoodsMemo}}</div>
    </div>
</template>

<script>
    import {goodsTypeInfoMore, unitQry} from '../../../util/module';
    import {sendServer} from '../../../util/common';
    import cfg from '../../../config/cfg';

    export default {

        data() {
            return {
                GoodsDetail: {}
            }
        },
        methods: {
            initGoods() {
                let query = this.$route.query || {};
                let UnitCalc = query.UnitCalcJson || '[]';
                query.UnitCalcArray = JSON.parse(UnitCalc);
                let unitInfo = {
                    BarCode: query.BarCode,
                    UnitName: query.UnitName
                };
                query.UnitCalcArray.unshift(unitInfo);

                this.GoodsDetail = query;
            },
            // 修改商品
            onEditTap() {
                let unitArray = this.$store.state.unitArray;
                let GoodsDetail = this.GoodsDetail;
                if (unitArray) {
                    goodsTypeInfoMore(this, '/addGoods', GoodsDetail);
                } else {
                    let that = this;
                    unitQry(this).then(
                        (res) => {
                            goodsTypeInfoMore(that, '/addGoods', GoodsDetail);
                        }, (res) => {
                            that.$message.error('请求失败');
                        })

                }
            },
            // 删除
            onDeleteTap() {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.goodsDel();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //删除商品
            goodsDel() {
                console.log("goodsDel")
                let urlParams = {};
                let send = {};

                urlParams.url = cfg.service.project + cfg.service.goodsDel.url + '/' + cfg.service.goodsDel.action;

                send.TxnId = cfg.service.goodsDel.txnId;
                let Goods = [];
                // send.Id = this.GoodsDetail.Id;
                let GoodsInfo = {
                    Id: this.GoodsDetail.Id
                };
                Goods.push(GoodsInfo);
                send.Count = Goods.length;
                send.Goods = Goods;
                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            that.$message.error(res.RespDesc);
                            return false;
                        }
                        that.$message.success("删除成功");
                        that.$store.commit('goodsRefreshT');
                        that.$router.push('/goodsManage');
                        // that.goodsQry();
                    }, (res) => {
                        // 失败
                        that.$message.error('请求失败');
                    }
                );
            },
        },
        created() {
            this.initGoods()
        },
        computed: {},
        watch: {
            $route(newValue, oldValue) {
                if (newValue.path === "/goodsDetail") {
                    this.initGoods()
                }
            },
        }
    }
</script>

<style>
    .goods-detail-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .goods-detail-top button {
        font-size: 15px;
    }

    .goods-detail-type {
        color: #A0A0A0;
    }

    .list-name {
        color: #A0A0A0;
        padding-top: 10px;
    }

    .goods-name {
        font-size: 20px;
    }
    .barcode-btn {
        padding: 0;
        font-size: 15px;
        border-width: 0;
    }
</style>
