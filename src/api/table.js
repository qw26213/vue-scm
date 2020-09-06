import request from '@/utils/request'

export function getWarehousetable(data) {
    return request({
        url: '/drp/ic/onhandQty/queryBookQtyList',
        method: 'post',
        data
    })
}

export function getTrucktable(data) {
    return request({
        url: '/drp/ic/truckQty/queryBookQtyList',
        method: 'post',
        data
    })
}

export function getOutboundhousetable(data) {
    return request({
        url: '/drp/rpt/outbound/queryBookQtyList',
        method: 'post',
        data
    })
}

export function getWarehousingtable(data) {
    return request({
        url: '/drp/rpt/warehousingEntry/queryBookQtyList',
        method: 'post',
        data
    })
}

export function getAllocationtable(data) {
    return request({
        url: '/drp/rpt/allocation/queryBookQtyList',
        method: 'post',
        data
    })
}

export function getMovementtable(data) {
    return request({
        url: '/drp/rpt/movement/queryBookQtyList',
        method: 'post',
        data
    })
}

export function getSaletable(data) {
    return request({
        url: '/drp/rpt/sales/queryFromLine8',
        method: 'post',
        data
    })
}

export function getAggregate() {
  return request({
    url: '/drp/rpt/sales/getAggregate',
    method: 'post'
  })
}

export function getQueryConfList() {
  return request({
    url: '/drp/rpt/sales/getQueryConfList',
    method: 'post'
  })
}

export function saveQueryConf(data) {
  return request({
    url: '/drp/rpt/sales/saveQueryConf',
    method: 'post',
    data
  })
}

export function getQueryConf() {
  return request({
    url: '/drp/rpt/sales/getQueryConf',
    method: 'post'
  })
}

export function deleteTemplateById(id) {
  return request({
    url: '/drp/rpt/sales/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

