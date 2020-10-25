import Layout from '@/layout'
const saleRouter = {
    path: '/sale',
    component: Layout,
    redirect: '/sale/data',
    name: 'Sale',
    meta: {
        roles: ['1410', '1420', '1430', '1440', '1450'],
        title: '销售',
        icon: 'certificate'
    },
    children: [{
        path: 'data',
        component: () => import('@/views/sale/data'),
        name: 'SaleData',
        meta: {
            roles: ['1420'],
            title: '销售单'
        }
    }, {
        path: 'add',
        component: () => import('@/views/sale/add'),
        name: 'SaleAdd',
        hidden: true,
        meta: {
            roles: ['142010'],
            title: '新增销售单'
        }
    }, {
        path: 'modify',
        component: () => import('@/views/sale/add'),
        name: 'SaleModify',
        hidden: true,
        meta: {
            roles: ['142020'],
            title: '编辑销售单'
        }
    }, {
        path: 'detail',
        component: () => import('@/views/sale/add'),
        name: 'SaleDetail',
        hidden: true,
        meta: {
            roles: ['1420'],
            title: '查看销售单'
        }
    }, {
        path: 'saleOrder',
        component: () => import('@/views/sale/order'),
        name: 'OrderData',
        meta: {
            roles: ['1410'],
            title: '销售订单'
        }
    }, {
        path: 'orderAdd',
        component: () => import('@/views/sale/orderAdd'),
        hidden:true,
        name: 'OrderAdd',
        meta: {
            roles: ['141010'],
            title: '新增销售订单'
        }
    }, {
        path: 'orderModify',
        component: () => import('@/views/sale/orderAdd'),
        hidden:true,
        name: 'OrderModify',
        meta: {
            roles: ['141020'],
            title: '编辑销售订单'
        }
    }, {
        path: 'orderDetail',
        component: () => import('@/views/sale/orderAdd'),
        hidden:true,
        name: 'OrderDetail',
        meta: {
            roles: ['141020'],
            title: '查看销售订单'
        }
    }, {
        path: 'returned',
        component: () => import('@/views/sale/returned'),
        name: 'SaleReturned',
        meta: {
            roles: ['1430'],
            title: '销售退货'
        }
    }, {
        path: 'returnedAdd',
        component: () => import('@/views/sale/returnedAdd'),
        name: 'SaleReturnedAdd',
        hidden:true,
        meta: {
            roles: ['143010'],
            title: '新增销售退货'
        }
    }, {
        path: 'returnedModify',
        component: () => import('@/views/sale/returnedAdd'),
        name: 'SaleReturnedModify',
        hidden:true,
        meta: {
            roles: ['143020'],
            title: '编辑销售退货'
        }
    }, {
        path: 'returnedDetail',
        component: () => import('@/views/sale/returnedAdd'),
        name: 'SaleReturnedDetail',
        hidden:true,
        meta: {
            roles: ['1430'],
            title: '查看销售退货'
        }
    }, {
        path: 'delivery',
        component: () => import('@/views/sale/delivery'),
        name: 'Delivery',
        meta: {
            roles: ['1440'],
            title: '销售配送'
        }
    }, {
        path: 'deliveryAdd',
        component: () => import('@/views/sale/deliveryAdd'),
        name: 'DeliveryAdd',
        hidden: true,
        meta: {
            roles: ['144010'],
            title: '新增销售配送'
        }
    }, {
        path: 'deliveryModify',
        component: () => import('@/views/sale/deliveryAdd'),
        name: 'DeliveryModify',
        hidden: true,
        meta: {
            roles: ['144020'],
            title: '编辑销售配送'
        }
    }, {
        path: 'deliveryDetail',
        component: () => import('@/views/sale/deliveryAdd'),
        name: 'DeliveryDetail',
        hidden: true,
        meta: {
            roles: ['144020'],
            title: '查看销售配送'
        }
    }, {
        path: 'invoice',
        component: () => import('@/views/sale/invoice'),
        name: 'SaleInvoice',
        meta: {
            roles: ['1450'],
            title: '销售发票'
        }
    }, {
        path: 'invoiceAdd',
        component: () => import('@/views/sale/invoiceAdd'),
        name: 'InvoiceAdd',
        hidden: true,
        meta: {
            roles: ['145010'],
            title: '新增销售发票'
        }
    }, {
        path: 'invoiceModify',
        component: () => import('@/views/sale/invoiceAdd'),
        name: 'InvoiceAdd',
        hidden: true,
        meta: {
            roles: ['145020'],
            title: '编辑销售发票'
        }
    }, {
        path: 'invoiceDeail',
        component: () => import('@/views/sale/invoiceAdd'),
        name: 'InvoiceAdd',
        hidden: true,
        meta: {
            roles: ['1460'],
            title: '查看销售发票'
        }
    }, {
        path: 'everyday',
        component: () => import('@/views/sale/everyday'),
        name: 'EverydayData',
        meta: {
            roles: ['1460'],
            title: '销售日结'
        }
    }, {
        path: 'everydayAdd',
        component: () => import('@/views/sale/everydayAdd'),
        name: 'EverydayAdd',
        hidden: true,
        meta: {
            roles: ['146010'],
            title: '新增销售日结'
        }
    }, {
        path: 'everydayModify',
        component: () => import('@/views/sale/everydayAdd'),
        name: 'EverydayAdd',
        hidden: true,
        meta: {
            roles: ['146020'],
            title: '编辑销售日结'
        }
    }, {
        path: 'everydayDetail',
        component: () => import('@/views/sale/everydayAdd'),
        name: 'EverydayAdd',
        hidden: true,
        meta: {
            roles: ['146020'],
            title: '查看销售日结'
        }
    }]
}

export default saleRouter
