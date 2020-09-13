import Layout from '@/layout'
import setView from '@/layout/set'
const reportRouter = {
    path: '/table',
    component: Layout,
    redirect: '/table/data',
    name: 'table',
    meta: {
        roles: ['6010', '6020', '6030'],
        title: '报表',
        icon: 'table'
    },
    children: [{
        path: 'store',
        component: setView,
        name: 'baseData',
        meta: {
            roles: ['6010'],
            title: '库存'
        },
        children: [{
            path: 'data',
            component: () => import ('@/views/table/store/data'),
            name: 'baseMeas',
            meta: {
                roles: ['601018'],
                title: '仓库'
            }
        }, {
            path: 'truck',
            component: () => import ('@/views/table/store/truck'),
            name: 'truck',
            meta: {
                roles: ['601018'],
                title: '车辆'
            }
        }, {
            path: 'outbound1',
            component: () => import ('@/views/table/store/outboundOrder1'),
            name: 'outbound1',
            meta: {
                roles: ['601018'],
                title: '销售出库统计'
            }
        }, {
            path: 'outbound2',
            component: () => import ('@/views/table/store/outboundOrder2'),
            name: 'outbound2',
            meta: {
                roles: ['601018'],
                title: '销售退库统计'
            }
        }, {
            path: 'warehousing1',
            component: () => import ('@/views/table/store/warehousing1'),
            name: 'warehousing1',
            meta: {
                roles: ['601018'],
                title: '入库统计'
            }
        }, {
            path: 'warehousing2',
            component: () => import ('@/views/table/store/warehousing2'),
            name: 'warehousing2',
            meta: {
                roles: ['601018'],
                title: '退货出库统计'
            }
        }, {
            path: 'inventory',
            component: () => import ('@/views/table/store/inventory'),
            name: 'inventory',
            meta: {
                roles: ['6030'],
                title: '盘点'
            }
        }, {
            path: 'allocation',
            component: () => import ('@/views/table/store/allocation'),
            name: 'allocation',
            meta: {
                roles: ['601018'],
                title: '调拨'
            }
        }, {
            path: 'movement',
            component: () => import ('@/views/table/store/movement'),
            name: 'movement',
            meta: {
                roles: ['601018'],
                title: '移库'
            }
        }]
    }, {
        path: '/grossprofit',
        component: setView,
        redirect: '/grossprofit/group',
        name: 'grossprofit',
        meta: {
            roles: ['5410', '5420', '5430', '5440', '5450', '5460'],
            title: '毛利'
        },
        children: [{
            path: 'grossprofit1',
            component: () => import ('@/views/table/grossprofit/grossprofit1'),
            name: 'grossprofit1',
            meta: {
                roles: ['5410'],
                title: '今日毛利统计'
            }
        }, {
            path: 'grossprofit2',
            component: () => import ('@/views/table/grossprofit/grossprofit2'),
            name: 'grossprofit2',
            meta: {
                roles: ['5420'],
                title: '毛利综合统计'
            }
        }, {
            path: 'grossprofit3',
            component: () => import ('@/views/table/grossprofit/grossprofit3'),
            name: 'grossprofit3',
            meta: {
                roles: ['5430'],
                title: '周期辅助项统计'
            }
        }, {
            path: 'grossprofit4',
            component: () => import ('@/views/table/grossprofit/grossprofit4'),
            name: 'grossprofit4',
            meta: {
                roles: ['5440'],
                title: '辅助项二维统计'
            }
        }, {
            path: 'grossprofit5',
            component: () => import ('@/views/table/grossprofit/grossprofit5'),
            name: 'grossprofit5',
            meta: {
                roles: ['5450'],
                title: '品类分项统计'
            }
        }, {
            path: 'grossprofit6',
            component: () => import ('@/views/table/grossprofit/grossprofit6'),
            name: 'grossprofit6',
            meta: {
                roles: ['5460'],
                title: '多维度统计'
            }
        }]
    }, {
        path: 'purchase',
        component: setView,
        name: 'purchase',
        meta: {
            roles: ['6020'],
            title: '采购'
        },
        children: [{
            path: 'purchase1',
            component: () => import ('@/views/table/purchase/data1'),
            name: 'purchase1',
            meta: {
                roles: ['602010'],
                title: '采购统计'
            }
        }, {
            path: 'purchase2',
            component: () => import ('@/views/table/purchase/data2'),
            name: 'purchase2',
            meta: {
                roles: ['602010'],
                title: '采购退货统计'
            }
        }]
    }, {
        path: 'sale',
        component: setView,
        name: 'sale',
        meta: {
            roles: ['6030'],
            title: '销售'
        },
        children: [{
            path: 'graph',
            component: () => import ('@/views/table/sale/data1'),
            name: 'graph1',
            meta: {
                roles: ['603010'],
                title: '销售统计'
            }
        }, {
            path: 'data',
            component: () => import ('@/views/table/sale/data2'),
            name: 'graph2',
            meta: {
                roles: ['603020'],
                title: '销售退货统计'
            }
        }]
    }]
}

export default reportRouter;