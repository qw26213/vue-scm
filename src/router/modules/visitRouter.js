import Layout from '@/layout';
const hrRouter = {
    path: '/visit',
    component: Layout,
    redirect: '/visit/table',
    name: 'visit',
    meta: {
        title: '拜访',
        icon:'table'
    },
    children: [{
        path: 'add',
        component: () => import('@/views/visit/add'),
        name: 'visitAdd',
        meta: {
            title: '行程分析'
        }
    }, {
        path: 'data',
        component: () => import('@/views/visit/data'),
        name: 'visitData',
        meta: {
            title: '明细查询'
        }
    }, {
        path: 'audit',
        component: () => import('@/views/visit/audit'),
        name: 'visitAudit',
        meta: {
            title: '拜访提醒'
        }
    }, {
        path: 'table',
        component: () => import('@/views/visit/table'),
        name: 'visitTable',
        meta: {
            title: '业务员行程'
        }
    }, {
        path: 'clientList',
        component: () => import('@/views/visit/clientList'),
        name: 'clientList',
        meta: {
            title: '待开发客户'
        }
    }]
}
export default hrRouter;