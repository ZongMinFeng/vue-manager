<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs && (!item.function || item.flag)">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span>{{ item.title }}</span>
                        </template>
                        <!--<el-menu-item  v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">-->
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index"
                                      v-if="!subItem.function || subItem.flag">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else-if="!item.function || item.flag">
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    let routeArray = require("./../../config/routeArray.js");

    export default {
        data() {
            return {
                collapse: false,
                items: routeArray.Sidebar
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        methods: {
            setFunction() {   // 对目录进行权限过滤，没有权限的不显示了
                const ruleFunction = this.$store.state.ruleFunction;
                this.items.forEach(item => {
                    if (item.function) {
                        item.flag = ruleFunction[item.function] || false
                    }
                    if (item.subs) {
                        item.subs.forEach(items => {
                            if (items.function) {
                                items.flag = ruleFunction[items.function] || false
                            }
                        })
                    }
                })
            }
        },
        created() {
            this.setFunction();
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 50px;
        bottom: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 200px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
