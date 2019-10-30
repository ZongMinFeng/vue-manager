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
            <div class="user-info-list">欢迎登录：<span>云店后台管理</span></div>
        </el-card>
        <!--<div class="body-cont">-->
            <!--<el-card shadow="hover" class="mgb20">-->
                <!--<div class="content-title">{{UserRgstOptions.contentTitle}}</div>-->
                <!--<schart canvasId="UserRgst" width="400" height="300" :data="UserRgst" type="bar"-->
                        <!--:options="UserRgstOptions"></schart>-->
            <!--</el-card>-->
            <!--<el-card shadow="hover" class="mgb20">-->
                <!--<div class="content-title">{{StoreRgstOptions.contentTitle}}</div>-->
                <!--<schart canvasId="StoreRgst" width="400" height="300" :data="UserRgst" type="bar"-->
                        <!--:options="StoreRgstOptions"></schart>-->
            <!--</el-card>-->
            <!--<el-card shadow="hover" class="mgb20">-->
                <!--<div class="content-title">{{TidRgstOptions.contentTitle}}</div>-->
                <!--<schart canvasId="TidRgst" width="400" height="300" :data="TidRgst" type="bar"-->
                        <!--:options="TidRgstOptions"></schart>-->
            <!--</el-card>-->
            <!--<el-card shadow="hover" class="mgb20">-->
                <!--<div class="content-title">{{GoodsAddOptions.contentTitle}}</div>-->
                <!--<schart canvasId="GoodsAdd" width="400" height="300" :data="GoodsAdd" type="bar"-->
                        <!--:options="GoodsAddOptions"></schart>-->
            <!--</el-card>-->
            <!--<el-card shadow="hover" class="mgb20">-->
                <!--<div class="content-title">{{GdsAddSOptions.contentTitle}}</div>-->
                <!--<schart canvasId="GdsAddS" width="400" height="300" :data="GdsAddS" type="bar"-->
                        <!--:options="GdsAddSOptions"></schart>-->
            <!--</el-card>-->
            <!--<el-card shadow="hover" class="mgb20">-->
                <!--<div class="content-title">{{MobileLgOptions.contentTitle}}</div>-->
                <!--<schart canvasId="MobileLg" width="400" height="300" :data="MobileLg" type="bar"-->
                        <!--:options="MobileLgOptions"></schart>-->
            <!--</el-card>-->
            <!--<el-card shadow="hover" class="mgb20">-->
                <!--<div class="content-title">{{PosLgOptions.contentTitle}}</div>-->
                <!--<schart canvasId="PosLg" width="400" height="300" :data="PosLg" type="bar"-->
                        <!--:options="PosLgOptions"></schart>-->
            <!--</el-card>-->
        <!--</div>-->
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import {sendServer} from './../../util/common';
    import cfg from '../../config/cfg';
    import moment from 'moment'

    export default {
        data() {
            return {
                name: localStorage.getItem('UserName'),
                // UserRgstOptions: {
                //     title: '',
                //     contentTitle: '注册用户数',
                //     // bgColor: '#009688',
                //     // titleColor: '#ffffff',
                //     // fillColor: '#e0f2f1',
                //     // axisColor: '#ffffff',
                //     // contentColor: '#999'
                // },
                // StoreRgstOptions: {
                //     title: '',
                //     contentTitle: '注册店铺数',
                //     // bgColor: '#009688',
                //     // titleColor: '#ffffff',
                //     // fillColor: '#e0f2f1',
                //     // axisColor: '#ffffff',
                //     // contentColor: '#999'
                // },
                // TidRgstOptions: {
                //     title: '',
                //     contentTitle: '绑定终端数',
                //     // bgColor: '#009688',
                //     // titleColor: '#ffffff',
                //     // fillColor: '#e0f2f1',
                //     // axisColor: '#ffffff',
                //     // contentColor: '#999'
                // },
                // GoodsAddOptions: {
                //     title: '',
                //     contentTitle: '商品添加数',
                //     // bgColor: '#009688',
                //     // titleColor: '#ffffff',
                //     // fillColor: '#e0f2f1',
                //     // axisColor: '#ffffff',
                //     // contentColor: '#999'
                // },
                // GdsAddSOptions: {
                //     title: '',
                //     contentTitle: '添加商品店铺数',
                //     // bgColor: '#009688',
                //     // titleColor: '#ffffff',
                //     // fillColor: '#e0f2f1',
                //     // axisColor: '#ffffff',
                //     // contentColor: '#999'
                // },
                // MobileLgOptions: {
                //     title: '',
                //     contentTitle: '小程序登陆用户数',
                //     // bgColor: '#009688',
                //     // titleColor: '#ffffff',
                //     // fillColor: '#e0f2f1',
                //     // axisColor: '#ffffff',
                //     // contentColor: '#999'
                // },
                // PosLgOptions: {
                //     title: '',
                //     contentTitle: 'POS登陆用户数',
                //     // bgColor: '#009688',
                //     // titleColor: '#ffffff',
                //     // fillColor: '#e0f2f1',
                //     // axisColor: '#ffffff',
                //     // contentColor: '#999'
                // },
                // UserRgst: [], //注册用户数
                // StoreRgst: [], //注册店铺数
                // TidRgst: [], //绑定终端数
                // GoodsAdd: [], //商品添加数
                // GdsAddS: [], //添加商品店铺数
                // MobileLg: [], //小程序登陆用户数
                // PosLg: [], //POS登陆用户数
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
        },
        methods: {
            //3.2.1	用户活动每日统计
            userOprDayDetail() {
                let urlParams = {};
                let send = {};
                urlParams.url = cfg.service.project + cfg.service.userOprDayDetail.url + '/' + cfg.service.userOprDayDetail.action;
                send.TxnId = cfg.service.userOprDayDetail.txnId;
                send.CustQryNum = '7';
                send.CurPage = '1';
                send.OrderFlag = '1';

                let EndDate = moment(moment().subtract(1, 'days')).format('YYYYMMDD');
                let BegDate = moment(moment().subtract(7, 'days')).format('YYYYMMDD');
                send.EndDate = EndDate;
                send.BegDate = BegDate;

                urlParams.send = send;
                let that = this;
                sendServer(urlParams, this).then(
                    (res) => {
                        // 成功
                        if (res.RespCode !== '0000') {
                            this.$message.error(res.RespDesc);
                            return false;
                        }
                        res.UserActSum.forEach(item => {
                            let item1 = {};
                            let item2 = {};
                            let item3 = {};
                            let item4 = {};
                            let item5 = {};
                            let item6 = {};
                            let item7 = {};
                            let name = item.Date.substr(6, 2);
                            item1.name = name;
                            item2.name = name;
                            item3.name = name;
                            item4.name = name;
                            item5.name = name;
                            item6.name = name;
                            item7.name = name;
                            item1.value = parseInt(item.UserRgst);
                            item2.value = parseInt(item.StoreRgst);
                            item3.value = parseInt(item.TidRgst);
                            item4.value = parseInt(item.GoodsAdd);
                            item5.value = parseInt(item.GdsAddS);
                            item6.value = parseInt(item.MobileLg);
                            item7.value = parseInt(item.PosLg);
                            that.UserRgst.push(item1);
                            that.StoreRgst.push(item2);
                            that.TidRgst.push(item3);
                            that.GoodsAdd.push(item4);
                            that.GdsAddS.push(item5);
                            that.MobileLg.push(item6);
                            that.PosLg.push(item7);
                        });
                        that.UserRgstOptions.title = `${BegDate} - ${EndDate}`;
                        that.StoreRgstOptions.title = `${BegDate} - ${EndDate}`;
                        that.TidRgstOptions.title = `${BegDate} - ${EndDate}`;
                        that.GoodsAddOptions.title = `${BegDate} - ${EndDate}`;
                        that.GdsAddSOptions.title = `${BegDate} - ${EndDate}`;
                        that.MobileLgOptions.title = `${BegDate} - ${EndDate}`;
                        that.PosLgOptions.title = `${BegDate} - ${EndDate}`;

                    }, (res) => {
                        // 失败
                        this.$message.error('请求失败');
                    }
                );
            }
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
        justify-content: space-between;
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
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
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
        word-break:keep-all;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }

</style>
