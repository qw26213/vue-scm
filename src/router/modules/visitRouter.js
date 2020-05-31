import Layout from '@/layout';
const hrRouter = {
    path: '/visit',
    component: Layout,
    redirect: '/visit/table',
    name: 'visit',
    meta: {
        title: '拜访',
        icon:'visitor'
    },
    children: [{
        path: 'data',
        component: () => import('@/views/visit/data'),
        name: 'visitData',
        meta: {
            title: '业务员行程'
        }
    }, {
        path: 'table',
        component: () => import('@/views/visit/table'),
        name: 'visitTable',
        meta: {
            title: '业务图片查询'
        }
    }]
}
export default hrRouter;