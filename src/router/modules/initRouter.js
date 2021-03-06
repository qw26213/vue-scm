import Layout from '@/layout';
const initRouter = {
    path: '/init',
    component: Layout,
    redirect: '/init/group',
    name: 'init',
    meta: {
        roles: ['7010','7020','7030'],
        title: '初始化',
        icon: 'init'
    },
    children: [{
        path: 'book',
        component: () => import ('@/views/init/book'),
        name: 'book',
        meta: {
            roles: ['7010'],
            title: '建账'
        }
    }, {
        path: 'buildbook',
        component: () => import ('@/views/init/buildbook'),
        name: 'buildbook',
        hidden: true,
        meta: {
            roles: ['7010'],
            title: '新建账套'
        }
    }, {
        path: 'modifybook',
        component: () => import ('@/views/init/buildbook'),
        name: 'buildbook',
        hidden: true,
        meta: {
            roles: ['7010'],
            title: '编辑账套'
        }
    }, {
        path: 'import',
        component: () => import ('@/views/init/import'),
        name: 'importData',
        meta: {
            roles: ['7030'],
            title: '导入'
        }
    }, {
        path: 'balance',
        component: () => import ('@/views/init/balance'),
        name: 'initialBalance',
        meta: {
            roles: ['7020'],
            title: '期初余额'
        }
    }]
}
export default initRouter;