import Layout from '@/layout';
const accountRouter = {
    path: '/report',
    component: Layout,
    redirect: '/report/debt',
    name: 'report',
    meta: {
        title: '报表',
        icon:'table'
    },
    children: [{
        path: 'debt',
        component: () => import('@/views/report/debt'),
        name: 'debt',
        meta: {
            title: '资产负债表'
        }
    }, {
        path: 'profit',
        component: () => import('@/views/report/profit'),
        name: 'profit',
        meta: {
            title: '利润表'
        }
    }, {
        path: 'flow',
        component: () => import('@/views/report/flow'),
        name: 'flow',
        meta: {
            title: '现金流量表'
        }
    }]
}
export default accountRouter;