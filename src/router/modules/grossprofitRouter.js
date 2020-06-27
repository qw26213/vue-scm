import Layout from '@/layout';
const grossprofitRouter = {
    path: '/grossprofit',
    component: Layout,
    redirect: '/grossprofit/group',
    name: 'grossprofit',
    meta: {
        roles: ['10'],
        title: '毛利',
        icon: 'obtain'
    },
    children: [{
        path: 'grossprofit1',
        component: () => import('@/views/grossprofit/grossprofit1'),
        name: 'grossprofit1',
        meta: {
            roles: ['10'],
            title: '今日毛利统计'
        }
    }, {
        path: 'grossprofit2',
        component: () => import('@/views/grossprofit/grossprofit2'),
        name: 'grossprofit2',
        meta: {
            roles: ['10'],
            title: '毛利综合统计'
        }
    }, {
        path: 'grossprofit3',
        component: () => import('@/views/grossprofit/grossprofit3'),
        name: 'grossprofit3',
        meta: {
            roles: ['10'],
            title: '周期辅助项统计'
        }
    }, {
        path: 'grossprofit4',
        component: () => import('@/views/grossprofit/grossprofit4'),
        name: 'grossprofit4',
        meta: {
            roles: ['10'],
            title: '辅助项二维统计'
        }
    }, {
        path: 'grossprofit5',
        component: () => import('@/views/grossprofit/grossprofit5'),
        name: 'grossprofit5',
        meta: {
            roles: ['10'],
            title: '品类分项统计'
        }
    }, {
        path: 'grossprofit6',
        component: () => import('@/views/grossprofit/grossprofit6'),
        name: 'grossprofit6',
        meta: {
            roles: ['10'],
            title: '多维度统计'
        }
    }]
}
export default grossprofitRouter;