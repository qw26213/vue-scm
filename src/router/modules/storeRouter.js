import Layout from '@/layout'
const storeRouter = {
    path: '/store',
    component: Layout,
    redirect: '/store/in',
    name: 'store',
    meta: {
        roles: ['2610', '2614', '2626', '2618', '2622', '2630'],
        title: '库存',
        icon: 'store'
    },
    children: [{
        path: 'warehousing',
        component: () => import ('@/views/store/warehousing'),
        name: 'warehousing',
        meta: {
            roles: ['2610'],
            title: '入库单'
        }
    }, {
        path: 'warehousingAdd',
        component: () => import ('@/views/store/warehousingAdd'),
        name: 'warehousingAdd',
        hidden: true,
        meta: {
            roles: ['261010'],
            title: '新增入库单'
        }
    }, {
        path: 'warehousingModify',
        component: () => import ('@/views/store/warehousingAdd'),
        name: 'warehousingModify',
        hidden: true,
        meta: {
            roles: ['261020'],
            title: '编辑入库单'
        }
    }, {
        path: 'warehousingDetail',
        component: () => import ('@/views/store/warehousingAdd'),
        name: 'warehousingDetail',
        hidden: true,
        meta: {
            roles: ['261020'],
            title: '查看入库单'
        }
    }, {
        path: 'outboundOrderReturned',
        component: () => import ('@/views/store/outboundOrderReturned'),
        name: 'outboundOrderReturned',
        meta: {
            roles: ['2614'],
            title: '销售退货入库'
        }
    }, {
        path: 'outboundOrderReturnedAdd',
        component: () => import ('@/views/store/outboundOrderReturnedAdd'),
        name: 'outboundOrderReturnedAdd',
        hidden: true,
        meta: {
            roles: ['261410'],
            title: '新增销售退货入库'
        }
    }, {
        path: 'outboundOrderReturnedModify',
        component: () => import ('@/views/store/outboundOrderReturnedAdd'),
        name: 'outboundOrderReturnedModify',
        hidden: true,
        meta: {
            roles: ['261420'],
            title: '编辑销售退货入库'
        }
    }, {
        path: 'outboundOrderReturnedDetail',
        component: () => import ('@/views/store/outboundOrderReturnedAdd'),
        name: 'outboundOrderReturnedDetail',
        hidden: true,
        meta: {
            roles: ['261420'],
            title: '查看销售退货入库'
        }
    }, {
        path: 'outboundOrder',
        component: () => import ('@/views/store/outboundOrder'),
        name: 'outboundOrder',
        meta: {
            roles: ['2626'],
            title: '出库单'
        }
    }, {
        path: 'outboundOrderAdd',
        component: () => import ('@/views/store/outboundOrderAdd'),
        name: 'outboundOrderAdd',
        hidden: true,
        meta: {
            roles: ['262610'],
            title: '新增出库单'
        }
    }, {
        path: 'outboundOrderModify',
        component: () => import ('@/views/store/outboundOrderAdd'),
        name: 'outboundOrderModify',
        hidden: true,
        meta: {
            roles: ['262620'],
            title: '编辑出库单'
        }
    }, {
        path: 'outboundOrderSplit',
        component: () => import ('@/views/store/outboundOrderAdd'),
        name: 'outboundOrderSplit',
        hidden: true,
        meta: {
            roles: ['262620'],
            title: '拆分出库单'
        }
    }, {
        path: 'outboundOrderDetail',
        component: () => import ('@/views/store/outboundOrderAdd'),
        name: 'outboundOrderDetail',
        hidden: true,
        meta: {
            roles: ['262620'],
            title: '查看出库单'
        }
    }, {
        path: 'allocation',
        component: () => import ('@/views/store/allocation'),
        name: 'allocation',
        meta: {
            roles: ['2618'],
            title: '调拨单'
        }
    }, {
        path: 'allocationAdd',
        component: () => import ('@/views/store/allocationAdd'),
        name: 'allocationAdd',
        hidden: true,
        meta: {
            roles: ['261810'],
            title: '新增调拨单'
        }
    }, {
        path: 'allocationModify',
        component: () => import ('@/views/store/allocationAdd'),
        name: 'allocationModify',
        hidden: true,
        meta: {
            roles: ['261820'],
            title: '编辑调拨单'
        }
    }, {
        path: 'allocationDetail',
        component: () => import ('@/views/store/allocationAdd'),
        name: 'allocationDetail',
        hidden: true,
        meta: {
            roles: ['261820'],
            title: '查看调拨单'
        }
    }, {
        path: 'movement',
        component: () => import ('@/views/store/movement'),
        name: 'movement',
        meta: {
            roles: ['2622'],
            title: '移库单'
        }
    }, {
        path: 'movementAdd',
        component: () => import ('@/views/store/movementAdd'),
        name: 'movementAdd',
        hidden: true,
        meta: {
            roles: ['262210'],
            title: '新增移库单'
        }
    }, {
        path: 'movementModify',
        component: () => import ('@/views/store/movementAdd'),
        name: 'movementModify',
        hidden: true,
        meta: {
            roles: ['262220'],
            title: '编辑移库单'
        }
    }, {
        path: 'movementDetail',
        component: () => import ('@/views/store/movementAdd'),
        name: 'movementDetail',
        hidden: true,
        meta: {
            roles: ['262220'],
            title: '查看移库单'
        }
    }, {
        path: 'warehousingReturned',
        component: () => import ('@/views/store/warehousingReturned'),
        name: 'warehousingReturned',
        meta: {
            roles: ['2630'],
            title: '采购退货出库'
        }
    }, {
        path: 'warehousingReturnedAdd',
        component: () => import ('@/views/store/warehousingReturnedAdd'),
        hidden: true,
        name: 'warehousingReturnedAdd',
        meta: {
            roles: ['263010'],
            title: '新增采购退货出库'
        }
    }, {
        path: 'warehousingReturnedModify',
        component: () => import ('@/views/store/warehousingReturnedAdd'),
        hidden: true,
        name: 'warehousingReturnedModify',
        meta: {
            roles: ['263020'],
            title: '编辑采购退货出库'
        }
    }, {
        path: 'warehousingReturnedDetail',
        component: () => import ('@/views/store/warehousingReturnedAdd'),
        hidden: true,
        name: 'warehousingReturnedDetail',
        meta: {
            roles: ['263020'],
            title: '查看采购退货出库'
        }
    }, {
        path: 'inventory',
        component: () => import ('@/views/store/inventory'),
        name: 'saleInventory',
        meta: {
            roles: ['1450'],
            title: '盘点单'
        }
    }, {
        path: 'inventoryAdd',
        component: () => import ('@/views/store/inventoryAdd'),
        name: 'inventoryAdd',
        hidden: true,
        meta: {
            roles: ['145010'],
            title: '新增盘点单'
        }
    }, {
        path: 'inventoryModify',
        component: () => import ('@/views/store/inventoryAdd'),
        name: 'inventoryAdd',
        hidden: true,
        meta: {
            roles: ['145020'],
            title: '编辑盘点单'
        }
    }, {
        path: 'inventoryDetail',
        component: () => import ('@/views/store/inventoryAdd'),
        name: 'inventoryDetail',
        hidden: true,
        meta: {
            roles: ['145020'],
            title: '查看盘点单'
        }
    }]
}
export default storeRouter;