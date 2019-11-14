module.exports = {
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {title: '自述文件'},
            children: [
                {
                    path: '/home',
                    component: resolve => require(['../components/page/home.vue'], resolve),
                    meta: {title: '欢迎'}
                },

                {
                    path: '/mallHomePage',
                    component: resolve => require(['../components/page/MallSetting/mallHomePage.vue'], resolve),
                    meta: {title: '首页轮播图'}
                },

                {
                    path: '/mallPhone',
                    component: resolve => require(['../components/page/MallSetting/mallPhone.vue'], resolve),
                    meta: {title: '客服电话'}
                },

                {
                    path: '/mallSysArg',
                    component: resolve => require(['../components/page/MallSetting/mallSysArg.vue'], resolve),
                    meta: {title: '系统参数'}
                },

                {
                    path: '/mallSysArgSet',
                    component: resolve => require(['../components/page/MallSetting/mallSysArgSet.vue'], resolve),
                    meta: {title: '系统参数设置'}
                },

                {
                    path: '/goodsManage',
                    component: resolve => require(['../components/page/Goods/goodsManage.vue'], resolve),
                    meta: {
                        title: '商品列表'
                    }
                },
                {
                    path: '/goodsInfos',
                    component: resolve => require(['../components/page/Goods/goodsInfos.vue'], resolve),
                    meta: {
                        title: '商品信息',
                        route: [
                            {
                                path: '/goodsManage',
                                title: '商品列表'
                            }
                        ]
                    }
                },
                {
                    path: '/goodsUpDown',
                    component: resolve => require(['../components/page/Goods/goodsUpDown.vue'], resolve),
                    meta: {
                        title: '商品上下架'
                    }
                },
                {
                    path: '/addGoods',
                    component: resolve => require(['../components/page/Goods/addGoods.vue'], resolve),
                    meta: {
                        title: '商品新增',
                        route: [
                            {
                                path: '/goodsManage',
                                title: '商品列表'
                            }
                        ]
                    }
                },
                {
                    path: '/addGoodsSerialsTab',
                    component: resolve => require(['../components/page/GoodsSerials/addGoodsSerials.vue'], resolve),
                    meta: {
                        title: '系列新增●修改',
                        route: [
                            {
                                path: '/goodsInfos',
                                title: '商品信息'
                            }
                        ]
                    }
                },
                {
                    path: '/goodsDesc',
                    component: resolve => require(['../components/page/Goods/goodsDesc.vue'], resolve),
                    meta: {
                        title: '商品详情',
                        route: [
                            {
                                path: '/goodsManage',
                                title: '商品管理'
                            }
                        ]
                    }
                },
                {
                    path: '/goodsDetail',
                    component: resolve => require(['../components/page/Goods/goodsDetail.vue'], resolve),
                    meta: {
                        title: '商品详情',
                        route: [
                            {
                                path: '/goodsManage',
                                title: '商品管理'
                            }
                        ]
                    }
                },
                {
                    path: '/goodsTypeManage',
                    component: resolve => require(['../components/page/GoodsType/goodsTypeManage.vue'], resolve),
                    meta: {
                        title: '商品分类管理'
                    }
                },
                {
                    path: '/suppManage',
                    component: resolve => require(['../components/page/Supplier/suppManage.vue'], resolve),
                    meta: {
                        title: '供货商管理'
                    }
                },
                {
                    path: '/addSupplier',
                    component: resolve => require(['../components/page/Supplier/addSupplier.vue'], resolve),
                    meta: {
                        title: '供货商新增',
                        route: [
                            {
                                path: '/suppManage',
                                title: '供货商管理'
                            }
                        ]
                    }
                },
                {
                    path: '/brandManage',
                    component: resolve => require(['../components/page/Brand/brandManage.vue'], resolve),
                    meta: {
                        title: '品牌管理'
                    }
                },
                {
                    path: '/addBrand',
                    component: resolve => require(['../components/page/Brand/addBrand.vue'], resolve),
                    meta: {
                        title: '品牌新增',
                        route: [
                            {
                                path: '/brandManage',
                                title: '品牌管理'
                            }
                        ]
                    }
                },
                {
                    path: '/userOprDayDetail',
                    component: resolve => require(['../components/page/mngRptAction/userOprDayDetail.vue'], resolve),
                    meta: {
                        title: '用户活动每日统计',
                        function: 'userOprDayDetail'
                    }
                },
                {
                    path: '/transSumDayDetail',
                    component: resolve => require(['../components/page/mngRptAction/transSumDayDetail.vue'], resolve),
                    meta: {
                        title: '交易每日统计',
                        function: 'transSumDayDetail'
                    }
                },
                {
                    path: '/payTypeDayDetail',
                    component: resolve => require(['../components/page/mngRptAction/payTypeDayDetail.vue'], resolve),
                    meta: {
                        title: '支付方式每日统计',
                        function: 'payTypeDayDetail'
                    }
                },
                {
                    path: '/payTypeTotal',
                    component: resolve => require(['../components/page/mngRptAction/payTypeTotal.vue'], resolve),
                    meta: {
                        title: '支付方式总计',
                        function: 'transSumDayDetail'
                    }
                },
                {
                    path: '/functionManage',
                    component: resolve => require(['../components/page/FunctionCodeAction/functionManage.vue'], resolve),
                    meta: {
                        title: '功能点管理',
                        function: 'payTypeDayDetail'
                    }
                },
                {
                    path: '/roleManage',
                    component: resolve => require(['../components/page/MsRoleInfoAction/roleManage.vue'], resolve),
                    meta: {
                        title: '角色管理',
                        function: 'payTypeDayDetail'
                    }
                },
                {
                    path: '/userManage',
                    component: resolve => require(['../components/page/MsUserInfoAction/userManage.vue'], resolve),
                    meta: {
                        title: '角色管理',
                        function: 'payTypeDayDetail'
                    }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: {title: '基础表格'}
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: {title: 'tab选项卡'}
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: {title: '基本表单'}
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: {title: '富文本编辑器'}
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: {title: 'markdown编辑器'}
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: {title: '文件上传'}
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: {title: 'schart图表'}
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: {title: '拖拽列表'}
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: {title: '权限测试', permission: true}
                },
                {
                    // 订单列表
                    path: '/orderList',
                    component: resolve => require(['../components/page/order/orderList'], resolve),
                    meta: {
                        title: '订单列表',
                    }
                },
                {
                    // 订单列表
                    path: '/orderTimeout',
                    component: resolve => require(['../components/page/order/orderTimeout'], resolve),
                    meta: {
                        title: '超时设置',
                    }
                },

                {
                    // 店铺列表
                    path: '/shopList',
                    component: resolve => require(['../components/page/shop/ShopList'], resolve),
                    meta: {
                        title: '店铺列表',
                    }
                },

                {
                    // 操作员列表
                    path: '/tellerList',
                    component: resolve => require(['../components/page/teller/TellerList'], resolve),
                    meta: {
                        title: '操作员列表',
                    }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ],
    Sidebar: [
        {
            icon: 'el-icon-house', index: 'home',
            title: '欢迎'
        },
        {
            icon: 'el-icon-setting',
            index: '1',
            title: '商城设置',
            subs: [
                {
                    // icon: 'el-icon-tickets',
                    index: 'mallHomePage',
                    title: '首页轮播图',
                },
                {
                    // icon: 'el-icon-tickets',
                    index: 'mallPhone',
                    title: '客服电话',
                },
                {
                    // icon: 'el-icon-tickets',
                    index: 'mallSysArg',
                    title: '系统参数',
                },
                {
                    // icon: 'el-icon-tickets',
                    index: 'mallSysArgSet',
                    title: '系统参数设置',
                }
            ],
        },
        {
            icon: 'el-icon-sell',
            index: '2',
            title: '商品管理',
            subs: [
                {
                    // icon: 'el-icon-tickets',
                    index: 'goodsTypeManage',
                    title: '商品分类',
                },
                {
                    // icon: 'el-icon-tickets',
                    index: 'goodsManage',
                    title: '商品列表',
                },
                {
                    // icon: 'el-icon-tickets',
                    index: 'goodsUpDown',
                    title: '批量上下架',
                },
            ]
        },
        {
            icon: 'el-icon-s-order',
            index: '3',
            title: '订单管理',
            subs: [
                {
                    // icon: 'el-icon-tickets',
                    index: 'orderList',
                    title: '订单列表',
                },
                {
                    // icon: 'el-icon-tickets',
                    index: 'orderTimeout',
                    title: '超时设置',
                },

            ]
        },
        {
            icon: 'el-icon-box',
            index: '4',
            title: '店铺管理',
            subs: [
                {
                    index: 'shopList',
                    title: '店铺列表',
                },
            ]
        },
        {
            icon: 'el-icon-user',
            index: '5',
            title: '操作员管理',
            subs: [
                {
                    index: 'tellerList',
                    title: '操作员列表',
                },
            ]
        },
    ]
};
