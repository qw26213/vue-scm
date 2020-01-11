import Layout from '@/layout';
const accbookRouter = {
    path: '/accbook',
    component: Layout,
    redirect: '/accbook/totalaccount',
    name: 'accbook',
    meta: {
        title: '账簿',
        icon: 'money'
    },
    children: [{
        path: 'totalaccount',
        component: () => import('@/views/accbook/totalaccount'),
        name: 'totalaccount',
        meta: {
            title: '总账'
        }
    }, {
        path: 'detailaccount',
        component: () => import('@/views/accbook/detailaccount'),
        name: 'detailaccount',
        meta: {
            title: '明细账'
        }
    }, {
        path: 'detailaccount',
        component: () => import('@/views/accbook/detailaccount'),
        name: 'detailaccount',
        meta: {
            title: '明细账(分录)'
        }
    }, {
        path: 'detailaccount',
        component: () => import('@/views/accbook/detailaccount'),
        name: 'detailaccount',
        meta: {
            title: '科目余额表'
        }
    }, {
        path: 'detailaccount',
        component: () => import('@/views/accbook/detailaccount'),
        name: 'detailaccount',
        meta: {
            title: '多栏账'
        }
    }, {
        path: 'detailaccount',
        component: () => import('@/views/accbook/detailaccount'),
        name: 'detailaccount',
        meta: {
            title: '数量明细账'
        }
    }, {
        path: 'detailaccount',
        component: () => import('@/views/accbook/detailaccount'),
        name: 'detailaccount',
        meta: {
            title: '数量明细账(分录)'
        }
    }, {
        path: 'detailaccount',
        component: () => import('@/views/accbook/detailaccount'),
        name: 'detailaccount',
        meta: {
            title: '项目余额表'
        }
    }, {
        path: 'detailaccount',
        component: () => import('@/views/accbook/detailaccount'),
        name: 'detailaccount',
        meta: {
            title: '项目明细表'
        }
    }, {
        path: 'detailaccount',
        component: () => import('@/views/accbook/detailaccount'),
        name: 'detailaccount',
        meta: {
            title: '项目余额表(分录)'
        }
    }]
}
export default accbookRouter;