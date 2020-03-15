<template>
    <div style="background-color: white;padding: 10px;">
        <el-form :model="selectForm">
            <el-row>
                <el-col :md="6" :sm="8" :xl="8">
                    <el-form-item label="状态" prop="type">
                        <el-select v-model="selectForm.status" clearable placeholder="请选择" @change="statusChange">
                            <el-option v-for="item in orderStatusArray" :key="item.id" :label="item.id+':'+item.detail"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col v-if="this.shops.length>0" :md="6" :sm="8" :xl="8">
                    <el-form-item label="店铺" prop="type">
                        <el-select v-model="selectForm.shopId" clearable placeholder="请选择店铺" @change="shopChange">
                            <el-option v-for="item in shops" :key="item.shopId" :label="item.area+':'+item.shopName"
                                       :value="item.shopId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="8" :xl="8">
                    &nbsp;
                </el-col>
                <el-col :md="6" :sm="8" :xl="8">
                    <el-button style="float: right; margin-right: 20px;" type="primary" @click="initdata">刷新</el-button>
                </el-col>
            </el-row>
        </el-form>

        <el-table v-loading = "tableLoading" :data="orders" stripe border size="medium" class="table" @row-dblclick="rowDblclick">
            <el-table-column prop="orderId" label="订单编号" width="120"></el-table-column>
            <el-table-column label="商品信息" width="170">
                <template slot-scope="props">
                    <div style="overflow-x: auto;">
                        <div v-for="(item, index) in props.row.orderDetailList"
                             style="width: 44px; margin-right: 5px; float: left; padding: 1px;">
                            <div style="width: 100%; float: left;">
                                <img style="height: 40px; width: 40px;background-color: white;" :preview="index"
                                     :src="uploadUrl + item.goodsId + '/'+item.tranImg">
                            </div>
                            <p style="font-size: 8px;" :title="item.goodsName">{{item.goodsName.substring(0, 4)}}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="payAmt" label="支付金额" width="100"></el-table-column>
            <el-table-column prop="uptAmt" label="优惠金额" width="100"></el-table-column>
            <el-table-column label="订单金额" width="150">
                <template slot-scope="props">
                    <p>订单总价:{{props.row.orderAmt}}元</p>
                    <p>运费:{{props.row.postFee}}元</p>
                </template>
            </el-table-column>
            <el-table-column label="商品金额数量" width="150">
                <template slot-scope="props">
                    <p>商品总价:{{props.row.goodsAllAmt}}元</p>
                    <p>商品总条数:{{props.row.orderDetailList.length}}</p>
                </template>
            </el-table-column>
            <el-table-column label="时间" width="225">
                <template slot-scope="props">
                    <p>创建时间：{{toDate(props.row.createDate)}}</p>
                    <p>支付时间：{{toDate(props.row.paymentTime)}}</p>
                </template>
            </el-table-column>
            <!--<el-table-column label="信息" width="70">-->
            <!--<template slot-scope="props">-->
            <!--<p v-if="props.row.payStatus==='Y'" style="color: green;">已支付</p>-->
            <!--<p v-else style="color: red;">未支付</p>-->
            <!--<p v-if="props.row.closedComment==='Y'" style="color: green;">已评论</p>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="订单状态">
                <template slot-scope="props">
                    <p>{{orderStatus(props.row.status)}}</p>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="props">
                    <div style="margin-bottom: 2px">
                        <el-button v-if="props.row.status===8" type="primary" @click="takeOrderTap(props.row)">接单
                        </el-button>
                    </div>
                    <div style="margin-bottom: 2px">
                        <el-button v-if="props.row.status===7" type="primary" @click="deliverGoodsTap(props.row)">发货
                        </el-button>
                    </div>
                    <div>
                        <el-button v-if="props.row.status===9" type="warning" @click="uptOrderPayAmtTap(props.row)">
                            优惠金额
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="limitNum"
                           layout="total,sizes, prev, pager, next"
                           :total="AllCount">
            </el-pagination>
        </div>

        <el-dialog :visible.sync="dialogStatus" width="40%">
            <el-row>
                <el-col :md="13" :sm="8" :xl="8" style="background-color: #FBFBFB">
                    <div style="border: 1px solid #DDDDDD; height: 180px;">
                        <div style="border-bottom: 1px solid #DDDDDD; padding-top: 2px; padding-bottom: 2px; padding-left: 10px; background-color: #F3F3F3">
                            <h5>订单信息</h5>
                        </div>
                        <div>
                            <ul style="list-style-type:none;">
                                <li style="margin-top: 14px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">订单编号：</div>
                                    <div style="float: left; font-size: 10px">{{order.orderId}}</div>
                                </li>
                                <li v-if="order.shopName!=null" style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">店铺名称：</div>
                                    <div style="float: left; font-size: 10px">{{order.shopName}}</div>
                                </li>
                                <li style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">用户编号：</div>
                                    <div style="float: left; font-size: 10px">{{order.userId}}</div>
                                </li>
                                <li style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">创建时间：</div>
                                    <div style="float: left; font-size: 10px">{{toDate(order.createDate)}}</div>
                                </li>
                                <li v-if="order.paymentTime!=null"
                                    style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">支付时间：</div>
                                    <div style="float: left; font-size: 10px">{{toDate(order.paymentTime)}}</div>
                                </li>
                                <li style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">关闭时间：</div>
                                    <div style="float: left; font-size: 10px">{{toDate(order.closeTime)}}</div>
                                </li>
                                <li v-if="order.nickName!=null"
                                    style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">买家信息：</div>
                                    <div style="float: left; font-size: 10px">{{order.nickName}}</div>
                                </li>
                                <li v-if="order.confirmOprPhone!=null"
                                    style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">接单人手机号：</div>
                                    <div style="float: left; font-size: 10px">{{order.confirmOprPhone}}</div>
                                </li>
                                <li v-if="order.deliveryOprPhone!=null"
                                    style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">发货人手机号：</div>
                                    <div style="float: left; font-size: 10px">{{order.deliveryOprPhone}}</div>
                                </li>
                                <li v-if="order.buyerMessage!=null"
                                    style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">买家留言：</div>
                                    <div style="float: left; font-size: 10px">{{order.buyerMessage}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-col>
                <el-col :md="11" :sm="8" :xl="8">
                    <div style="border: 1px solid #DDDDDD; height: 180px;">
                        <div style="display: flex; margin-top: 20px; margin-left: 20px;">
                            <i v-if="order.status===2" class="el-icon-error" style="font-size: 30px; color: red;"></i>
                            <i v-else-if="order.status===9" class="el-icon-warning"
                               style="font-size: 30px; color: orange;"></i>
                            <i v-else-if="order.status===7" class="el-icon-info"
                               style="font-size: 30px; color: orange;"></i>
                            <i v-else class="el-icon-success" style="font-size: 30px; color: green;"></i>
                            <h5 style="margin-top: 8px; margin-left: 5px;">订单状态: {{orderStatus(order.status)}}</h5>
                        </div>
                        <div>
                            <div style="float: left; display: flex; margin-top: 30px; margin-left: 20px;">
                                <i v-if="order.payStatus==='Y'" class="el-icon-success"
                                   style="font-size: 30px; color: green;"></i>
                                <i v-else class="el-icon-error" style="font-size: 30px;"></i>
                                <h5 v-if="order.payStatus==='Y'" style="margin-top: 8px; margin-left: 5px;">已支付</h5>
                                <h5 v-else style="margin-top: 8px; margin-left: 5px;">未支付</h5>
                            </div>
                            <div style="float: left; display: flex; margin-top: 30px; margin-left: 30px;">
                                <i v-if="order.closedComment==='Y'" class="el-icon-success"
                                   style="font-size: 30px; color: green;"></i>
                                <i v-else class="el-icon-warning" style="font-size: 30px;"></i>
                                <h5 v-if="order.closedComment==='Y'" style="margin-top: 8px; margin-left: 5px;">已评论</h5>
                                <h5 v-else style="margin-top: 8px; margin-left: 5px;">未评论</h5>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-table :data="orderDetail" border style="margin-top: 20px;">
                <el-table-column label="商品">
                    <template slot-scope="props">
                        <div style="float: left; margin-left: 10px; margin-right: 10px;">
                            <img style="height: 40px; width: 40px;background-color: white;"
                                 :src="uploadUrl + props.row.goodsId + '/'+props.row.tranImg">
                        </div>
                        <div style="float: left;">
                            <p>{{props.row.goodsName}}:{{props.row.goodsId}}</p>
                            <p><span v-if="props.row.specColor!=null&&props.row.specColor!==''">颜色:{{props.row.specColor}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span
                                    v-if="props.row.specSize!=null&&props.row.specSize!==''">尺寸:{{props.row.specSize}}</span>
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="单价" width="100">
                    <template slot-scope="props">
                        <p>{{props.row.price}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="数量" width="100">
                    <template slot-scope="props">
                        <p>{{props.row.number}}</p>
                    </template>
                </el-table-column>
            </el-table>

            <el-row style="margin-top: 20px; border: 1px solid #DDDDDD; background-color: #FBFBFB">
                <el-col :md="12" :sm="8" :xl="8">
                    <div style="border: 1px solid #DDDDDD; height: 130px;">
                        <div style="border-bottom: 1px solid #DDDDDD; padding-top: 2px; padding-bottom: 2px; padding-left: 10px; background-color: #F3F3F3">
                            <h5>收货人信息</h5>
                        </div>
                        <div>
                            <ul style="list-style-type:none;">
                                <li style="margin-top: 14px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 70px;">地址：</div>
                                    <div style="float: left; font-size: 10px">
                                        {{ordership.province}},{{ordership.city}},{{ordership.area}},{{ordership.shipAddress}}
                                    </div>
                                </li>
                                <li style="margin-top: 14px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 50px;">姓名：</div>
                                    <div style="float: left; font-size: 10px">{{ordership.shipName}}</div>
                                </li>
                                <li style="margin-top: 14px; margin-left: 10px; margin-right: 8px; display: flex;">
                                    <div style="float: left; font-size: 10px; width: 50px;">电话：</div>
                                    <div style="float: left; font-size: 10px">{{ordership.shipPhone}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-col>
                <el-col :md="12" :sm="8" :xl="8">
                    <div style="border: 1px solid #DDDDDD; height: 130px;">
                        <el-table :data="orderPays" border>
                            <el-table-column label="支付方式" prop="payMethod"></el-table-column>
                            <el-table-column label="支付金额" prop="payAmt"></el-table-column>
                            <el-table-column label="支付状态">
                                <template slot-scope="props">
                                    <p>{{getPayStatus(props.row.payStatus)}}</p>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>

            <el-row style="margin-top: 20px; border: 1px solid #DDDDDD; background-color: #FBFBFB">
                <el-col :md="17" :sm="8" :xl="8">
                    <div style="height: 125px;">
                    </div>
                </el-col>
                <el-col :md="7" :sm="8" :xl="8">
                    <div style="height: 125px;">
                        <ul style="list-style-type:none;">
                            <li style="margin-top: 25px; margin-left: 10px; margin-right: 8px; display: flex;">
                                <div style="float: left; font-size: 10px; width: 70px;">商品总价：</div>
                                <div style="float: left; font-size: 10px">￥{{order.goodsAllAmt}}</div>
                            </li>
                            <li style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                <div style="float: left; font-size: 10px; width: 70px;">运费（快递）：</div>
                                <div style="float: left; font-size: 10px">￥{{order.postFee}}</div>
                            </li>
                            <li style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                <h4 style="float: left; font-size: 12px; width: 70px;">订单总价：</h4>
                                <h4 style="float: left; font-size: 12px">￥{{order.orderAmt}}</h4>
                            </li>
                            <li style="margin-top: 5px; margin-left: 10px; margin-right: 8px; display: flex;">
                                <div style="float: left; font-size: 10px; width: 70px; color: green;">优惠金额：</div>
                                <div style="float: left; font-size: 10px; color: green">￥{{order.uptAmt}}</div>
                            </li>
                            <li style="margin-top: 20px; margin-left: 10px; margin-right: 8px; display: flex;">
                                <h3 style="float: left; font-size: 14px; width: 70px;">实付款：</h3>
                                <h3 style="float: left; font-size: 14px; color: red;">￥{{order.payAmt}}</h3>
                            </li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>

        <el-dialog :title="uptOrderPayAmtDialogTitle" :visible.sync="uptOrderPayAmtDialogVisible" width="30%">
            <el-form :model="uptOrderPayAmtDialogForm" label-width="80px" ref="uptOrderPayAmtDialogForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="金额" prop="uptAmt"
                                      :rules="[{required: true, message:'修改金额不能为空', trigger:'blur'},
                                      {validator:checkAmt, trigger:'blur'}]">
                            <el-input v-model="uptOrderPayAmtDialogForm.uptAmt" placeholder="请输入优惠金额"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" type="dialog-footer">
                <el-button @click="uptOrderPayAmtDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="uptOrderPayAmtDialogFormConfirm">确定</el-button>
            </span>
        </el-dialog>

        <!--暂时没有快递信息，不使用此dialog-->
        <el-dialog title="发货" :visible.sync="deliverVisible" width="30%">
            <el-form :model="deliverForm" label-width="80px" ref="deliverForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="快递单号" prop="expressNo"
                                      :rules="[{required: true, message:'快递单号不能为空', trigger:'blur'}]">
                            <el-input v-model="deliverForm.expressNo" placeholder="请输入快递单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="快递公司" prop="expressName"
                                      :rules="[{required: true, message:'快递单号不能为空', trigger:'blur'}]">
                            <el-select style="width: 100%;" v-model="deliverForm.expressName" clearable
                                       placeholder="请选择" @change="selectExpress">
                                <el-option v-for="item in expressInfos" :key="item.id" :label="item.value"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" type="dialog-footer">
                <el-button @click="deliverVisible=false">取消</el-button>
                <el-button type="primary" @click="deliverFormConfirm">确定</el-button>
            </span>
        </el-dialog>

        <!--店铺选择-->
        <el-dialog title="请选择店铺" :visible.sync="shopVisible" width="30%">
            <el-form :model="shopForm" label-width="80px" ref="shopForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="店铺" prop="shopId"
                                      :rules="[{required: true, message:'请选择店铺', trigger:'blur'}]">
                            <el-select v-model="shopForm.shopId" clearable placeholder="请选择店铺">
                                <el-option style="width: 100%;" v-for="item in shops" :key="item.shopId"
                                           :label="item.area+':'+item.shopName"
                                           :value="item.shopId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" type="dialog-footer">
                <el-button @click="shopVisible=false">取消</el-button>
                <el-button type="primary" @click="shopFormConfirmTap">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        qryOrders,
        qryOrderById,
        confirmOrder,
        getMallShop,
        uptOrderPayAmt,
        sendOrder,
    } from "../../../util/module";
    import cfg from '../../../config/cfg';
    import FormCheck from '@/tool/formCheck.js';

    export default {
        name: "orderList",
        data() {
            return {
                CurPage: 1,   // 设置加载的第几次，默认是第一次
                limitNum: 10,        // 返回数据的个数
                AllCount: 0,    // 总条数
                orders: [],//订单
                uploadUrl: '',
                selectForm: {
                    status: null,
                    shopId: null,
                },
                orderStatusArray: [
                    {id: 1, detail: '交易成功'},
                    {id: 2, detail: '交易关闭'},
                    {id: 3, detail: '已签收'},
                    {id: 4, detail: '已发货'},
                    {id: 7, detail: '未发货'},
                    {id: 8, detail: '已付款'},
                    {id: 9, detail: '未付款'},
                ],
                dialogStatus: false,
                dialogOrder: {},
                orderDetail: [],
                order: {},
                orderPays: {},
                ordership: {},
                shops: [],
                uptOrderPayAmtDialogTitle: '优惠金额',
                uptOrderPayAmtDialogVisible: false,
                uptOrderPayAmtDialogForm: {
                    orderId: null,
                    uptAmt: null
                },
                deliverVisible: false,
                deliverForm: {
                    orderId: null,
                    expressNo: null,
                    expressName: null,
                    shopId: null,
                },
                //快递公司信息
                expressInfos: [
                    {id: 1, value: '顺丰'},
                    {id: 2, value: '申通'},
                ],
                shopForm: {
                    shopId: null,
                },
                shopVisible: false,
                selectRow: {},
                flag:1,//1：接单  2：发货
                tableLoading:false,
            }
        },

        created() {
            let mallId = localStorage.getItem('mallId') || '';
            this.uploadUrl = cfg.service.uploadUrl + '/' + mallId + '/';
            this.getMallShop();
            this.initdata();
        },

        methods: {
            initdata() {
                this.tableLoading=true;
                let params = {};
                params.page = this.CurPage;
                params.pageSize = this.limitNum;
                params.status = this.selectForm.status;
                params.shopId = this.selectForm.shopId;
                qryOrders(this, params).then(res => {
                    this.orders = res.data.rows;
                    this.AllCount = parseInt(res.data.records);
                    this.tableLoading=false;
                }, res => {
                    console.log("失败res", res);//debug
                    this.$message.error(res.msg);
                    this.tableLoading=false;
                });
            },

            checkAmt(rule, amt, callback){
                //准备优惠金额+已优惠金额<订单总额
                if (parseFloat(amt)+parseFloat(this.selectRow.uptAmt)-parseFloat(this.selectRow.orderAmt)>-0.005){
                    callback(new Error('已优惠'+parseFloat(this.selectRow.uptAmt)+'元，总优惠金额不许超过订单总额'+parseFloat(this.selectRow.orderAmt)+'!'));
                    return;
                }
                return FormCheck.amt(rule, amt, callback);
            },

            //获取店铺信息
            getMallShop() {
                let params = {};
                getMallShop(this, params).then(
                    (res) => {
                        this.shops = res.data;
                    }
                ).catch();
            },

            statusChange() {
                this.CurPage = 1;
                this.initdata();
            },

            shopChange() {
                this.CurPage = 1;
                this.initdata();
            },

            selectExpress() {

            },

            toDate(dateNum) {
                if (dateNum == null || dateNum === '') {
                    return '未知';
                }
                let date = new Date(dateNum);
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y + M + D + h + m + s;
            },

            orderStatus(status) {
                let statusName = '未知状态';
                switch (status) {
                    case 1:
                        statusName = '交易成功';
                        break;
                    case 2:
                        statusName = '交易关闭';
                        break;
                    case 3:
                        statusName = '已签收';
                        break;
                    case 4:
                        statusName = '已发货';
                        break;
                    case 5:
                        break;
                    case 6:
                        break;
                    case 7:
                        statusName = '未发货';
                        break;
                    case 8:
                        statusName = '已付款';
                        break;
                    case 9:
                        statusName = '未付款';
                        break;
                }
                return statusName;
            },

            getPayStatus(status) {
                let statusName = '未知状态';
                switch (status) {
                    case 1:
                        statusName = '成功';
                        break;
                    case 2:
                        statusName = '失败';
                        break;
                    case 3:
                        statusName = '撤销';
                        break;
                    case 4:
                        statusName = '未知';
                        break;
                    case 5:
                        statusName = '未知';
                        break;
                    case 6:
                        statusName = '未知';
                        break;
                    case 7:
                        statusName = '未知';
                        break;
                    case 8:
                        statusName = '未知';
                        break;
                    case 9:
                        statusName = '初始状态';
                        break;
                }
                return statusName;
            },

            // 分页导航
            handleCurrentChange(options) {
                this.CurPage = options;
                this.initdata();
            },

            // 每页条数改变
            handleSizeChange(options) {
                this.limitNum = options;
                this.initdata();
            },

            //行被双击
            rowDblclick(row) {
                // this.order=row;
                // this.orderItems=row.orderDetailList;
                // this.dialogStatus=true;
                //获取订单详细信息
                let params = {};
                params.orderId = row.orderId;
                qryOrderById(this, params).then(res => {
                    this.order = res.data.order;
                    this.orderDetail = res.data.orderDetail;
                    this.orderPays = res.data.orderPay;
                    this.ordership = res.data.ordership;
                    this.dialogStatus = true;
                }, res => {
                    this.$message.error(res.msg);
                });
            },

            //接单按钮被按下
            takeOrderTap(row) {
                this.flag=1;
                this.shopForm={};
                this.selectRow=row;
                //如果没有分店铺，直接接单
                if (this.shops.length === 0) {
                    this.$confirm('此操作将接单，是否确认？', '接单确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(
                        () => {
                            this.takeOrder();
                        }
                    ).catch();
                }

                //需要选择店铺
                this.shopVisible=true;
            },

            //接单
            takeOrder() {
                let param = {};
                param.orderId = this.selectRow.orderId;
                param.shopId = this.shopForm.shopId;
                confirmOrder(this, param).then(
                    (res) => {
                        this.$message.success('接单成功！');
                        this.shopVisible=false;
                        this.initdata();
                    },
                    (res) => {
                        if (res.msg != null) {
                            this.$message.error(res.msg);
                        } else {
                            this.$message.error('接单失败！');
                        }
                        this.initdata();
                    }
                ).catch(
                    () => {
                        this.$message.error('系统错误!');
                    }
                );
            },

            // 发货按钮被按下
            deliverGoodsTap(row) {
                this.flag=2;
                this.selectRow = row;
                this.shopForm = {};
                this.deliverForm = {};
                this.deliverForm.orderId = row.orderId;
                //如果没有分店那么直接发货
                if (this.shops.length === 0) {
                    this.$confirm('此操作将发货，是否确认？', '发货', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(
                        () => {
                            this.deliverGoods();
                        }
                    ).catch(
                        (res) => {
                            console.log('出错', res);//debug
                        }
                    );
                    return;
                }

                //筛选条件如果选择了店铺，那么默认使用筛选条件的店铺。如果没有选择，那么选择一个店铺
                if (this.selectForm.shopId === null || this.selectForm.shopId === '') {
                    //选择店铺
                    this.shopVisible = true;
                } else {
                    //使用筛选条件的店铺
                    this.deliverForm.shopId = this.selectForm.shopId;
                    this.$confirm('此操作将发货，是否确认？', '发货', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(
                        () => {
                            this.deliverGoods();
                        }
                    ).catch(
                        (res) => {
                            console.log('出错', res);//debug
                        }
                    );
                }
            },

            deliverFormConfirm() {
                this.$refs['deliverForm'].validate((valid) => {
                    if (valid) {
                        this.deliverGoods();
                    } else {
                        return false;
                    }
                });
            },

            shopFormConfirmTap() {
                this.$refs['shopForm'].validate((valid) => {
                    if (valid) {
                        this.shopFormConfirm();
                    } else {
                        return false;
                    }
                });
            },

            //店铺对话框被选择
            shopFormConfirm() {
                this.deliverForm.shopId = this.shopForm.shopId;
                //接单
                if (this.flag === 1) {
                    this.takeOrder();
                }
                //发货
                if (this.flag === 2) {
                    this.deliverGoods();
                }
            },

            //发货
            deliverGoods() {
                //如果是多店铺，发货选择店铺必须是接单的店铺
                if (this.shops.length > 0) {
                    if (this.selectRow.shopId !== this.deliverForm.shopId) {
                        this.$message.error('发货店铺需要跟接单店铺一致！');
                        return;
                    }
                }
                let params = {};
                params.orderId = this.deliverForm.orderId;
                params.expressNo = this.deliverForm.expressNo;
                params.expressName = this.deliverForm.expressName;
                if (this.deliverForm.shopId != null) {
                    params.shopId = this.deliverForm.shopId;
                }
                sendOrder(this, params).then(
                    (res) => {
                        this.$message.success('发货成功');
                        this.deliverVisible = false;
                        this.shopVisible = false;
                        this.initdata();
                    },
                    (res) => {
                        if (res.msg != null) {
                            this.$message.error(res.msg);
                        } else {
                            this.$message.error('发货失败！');
                        }
                    }
                ).catch();
            },

            //修改金额被按下
            uptOrderPayAmtTap(row) {
                this.selectRow=row;
                this.uptOrderPayAmtDialogForm={};
                this.uptOrderPayAmtDialogForm.orderId = row.orderId;
                this.uptOrderPayAmtDialogVisible = true;
            },

            uptOrderPayAmtDialogFormConfirm() {
                this.$refs['uptOrderPayAmtDialogForm'].validate(
                    (valid) => {
                        if (valid) {
                            this.uptOrderPayAmtDialogFormCommit();
                        } else {
                            return false;
                        }
                    }
                );
            },

            uptOrderPayAmtDialogFormCommit() {
                let params = {};
                params.orderId = this.uptOrderPayAmtDialogForm.orderId;
                params.uptAmt = this.uptOrderPayAmtDialogForm.uptAmt;
                uptOrderPayAmt(this, params).then(
                    (res) => {
                        this.$message.success('修改金额成功！');
                        this.initdata();
                        this.uptOrderPayAmtDialogVisible = false;
                    },
                    (res) => {
                        if (res.msg != null) {
                            this.$message.error(res.msg);
                        } else {
                            this.$message.error('修改金额失败！');
                        }
                    }
                ).catch();
            }
        }
    }
</script>

<style scoped>
    .table {
    }
</style>
