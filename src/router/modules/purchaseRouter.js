import Layout from '@/layout'
const purchaseRouter = {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/data',
    name: 'purchase',
    meta: {
        title: '采购',
        icon: 'table'
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
        path: 'purchaseTable',
        component: () =>
            import ('@/views/purchase/table'),
        name: 'purchaseTable',
        meta: {
            title: '采购退货'
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