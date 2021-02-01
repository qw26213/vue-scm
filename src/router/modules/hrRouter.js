import Layout from '@/layout';
const hrRouter = {
    path: '/hr',
    component: Layout,
    redirect: '/hr/group',
    name: 'hr',
    meta: {
        roles: ['4210', '4220'],
        title: '薪酬',
        icon: 'people'
    },
    children: [{
        path: 'employee',
        component: () => import('@/views/hr/employee'),
        name: 'employee',
        meta: {
            roles: ['4210'],
            title: '人员管理'
        }
    }, {
        path: 'salary',
        component: () => import('@/views/hr/salary'),
        name: 'salary',
        meta: {
            roles: ['4220'],
            title: '薪酬管理'
        }
    }, {
        path: 'salarydetail',
        component: () => import('@/views/hr/salarydetail'),
        name: 'salarydetail',
        hidden: true,
        meta: {
            roles: ['4220'],
            title: '薪酬明细'
        }
    }]
}
export default hrRouter;