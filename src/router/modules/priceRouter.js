import Layout from '@/layout';
const priceRouter = {
        path: '/price',
        component: Layout,
        redirect: '/price/group',
        name: 'price',
        meta: {
            title: '价格',
            icon: 'money'
        },
        children: [{
            path: 'priceGroup',
            component: () => import('@/views/price/group'),
            name: 'priceGroup',
            meta: {
                title: '价格组'
            }
        }, {
            path: 'priceIndex',
            component: () => import('@/views/price/index'),
            name: 'priceIndex',
            meta: {
                title: '价格设定'
            }
        }]
    }
export default priceRouter;