import Layout from '@/layout'
const hrRouter = {
    path: '/visit',
    component: Layout,
    redirect: '/visit/data',
    name: 'visit',
    meta: {
        roles: ['3410', '3420'],
        title: '拜访',
        icon:'visitor'
    },
    children: [{
        path: 'data',
        component: () => import('@/views/visit/data'),
        name: 'visitData',
        meta: {
            roles: ['3410'],
            title: '业务员行程'
        }
    }, {
        path: 'photo',
        component: () => import('@/views/visit/photo'),
        name: 'visitPhoto',
        meta: {
            roles: ['3420'],
            title: '业务图片查询'
        }
    }]
}

export default hrRouter
