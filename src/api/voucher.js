import request from '@/utils/request'

export function getCoas() {
    return request({
        url: '/drp/gl/coa/treeData',
        method: 'post',
        data: { bookId: sessionStorage.bookId }
    })
}

export function getSummarys() {
    return request({
        url: '/drp/gl/summary/datatables',
        method: 'post',
        data: { bookId: sessionStorage.bookId }
    })
}

export function getAuxiliaryType(data) {
    return request({
        url: '/drp/gl/auxiliaryType/get',
        method: 'post',
        data: { bookId: sessionStorage.bookId }
    })
}
// 获取凭证模板
export function getTempletHeader(data) {
    return request({
        url: '/drp/gl/templetHeader/page',
        method: 'post',
        data
    })
}

export function getGlPeriodByCenterDate(data) {
    return request({
        url: '/drp/gl/period/getGlPeriodByCenterDate',
        method: 'post',
        data
    })
}

export function getGlPeriodByPeriodCode(data) {
    return request({
        url: '/drp/gl/period/getGlPeriodByPeriodCode',
        method: 'post',
        data
    })
}

export function getMaxVoucherSeq() {
    return request({
        url: '/drp/gl/voucher/getMaxVoucherSeq',
        method: 'post',
        data
    })
}