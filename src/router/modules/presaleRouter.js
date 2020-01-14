import Layout from '@/layout'
const presaleRouter = {
    path: '/presale',
    component: Layout,
    alwaysShow: true,
    redirect: '/presale/data',
    name: 'presale',
    meta: {
        title: '预收',
        icon: 'collect',
    },
    children: [{
        path: 'data',
        component: () => import('@/views/presale/data'),
        name: 'presaleData',
        meta: { title: '预收单' }
    }, {
        path: 'add',
        component: () => import('@/views/presale/add'),
        hidden: true,
        name: 'presaleAdd',
        meta: { title: '新增预收单' }
    }, {
        path: 'modify',
        component: () => import('@/views/presale/add'),
        name: 'presaleModify',
        hidden: true,
        meta: { title: '编辑预收单' }
    },{
        path: 'returned',
        component: () => import('@/views/presale/returned'),
        name: 'presaleReturnedData',
        meta: { title: '预收退款' }
    }, {
        path: 'returnedAdd',
        component: () => import('@/views/presale/returnedAdd'),
        hidden: true,
        name: 'presaleReturnedAdd',
        meta: { title: '新增预收退款' }
    }, {
        path: 'returneModify',
        component: () => import('@/views/presale/returnedAdd'),
        name: 'presaleReturnedAdd',
        hidden: true,
        meta: { title: '编辑预收退款' }
    }]
}

export default presaleRouter;