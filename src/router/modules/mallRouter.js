import Layout from '@/layout';
const mallRouter = {
    path: '/mall',
    component: Layout,
    redirect: '/mall/enterprise',
    name: 'mall',
    meta: {
        roles: ['4210', '4220'],
        title: '微商城',
        icon: 'people'
    },
    children: [{
        path: 'enterprise',
        component: () => import('@/views/mall/enterprise'),
        name: 'enterprise',
        meta: {
            roles: ['4210'],
            title: '企业信息'
        }
    }, {
        path: 'customerlist',
        component: () => import('@/views/mall/customerlist'),
        name: 'customerlist',
        meta: {
            roles: ['4220'],
            title: '客户管理'
        }
    }, {
        path: 'goodlist',
        component: () => import('@/views/mall/goodlist'),
        name: 'goodlist',
        meta: {
            roles: ['4220'],
            title: '商品管理'
        }
    }, {
        path: 'addgood',
        component: () => import('@/views/mall/addgood'),
        name: 'addgood',
        hidden: true,
        meta: {
            roles: ['4220'],
            title: '商品新增'
        }
    }, {
        path: 'order',
        component: () => import('@/views/mall/order'),
        name: 'order',
        meta: {
            roles: ['4220'],
            title: '订单管理'
        }
    }]
}
export default mallRouter;