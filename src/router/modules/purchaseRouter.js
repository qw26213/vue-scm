import Layout from '@/layout'
const purchaseRouter = {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/data',
    name: 'Purchase',
    meta: {
        roles: ['1020', '1030'],
        title: '采购',
        icon: 'shopping'
    },
    children: [{
        path: 'data',
        component: () => import ('@/views/purchase/data'),
        name: 'PurchaseData',
        meta: {
            roles: ['1020'],
            title: '进货单'
        }
    }, {
        path: 'add',
        component: () => import ('@/views/purchase/add'),
        name: 'PurchaseAdd',
        hidden: true,
        meta: {
            roles: ['102010'],
            title: '新增进货单'
        }
    }, {
        path: 'modify',
        component: () => import ('@/views/purchase/add'),
        name: 'PurchaseModify',
        hidden: true,
        meta: {
            roles: ['102020'],
            title: '编辑进货单'
        }
    }, {
        path: 'detail',
        component: () => import ('@/views/purchase/add'),
        name: 'PurchaseDetail',
        hidden: true,
        meta: {
            roles: ['1020'],
            title: '查看进货单'
        }
    }, {
        path: 'returned',
        component: () => import ('@/views/purchase/returned'),
        name: 'PurchaseReturned',
        meta: {
            roles: ['1030'],
            title: '采购退货'
        }
    }, {
        path: 'returnedAdd',
        component: () => import ('@/views/purchase/returnedAdd'),
        name: 'PurchaseReturnedAdd',
        hidden: true,
        meta: {
            roles: ['103010'],
            title: '新增采购退货'
        }
    }, {
        path: 'returnedModify',
        component: () => import ('@/views/purchase/returnedAdd'),
        name: 'PurchaseReturnedModify',
        hidden: true,
        meta: {
            roles: ['103020'],
            title: '编辑采购退货'
        }
    }, {
        path: 'returnedDetail',
        component: () => import ('@/views/purchase/returnedAdd'),
        name: 'PurchaseReturnedDetail',
        hidden: true,
        meta: {
            roles: ['1030'],
            title: '查看采购退货'
        }
    }]
}
export default purchaseRouter;