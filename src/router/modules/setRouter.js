import Layout from '@/layout';
import setView from '@/layout/set'
const setRouter = {
    path: '/set',
    component: Layout,
    redirect: '/set/index',
    name: 'set',
    meta: {
        title: '设置',
        icon: 'setting'
    },
    children: [{
        path: 'baseData',
        component: setView,
        name: 'baseData',
        meta: { title: '基础数据' },
        children: [{
            path: 'meas',
            component: () => import('@/views/set/meas'),
            name: 'baseMeas',
            meta: { title: '计量单位' }
        }, {
            path: 'bizType',
            component: () => import('@/views/set/bizType'),
            name: 'baseBizType',
            meta: { title: '业务类型' }
        }, {
            path: 'bizProc',
            component: () => import('@/views/set/bizProc'),
            name: 'baseBizProc',
            meta: { title: '业务流程' }
        }, {
            path: 'salesType',
            component: () => import('@/views/set/salesType'),
            name: 'baseSalesType',
            meta: { title: '销售类型' }
        }, {
            path: 'settleType',
            component: () => import('@/views/set/settleType'),
            name: 'baseSettleType',
            meta: { title: '结算方式' }
        }, {
            path: 'paymentType',
            component: () => import('@/views/set/paymentType'),
            name: 'basePaymentType',
            meta: { title: '付款方式' }
        }, ]
    }, {
        path: 'baseFile',
        component: setView,
        name: 'baseFile',
        meta: { title: '基础档案' },
        children: [{
            path: 'supplier',
            component: () => import('@/views/set/supplier'),
            name: 'baseSupplier',
            meta: { title: '供应商' }
        }, {
            path: 'channel',
            component: () => import('@/views/set/channelType'),
            name: 'baseChannel',
            meta: { title: '渠道类型' }
        }, {
            path: 'custType',
            component: () => import('@/views/set/custType'),
            name: 'baseCustType',
            meta: { title: '客户类型', }
        }, {
            path: 'cust',
            component: () => import('@/views/set/cust'),
            name: 'baseCust',
            meta: { title: '客户' }
        }, {
            path: 'warehouse',
            component: () => import('@/views/set/warehouse'),
            name: 'baseWarehouse',
            meta: { title: '仓库' }
        }, {
            path: 'truck',
            component: () => import('@/views/set/truck'),
            name: 'baseTruck',
            meta: { title: '车辆' }
        }, {
            path: 'invCatg',
            component: () => import('@/views/set/invCatg'),
            name: 'baseInvCatg',
            meta: { title: '商品分类' }
        }, {
            path: 'item',
            component: () => import('@/views/set/item'),
            name: 'baseItem',
            meta: { title: '商品' }
        }, {
            path: 'route',
            component: () => import('@/views/set/route'),
            name: 'baseRoute',
            meta: { title: '线路' }
        }, {
            path: 'brand',
            component: () => import('@/views/set/brand'),
            name: 'baseBrand',
            meta: { title: '品牌' }
        }, {
            path: 'dept',
            component: () => import('@/views/set/dept'),
            name: 'baseDept',
            meta: { title: '部门', }
        }, {
            path: 'staff',
            component: () => import('@/views/set/staff'),
            name: 'baseStaff',
            meta: { title: '员工', }
        }, {
            path: 'proj',
            component: () => import('@/views/set/proj'),
            name: 'baseProj',
            meta: { title: '项目' }
        }, {
            path: 'coaList',
            component: () => import('@/views/set/coaList'),
            name: 'coaList',
            meta: {
                title: '科目'
            }
        }, {
            path: 'invCurrency',
            component: () => import('@/views/set/currency'),
            name: 'baseInvCurrency',
            meta: { title: '币种' }
        }, {
            path: 'invCatogery',
            component: () => import('@/views/set/catogery'),
            name: 'baseInvCatogery',
            meta: { title: '凭证字' }
        }, {
            path: 'invTempletType',
            component: () => import('@/views/set/templetType'),
            name: 'baseInvTempletType',
            meta: { title: '凭证模板类型' }
        }, {
            path: 'voucherModal',
            component: () => import('@/views/set/voucherModal'),
            name: 'voucherModal',
            meta: { title: '凭证模板' }
        }]
    }, {
        path: 'user',
        component: setView,
        name: 'user',
        meta: { title: '用户权限' },
        children: [{
            path: 'userList',
            component: () => import('@/views/set/user/list'),
            name: 'userList',
            meta: { title: '用户' }
        }, {
            path: 'userGroup',
            component: () => import('@/views/set/user/group'),
            name: 'userGroup',
            meta: { title: '用户组' }
        }, {
            path: 'userFunc',
            component: () => import('@/views/set/user/func'),
            name: 'userFunc',
            meta: { title: '功能权限' }
        }, {
            path: 'dataRole',
            component: () => import('@/views/set/user/data'),
            name: 'dataRole',
            meta: { title: '数据权限' }
        }]
    }, {
        path: 'baseElse',
        component: setView,
        name: 'baseElse',
        meta: { title: '其他' },
        children: [{
            path: 'feeType',
            component: () => import('@/views/set/else/feeType'),
            name: 'feeType',
            meta: { title: '计价方式' }
        }, {
            path: 'payType',
            component: () => import('@/views/set/else/payType'),
            name: 'payType',
            meta: { title: '收付类型' }
        }, {
            path: 'coaType',
            component: () => import('@/views/set/else/coaType'),
            name: 'coaType',
            meta: { title: '科目分类' }
        }]
    }, {
        path: 'balance',
        component: () => import('@/views/set/else/balance'),
        name: 'balanceset',
        meta: {
            title: '期初余额'
        }
    }]
}

export default setRouter;