import Layout from '@/layout';
const maintainRouter = {
        path: '/maintain',
        component: Layout,
        redirect: '/maintain/group',
        name: 'maintain',
        meta: {
            roles: ['7410', '7420'],
            title: '维护',
            icon: 'maintain'
        },
        children: [{
            path: 'reBalance',
            component: () => import('@/views/maintain/reBalance'),
            name: 'reBalance',
            meta: {
                roles: ['7410'],
                title: '重建余额表'
            }
        }, {
            path: 'synBasedata',
            component: () => import('@/views/maintain/synBasedata'),
            name: 'synBasedata',
            meta: {
                roles: ['7420'],
                title: '基础数据同步'
            }
        }]
    }
export default maintainRouter;