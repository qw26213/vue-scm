import Layout from '@/layout';
const priceRouter = {
        path: '/price',
        component: Layout,
        redirect: '/price/group',
        name: 'price',
        meta: {
            roles: ['3010', '3020'],
            title: '价格',
            icon: 'price'
        },
        children: [{
            path: 'index',
            component: () => import('@/views/price/index'),
            name: 'priceIndex',
            meta: {
                roles: ['3020'],
                title: '价格设定'
            }
        }, {
            path: 'group',
            component: () => import('@/views/price/group'),
            name: 'priceGroup',
            meta: {
                roles: ['3010'],
                title: '价格组'
            }
        }]
    }
export default priceRouter;