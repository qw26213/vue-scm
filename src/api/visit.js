import request from '@/utils/request'

export function getVisitData(data) {
    return request({
        url: '/drp/crm/visit/getResPageData',
        method: 'post',
        data
    })
}

export function getCrmFileInfo(data) {
    return request({
        url: '/drp/crm/crmFileInfo/getResPageCOSData',
        method: 'post',
        data
    })
}

export function deleteFileById(data) {
    return request({
        url: '/drp/crm/crmFileInfo/deleteFileById',
        method: 'post',
        data
    })
}

export function deleteFileByIds(data) {
    return request({
        url: '/drp/crm/crmFileInfo/deleteFileByIds',
        method: 'post',
        data
    })
}