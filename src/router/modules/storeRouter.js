import Layout from '@/layout'
const storeRouter = {
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
            path: 'outboundOrderReturned',
            component: () => import('@/views/store/outboundOrderReturned'),
            name: 'outboundOrderReturned',
            meta: {
                title: '销售退货入库'
            }
        }, {
            path: 'outboundOrderReturnedAdd',
            component: () => import('@/views/store/outboundOrderReturnedAdd'),
            name: 'outboundOrderReturnedAdd',
            hidden:true,
            meta: {
                title: '新增销售退货入库'
            }
        }, {
            path: 'outboundOrderReturnedModify',
            component: () => import('@/views/store/outboundOrderReturnedAdd'),
            name: 'outboundOrderReturnedModify',
            hidden:true,
            meta: {
                title: '编辑销售退货入库'
            }
        }, {
            path: 'outboundOrder',
            component: () => import('@/views/store/outboundOrder'),
            name: 'outboundOrder',
            meta: {
                title: '出库单'
            }
        }, {
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
            path: 'warehousingReturned',
            component: () => import('@/views/store/warehousingReturned'),
            name: 'warehousingReturned',
            meta: {
                title: '采购退货出库'
            }
        }, {
            path: 'warehousingReturnedAdd',
            component: () => import('@/views/store/warehousingReturnedAdd'),
            hidden:true,
            name: 'warehousingReturnedAdd',
            meta: {
                title: '新增采购退货出库'
            }
        }, {
            path: 'warehousingReturnedModify',
            component: () => import('@/views/store/warehousingReturnedAdd'),
            hidden:true,
            name: 'warehousingReturnedModify',
            meta: {
                title: '编辑采购退货出库'
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
    }
export default storeRouter;