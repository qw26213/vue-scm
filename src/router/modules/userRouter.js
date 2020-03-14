import Layout from '@/layout'
const userRouter = {
    path: '/user',
    component: Layout,
    redirect: '/user/info',
    meta: {
        title: '账户信息',
        icon: 'change'
    },
    hidden: true,
    children: [{
        path: 'info',
        component: () => import('@/views/home/user'),
        name: 'userInfo',
        meta: { title: '账户信息' }
    }]
}
export default userRouter