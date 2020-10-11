import request from '@/utils/request'

export function getCoas() {
  return request({
    url: '/drp/gl/coa/treeData',
    method: 'post'
  })
}

export function getAllUnion() {
  return request({
    url: '/drp/gl/summary/getAllUnion',
    method: 'post'
  })
}

export function getSummarys() {
  return request({
    url: '/drp/gl/summary/datatables',
    method: 'post'
  })
}

export function getAuxiliaryType() {
  return request({
    url: '/drp/gl/auxiliaryType/get',
    method: 'post'
  })
}

// 获取凭证模板类型
export function getTempletTypeList(data) {
  return request({
    url: '/drp/gl/templetType/list',
    method: 'post',
    data
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

export function synVoucherData(data) {
  return request({
    url: '/drp/gl/templet/synData',
    method: 'post',
    data
  })
}

export function delTempletHeader(id) {
  return request({
    url: '/drp/gl/templetHeader/deleteById',
    method: 'post',
    data: { id: id }
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

export function getMaxVoucherSeq(data) {
  return request({
    url: '/drp/gl/voucher/getMaxVoucherSeq',
    method: 'post',
    data
  })
}

export function getVoucher(data) {
  return request({
    url: '/drp/gl/voucher/datatables',
    method: 'post',
    data
  })
}

export function getVoucherById(data) {
  return request({
    url: '/drp/gl/voucher/getById',
    method: 'post',
    data
  })
}

export function printVoucherById(data) {
  return request({
    url: '/drp/gl/voucher/printById',
    method: 'post',
    data
  })
}
// 整理凭证号
export function trimJeSeqByMap(data) {
  return request({
    url: '/drp/gl/voucher/trimJeSeqByMap',
    method: 'post',
    data
  })
}

export function printList(data) {
  return request({
    url: '/drp/gl/voucher/printList',
    method: 'post',
    data
  })
}

export function getVoucherMaxDate(data) {
  return request({
    url: '/drp/gl/voucher/getVoucherMaxDate',
    method: 'post',
    data
  })
}

export function delVoucher(data) {
  return request({
    url: '/drp/gl/voucher/deleteById',
    method: 'post',
    data
  })
}

export function getVoucherAuditList(data) {
  return request({
    url: '/drp/gl/voucher/getVoucherAuditList',
    method: 'post',
    data
  })
}
export function unAudit(data) {
  return request({
    url: '/drp/gl/voucherAduit/unaudit',
    method: 'post',
    data
  })
}

export function voucherAduit(data) {
  return request({
    url: '/drp/gl/voucherAduit/save',
    method: 'post',
    data
  })
}

export function auditList(data) {
  return request({
    url: '/drp/gl/voucherAduit/list',
    method: 'post',
    data
  })
}

export function voucherSave(data, type) {
  return request({
    url: '/drp/gl/voucher/' + type,
    method: 'post',
    data
  })
}

export function getTempletById(id) {
  return request({
    url: '/drp/gl/templet/customGetTempletById',
    method: 'post',
    data: { id: id }
  })
}

export function addSummary(data) {
  return request({
    url: '/drp/gl/summary/save',
    method: 'post',
    data
  })
}

export function delSummary(id) {
  return request({
    url: '/drp/gl/summary/deleteById',
    method: 'post',
    data: { id: id }
  })
}

export function initSummaryTables(data) {
  return request({
    url: '/drp/gl/summary/datatables',
    method: 'post',
    data
  })
}

export function coaSave(data) {
  return request({
    url: '/drp/gl/coa/save',
    method: 'post',
    data
  })
}

export function templetSave(data) {
  return request({
    url: '/drp/gl/templet/save',
    method: 'post',
    data
  })
}

export function voucherModify(data) {
  return request({
    url: '/drp/gl/voucher/modify',
    method: 'post',
    data
  })
}

export function getCatogery() {
  return request({
    url: '/drp/gl/catogery/list',
    method: 'post'
  })
}

// -----------------------------------------------------------结账----------------------------

export function backPeriodClose(data) {
  return request({
    url: '/drp/gl/periodClose/backPeriodClose',
    method: 'post',
    data
  })
}

export function periodClose(data) {
  return request({
    url: '/drp/gl/periodClose/periodClose',
    method: 'post',
    data
  })
}

export function getPeriodState(str) {
  return request({
    url: '/drp/gl/periodClose/getPeriodState',
    method: 'post',
    data: {
      periodYear: str.split('-')[0],
      periodNum: str.split('-')[1],
      periodCode: str
    }
  })
}

export function getIdByPeriodJzCode(data) {
  return request({
    url: '/drp/gl/voucher/getIdByPeriodJzCode',
    method: 'post',
    data
  })
}

export function getJZVoucherByCode(code) {
  return request({
    url: '/drp/gl/templetHeader/getJZList',
    method: 'post',
    data: { code: code }
  })
}

export function getJzTempletById(data) {
  return request({
    url: '/drp/gl/templet/getDataById',
    method: 'post',
    data
  })
}

export function transLogList(data) {
  return request({
    url: '/drp/log/trans/transLogList',
    method: 'post',
    data
  })
}
