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
            path: 'outbound',
            component: () => import ('@/views/table/store/outbound'),
            name: 'outbound',
            meta: {
                roles: ['601018'],
                title: '出库'
            }
        }, {
            path: 'warehousing',
            component: () => import ('@/views/table/store/warehousing'),
            name: 'baseMeas',
            meta: {
                roles: ['601018'],
                title: '入库'
            }
        }, {
            path: 'allocation',
            component: () => import ('@/views/table/store/allocation'),
            name: 'baseMeas',
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
                title: '采购'
            }
        }, {
            path: 'purchase2',
            component: () => import ('@/views/table/purchase/data2'),
            name: 'purchase2',
            meta: {
                roles: ['602010'],
                title: '采购退货'
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
            path: 'data1',
            component: () => import ('@/views/table/sale/data1'),
            name: 'userList',
            meta: {
                roles: ['603010'],
                title: '销售'
            }
        }, {
            path: 'data2',
            component: () => import ('@/views/table/sale/data2'),
            name: 'userRole',
            meta: {
                roles: ['603020'],
                title: '销售退货'
            }
        }]
    }]
}

export default reportRouter;