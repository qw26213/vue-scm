import Layout from '@/layout'
const purchaseRouter = {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/data',
    name: 'purchase',
    meta: {
        roles: ['1020', '1030'],
        title: '采购',
        icon: 'shopping'
    },
    children: [{
        path: 'data',
        component: () => import ('@/views/purchase/data'),
        name: 'purchaseData',
        meta: {
            roles: ['1020'],
            title: '进货单'
        }
    }, {
        path: 'add',
        component: () => import ('@/views/purchase/add'),
        name: 'purchaseAdd',
        hidden: true,
        meta: {
            roles: ['102010'],
            title: '新增进货单'
        }
    }, {
        path: 'modify',
        component: () => import ('@/views/purchase/add'),
        name: 'purchaseModify',
        hidden: true,
        meta: {
            roles: ['102020'],
            title: '编辑进货单'
        }
    }, {
        path: 'detail',
        component: () => import ('@/views/purchase/detail'),
        name: 'purchaseDetail',
        hidden: true,
        meta: {
            roles: ['1020'],
            title: '查看进货单'
        }
    }, {
        path: 'returned',
        component: () => import ('@/views/purchase/returned'),
        name: 'purchaseReturned',
        meta: {
            roles: ['1030'],
            title: '采购退货'
        }
    }, {
        path: 'returnedAdd',
        component: () => import ('@/views/purchase/returnedAdd'),
        name: 'purchaseReturnedAdd',
        hidden: true,
        meta: {
            roles: ['103010'],
            title: '新增采购退货'
        }
    }, {
        path: 'returnedModify',
        component: () => import ('@/views/purchase/returnedAdd'),
        name: 'purchaseReturnedModify',
        hidden: true,
        meta: {
            roles: ['103020'],
            title: '编辑采购退货'
        }
    }, {
        path: 'returnedDetail',
        component: () => import ('@/views/purchase/returnedDetail'),
        name: 'purchaseReturnedDetail',
        hidden: true,
        meta: {
            roles: ['1030'],
            title: '查看采购退货'
        }
    // }, {
    //     path: 'purchaseOrder',
    //     component: () => import ('@/views/purchase/list'),
    //     name: 'purchaseOrder',
    //     meta: {
    //         roles: ['1100'],
    //         title: '采购订单'
    //     }
    // }, {
    //     path: 'purchaseInvoice',
    //     component: () => import ('@/views/purchase/invoice'),
    //     name: 'purchaseInvoice',
    //     meta: {
    //         roles: ['1100'],
    //         title: '采购发票'
    //     }
    }]
}
export default purchaseRouter;