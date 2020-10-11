import request from '@/utils/request'

export function getGoodsData(data) {
    return request({
        url: '/drp/mm/goods/getAll',
        method: 'post',
        data
    })
}

export function getGood(data) {
    return request({
        url: '/drp/mm/goods/getById',
        method: 'post',
        data
    })
}

export function saveGood(data) {
    return request({
        url: '/drp/mm/goods/save',
        method: 'post',
        data
    })
}

export function delGoodsById(data) {
    return request({
        url: '/drp/mm/goods/deleteById',
        method: 'post',
        data
    })
}

export function getGoodsDetailData(data) {
    return request({
        url: '/drp/mm/goodsDetail/getByHeaderId',
        method: 'post',
        data
    })
}

export function delGoodsDetailById(data) {
    return request({
        url: '/drp/mm/goodsDetail/delByHeaderId',
        method: 'post',
        data
    })
}

export function getGoodDetail(data) {
    return request({
        url: '/drp/mm/goodsDetail/getById',
        method: 'post',
        data
    })
}

export function delGoodDetail(data) {
    return request({
        url: '/drp/mm/goodsDetail/deleteById',
        method: 'post',
        data
    })
}

export function saveGoodDetail(data) {
    return request({
        url: '/drp/mm/goodsDetail/save',
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

export function delOrder(data) {
    return request({
        url: '/drp/mm/salesOrder/deleteByHeaderId',
        method: 'post',
        data
    })
}

export function getOrderInfo(data) {
    return request({
        url: '/drp/mm/salesOrder/getByHeaderId',
        method: 'post',
        data
    })
}

export function auditOrder(data) {
    return request({
        url: '/drp/mm/salesOrder/auditByHeaderId',
        method: 'post',
        data
    })
}

export function buildOutboundOrderByHeaderId(data) {
    return request({
        url: '/drp/mm/salesOrder/buildOutboundOrderByHeaderId',
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