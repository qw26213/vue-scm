import Layout from '@/layout';
import account from '@/layout/account';
const accountRouter = {
    path: '/account',
    component: Layout,
    redirect: '/accbook/totalaccount',
    name: 'account',
    meta: {
        title: '总账',
        icon: 'account'
    },
    children: [{
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
            path: 'modify',
            component: () => import('@/views/voucher/add'),
            name: 'voucherModify',
            hidden:true,
            meta: {
                title: '修改凭证'
            }
        }, {
            path: 'insert',
            component: () => import('@/views/voucher/add'),
            name: 'voucherInsert',
            hidden:true,
            meta: {
                title: '插入凭证'
            }
        }, {
            path: 'data',
            component: () => import('@/views/voucher/data'),
            name: 'voucherData',
            meta: {
                title: '查询凭证'
            }
        }, {
            path: 'audit',
            component: () => import('@/views/voucher/audit'),
            name: 'voucherAudit',
            meta: {
                title: '审核凭证'
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
        }, {
            path: 'coabalance',
            component: () => import('@/views/accbook/balance'),
            name: 'coabalance',
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