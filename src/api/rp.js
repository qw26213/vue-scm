import request from '@/utils/request'

export function getReceiptPayment(data) {
  return request({
    url: '/drp/rp/receiptPayment/getResPageData',
    method: 'post',
    data
  })
}

export function delReceiptPayment(id) {
  return request({
    url: '/drp/rp/receiptPayment/deleteByHeaderId',
    method: 'post',
    data: { id }
  })
}

export function getByHeaderId(id) {
  return request({
    url: '/drp/rp/receiptPayment/getByHeaderId',
    method: 'post',
    data: { id }
  })
}

export function saveReceiptPayment(data) {
  return request({
    url: '/drp/rp/receiptPayment/save',
    method: 'post',
    data
  })
}

export function buildReceiptPayment(data) {
  return request({
    url: '/drp/rp/receiptPayment/buildVoucherByHeaderId',
    method: 'post',
    data
  })
}

export function auditReceiptPayment(data) {
  return request({
    url: '/drp/rp/receiptPayment/auditByHeaderId',
    method: 'post',
    data
  })
}

export function printByHeaderId(id) {
  return request({
    url: '/drp/rp/receiptPayment/printByHeaderId',
    method: 'post',
    data: { id }
  })
}

// 获取销售单据
export function getSalesListByCustId(data) {
  return request({
    url: '/drp/rp/receiptPayment/getSalesListByCustId',
    method: 'post',
    data
  })
}

// 获取采购单据
export function getPurchaseListBySupplierId(data) {
  return request({
    url: '/drp/rp/receiptPayment/getPurchaseListBySupplierId',
    method: 'post',
    data
  })
}
