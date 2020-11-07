import Layout from '@/layout'
import tableView from '@/layout/set'
const reportRouter = {
    path: '/table',
    component: Layout,
    redirect: '/table/data',
    name: 'table',
    meta: {
        roles: ['5010', '5020', '5030', '5036', '5040', '5050', '5060'],
        title: '报表',
        icon: 'table'
    },
    children: [{
        path: 'purchase',
        component: tableView,
        name: 'purchaseStatic',
        meta: {
            roles: ['5010'],
            title: '采购'
        },
        children: [{
            path: 'purchase',
            component: () => import ('@/views/table/purchase/data1'),
            name: 'tablePurchase',
            meta: {
                roles: ['501010'],
                title: '采购统计'
            }
        }, {
            path: 'purchasereturn',
            component: () => import ('@/views/table/purchase/data2'),
            name: 'tablePurchasereturn',
            meta: {
                roles: ['501020'],
                title: '采购退货统计'
            }
        }]
    }, {
        path: 'sale',
        component: tableView,
        name: 'saleStatic',
        meta: {
            roles: ['5020'],
            title: '销售'
        },
        children: [{
            path: 'graph',
            component: () => import ('@/views/table/sale/data1'),
            name: 'tableSale',
            meta: {
                roles: ['502010'],
                title: '销售统计'
            }
        }, {
            path: 'data',
            component: () => import ('@/views/table/sale/data2'),
            name: 'tableSalereturn',
            meta: {
                roles: ['502020'],
                title: '销售退货统计'
            }
        }]
    }, {
        path: 'store',
        component: tableView,
        name: 'tableStore',
        meta: {
            roles: ['5030'],
            title: '库存'
        },
        children: [{
            path: 'warehousing1',
            component: () => import ('@/views/table/store/warehousing1'),
            name: 'tableWarehousing',
            meta: {
                roles: ['503010'],
                title: '入库统计'
            }
        }, {
            path: 'outbound1',
            component: () => import ('@/views/table/store/outboundOrder1'),
            name: 'tableOutbound1',
            meta: {
                roles: ['503020'],
                title: '出库统计'
            }
        }, {
            path: 'allocation',
            component: () => import ('@/views/table/store/allocation'),
            name: 'tableAllocation',
            meta: {
                roles: ['503030'],
                title: '调拨统计'
            }
        }, {
            path: 'movement',
            component: () => import ('@/views/table/store/movement'),
            name: 'tableMovement',
            meta: {
                roles: ['503040'],
                title: '移库统计'
            }
        }, {
            path: 'outbound2',
            component: () => import ('@/views/table/store/outboundOrder2'),
            name: 'tableOutbound2',
            meta: {
                roles: ['503050'],
                title: '销售退货入库'
            }
        }, {
            path: 'warehousing2',
            component: () => import ('@/views/table/store/warehousing2'),
            name: 'tableWarehousingReturn',
            meta: {
                roles: ['503060'],
                title: '采购退货出库'
            }
        }, {
            path: 'inventory',
            component: () => import ('@/views/table/store/inventory'),
            name: 'tableInventory',
            meta: {
                roles: ['503070'],
                title: '盘点统计'
            }
        }, {
            path: 'warehouse',
            component: () => import ('@/views/table/store/warehouse'),
            name: 'tableWarehouse',
            meta: {
                roles: ['503080'],
                title: '仓库统计'
            }
        }, {
            path: 'truck',
            component: () => import ('@/views/table/store/truck'),
            name: 'tableTruck',
            meta: {
                roles: ['503090'],
                title: '车辆统计'
            }
        }]
    }, {
        path: 'presale',
        component: () => import ('@/views/table/presale/data'),
        name: 'tablePresale',
        meta: {
            roles: ['5036'],
            title: '预收'
        }
    }, {
        path: 'rpt',
        component: tableView,
        name: 'rpt1',
        meta: {
            roles: ['5030'],
            title: '往来'
        },
        children: [{
            path: 'rpt1',
            component: () => import ('@/views/table/rpt/data1'),
            name: 'tableRect',
            meta: {
                roles: ['503010'],
                title: '收款'
            }
        }, {
            path: 'rpt2',
            component: () => import ('@/views/table/rpt/data2'),
            name: 'tablePay',
            meta: {
                roles: ['503020'],
                title: '付款'
            }
        }]
    }, {
        path: '/grossprofit',
        component: tableView,
        redirect: '/grossprofit/group',
        name: 'grossprofit',
        meta: {
            roles: ['5050'],
            title: '毛利'
        },
        children: [{
            path: 'grossprofit',
            component: () => import ('@/views/table/grossprofit/grossprofit'),
            name: 'grossprofit',
            meta: {
                roles: ['505010'],
                title: '综合统计'
            }
        }, {
            path: 'grossprofit3',
            component: () => import ('@/views/table/grossprofit/grossprofit3'),
            name: 'grossprofit3',
            meta: {
                roles: ['505020'],
                title: '周期辅助项统计'
            }
        }, {
            path: 'grossprofit4',
            component: () => import ('@/views/table/grossprofit/grossprofit4'),
            name: 'grossprofit4',
            meta: {
                roles: ['505030'],
                title: '辅助项二维统计'
            }
        }, {
            path: 'grossprofit5',
            component: () => import ('@/views/table/grossprofit/grossprofit5'),
            name: 'grossprofit5',
            meta: {
                roles: ['505040'],
                title: '品类分项统计'
            }
        }]
    }, {
        path: 'visit',
        component: () => import ('@/views/table/visit/data'),
        name: 'tableVisit',
        meta: {
            roles: ['5060'],
            title: '拜访'
        }
    }]
}

export default reportRouter
