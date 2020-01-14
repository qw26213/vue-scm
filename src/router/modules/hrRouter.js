import Layout from '@/layout';
const hrRouter = {
        path: '/hr',
        component: Layout,
        redirect: '/hr/group',
        name: 'hr',
        meta: {
            title: '薪酬',
            icon: 'people'
        },
        children: [{
            path: 'employee',
            component: () => import('@/views/hr/employee'),
            name: 'employee',
            meta: {
                title: '人员管理'
            }
        }, {
            path: 'pay',
            component: () => import('@/views/hr/pay'),
            name: 'pay',
            meta: {
                title: '薪酬管理'
            }
        }]
    }
export default hrRouter;