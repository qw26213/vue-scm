import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
import setView from '@/layout/set'

import saleRouter from './modules/saleRouter'
import purchaseRouter from './modules/purchaseRouter'


export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
    }]
}, {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
}, {
    path: '/forgetPsd',
    component: () => import('@/views/login/forgetPsd'),
    hidden: true
}, {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
}, {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
}, {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'home',
        meta: { title: '主页', icon: 'home', affix: true }
    }]
}]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    saleRouter, 
    purchaseRouter, 
    // {
    //     path: '/interact',
    //     component: Layout,
    //     redirect: '/interact/data',
    //     name: 'interact',
    //     meta: {
    //         title: '往来',
    //         icon: 'table'
    //     },
    //     children: [{
    //         path: 'interactData',
    //         component: () => import('@/views/interact/data'),
    //         name: 'interactData',
    //         meta: {
    //             title: '收款单'
    //         }
    //     }, {
    //         path: 'interactData1',
    //         component: () => import('@/views/interact/data1'),
    //         name: 'interactData1',
    //         meta: {
    //             title: '付款单'
    //         }
    //     }, {
    //         path: 'interactData2',
    //         component: () => import('@/views/interact/data2'),
    //         name: 'interactData2',
    //         meta: {
    //             title: '其它应收'
    //         }
    //     }, {
    //         path: 'interactData3',
    //         component: () => import('@/views/interact/data3'),
    //         name: 'interactData3',
    //         meta: {
    //             title: '其它应付'
    //         }
    //     }, {
    //         path: 'interactData5',
    //         component: () => import('@/views/interact/data5'),
    //         name: 'interactData5',
    //         meta: {
    //             title: '收入单'
    //         }
    //     }, {
    //         path: 'interactData6',
    //         component: () => import('@/views/interact/data6'),
    //         name: 'interactData6',
    //         meta: {
    //             title: '费用单'
    //         }
    //     }, {
    //         path: 'interactData7',
    //         component: () => import('@/views/interact/data7'),
    //         name: 'interactData7',
    //         meta: {
    //             title: '往来核销'
    //         }
    //     }, {
    //         path: 'interactData8',
    //         component: () => import('@/views/interact/data8'),
    //         name: 'interactData8',
    //         meta: {
    //             title: '往来冲销'
    //         }
    //     }, {
    //         path: 'interactData9',
    //         component: () => import('@/views/interact/data9'),
    //         name: 'interactData9',
    //         meta: {
    //             title: '往来账'
    //         }
    //     }]
    // }, 
    {
        path: '/presale',
        component: Layout,
        redirect: '/presale/data',
        name: 'presale',
        meta: {
          title: '预收',
          icon: 'table',
        },
        children: [{
          path: 'data',
          component: () => import('@/views/presale/data'),
          name: 'presaleData',
          meta: { title: '预收单'}
        },{
          path: 'add',
          component: () => import('@/views/presale/add'),
          name: 'presaleAdd',
          hidden:true,
          meta: { title: '新增预收单'}
        },{
          path: 'modify',
          component: () => import('@/views/presale/add'),
          name: 'presaleModify',
          hidden:true,
          meta: { title: '编辑预收单'}
        }]
      }, {
        path: '/store',
        component: Layout,
        redirect: '/store/in',
        name: 'store',
        meta: {
            title: '库存',
            icon: 'table'
        },
        children: [{
            path: 'warehousing',
            component: () => import('@/views/store/warehousing'),
            name: 'warehousing',
            meta: {
                title: '入库单'
            }
        },{
            path: 'warehousingAdd',
            component: () => import('@/views/store/warehousingAdd'),
            name: 'warehousingAdd',
            hidden:true,
            meta: {
                title: '新增入库单'
            }
        },{
            path: 'warehousingModify',
            component: () => import('@/views/store/warehousingAdd'),
            name: 'warehousingModify',
            hidden:true,
            meta: {
                title: '编辑入库单'
            }
        }, {
            path: 'outboundOrder',
            component: () => import('@/views/store/outboundOrder'),
            name: 'outboundOrder',
            meta: {
                title: '出库单'
            }
        },{
            path: 'outboundOrderAdd',
            component: () => import('@/views/store/outboundOrderAdd'),
            name: 'outboundOrderAdd',
            hidden:true,
            meta: {
                title: '新增出库单'
            }
        }, {
            path: 'outboundOrderModify',
            component: () => import('@/views/store/outboundOrderAdd'),
            name: 'outboundOrderModify',
            hidden:true,
            meta: {
                title: '编辑出库单'
            }
        }, {
            path: 'allocation',
            component: () => import('@/views/store/allocation'),
            name: 'allocation',
            meta: {
                title: '调拨单'
            }
        }, {
            path: 'allocationAdd',
            component: () => import('@/views/store/allocationAdd'),
            name: 'allocationAdd',
            hidden:true,
            meta: {
                title: '新增调拨单'
            }
        }, {
            path: 'allocationModify',
            component: () => import('@/views/store/allocationAdd'),
            name: 'allocationModify',
            hidden:true,
            meta: {
                title: '编辑调拨单'
            }
        }, {
            path: 'movement',
            component: () => import('@/views/store/movement'),
            name: 'movement',
            meta: {
                title: '移库单'
            }
        }, {
            path: 'movementAdd',
            component: () => import('@/views/store/movementAdd'),
            name: 'movementAdd',
            hidden:true,
            meta: {
                title: '新增移库单'
            }
        }, {
            path: 'movementModify',
            component: () => import('@/views/store/movementAdd'),
            name: 'movementModify',
            hidden:true,
            meta: {
                title: '编辑移库单'
            }
        }, {
            path: 'storeAbolish',
            component: () => import('@/views/store/turnover0'),
            name: 'storeAbolish',
            meta: {
                title: '报废'
            }
        }, {
            path: 'storeTurnover1',
            component: () => import('@/views/store/turnover1'),
            name: 'storeTurnover1',
            meta: {
                title: '盘亏'
            }
        }, {
            path: 'storeTurnover2',
            component: () => import('@/views/store/turnover2'),
            name: 'storeTurnover2',
            meta: {
                title: '盘盈'
            }
        }, {
            path: 'storeTurnover3',
            component: () => import('@/views/store/turnover3'),
            name: 'storeTurnover3',
            meta: {
                title: '盘点'
            }
        }]
    }, {
        path: '/price',
        component: Layout,
        redirect: '/price/group',
        name: 'price',
        meta: {
            title: '价格',
            icon: 'money'
        },
        children: [{
            path: 'priceGroup',
            component: () => import('@/views/price/group'),
            name: 'priceGroup',
            meta: {
                title: '价格组'
            }
        }, {
            path: 'priceIndex',
            component: () => import('@/views/price/index'),
            name: 'priceIndex',
            meta: {
                title: '价格设定'
            }
        }]
    }, {
        path: '/set',
        component: Layout,
        redirect: '/set/index',
        name: 'set',
        meta: {
            title: '设置',
            icon: 'set'
        },
        children: [{
                path: 'baseData',
                component: setView,
                name: 'baseData',
                meta: { title: '基础数据' },
                children: [{
                        path: 'meas',
                        component: () => import('@/views/set/meas'),
                        name: 'baseMeas',
                        meta: { title: '计量单位' }
                    }, {
                        path: 'bizType',
                        component: () => import('@/views/set/bizType'),
                        name: 'baseBizType',
                        meta: { title: '业务类型' }
                    }, {
                        path: 'bizProc',
                        component: () => import('@/views/set/bizProc'),
                        name: 'baseBizProc',
                        meta: { title: '业务流程' }
                    }, {
                        path: 'salesType',
                        component: () => import('@/views/set/salesType'),
                        name: 'baseSalesType',
                        meta: { title: '销售类型' }
                    }, {
                        path: 'settleType',
                        component: () => import('@/views/set/settleType'),
                        name: 'baseSettleType',
                        meta: { title: '结算方式' }
                    }, {
                        path: 'paymentType',
                        component: () => import('@/views/set/paymentType'),
                        name: 'basePaymentType',
                        meta: { title: '付款方式' }
                    },
                ]
            }, {
                path: 'baseFile',
                component: setView,
                name: 'baseFile',
                meta: { title: '基础档案' },
                children: [{
                        path: 'supplier',
                        component: () => import('@/views/set/supplier'),
                        name: 'baseSupplier',
                        meta: { title: '供应商' }
                    }, {
                        path: 'channel',
                        component: () => import('@/views/set/channelType'),
                        name: 'baseChannel',
                        meta: { title: '渠道类型' }
                    }, {
                        path: 'custType',
                        component: () => import('@/views/set/custType'),
                        name: 'baseCustType',
                        meta: { title: '客户类别', }
                    }, {
                        path: 'cust',
                        component: () => import('@/views/set/cust'),
                        name: 'baseCust',
                        meta: { title: '客户' }
                    }, {
                        path: 'warehouse',
                        component: () => import('@/views/set/warehouse'),
                        name: 'baseWarehouse',
                        meta: { title: '仓库' }
                    }, {
                        path: 'truck',
                        component: () => import('@/views/set/truck'),
                        name: 'baseTruck',
                        meta: { title: '车辆' }
                    }, {
                        path: 'invCatg',
                        component: () => import('@/views/set/invCatg'),
                        name: 'baseInvCatg',
                        meta: { title: '商品分类' }
                    }, {
                        path: 'item',
                        component: () => import('@/views/set/item'),
                        name: 'baseItem',
                        meta: { title: '商品' }
                    }, {
                        path: 'route',
                        component: () => import('@/views/set/route'),
                        name: 'baseRoute',
                        meta: { title: '线路' }
                    }, {
                        path: 'brand',
                        component: () => import('@/views/set/brand'),
                        name: 'baseBrand',
                        meta: { title: '品牌' }
                    }, {
                        path: 'dept',
                        component: () => import('@/views/set/dept'),
                        name: 'baseDept',
                        meta: { title: '部门', }
                    }, {
                        path: 'staff',
                        component: () => import('@/views/set/staff'),
                        name: 'baseStaff',
                        meta: { title: '员工', }
                    }, {
                        path: 'proj',
                        component: () => import('@/views/set/proj'),
                        name: 'baseProj',
                        meta: { title: '项目' }
                    }, {
                        path: 'invCurrency',
                        component: () => import('@/views/set/currency'),
                        name: 'baseInvCurrency',
                        meta: { title: '币种' }
                    }, {
                        path: 'invCatogery',
                        component: () => import('@/views/set/catogery'),
                        name: 'baseInvCatogery',
                        meta: { title: '凭证字' }
                    }, {
                        path: 'invTempletType',
                        component: () => import('@/views/set/templetType'),
                        name: 'baseInvTempletType',
                        meta: { title: '凭证模板类型' }
                    }
                ]
            }, {
                path: 'user',
                component: setView,
                name: 'user',
                meta: { title: '用户权限' },
                children: [{
                        path: 'userList',
                        component: () => import('@/views/set/user/list'),
                        name: 'userList',
                        meta: { title: '用户' }
                    }, {
                        path: 'userGroup',
                        component: () => import('@/views/set/user/group'),
                        name: 'userGroup',
                        meta: { title: '用户组' }
                    }, {
                        path: 'userFunc',
                        component: () => import('@/views/set/user/func'),
                        name: 'userFunc',
                        meta: { title: '功能权限' }
                    }, {
                        path: 'dataRole',
                        component: () => import('@/views/set/user/data'),
                        name: 'dataRole',
                        meta: { title: '数据权限' }
                    }
                ]
            }, {
                path: 'baseElse',
                component: setView,
                name: 'baseElse',
                meta: { title: '其他' },
                children: [{
                        path: 'feeType',
                        component: () => import('@/views/set/else/feeType'),
                        name: 'feeType',
                        meta: { title: '计价方式' }
                    }, {
                        path: 'payType',
                        component: () => import('@/views/set/else/payType'),
                        name: 'payType',
                        meta: { title: '收付类型' }
                    }, {
                        path: 'coaType',
                        component: () => import('@/views/set/else/coaType'),
                        name: 'coaType',
                        meta: { title: '科目分类' }
                    }
                ]
            }
        ]
    },
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router