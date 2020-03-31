import Layout from '@/layout';
const maintainRouter = {
        path: '/maintain',
        component: Layout,
        redirect: '/maintain/group',
        name: 'maintain',
        meta: {
            title: '维护',
            icon: 'maintain'
        },
        children: [{
            path: 'rebuildBalance',
            component: () => import('@/views/maintain/rebuildBalance'),
            name: 'rebuildBalance',
            meta: {
                title: '重建余额表'
            }
        }, {
            path: 'synBasedata',
            component: () => import('@/views/maintain/synBasedata'),
            name: 'synBasedata',
            meta: {
                title: '基础数据同步'
            }
        }]
    }
export default maintainRouter;