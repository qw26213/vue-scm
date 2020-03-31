import Layout from '@/layout';
const initRouter = {
        path: '/init',
        component: Layout,
        redirect: '/init/group',
        name: 'init',
        meta: {
            title: '初始化',
            icon: 'init'
        },
        children: [{
            path: 'createBill',
            component: () => import('@/views/init/createBill'),
            name: 'createBill',
            meta: {
                title: '建账'
            }
        }, {
            path: 'import',
            component: () => import('@/views/init/import'),
            name: 'import',
            meta: {
                title: '导入'
            }
        }]
    }
export default initRouter;