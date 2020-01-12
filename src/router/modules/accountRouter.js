import Layout from '@/layout';
import account from '@/layout/account';
const accountRouter = {
    path: '/account',
    component: Layout,
    redirect: '/accbook/totalaccount',
    name: 'account',
    meta: {
        title: '总账',
        icon: 'money'
    },
    children: [{
        path: '/accbook',
        component: account,
        redirect: '/accbook/totalaccount',
        name: 'accbook',
        meta: {
            title: '账簿'
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
            // }, {
            //     path: 'subsidiary',
            //     component: () => import('@/views/accbook/subsidiary'),
            //     name: 'subsidiary',
            //     meta: {
            //         title: '明细账(分录)'
            //     }
        }, {
            path: 'balance',
            component: () => import('@/views/accbook/balance'),
            name: 'balance',
            meta: {
                title: '科目余额表'
            }
        }, {
            path: 'manyaccount',
            component: () => import('@/views/accbook/manyaccount'),
            name: 'manyaccount',
            meta: {
                title: '多栏账'
            }
        }, {
            path: 'numbertotalaccount',
            component: () => import('@/views/accbook/numbertotalaccount'),
            name: 'numbertotalaccount',
            meta: {
                title: '数量总账'
            }
        }, {
            path: 'numberdetailaccount',
            component: () => import('@/views/accbook/numberdetailaccount'),
            name: 'numberdetailaccount',
            meta: {
                title: '数量明细账'
            }
            // }, {
            //     path: 'subsidiarynum',
            //     component: () => import('@/views/accbook/subsidiarynum'),
            //     name: 'subsidiarynum',
            //     meta: {
            //         title: '数量明细账(分录)'
            //     }
        }, {
            path: 'checkbalance',
            component: () => import('@/views/accbook/checkbalance'),
            name: 'checkbalance',
            meta: {
                title: '项目余额表'
            }
        }, {
            path: 'checkdetail',
            component: () => import('@/views/accbook/checkdetail'),
            name: 'checkdetail',
            meta: {
                title: '项目明细表'
            }
            // }, {
            //     path: 'projsubsidiary',
            //     component: () => import('@/views/accbook/projsubsidiary'),
            //     name: 'projsubsidiary',
            //     meta: {
            //         title: '项目明细表(分录)'
            //     }
        }]
    }, {
        path: '/voucher',
        component: account,
        redirect: '/voucher/add',
        name: 'voucher',
        meta: {
            title: '凭证'
        },
        children: [{
            path: 'add',
            component: () => import('@/views/voucher/add'),
            name: 'voucherAdd',
            meta: {
                title: '新增凭证'
            }
        }, {
            path: 'data',
            component: () => import('@/views/voucher/data'),
            name: 'voucherData',
            meta: {
                title: '凭证管理'
            }
        }, {
            path: 'audit',
            component: () => import('@/views/voucher/audit'),
            name: 'voucherAudit',
            meta: {
                title: '凭证审核'
            }
        }, {
            path: 'table',
            component: () => import('@/views/voucher/table'),
            name: 'voucherTable',
            meta: {
                title: '凭证汇总表'
            }
        }]
    }, {
        path: 'closePeriod',
        component: () => import('@/views/voucher/closePeriod'),
        name: 'closePeriod',
        meta: {
            title: '结账'
        }
    }]
}
export default accountRouter;