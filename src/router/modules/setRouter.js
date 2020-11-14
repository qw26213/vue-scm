import Layout from '@/layout'
import setView from '@/layout/set'
const setRouter = {
    path: '/set',
    component: Layout,
    redirect: '/set/index',
    name: 'set',
    meta: {
        roles: ['6010', '6020', '6030'],
        title: '设置',
        icon: 'setting'
    },
    children: [{
        path: 'data',
        component: setView,
        name: 'baseData',
        meta: {
            roles: ['6010'],
            title: '基础数据'
        },
        children: [{
            path: 'meas',
            component: () => import ('@/views/set/data/meas'),
            name: 'baseMeas',
            meta: {
                roles: ['601018'],
                title: '计量单位'
            }
        }, {
            path: 'bizType',
            component: () => import ('@/views/set/data/bizType'),
            name: 'baseBizType',
            meta: {
                roles: ['601022'],
                title: '业务类型'
            }
        }, {
            path: 'bizProc',
            component: () => import ('@/views/set/data/bizProc'),
            name: 'baseBizProc',
            meta: {
                roles: ['601026'],
                title: '业务流程'
            }
        }, {
            path: 'salesType',
            component: () => import ('@/views/set/data/salesType'),
            name: 'baseSalesType',
            meta: {
                roles: ['601030'],
                title: '销售类型'
            }
        }, {
            path: 'settleType',
            component: () => import ('@/views/set/data/settleType'),
            name: 'baseSettleType',
            meta: {
                roles: ['601034'],
                title: '结算方式'
            }
        }, {
            path: 'referCoa',
            component: () => import ('@/views/set/data/referCoa'),
            name: 'baseReferCoa',
            meta: {
                roles: ['601036'],
                title: '科目对照'
            }
        }, {
            path: 'paymentType',
            component: () => import ('@/views/set/data/paymentType'),
            name: 'basePaymentType',
            meta: {
                roles: ['601038'],
                title: '付款方式'
            }
        }, {
            path: 'label',
            component: () => import ('@/views/set/data/label'),
            name: 'baseLabel',
            meta: {
                roles: ['601042'],
                title: '业务标签'
            }
        }]
    }, {
        path: 'file',
        component: setView,
        name: 'baseFile',
        meta: {
            roles: ['6020'],
            title: '基本档案'
        },
        children: [{
            path: 'supplier',
            component: () => import ('@/views/set/file/supplier'),
            name: 'baseSupplier',
            meta: {
                roles: ['602010'],
                title: '供应商'
            }
        }, {
            path: 'channel',
            component: () => import ('@/views/set/file/channelType'),
            name: 'baseChannel',
            meta: {
                roles: ['602014'],
                title: '渠道类型'
            }
        }, {
            path: 'custType',
            component: () => import ('@/views/set/file/custType'),
            name: 'baseCustType',
            meta: {
                roles: ['602022'],
                title: '客户类别',
            }
        }, {
            path: 'cust',
            component: () => import ('@/views/set/file/cust'),
            name: 'baseCust',
            meta: {
                roles: ['602026'],
                title: '客户'
            }
        }, {
            path: 'warehouse',
            component: () => import ('@/views/set/file/warehouse'),
            name: 'baseWarehouse',
            meta: {
                roles: ['602030'],
                title: '仓库'
            }
        }, {
            path: 'truck',
            component: () => import ('@/views/set/file/truck'),
            name: 'baseTruck',
            meta: {
                roles: ['602034'],
                title: '车辆'
            }
        }, {
            path: 'invCatg',
            component: () => import ('@/views/set/file/invCatg'),
            name: 'baseInvCatg',
            meta: {
                roles: ['602038'],
                title: '商品分类'
            }
        }, {
            path: 'item',
            component: () => import ('@/views/set/file/item'),
            name: 'baseItem',
            meta: {
                roles: ['602042'],
                title: '商品'
            }
        }, {
            path: 'route',
            component: () => import ('@/views/set/file/route'),
            name: 'baseRoute',
            meta: {
                roles: ['602046'],
                title: '线路'
            }
        }, {
            path: 'brand',
            component: () => import ('@/views/set/file/brand'),
            name: 'baseBrand',
            meta: {
                roles: ['602050'],
                title: '品牌'
            }
        }, {
            path: 'dept',
            component: () => import ('@/views/set/file/dept'),
            name: 'baseDept',
            meta: {
                roles: ['602058'],
                title: '部门',
            }
        }, {
            path: 'staff',
            component: () => import ('@/views/set/file/staff'),
            name: 'baseStaff',
            meta: {
                roles: ['602062'],
                title: '员工',
            }
        }, {
            path: 'proj',
            component: () => import ('@/views/set/file/proj'),
            name: 'baseProj',
            meta: {
                roles: ['602066'],
                title: '项目'
            }
        }, {
            path: 'coaList',
            component: () => import ('@/views/set/file/coaList'),
            name: 'coaList',
            meta: {
                roles: ['602078'],
                title: '科目'
            }
        }, {
            path: 'invCurrency',
            component: () => import ('@/views/set/file/currency'),
            name: 'baseCurrency',
            meta: {
                roles: ['602070'],
                title: '币种'
            }
        }, {
            path: 'catogery',
            component: () => import ('@/views/set/file/catogery'),
            name: 'baseCatogery',
            meta: {
                roles: ['602074'],
                title: '凭证字'
            }
        }, {
            path: 'templetType',
            component: () => import ('@/views/set/file/templetType'),
            name: 'templetType',
            meta: {
                roles: ['602082'],
                title: '凭证模板类型'
            }
        }, {
            path: 'voucherTemplet',
            component: () => import ('@/views/set/file/voucherTemplet'),
            name: 'voucherTemplet',
            meta: {
                roles: ['602084'],
                title: '凭证模板'
            }
        }]
    }, {
        path: 'user',
        component: setView,
        name: 'user',
        meta: {
            roles: ['6030'],
            title: '用户权限'
        },
        children: [{
            path: 'list',
            component: () => import ('@/views/set/user/list'),
            name: 'UserList',
            meta: {
                roles: ['603010'],
                title: '用户'
            }
        }, {
            path: 'role',
            component: () => import ('@/views/set/user/role'),
            name: 'UserRole',
            meta: {
                roles: ['603020'],
                title: '角色'
            }
        }, {
            path: 'funcs',
            component: () => import ('@/views/set/user/func'),
            name: 'UserFunc',
            meta: {
                roles: ['603030'],
                title: '功能'
            }
        }, {
            path: 'data',
            component: () => import ('@/views/set/user/data'),
            name: 'UserData',
            meta: {
                roles: ['603040'],
                title: '数据'
            }
        }]
    }]
}

export default setRouter;