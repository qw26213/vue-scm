import Vue from 'vue'
import VueRouter from 'vue-router'

if (process.env.NODE_ENV === 'development') {
    Vue.use(VueRouter)
}
import Layout from '@/layout'
import saleRouter from './modules/saleRouter'
import purchaseRouter from './modules/purchaseRouter'
import arapRouter from './modules/arapRouter'
import presaleRouter from './modules/presaleRouter'
import storeRouter from './modules/storeRouter'
import priceRouter from './modules/priceRouter'
import setRouter from './modules/setRouter'
import grossprofitRouter from './modules/grossprofitRouter'
import accountRouter from './modules/accountRouter'
import reportRouter from './modules/reportRouter'
import hrRouter from './modules/hrRouter'
import visitRouter from './modules/visitRouter'
import maintainRouter from './modules/maintainRouter'
import initRouter from './modules/initRouter'
import userRouter from './modules/userRouter'

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
    hidden: true
}, {
    path: '/forgetPsd',
    component: () => import('@/views/login/forgetPsd'),
    hidden: true
}, {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
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
    }]
}]

export const asyncRoutes = [
    purchaseRouter,
    saleRouter,
    arapRouter,
    presaleRouter,
    storeRouter,
    priceRouter,
    visitRouter,
    accountRouter,
    reportRouter,
    hrRouter,
    grossprofitRouter,
    setRouter,
    initRouter,
    maintainRouter,
    userRouter, 
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