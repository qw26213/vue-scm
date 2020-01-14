import Layout from '@/layout'
const purchaseRouter = {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/data',
    name: 'purchase',
    meta: {
        title: '采购',
        icon: 'shopping'
    },
    children: [{
        path: 'data',
        component: () =>
            import ('@/views/purchase/data'),
        name: 'purchaseData',
        meta: {
            title: '进货单'
        }
    }, {
        path: 'add',
        component: () =>
            import ('@/views/purchase/add'),
        name: 'purchaseAdd',
        hidden: true,
        meta: {
            title: '新增进货单'
        }
    }, {
        path: 'modify',
        component: () =>
            import ('@/views/purchase/add'),
        name: 'purchaseModify',
        hidden: true,
        meta: {
            title: '编辑进货单'
        }
    }, {
        path: 'purchaseOrder',
        component: () =>
            import ('@/views/purchase/list'),
        name: 'purchaseOrder',
        meta: {
            title: '采购订单'
        }
    }, {
        path: 'returned',
        component: () =>
            import ('@/views/purchase/returned'),
        name: 'returned',
        meta: {
            title: '采购退货'
        }
    }, {
        path: 'returnedAdd',
        component: () =>
            import ('@/views/purchase/returnedAdd'),
        name: 'returnedAdd',
        hidden: true,
        meta: {
            title: '新增采购退货'
        }
    }, {
        path: 'returnedModify',
        component: () =>
            import ('@/views/purchase/returnedAdd'),
        name: 'returnedModify',
        hidden: true,
        meta: {
            title: '编辑采购退货'
        }
    }, {
        path: 'purchaseInvoice',
        component: () =>
            import ('@/views/purchase/invoice'),
        name: 'purchaseInvoice',
        meta: {
            title: '采购发票'
        }
    }]
}
export default purchaseRouter;