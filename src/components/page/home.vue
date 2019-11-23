<template>
    <div>
        <el-card shadow="hover" class="mgb20 cont-top">
            <div class="user-info">
                <!--<img src="static/img/img.png" class="user-avator" alt="">-->
                <div class="user-info-cont">
                    <div class="user-info-name">{{name}}</div>
                    <div>{{role}}</div>
                </div>
            </div>
            <div class="user-info-list">欢迎登录：<span>{{mallName}}</span></div>
        </el-card>

        <div class="body-cont">
            <el-card shadow="hover" class="mgb20  mgb21">
                <schart canvasId="unholderOrders"
                        :type="type"
                        :width="width"
                        :height="height"
                        :data="unholderOrders"
                        :options="unholderOrderOptions">
                </schart>
            </el-card>

            <el-card shadow="hover" class="mgb20 mgb21">
                <schart canvasId="acceptOrders"
                        :type="type"
                        :width="width"
                        :data="acceptOrders"
                        :options="acceptOrderOptions">
                </schart>
            </el-card>

            <el-card shadow="hover" class="mgb20 mgb21">
                <schart canvasId="orderAmts"
                        :type="type"
                        :width="width"
                        :data="orderAmts"
                        :options="orderAmtsOptions">
                </schart>
            </el-card>
        </div>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import {sendServer} from './../../util/common';
    import cfg from '../../config/cfg';
    import moment from 'moment';
    import {qryMallDailyOrderRpt} from '@/util/module.js';

    export default {
        data() {
            return {
                name: localStorage.getItem('UserName'),
                canvasId: 'myCanvas',
                type: 'bar',
                width: 600,
                height: 500,
                mallName:null,
                unholderOrders:[],
                unholderOrderOptions:{
                    title:'未处理订单数量',
                    // bgColor: '#009688',
                    // titleColor: '#ffffff',
                    // fillColor: '#e0f2f1',
                    // axisColor: '#ffffff',
                    // contentColor: '#999'
                },
                acceptOrders:[],
                acceptOrderOptions:{
                    title:'当日接单数量',
                    // bgColor: '#009688',
                    // titleColor: '#ffffff',
                    // fillColor: '#e0f2f1',
                    // axisColor: '#ffffff',
                    // contentColor: '#999'
                },
                orderAmts:[],
                orderAmtsOptions:{
                    title:'当日订单总额',
                    // bgColor: '#009688',
                    // titleColor: '#ffffff',
                    // fillColor: '#e0f2f1',
                    // axisColor: '#ffffff',
                    // contentColor: '#999'
                },
                shopList:[],
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created() {
            // this.userOprDayDetail();
            this.mallName=localStorage.getItem('mallName');
            this.qryMallDailyOrderRpt();
        },
        methods: {
            //商城当日订单数据
            qryMallDailyOrderRpt(){
                let params={};
                qryMallDailyOrderRpt(this, params).then(
                    (res)=>{
                        console.log('res', res);//debug
                        this.shopList=res.data.shopList;
                        console.log('shopList', this.shopList);//debug
                        let orders=res.data.dayRpt;
                        orders.forEach((item)=>{
                            let unholderOrder={};
                            unholderOrder.name=this.getShopName(item.shopId);
                            unholderOrder.value=item.totalUndoCnt;
                            this.unholderOrders.push(unholderOrder);

                            let acceptOrder={};
                            acceptOrder.name=this.getShopName(item.shopId);
                            acceptOrder.value=item.totalCnt;
                            this.acceptOrders.push(acceptOrder);

                            let orderAmt={};
                            orderAmt.name=this.getShopName(item.shopId);
                            orderAmt.value=item.totalAmt;
                            this.orderAmts.push(orderAmt);
                        });
                        console.log('unholderOrderOptions', this.unholderOrderOptions);//debug
                    },
                    (res)=>{

                    }
                ).catch();
            },

            getShopName(shopId){
                if (this.shopList.length === 0) {
                    return null;
                }
                let shopName='';
                this.shopList.forEach((item)=>{
                   if (item.shopId === shopId) {
                       shopName=item.shopName
                   }
                });
                let shopNameNew=shopName;
                if (shopName.length>6){
                    shopNameNew=shopName.substring(0,6)+'\n\t'+shopName.substring(6, shopName.length-6);
                }
                return shopNameNew;
            },
        }
    }

</script>


<style scoped>
    .body-cont {
        /*width: 100%;*/
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        /*justify-content: space-around;*/
        /*justify-content: space-between;*/
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 10px;
        color: #4c2cff;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .mgb21 {
        float: left;
        margin-right: 10px;
    }

    .cont-top {
        width: 100%;
        min-width: 350px;
    }

    .content-title {
        clear: both;
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
        /*min-width: 400px;*/
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

</style>
