import Layout from '@/layout';
const arapRouter = {
    path: '/interact',
    component: Layout,
    redirect: '/interact/data',
    name: 'interact',
    meta: {
        title: '往来',
        icon: 'change'
    },
    children: [{
        path: 'interactData',
        component: () => import('@/views/interact/data'),
        name: 'interactData',
        meta: {
            title: '收款单'
        }
    }, {
        path: 'interactData1',
        component: () => import('@/views/interact/data1'),
        name: 'interactData1',
        meta: {
            title: '付款单'
        }
    }, {
        path: 'interactData2',
        component: () => import('@/views/interact/data2'),
        name: 'interactData2',
        meta: {
            title: '其它应收'
        }
    }, {
        path: 'interactData3',
        component: () => import('@/views/interact/data3'),
        name: 'interactData3',
        meta: {
            title: '其它应付'
        }
    }, {
        path: 'interactData5',
        component: () => import('@/views/interact/data5'),
        name: 'interactData5',
        meta: {
            title: '收入单'
        }
    }, {
        path: 'interactData6',
        component: () => import('@/views/interact/data6'),
        name: 'interactData6',
        meta: {
            title: '费用单'
        }
    }, {
        path: 'interactData7',
        component: () => import('@/views/interact/data7'),
        name: 'interactData7',
        meta: {
            title: '往来核销'
        }
    }, {
        path: 'interactData8',
        component: () => import('@/views/interact/data8'),
        name: 'interactData8',
        meta: {
            title: '往来冲销'
        }
    }, {
        path: 'interactData9',
        component: () => import('@/views/interact/data9'),
        name: 'interactData9',
        meta: {
            title: '往来账'
        }
    }]
}
export default arapRouter;