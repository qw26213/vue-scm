import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'
import saleRouter from './modules/saleRouter'
import purchaseRouter from './modules/purchaseRouter'
import arapRouter from './modules/arapRouter'
import presaleRouter from './modules/presaleRouter'
import storeRouter from './modules/storeRouter'
import priceRouter from './modules/priceRouter'
import setRouter from './modules/setRouter'

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
    saleRouter, 
    purchaseRouter, 
    arapRouter,
    presaleRouter,
    storeRouter, 
    priceRouter, 
    setRouter,
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
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