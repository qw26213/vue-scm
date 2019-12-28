import request from '@/utils/request'
var fromData = [function (obj) {let c = '';for (let i in obj) {c += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&'}return c}];
//-----进货单----
export function getPurchase(data) {
  return request({
    url: '/drp/po/purchase/getResPageData',
    method: 'post',
    data
  })
}

export function getPurchaseById(id) {
  return request({
    url: '/drp/po/purchase/getByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function savePurchase(data) {
  return request({
    url: '/drp/po/purchase/save',
    method: 'post',
    data
  })
}

export function delPurchase(id) {
  return request({
    url: '/drp/po/purchase/deleteByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function auditPurchase(id) {
  return request({
    url: '/drp/po/purchase/auditByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function buildPurchaseEntry(data) {
  return request({
    url: '/drp/po/purchase/buildWarehousingEntryByHeaderId',
    method: 'post',
    data:data
  })
}

export function buildVoucherByHeaderId(data) {
  return request({
    url: '/drp/po/purchase/buildVoucherByHeaderId',
    method: 'post',
    data:data
  })
}

//-----入库单----
export function getWarehousing(data) {
  return request({
    url: '/drp/ic/warehousingEntry/getResPageData',
    method: 'post',
    data
  })
}

export function getWarehousingById(id) {
  return request({
    url: '/drp/ic/warehousingEntry/getByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function saveWarehousing(data) {
  return request({
    url: '/drp/ic/warehousingEntry/save',
    method: 'post',
    data
  })
}

export function delWarehousing(id) {
  return request({
    url: '/drp/ic/warehousingEntry/deleteByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function auditWarehousing(id) {
  return request({
    url: '/drp/ic/warehousingEntry/auditByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function buildWarehousingEntry(data) {
  return request({
    url: '/drp/ic/warehousingEntry/buildWarehousingEntryByHeaderId',
    method: 'post',
    data
  })
}

//-----出库单----
export function getOutboundOrder(data) {
  return request({
    url: '/drp/ic/outboundOrder/getResPageData',
    method: 'post',
    data
  })
}

export function getOutboundOrderById(id) {
  return request({
    url: '/drp/ic/outboundOrder/getByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function saveOutboundOrder(data) {
  return request({
    url: '/drp/ic/outboundOrder/save',
    method: 'post',
    data
  })
}

export function delOutboundOrder(id) {
  return request({
    url: '/drp/ic/outboundOrder/deleteByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function auditOutboundOrder(id) {
  return request({
    url: '/drp/ic/outboundOrder/auditByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function buildOutboundOrder(data) {
  return request({
    url: '/drp/ic/outboundOrder/buildSalesByHeaderId',
    method: 'post',
    data
  })
}

//-----销售单----
export function getSales(data) {
  return request({
    url: '/drp/so/sales/getResPageData',
    method: 'post',
    data
  })
}

export function getSalesById(id) {
  return request({
    url: '/drp/so/sales/getByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function saveSales(data) {
  return request({
    url: '/drp/so/sales/save',
    method: 'post',
    data
  })
}

export function delSales(id) {
  return request({
    url: '/drp/so/sales/deleteByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function auditSales(id) {
  return request({
    url: '/drp/so/sales/auditByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function buildSales(data) {
  return request({
    url: '/drp/so/sales/buildOutboundOrderByHeaderId',
    method: 'post',
    data
  })
}

// 移库单
export function getMovement(data) {
  return request({
    url: '/drp/ic/movement/getResPageData',
    method: 'post',
    data
  })
}

export function getMovementById(id) {
  return request({
    url: '/drp/ic/movement/getByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function saveMovement(data) {
  return request({
    url: '/drp/ic/movement/save',
    method: 'post',
    data
  })
}

export function delMovement(id) {
  return request({
    url: '/drp/ic/movement/deleteByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function auditMovement(id) {
  return request({
    url: '/drp/ic/movement/auditByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function buildMovement(id) {
  return request({
    url: '/drp/ic/movement/buildPurchaseByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

//-----调拨单----
export function getAllocation(data) {
  return request({
    url: '/drp/ic/allocation/getResPageData',
    method: 'post',
    data
  })
}

export function getAllocationById(id) {
  return request({
    url: '/drp/ic/allocation/getByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function saveAllocation(data) {
  return request({
    url: '/drp/ic/allocation/save',
    method: 'post',
    data
  })
}

export function delAllocation(id) {
  return request({
    url: '/drp/ic/allocation/deleteByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function auditAllocation(id) {
  return request({
    url: '/drp/ic/allocation/auditByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function buildAllocation(id) {
  return request({
    url: '/drp/ic/allocation/buildPurchaseByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

//-----预收单----
export function getPresale(data) {
  return request({
    url: '/drp/ps/presale/getResPageData',
    method: 'post',
    data
  })
}

export function getPresaleById(id) {
  return request({
    url: '/drp/ps/presale/getByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function savePresale(data) {
  return request({
    url: '/drp/ps/presale/save',
    method: 'post',
    data
  })
}

export function delPresale(id) {
  return request({
    url: '/drp/ps/presale/deleteByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function auditPresale(id) {
  return request({
    url: '/drp/ps/presale/auditByHeaderId',
    method: 'post',
    data:{id:id}
  })
}

export function buildPresaleVoucher(data) {
  return request({
    url: '/drp/ps/presale/buildVoucherByHeaderId',
    method: 'post',
    data
  })
}

export function getItemPrice(data){
  return request({
    url:'/drp/bd/price/getPriceSVOByItemIdCustId',
    method: 'post',
    data
  })
}