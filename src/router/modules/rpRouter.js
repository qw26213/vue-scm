import Layout from '@/layout';
const arapRouter = {
    path: '/rp',
    component: Layout,
    redirect: '/rp/data',
    name: 'rp',
    meta: {
        title: '往来',
        icon: 'change'
    },
    children: [{
        path: 'receipt',
        component: () => import ('@/views/rp/receipt'),
        name: 'receipt',
        meta: {
            title: '收款单'
        }
    }, {
        path: 'receiptAdd',
        component: () => import ('@/views/rp/receiptAdd'),
        name: 'receipt',
        hidden: true,
        meta: {
            title: '新增收款单'
        }
    }, {
        path: 'receiptModify',
        component: () => import ('@/views/rp/receiptAdd'),
        name: 'receipt',
        hidden: true,
        meta: {
            title: '修改收款单'
        }
    }, {
        path: 'payment',
        component: () => import ('@/views/rp/payment'),
        name: 'payment',
        meta: {
            title: '付款单'
        }
    }, {
        path: 'paymentAdd',
        component: () => import ('@/views/rp/paymentAdd'),
        name: 'paymentAdd',
        hidden: true,

        meta: {
            title: '新增付款单'
        }
    }, {
        path: 'paymentModify',
        component: () => import ('@/views/rp/paymentAdd'),
        name: 'paymentAdd',
        hidden: true,
        meta: {
            title: '修改付款单'
        }
    }, {
        path: 'rpData2',
        component: () => import ('@/views/rp/data2'),
        name: 'rpData2',
        meta: {
            title: '其它应收'
        }
    }, {
        path: 'rpData3',
        component: () => import ('@/views/rp/data3'),
        name: 'rpData3',
        meta: {
            title: '其它应付'
        }
    }, {
        path: 'rpData5',
        component: () => import ('@/views/rp/data5'),
        name: 'rpData5',
        meta: {
            title: '收入单'
        }
    }, {
        path: 'rpData6',
        component: () => import ('@/views/rp/data6'),
        name: 'rpData6',
        meta: {
            title: '费用单'
        }
    }, {
        path: 'rpData7',
        component: () => import ('@/views/rp/data7'),
        name: 'rpData7',
        meta: {
            title: '往来核销'
        }
    }, {
        path: 'rpData8',
        component: () => import ('@/views/rp/data8'),
        name: 'rpData8',
        meta: {
            title: '往来冲销'
        }
    }, {
        path: 'rpData9',
        component: () => import ('@/views/rp/data9'),
        name: 'rpData9',
        meta: {
            title: '往来账'
        }
    }]
}
export default arapRouter;