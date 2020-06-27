import Layout from '@/layout';
const accountRouter = {
    path: '/report',
    component: Layout,
    redirect: '/report/debt',
    name: 'report',
    meta: {
        roles: ['504010', '504020'],
        title: '报表',
        icon:'report'
    },
    children: [{
        path: 'debt',
        component: () => import('@/views/report/debt'),
        name: 'debt',
        meta: {
            roles: ['504010'],
            title: '资产负债表'
        }
    }, {
        path: 'profit',
        component: () => import('@/views/report/profit'),
        name: 'profit',
        meta: {
            roles: ['504020'],
            title: '利润表'
        }
    }]
}
export default accountRouter;