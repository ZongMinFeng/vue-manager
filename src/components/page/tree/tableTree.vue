<template>
    <el-table
        :data="data"
        size="medium"
        border
        :row-style="showTr">
        <el-table-column v-for="(column, index) of columns" :key="column.dataIndex"
                         :label="column.text">
            <template slot-scope="scope">
                <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) of scope.row._level" class="ms-tree-space"
                      :key="levelIndex"></span>
                <span v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
                    <i v-if="!scope.row._expanded" class="el-icon-caret-right " aria-hidden="true"></i>
                    <i v-if="scope.row._expanded" class="el-icon-caret-bottom " aria-hidden="true"></i>
                </span>
                <span v-else-if="index===0" class="ms-tree-space"></span>
                <div v-if="column.dataIndex==='Status'">
                    <el-button v-if="scope.row[column.dataIndex] === '1'" type="primary" size="small" plain @click="handleOpenStatus(scope.row.Id)">
                        开启</el-button>
                    <el-button v-else type="success" size="small" plain @click="handleCloseStatus(scope.row.Id)">
                        关闭</el-button>
                </div>
                <span v-else>{{scope.row[column.dataIndex]}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="220" v-if="treeType === 'normal'">
            <template slot-scope="props">
                <el-button type="primary" size="small" plain @click="handleAdd(props.row.Id)">新增</el-button>
                <el-button type="warning" size="small" plain @click="handleEdit(props.row)">修改</el-button>
                <el-button type="danger" size="small" plain @click="handleDelete(props.row.Id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
    import Utils from './index'
    //  import Vue from 'vue'
    export default {
        name: 'tree-grid',
        props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
            treeStructure: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
// 这是相应的字段展示
            columns: {
                type: Array,
                default: function () {
                    return []
                }
            },
// 这是数据源
            dataSource: {
                type: Array,
                default: function () {
                    return []
                }
            },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
            requestUrl: {
                type: String,
                default: function () {
                    return ''
                }
            },
// 这个是是否展示操作列
            treeType: {
                type: String,
                default: function () {
                    return 'normal'
                }
            },
// 是否默认展开所有树
            defaultExpandAll: {
                type: Boolean,
                default: function () {
                    return false
                }
            }
        },
        data() {
            return {}
        },
        computed: {
            // 格式化数据源
            data: function () {
                let me = this
                if (me.treeStructure) {
                    let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
                    // console.log('333', data)
                    return data
                }
                return me.dataSource
            }
        },
        filters: {
            btnType(value, index) {

                if (value === 'M') {
                    return '菜单'
                } else if (value === 'B') {
                    return '按钮'
                } else {
                    return value
                }
            }
        },
        methods: {
            // 显示行
            showTr(row, index) {
                let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
                row.row._show = show
                return show ? '' : 'display:none;'
            },
            // 展开下级
            toggle(trIndex) {
                let record = this.data[trIndex]
                record._expanded = !record._expanded
            },
            // 显示层级关系的空格和图标
            spaceIconShow(index) {
                if (this.treeStructure && index === 0) {
                    return true
                }
                return false
            },
            // 点击展开和关闭的时候，图标的切换
            toggleIconShow(index, record) {
                if(this.treeStructure && index === 0 && record.menuBeans && record.menuBeans.length > 0) {
                    return true
                }
                return false
            },

            handleDelete(Id) {
                this.$emit('deleteBtn', Id)
            },
            handleEdit(row) {
                this.$emit('editBtn', row)
            },
            handleAdd(Id) {
                this.$emit('addBtn', Id)
            },
            handleOpenStatus(Id) {
                this.$emit('uptStatusBtn', Id, '1')
            },
            handleCloseStatus(Id) {
                this.$emit('uptStatusBtn', Id, '2')
            }
        }
    }
</script>
<style scoped>
    .ms-tree-space {
        position: relative;
        top: 1px;
        display: inline-block;
        font-family: 'Glyphicons Halflings';
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        width: 18px;
        height: 14px;
    }

    .ms-tree-space::before {
        content: "·"
    }

    table td {
        line-height: 26px;
    }

    .icon-size {
        font-size: 20px;
        padding-top: 5px;
    }
</style>
