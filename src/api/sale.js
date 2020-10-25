import request from '@/utils/request'

// -------------------------------------销售单----------------------------------------

export function getSales(data) {
  return request({
    url: '/drp/so/sales/getResPageData',
    method: 'post',
    data
  })
}

export function getSalesById(id, date) {
  return request({
    url: '/drp/so/sales/getByHeaderId',
    method: 'post',
    data: { id: id, billDate: date }
  })
}

export function saveSales(data) {
  return request({
    url: '/drp/so/sales/save',
    method: 'post',
    data
  })
}

export function delSales(id, date) {
  return request({
    url: '/drp/so/sales/deleteByHeaderId',
    method: 'post',
    data: { id: id, billDate: date }
  })
}

export function auditSales(data) {
  return request({
    url: '/drp/so/sales/auditByHeaderId',
    method: 'post',
    data
  })
}

export function buildSales(data) {
  return request({
    url: '/drp/so/sales/buildOutboundOrderByHeaderId',
    method: 'post',
    data
  })
}

export function buildSaleVoucherByHeaderId(data) {
  return request({
    url: '/drp/so/sales/buildVoucherByHeaderId',
    method: 'post',
    data: data
  })
}

export function printByHeaderId(url, id, invoiceDate) {
  return request({
    url: '/drp' + url + '/printByHeaderId',
    method: 'post',
    data: { id, invoiceDate }
  })
}

// -------------------------------------销售订单----------------------------------------

export function getSalesOrder(data) {
  return request({
    url: '/drp/so/salesOrder/getResPageData',
    method: 'post',
    data
  })
}

export function getSalesOrderById(data) {
  return request({
    url: '/drp/so/salesOrder/getByHeaderId',
    method: 'post',
    data
  })
}

export function saveSalesOrder(data) {
  return request({
    url: '/drp/so/salesOrder/save',
    method: 'post',
    data
  })
}

export function delSalesOrder(id) {
  return request({
    url: '/drp/so/salesOrder/deleteByHeaderId',
    method: 'post',
    data: { id: id }
  })
}

export function auditSalesOrder(data) {
  return request({
    url: '/drp/so/salesOrder/auditByHeaderId',
    method: 'post',
    data
  })
}

export function buildSalesOrder(data) {
  return request({
    url: '/drp/so/salesOrder/buildOutboundOrderByHeaderId',
    method: 'post',
    data
  })
}

export function buildSalesOrderVoucherByHeaderId(data) {
  return request({
    url: '/drp/so/salesOrder/buildVoucherByHeaderId',
    method: 'post',
    data: data
  })
}

// -------------------------------------销售退货----------------------------------------

export function getSalesReturned(data) {
  return request({
    url: '/drp/so/salesReturned/getResPageData',
    method: 'post',
    data
  })
}

export function getSalesReturnedById(id) {
  return request({
    url: '/drp/so/salesReturned/getByHeaderId',
    method: 'post',
    data: { id: id }
  })
}
export function getSalesReturnedBySalesHeaderId(id) {
  return request({
    url: '/drp/so/salesReturned/getBySalesHeaderId',
    method: 'post',
    data: { id: id }
  })
}

export function saveSalesReturned(data) {
  return request({
    url: '/drp/so/salesReturned/save',
    method: 'post',
    data
  })
}

export function delSalesReturned(id) {
  return request({
    url: '/drp/so/salesReturned/deleteByHeaderId',
    method: 'post',
    data: { id: id }
  })
}

export function auditSalesReturned(data) {
  return request({
    url: '/drp/so/salesReturned/auditByHeaderId',
    method: 'post',
    data
  })
}

export function buildSalesReturned(data) {
  return request({
    url: '/drp/so/salesReturned/buildOutboundOrderReturnedByHeaderId',
    method: 'post',
    data
  })
}

export function buildSaleReturnedVoucherByHeaderId(data) {
  return request({
    url: '/drp/so/salesReturned/buildVoucherByHeaderId',
    method: 'post',
    data: data
  })
}

export function buildInventoryByHeaderId(data) {
  return request({
    url: '/drp/so/salesReturned/buildInventoryByHeaderId',
    method: 'post',
    data: data
  })
}

// -------------------------------------销售配送----------------------------------------

export function getDelivery(data) {
  return request({
    url: '/drp/so/delivery/getResPageData',
    method: 'post',
    data
  })
}

export function getDeliveryById(id, billDate) {
  return request({
    url: '/drp/so/delivery/getByHeaderId',
    method: 'post',
    data: { id, billDate }
  })
}

export function saveDelivery(data) {
  return request({
    url: '/drp/so/delivery/save',
    method: 'post',
    data
  })
}

export function delDelivery(id, date) {
  return request({
    url: '/drp/so/delivery/deleteByHeaderId',
    method: 'post',
    data: { id: id, billDate: date }
  })
}

export function auditDelivery(data) {
  return request({
    url: '/drp/so/delivery/auditByHeaderId',
    method: 'post',
    data
  })
}

export function buildDelivery(data) {
  return request({
    url: '/drp/so/delivery/buildOutboundOrderByHeaderId',
    method: 'post',
    data
  })
}

export function buildDeliverVoucherByHeaderId(data) {
  return request({
    url: '/drp/so/delivery/buildVoucherByHeaderId',
    method: 'post',
    data: data
  })
}

// -------------------------------------销售发票----------------------------------------
export function getInvoice(data) {
  return request({
    url: '/drp/so/invoice/getResPageData',
    method: 'post',
    data
  })
}

export function getInvoiceById(id, invoiceDate) {
  return request({
    url: '/drp/so/invoice/getByHeaderId',
    method: 'post',
    data: { id, invoiceDate }
  })
}

export function saveInvoice(data) {
  return request({
    url: '/drp/so/invoice/save',
    method: 'post',
    data
  })
}

export function delInvoice(data) {
  return request({
    url: '/drp/so/invoice/deleteByHeaderId',
    method: 'post',
    data
  })
}

export function auditInvoice(data) {
  return request({
    url: '/drp/so/invoice/auditByHeaderId',
    method: 'post',
    data
  })
}

export function buildInvoice(data) {
  return request({
    url: '/drp/so/invoice/buildInvoiceByHeaderId',
    method: 'post',
    data
  })
}

export function buildSalesInvoice(data) {
  return request({
    url: '/drp/so/sales/buildInvoiceByHeaderId',
    method: 'post',
    data
  })
}

export function buildOrderInvoice(data) {
  return request({
    url: '/drp/so/salesOrder/buildInvoiceByHeaderId',
    method: 'post',
    data
  })
}

// -------------------------------------销售日结----------------------------------------
export function getEverydayTotal(data) {
  return request({
    url: '/drp/so/everydayTotal/getResPageData',
    method: 'post',
    data
  })
}

export function getEverydayTotalById(id) {
  return request({
    url: '/drp/so/everydayTotal/getById',
    method: 'post',
    data: { id: id }
  })
}

export function queryDataByStaffId(data) {
  return request({
    url: '/drp/so/everydayTotal/queryDataByStaffId',
    method: 'post',
    data
  })
}

export function saveEverydayTotal(data) {
  return request({
    url: '/drp/so/everydayTotal/save',
    method: 'post',
    data
  })
}

export function delEverydayTotal(id) {
  return request({
    url: '/drp/so/everydayTotal/deleteByHeaderId',
    method: 'post',
    data: { id }
  })
}

export function auditEverydayTotal(data) {
  return request({
    url: '/drp/so/everydayTotal/auditByHeaderId',
    method: 'post',
    data
  })
}

export function confirmEverydayTotal(data) {
  return request({
    url: '/drp/so/everydayTotal/confirmByHeaderId',
    method: 'post',
    data
  })
}

// -------------------------------------盘点单----------------------------------------
export function getInventory(data) {
  return request({
    url: '/drp/ic/inventory/getResPageData',
    method: 'post',
    data
  })
}

export function getInventoryById(id) {
  return request({
    url: '/drp/ic/inventory/getByHeaderId',
    method: 'post',
    data: { id }
  })
}

export function saveInventory(data) {
  return request({
    url: '/drp/ic/inventory/save',
    method: 'post',
    data
  })
}

export function delInventory(id) {
  return request({
    url: '/drp/ic/inventory/deleteByHeaderId',
    method: 'post',
    data: { id }
  })
}

export function buildInventoryVoucher(data) {
  return request({
    url: '/drp/ic/inventory/buildVoucherByHeaderId',
    method: 'post',
    data
  })
}

export function auditInventory(data) {
  return request({
    url: '/drp/ic/inventory/auditByHeaderId',
    method: 'post',
    data
  })
}

export function queryBookQtyList(data) {
  return request({
    url: '/drp/ic/inventory/queryBookQtyList',
    method: 'post',
    data
  })
}

// 查看审核意见
export function getAuditInfoByHeaderId(id) {
  return request({
    url: '/drp/log/auditInfo/getByHeaderId',
    method: 'post',
    data: { id }
  })
}

// 查看确认意见
export function getConfirmInfoByHeaderId(id) {
  return request({
    url: '/drp/log/confirmInfo/getByHeaderId',
    method: 'post',
    data: { id }
  })
}

// 销售订单查看配送单列表
export function getDeliveryBySalesHeaderId(data) {
  return request({
    url: '/drp/so/delivery/getBySalesHeaderId',
    method: 'post',
    data
  })
}

// 出库单查看配送单列表
export function getDeliveryByOutboundOrderHeaderId(data) {
  return request({
    url: '/drp/so/delivery/getByOutboundOrderHeaderId',
    method: 'post',
    data
  })
}

// 销售订单查看出库单
export function getOutboundOrderBySalesHeaderId(data) {
  return request({
    url: '/drp/ic/outboundOrder/getBySalesHeaderId',
    method: 'post',
    data
  })
}
