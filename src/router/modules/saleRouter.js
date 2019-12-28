import Layout from '@/layout'
const saleRouter = {
    path: '/sale',
    component: Layout,
    redirect: '/sale/data',
    name: 'sale',
    meta: {
        title: '销售',
        icon: 'table'
    },
    children: [{
        path: 'data',
        component: () => import('@/views/sale/data'),
        name: 'saleData',
        meta: {
            title: '销售单'
        }
    }, {
        path: 'add',
        component: () => import('@/views/sale/add'),
        name: 'saleAdd',
        hidden: true,
        meta: {
            title: '新增销售单'
        }
    }, {
        path: 'modify',
        component: () => import('@/views/sale/add'),
        name: 'saleModify',
        hidden: true,
        meta: {
            title: '编辑销售单'
        }
    }, {
        path: 'saleList',
        component: () => import('@/views/sale/list'),
        name: 'saleList',
        meta: {
            title: '销售订单'
        }
    }, {
        path: 'saleTable',
        component: () => import('@/views/sale/table'),
        name: 'saleTable',
        meta: {
            title: '销售退货'
        }
    }, {
        path: 'saleInvoice',
        component: () => import('@/views/sale/invoice'),
        name: 'saleInvoice',
        meta: {
            title: '销售发票'
        }
    }]
}
export default saleRouter;