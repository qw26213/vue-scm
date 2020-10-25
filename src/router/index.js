import Vue from 'vue'
import VueRouter from 'vue-router'

if (process.env.NODE_ENV === 'development') {
    Vue.use(VueRouter)
}
import Layout from '@/layout'
import saleRouter from './modules/saleRouter'
import purchaseRouter from './modules/purchaseRouter'
import rpRouter from './modules/rpRouter'
import presaleRouter from './modules/presaleRouter'
import storeRouter from './modules/storeRouter'
import priceRouter from './modules/priceRouter'
import setRouter from './modules/setRouter'
import accountRouter from './modules/accountRouter'
import tableRouter from './modules/tableRouter'
import hrRouter from './modules/hrRouter'
import visitRouter from './modules/visitRouter'
import maintainRouter from './modules/maintainRouter'
import initRouter from './modules/initRouter'
import mallRouter from './modules/mallRouter'

export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
    }]
}, {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    children: [{
        path: '/login',
        component: () => import('@/views/login/login'),
        hidden: true
    }, {
        path: '/forgetPsd',
        component: () => import('@/views/login/forgetPsd'),
        hidden: true
    }, {
        path: '/forgetCode',
        component: () => import('@/views/login/forgetCode'),
        hidden: true
    }, {
        path: '/register',
        component: () => import('@/views/login/register'),
        hidden: true
    }]
}, {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
}, {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'home',
        meta: { title: '主页', icon: 'home', affix: true }
    }, {
        path: '/accountinfo',
        component: () => import('@/views/home/account'),
        name: 'accountInfo',
        hidden: true,
        meta: { title: '账户信息' }
    }, {
        path: '/help',
        component: () => import('@/views/home/help'),
        name: 'usingHelp',
        hidden: true,
        meta: { title: '帮助' }
    }]
}]

export const asyncRoutes = [
    purchaseRouter,
    saleRouter,
    rpRouter,
    presaleRouter,
    storeRouter,
    priceRouter,
    visitRouter,
    accountRouter,
    tableRouter,
    hrRouter,
    setRouter,
    initRouter,
    maintainRouter,
    mallRouter,
    {
        path: '*',
        edirect: '/404',
        hidden: true
    }
]

const createRouter = () => new VueRouter({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router