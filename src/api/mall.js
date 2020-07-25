import request from '@/utils/request'

export function getGoodsData(data) {
    return request({
        url: '/drp/mm/goods/getAll',
        method: 'post',
        data
    })
}

export function getOrderData(data) {
    return request({
        url: '/drp/mm/salesOrder/getResPageData',
        method: 'post',
        data
    })
}

export function getCustomerData(data) {
    return request({
        url: '/drp/mm/customer/getAll',
        method: 'post',
        data
    })
}

export function getCustomerById(data) {
    return request({
        url: '/drp/mm/customer/getById',
        method: 'post',
        data
    })
}

export function getEnterpriseInfo() {
    return request({
        url: '/drp/mm/enterpriseInfo/getAll',
        method: 'post'
    })
}

export function updateEnterpriseInfo(data) {
    return request({
        url: '/drp/mm/enterpriseInfo/save',
        method: 'post',
        data
    })
}

export function getTabs() {
    return request({
        url: '/drp/mm/tabs/getAll',
        method: 'post'
    })
}

export function delTabById(data) {
    return request({
        url: '/drp/mm/tabs/deleteById',
        method: 'post',
        data
    })
}

export function addTab(data) {
    return request({
        url: '/drp/mm/tabs/save',
        method: 'post',
        data
    })
}

