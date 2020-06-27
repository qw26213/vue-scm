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
        path: 'createBill',
        component: () => import ('@/views/init/createBill'),
        name: 'createBill',
        meta: {
            roles: ['7010'],
            title: '建账'
        }
    }, {
        path: 'import',
        component: () => import ('@/views/init/import'),
        name: 'import',
        meta: {
            roles: ['7030'],
            title: '导入'
        }
    }, {
        path: 'balance',
        component: () => import ('@/views/init/balance'),
        name: 'coaBalance',
        meta: {
            roles: ['7020'],
            title: '期初余额'
        }
    }]
}
export default initRouter;