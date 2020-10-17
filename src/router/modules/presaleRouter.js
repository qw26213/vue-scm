import Layout from '@/layout'
const presaleRouter = {
    path: '/presale',
    component: Layout,
    alwaysShow: true,
    redirect: '/presale/data',
    name: 'presale',
    meta: {
        roles: ['2210', '2220'],
        title: '预收',
        icon: 'collect',
    },
    children: [{
        path: 'data',
        component: () => import ('@/views/presale/data'),
        name: 'presaleData',
        meta: {
            roles: ['2210'],
            title: '预收单'
        }
    }, {
        path: 'add',
        component: () => import ('@/views/presale/add'),
        hidden: true,
        name: 'presaleAdd',
        meta: {
            roles: ['221010'],
            title: '新增预收单'
        }
    }, {
        path: 'modify',
        component: () => import ('@/views/presale/add'),
        name: 'presaleModify',
        hidden: true,
        meta: {
            roles: ['221020'],
            title: '编辑预收单'
        }
    }, {
        path: 'detail',
        component: () => import ('@/views/presale/add'),
        name: 'presaleDetail',
        hidden: true,
        meta: {
            roles: ['2210'],
            title: '查看预收单'
        }
    }, {
        path: 'returned',
        component: () => import ('@/views/presale/returned'),
        name: 'presaleReturnedData',
        meta: {
            roles: ['2220'],
            title: '预收退款'
        }
    }, {
        path: 'returnedAdd',
        component: () => import ('@/views/presale/returnedAdd'),
        hidden: true,
        name: 'presaleReturnedAdd',
        meta: {
            roles: ['222010'],
            title: '新增预收退款'
        }
    }, {
        path: 'returnedModify',
        component: () => import ('@/views/presale/returnedAdd'),
        name: 'presaleReturnedModify',
        hidden: true,
        meta: {
            roles: ['222020'],
            title: '编辑预收退款'
        }
    }, {
        path: 'returnedDetail',
        component: () => import ('@/views/presale/returnedAdd'),
        name: 'presaleReturnedDetail',
        hidden: true,
        meta: {
            roles: ['2220'],
            title: '查看预收退款'
        }
    }]
}

export default presaleRouter;