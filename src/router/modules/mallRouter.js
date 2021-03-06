import Layout from '@/layout';
const mallRouter = {
    path: '/mall',
    component: Layout,
    redirect: '/mall/enterprise',
    name: 'mall',
    meta: {
        roles: ['4210', '4220'],
        title: '微商城',
        icon: 'mall'
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
            title: '新增商品'
        }
    }, {
        path: 'modifygood',
        component: () => import('@/views/mall/addgood'),
        name: 'modifygood',
        hidden: true,
        meta: {
            roles: ['4220'],
            title: '编辑商品'
        }
    }, {
        path: 'deline',
        component: () => import('@/views/mall/deline'),
        name: 'goodDeline',
        hidden: true,
        meta: {
            roles: ['4220'],
            title: '商品明细管理'
        }
    }, {
        path: 'addgoodline',
        component: () => import('@/views/mall/addgoodline'),
        name: 'addgoodline',
        hidden: true,
        meta: {
            roles: ['4220'],
            title: '新增商品明细'
        }
    }, {
        path: 'modifygoodline',
        component: () => import('@/views/mall/addgoodline'),
        name: 'modifygoodline',
        hidden: true,
        meta: {
            roles: ['4220'],
            title: '编辑商品明细'
        }
    }, {
        path: 'orderlist',
        component: () => import('@/views/mall/orderlist'),
        name: 'orderlist',
        meta: {
            roles: ['4220'],
            title: '订单管理'
        }
    }]
}
export default mallRouter;