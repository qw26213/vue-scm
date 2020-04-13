import Layout from '@/layout';
const priceRouter = {
        path: '/price',
        component: Layout,
        redirect: '/price/group',
        name: 'price',
        meta: {
            title: '价格',
            icon: 'price'
        },
        children: [{
            path: 'index',
            component: () => import('@/views/price/index'),
            name: 'priceIndex',
            meta: {
                title: '价格设定'
            }
        }, {
            path: 'group',
            component: () => import('@/views/price/group'),
            name: 'priceGroup',
            meta: {
                title: '价格组'
            }
        }]
    }
export default priceRouter;