<template>
    <div>
        <div style="height: 50px;">
            <el-button type="success" icon="el-icon-plus" style="margin-bottom: 10px" @click="showAddItem">新增
            </el-button>
            <el-button type="primary" style="margin-bottom: 10px; margin-left: 10px" @click="selectItem(null)">所有配置
            </el-button>
            <div class="btn-div" v-for="(item) in items">
                <el-button type="primary" v-if="item.argName!=null&&item.argName.startsWith('config_service_phone')"
                           @click="selectItem('config_service_phone')">客服电话
                </el-button>
                <el-button type="primary" v-if="item.argName!=null&&item.argName.startsWith('mall_order_closetime')"
                           @click="selectItem('mall_order_closetime')">订单关闭时间
                </el-button>
                <el-button type="primary" v-if="item.argName!=null&&item.argName.startsWith('mall_order_memos')"
                           @click="selectItem('mall_order_memos')">备注标签设置
                </el-button>
                <el-button type="primary" v-if="item.argName!=null&&item.argName.startsWith('mall_order_minamt')"
                           @click="selectItem('mall_order_minamt')">每单最小金额
                </el-button>
                <el-button type="primary" v-if="item.argName!=null&&item.argName.startsWith('mall_spec_name')"
                           @click="selectItem('mall_spec_name')">系统参数名称
                </el-button>
            </div>
        </div>
        <el-table :data="tableData" border stripe>
            <!--<el-table-column label="Id" prop="argName"></el-table-column>-->
            <el-table-column label="名称" prop="chnExplain"></el-table-column>
            <el-table-column label="值">
                <template slot-scope="props">
                    <el-tag v-if="isManyItems(props.row.argName)" style="margin: 10px;"
                            v-for="tag in getTags(props.row)" :key="tag">
                        {{tag}}
                    </el-tag>
                    <span v-if="!isManyItems(props.row.argName)">
                        {{props.row.argValue}}
                    </span>
                </template>
            </el-table-column>
            <!--目前不显示首页图的设置，因此注释掉图片显示部分begin-->
            <!--<el-table-column label="图片" prop="pictureUrl">-->
            <!--<template slot-scope="scope">-->
            <!--<el-image v-if="isPicture(scope.row.argName)" style="height: 80px; width: 80px;" :src="uploadUrl + scope.row.argValue + '/'+scope.row.pictureUrl" :preview-src-list="[uploadUrl + scope.row.argValue + '/'+scope.row.pictureUrl]"></el-image>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--目前不显示首页图的设置，因此注释掉图片显示部分end-->
            <!--<el-table-column label="状态" prop="status"></el-table-column>-->
            <el-table-column label="操作">
                <template slot-scope="props">
                    <el-button v-if="!isPicture(props.row.argName)" type="warning" style="margin-right: 5px;"
                               @click="showModiItem(props.row)">修改
                    </el-button>
                    <el-button type="danger" @click="showDeleteItem(props.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
            <el-form label-width="80px" :model="itemForm" :rules="rules" ref="itemModiForm">
                <el-form-item v-if="flag===1" label="名称" prop="argName">
                    <el-select v-model="itemForm.argName" style="width: 100%;" @change="itemType">
                        <el-option v-for="item in options" :key="item.argName" :label="item.chnExplain"
                                   :value="item.argName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="flag===2" label="名称">
                    <el-input v-model="itemForm.chnExplain" :disabled="true"></el-input>
                </el-form-item>
                <!--多条目处理-->
                <el-form-item v-if="isManyItems(itemForm.argName)" label="值">
                    <el-row>
                        <el-col :span="20">
                            <el-input v-model="tag" maxlength="20"></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" style="margin-left: 20px" @click="addTags(itemForm.argName)">
                                添加
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-if="isManyItems(itemForm.argName)" style="padding-right:10px">
                    <div>
                        <el-tag v-if="tags" style="margin: 10px;" v-for="tag in tags"
                                :key="tag"
                                closable @close="handleModiClose(tag)">
                            {{tag}}
                        </el-tag>
                    </div>
                </el-form-item>
                <!--单条目处理-->
                <el-form-item v-if="!isManyItems(itemForm.argName)" label="值" prop="argValue">
                    <el-row>
                        <el-col :span="20">
                            <el-input v-model="itemForm.argValue" maxlength="20"></el-input>
                        </el-col>
                        <el-col :span="2">
                            <span v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_closetime')">分钟</span>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item v-if="itemForm.argName!=null&&itemForm.argName.startsWith('mall_order_closetime')"
                              label="快速选择" style="padding-right:10px">
                    <template sslot-scope="props">
                        <div>
                            <el-slider :max="6" :show-tooltip="false" :step="1" :marks="marks" v-model="sliderValue"
                                       show-stops @change="sliderChange"></el-slider>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button style="margin-right:5px" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('itemModiForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getSysMallConfig,
        getMallContent,
        saveMallContent,
        delMallContentById,
        uptMallContent
    } from "../../../util/module";
    import cfg from '../../../config/cfg';
    import GwRegular from '@/Gw/GwRegular.js';

    export default {
        name: "mallSysArg",
        data() {
            var checkValue = (rule, value, callback) => {
                console.log("value", value);//debug
                //订单关闭时间
                if (this.itemForm.argName.startsWith('mall_order_closetime')) {
                    if (value == null || value === '') {
                        callback(new Error('请选择或输入值'));
                        return false;
                    }
                    let reg = /^[0-9]*[0-9][0-9]*$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入大于等于0的数字'));
                        return false;
                    }
                    if (value > 525600) {
                        callback(new Error("不允许大于1年！"));
                        return false;
                    }
                }

                //客服电话
                if (this.itemForm.argName.startsWith('config_service_phone')) {
                    if (!GwRegular.phone.test(value)) {
                        callback(new Error('请输入正确手机号'));
                        return false;
                    }
                }

                //每单最小金额
                if (this.itemForm.argName.startsWith('mall_order_minamt')) {
                    if (!GwRegular.numeric2.test(value)) {
                        callback(new Error('请输入金额，可以两位小数'));
                        return false;
                    }
                }

                //商品未设起购价时，默认的起购价格
                if (this.itemForm.argName.startsWith('mall_goods_defminamt')) {
                    if (!GwRegular.numeric2.test(value)) {
                        callback(new Error('请输入金额，可以两位小数'));
                        return false;
                    }
                }

                //总体校验
                if (value == null||value==='') {
                    callback(new Error('请输入值'));
                    return false;
                }
                callback();
            };
            return {
                allItems: [],
                items: [],
                addItemVisible: false,
                itemForm: {
                    id: null,
                    argName: null,
                    argValue: '',
                    chnExplain: null,
                    mallId: null,
                    pictureUrl: null,
                    status: null,
                    signFlag: null,
                },
                options: [],
                rules: {
                    argValue: [
                        {validator: checkValue, trigger: 'blur'},
                    ],
                    argName: [
                        {required: true, message: '请选择类型', trigger: 'blur'},
                    ]
                },
                dialogVisible: false,
                uploadUrl: '',
                sliderValue: 0,
                marks: {
                    0: '无',
                    1: '15分钟',
                    2: '1小时',
                    3: '2小时',
                    4: '半天',
                    5: '1天',
                    6: '无'
                },
                tableData: [],
                searchForm: {},
                argNameSelected: null,
                tags: [],
                tag: null,
                setItemArray: [],
                flag: 1,//1新增  2修改
            }
        },

        computed: {
            dialogTitle() {
                if (this.flag === 1) {
                    return '新增参数';
                } else {
                    return '修改参数';
                }
            },
        },

        created() {
            let mallId = localStorage.getItem('mallId') || '';
            this.uploadUrl = cfg.service.uploadUrl + '/' + mallId + '/';
            this.initData();
        },

        methods: {
            initData() {
                //清空数据
                this.allItems = [];
                this.items = [];
                this.options = [];
                //获取配置信息
                getSysMallConfig(this).then((res) => {
                    res.data.forEach((value) => {
                        let item = {};
                        item.id = '';
                        item.mallId = '';
                        item.argName = value.engFlag;
                        item.argValue = '';
                        item.chnExplain = value.chnExplain;
                        item.status = 1;
                        item.pictureUrl = '';
                        item.signFlag = value.signFlag;
                        this.allItems.push(item);
                    });
                    console.log("allItems", this.allItems);//debug

                    //获取已配置信息
                    getMallContent(this).then((res) => {
                        res.data.forEach((value) => {
                            for (let i = 0; i < this.allItems.length; i++) {
                                if (this.allItems[i].argName === value.argName) {
                                    this.allItems[i].id = value.id;
                                    this.allItems[i].argValue = value.argValue;
                                    this.allItems[i].pictureUrl = value.pictureUrl;
                                    this.allItems[i].status = value.status;
                                    this.allItems[i].mallId = value.mallId;
                                    break;
                                }
                            }
                        });
                        console.log("new allItems", this.allItems);//debug

                        this.allItems.forEach((value) => {
                            //过滤首页轮播图
                            if (value.argValue !== '' && !value.argName.startsWith('mall_a_picture')) {
                                this.items.push(value);
                            } else {
                                //不是首页图允许新增
                                if (!value.argName.startsWith('mall_a_picture')) {
                                    this.options.push(value);
                                }
                            }
                        });
                        this.selectItem(this.argNameSelected);
                    }, (res) => {
                        this.$message.error(res.message);
                    });
                }, (res) => {
                    this.$message.error(res.message);
                });
            },

            //参数有多个值判断
            isManyItems(argName) {
                if (argName == null) {
                    return false;
                }

                switch (argName) {
                    case 'mall_spec_name':
                    case 'mall_order_memos':
                        return true;
                    default:
                        return false;
                }
            },

            getTags(row) {
                let tags = [];
                if (row.argName === 'mall_spec_name') {
                    tags.push(...row.argValue.split('||'));
                }
                if (row.argName === 'mall_order_memos') {
                    let memos = JSON.parse(row.argValue);
                    for (let val in memos) {
                        tags.push(memos[val]);
                    }
                }
                return tags;
            },

            //添加通用标签
            addTags(argName) {
                let length = 1;
                switch (argName) {
                    case 'mall_spec_name':
                        length = 2;
                        break;
                    case 'mall_order_memos':
                        length = 15;
                        break;
                }
                if (this.tag.trim()) {
                    console.log('this.tags.length', this.tags.length);
                    if (this.tags.indexOf(this.tag) === -1) {
                        if (this.tags.length >= length) {
                            this.$message.error('标签超出个数限制');
                        } else {
                            this.tags.unshift(this.tag);
                        }
                    }
                }
                //重置输入框
                this.tag='';
            },

            handleModiClose(tag) {
                this.tags.forEach((item, index) => {
                    if (item === tag) {
                        this.tags.splice(index, 1)
                    }
                })
            },

            selectItem(argName) {
                console.log('argName', argName);//debug
                this.argNameSelected = argName;
                let tableDataNew=[];
                if (argName != null) {
                    this.items.forEach((item) => {
                        if (item.argName === this.argNameSelected) {
                            tableDataNew.push(item);
                        }
                    });
                } else {
                    this.items.forEach((item) => {
                        tableDataNew.push(item);
                    });
                }
                this.tableData=tableDataNew;
            },

            showAddItem() {
                //初始化
                this.itemForm.argName=null;
                this.itemForm.argValue=null;
                this.tags=[];
                //清空校验信息
                if (this.$refs['itemForm'] != null) {
                    this.$refs['itemForm'].clearValidate('argValue');
                }

                this.flag = 1;
                this.itemForm = {
                    id: null,
                    argName: null,
                    argValue: '',
                    chnExplain: null,
                    mallId: null,
                    pictureUrl: null,
                    status: null,
                    signFlag: null,
                };
                this.dialogVisible = true;
            },

            showModiItem(item) {
                this.flag=2;
                if (item.argName.startsWith('mall_spec_name')) {
                    this.tags = item.argValue.split("||");
                }
                if (item.argName.startsWith('mall_order_memos')) {
                    let momes = [];
                    this.setItemArray = [];
                    this.items.forEach(value => {
                        if (value.argName.startsWith('mall_order_memos')) {
                            this.setItemArray.push(value);
                            let memo = JSON.parse(value.argValue);
                            for (var memoItem in memo) {
                                momes.push(memo[memoItem]); //key所对应的value 
                            }
                        }
                    });
                    this.tags = momes;
                }
                this.itemForm = {
                    id: item.id,
                    argName: item.argName,
                    argValue: item.argValue,
                    chnExplain: item.chnExplain,
                    mallId: item.mallId,
                    pictureUrl: item.pictureUrl,
                    status: item.status,
                    signFlag: item.signFlag
                };
                this.dialogVisible = true;
            },

            itemType(value) {
                this.options.forEach((item) => {
                    if (item.argName === value) {
                        this.itemForm.argName = item.argName;
                        this.itemForm.chnExplain = item.chnExplain;
                        this.itemForm.status = item.status;
                        this.itemForm.signFlag = item.signFlag;
                        this.itemForm.mallId = localStorage.getItem("mallId") || '';
                    }
                });
                console.log("this.itemForm", this.itemForm);//debug
            },

            // submitForm(formName){
            //     this.$refs[formName].validate((valid)=>{
            //         if(valid){
            //             this.addItem();
            //         }else{
            //             return false;
            //         }
            //     });
            // },

            submitForm(formName) {
                if (this.itemForm.argName == null) {
                    this.$message.error('请选择名称');
                    return;
                }
                //argValue按照argName处理
                if (this.itemForm.argName.startsWith('mall_order_memos')) {
                    if (this.tags.length === 0) {
                        this.$message.error('请添加值');
                        return false;
                    } else if (this.tags.length > 15) {
                        this.$message.error('备注标签超出个数限制');
                        return false;
                    }
                    let jsonstr = "{";
                    for (let i = 0; i < this.tags.length; i++) {
                        jsonstr += "\"memo" + (i + 1) + "\":" + "\"" + this.tags[i] + "\"" + ','
                    }
                    jsonstr = jsonstr.substring(0, jsonstr.length - 1) + "}";
                    this.itemForm.argValue = jsonstr;
                } else if (this.isManyItems(this.itemForm.argName)) {
                    //多条目处理
                    if (this.tags.length === 0) {
                        this.$message.error('请添加值！');
                        return;
                    }
                    this.itemForm.argValue = this.tags.join('||');
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.flag === 1) {
                            this.addItem();
                        } else {
                            this.modiItem();
                        }
                    } else {
                        return false;
                    }
                });
            },

            addItem() {
                let params = {
                    userId: localStorage.getItem("usrId") || '',
                    argName: this.itemForm.argName,
                    argValue: this.itemForm.argValue,
                    signFlag: this.itemForm.signFlag,
                };
                if (this.itemForm.pictureUrl != null) {
                    params.pictureUrl = this.itemForm.pictureUrl;
                }
                saveMallContent(this, params).then((res) => {
                    this.dialogVisible = false;
                    this.$message.success("新增系统参数成功");
                    this.initData();
                }, (res) => {
                    this.$message.error(res.msg);
                });
            },

            modiItem() {
                let params = {
                    id: this.itemForm.id,
                    userId: localStorage.getItem("usrId") || '',
                    argValue: this.itemForm.argValue,
                    signFlag: this.itemForm.signFlag,
                };
                uptMallContent(this, params).then((res) => {
                    this.dialogVisible = false;
                    this.$message.success("修改系统参数成功");
                    this.initData();
                }, (res) => {
                    this.$message.error(res.msg);
                });
            },

            showDeleteItem(value) {
                this.$confirm('此操作将删除系统参数，是否继续？', '参数删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    Type: 'error'
                }).then(() => {
                    this.deleteItem(value);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消删除'
                    });
                });
            },

            deleteItem(value) {
                let params = {
                    id: value.id,
                    userId: localStorage.getItem("userId") || ''
                };
                delMallContentById(this, params).then((res) => {
                    this.$message.success("删除参数成功");
                    this.initData();
                }, (res) => {
                    this.$message.error(res.msg);
                });
            },

            isPicture(value) {
                if (value.startsWith('mall_a_picture')) {
                    return true;
                } else {
                    return false;
                }
            },

            sliderChange(data) {
                console.log("hello, data", data);//debug
                //默认1年
                let minutes = 525600;
                switch (data) {
                    case 0:
                        break;
                    case 1:
                        minutes = 15;
                        break;
                    case 2:
                        minutes = 60;
                        break;
                    case 3:
                        minutes = 120;
                        break;
                    case 4:
                        minutes = 720;
                        break;
                    case 5:
                        minutes = 1440;
                        break;
                    case 6:
                        break;
                    default:
                        break;
                }
                this.itemForm.argValue = minutes;
            },
        }
    }
</script>

<style scoped>
    .button-right {
        float: right;
    }

    .el-slider__marks-text {
        width: 30px;
    }

    .btn-div {
        /*display: inline-block;*/
        float: right;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>
