import Layout from '@/layout';
const arapRouter = {
    path: '/rp',
    component: Layout,
    redirect: '/rp/data',
    name: 'rp',
    meta: {
        roles: ['1810', '1820'],
        title: '往来',
        icon: 'change'
    },
    children: [{
        path: 'receipt',
        component: () => import ('@/views/rp/receipt'),
        name: 'receipt',
        meta: {
            roles: ['1810'],
            title: '收款单'
        }
    }, {
        path: 'receiptAdd',
        component: () => import ('@/views/rp/receiptAdd'),
        name: 'receiptAdd',
        hidden: true,
        meta: {
            roles: ['181010'],
            title: '新增收款单'
        }
    }, {
        path: 'receiptModify',
        component: () => import ('@/views/rp/receiptAdd'),
        name: 'receiptModify',
        hidden: true,
        meta: {
            roles: ['181020'],
            title: '修改收款单'
        }
    }, {
        path: 'payment',
        component: () => import ('@/views/rp/payment'),
        name: 'payment',
        meta: {
            roles: ['1820'],
            title: '付款单'
        }
    }, {
        path: 'paymentAdd',
        component: () => import ('@/views/rp/paymentAdd'),
        name: 'paymentAdd',
        hidden: true,
        meta: {
            roles: ['182010'],
            title: '新增付款单'
        }
    }, {
        path: 'paymentModify',
        component: () => import ('@/views/rp/paymentAdd'),
        name: 'paymentModify',
        hidden: true,
        meta: {
            roles: ['182020'],
            title: '修改付款单'
        }
    }]
}
export default arapRouter