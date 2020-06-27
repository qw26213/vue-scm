import Layout from '@/layout';
const accountRouter = {
    path: '/report',
    component: Layout,
    redirect: '/report/debt',
    name: 'report',
    meta: {
        roles: ['10'],
        title: '报表',
        icon:'report'
    },
    children: [{
        path: 'debt',
        component: () => import('@/views/report/debt'),
        name: 'debt',
        meta: {
            roles: ['10'],
            title: '资产负债表'
        }
    }, {
        path: 'profit',
        component: () => import('@/views/report/profit'),
        name: 'profit',
        meta: {
            roles: ['10'],
            title: '利润表'
        }
    }, {
        path: 'flow',
        component: () => import('@/views/report/flow'),
        name: 'flow',
        meta: {
            roles: ['10'],
            title: '现金流量表'
        }
    }]
}
export default accountRouter;