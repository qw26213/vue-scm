import Layout from '@/layout';
import account from '@/layout/account';
const accountRouter = {
    path: '/account',
    component: Layout,
    redirect: '/accbook/totalaccount',
    name: 'account',
    meta: {
        title: '总账',
        icon: 'account',
        roles: ['3810', '3820', '3830', '3840']
    },
    children: [{
        path: '/voucher',
        component: account,
        redirect: '/voucher/add',
        name: 'voucher',
        meta: {
            title: '凭证',
            roles: ['3810']
        },
        children: [{
            path: 'add',
            component: () =>
                import ('@/views/voucher/add'),
            name: 'voucherAdd',
            meta: {
                title: '新增凭证',
                roles: ['381010']
            }
        }, {
            path: 'modify',
            component: () =>
                import ('@/views/voucher/add'),
            name: 'voucherModify',
            hidden: true,
            meta: {
                title: '修改凭证',
                roles: ['381020']
            }
        }, {
            path: 'insert',
            component: () =>
                import ('@/views/voucher/add'),
            name: 'voucherInsert',
            hidden: true,
            meta: {
                title: '插入凭证',
                roles: ['38']
            }
        }, {
            path: 'data',
            component: () =>
                import ('@/views/voucher/data'),
            name: 'voucherData',
            meta: {
                title: '查询凭证',
                roles: ['38']
            }
        }, {
            path: 'audit',
            component: () =>
                import ('@/views/voucher/audit'),
            name: 'voucherAudit',
            meta: {
                title: '审核凭证',
                roles: ['381030']
            }
        }, {
            path: 'table',
            component: () =>
                import ('@/views/voucher/table'),
            name: 'voucherTable',
            meta: {
                title: '凭证汇总表',
                roles: ['381040']
            }
        }]
    }, {
        path: '/accbook',
        component: account,
        redirect: '/accbook/totalaccount',
        name: 'accbook',
        meta: {
            title: '账簿',
            roles: ['3820']
        },
        children: [{
            path: 'totalaccount',
            component: () =>
                import ('@/views/accbook/totalaccount'),
            name: 'totalaccount',
            meta: {
                title: '总账',
                roles: ['382010']
            }
        }, {
            path: 'detailaccount',
            component: () =>
                import ('@/views/accbook/detailaccount'),
            name: 'detailaccount',
            meta: {
                title: '明细账',
                roles: ['382020']
            }
        }, {
            path: 'coabalance',
            component: () =>
                import ('@/views/accbook/balance'),
            name: 'coabalance',
            meta: {
                title: '科目余额表',
                roles: ['382030']
            }
        }, {
            path: 'manyaccount',
            component: () =>
                import ('@/views/accbook/manyaccount'),
            name: 'manyaccount',
            meta: {
                title: '多栏账',
                roles: ['382040']
            }
        }, {
            path: 'numbertotalaccount',
            component: () =>
                import ('@/views/accbook/numbertotalaccount'),
            name: 'numbertotalaccount',
            meta: {
                title: '数量总账',
                roles: ['382050']
            }
        }, {
            path: 'numberdetailaccount',
            component: () =>
                import ('@/views/accbook/numberdetailaccount'),
            name: 'numberdetailaccount',
            meta: {
                title: '数量明细账',
                roles: ['382060']
            }
        }, {
            path: 'checkbalance',
            component: () =>
                import ('@/views/accbook/checkbalance'),
            name: 'checkbalance',
            meta: {
                title: '项目余额表',
                roles: ['382070']
            }
        }, {
            path: 'checkdetail',
            component: () =>
                import ('@/views/accbook/checkdetail'),
            name: 'checkdetail',
            meta: {
                title: '项目明细表',
                roles: ['382080']
            }
        }]
    }, {
        path: '/report',
        component: Layout,
        redirect: '/report/debt',
        name: 'report',
        meta: {
            roles: ['383010', '383020'],
            title: '报表',
            icon: 'report'
        },
        children: [{
            path: 'debt',
            component: () =>
                import ('@/views/report/debt'),
            name: 'debt',
            meta: {
                roles: ['383010'],
                title: '资产负债表'
            }
        }, {
            path: 'profit',
            component: () =>
                import ('@/views/report/profit'),
            name: 'profit',
            meta: {
                roles: ['383020'],
                title: '利润表'
            }
        }]
    }, {
        path: 'closePeriod',
        component: () =>
            import ('@/views/voucher/closePeriod'),
        name: 'closePeriod',
        meta: {
            title: '结账',
            roles: ['3840']
        }
    }]
}
export default accountRouter;