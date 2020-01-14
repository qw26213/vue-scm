import Layout from '@/layout'
const saleRouter = {
    path: '/sale',
    component: Layout,
    redirect: '/sale/data',
    name: 'sale',
    meta: {
        title: '销售',
        icon: 'certificate'
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
        path: 'returned',
        component: () => import('@/views/sale/returned'),
        name: 'returned',
        meta: {
            title: '销售退货'
        }
    }, {
        path: 'returnedAdd',
        component: () => import('@/views/sale/returnedAdd'),
        name: 'returnedAdd',
        hidden:true,
        meta: {
            title: '新增销售退货'
        }
    }, {
        path: 'returnedModify',
        component: () => import('@/views/sale/returnedAdd'),
        name: 'returnedModify',
        hidden:true,
        meta: {
            title: '编辑销售退货'
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