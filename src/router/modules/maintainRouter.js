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
            path: 'rebuildBalance',
            component: () => import('@/views/maintain/rebuildBalance'),
            name: 'rebuildBalance',
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