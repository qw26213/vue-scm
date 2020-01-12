import request from '@/utils/request'

export function getTotalAccount(data) {
  return request({
    url: '/drp/accbook/ledger/datatables',
    method: 'post',
    data
  })
}

export function getProjbalance(data) {
  return request({
    url: '/drp/accbook/projbalance/datatables',
    method: 'post',
    data
  })
}

export function getDetail(data) {
  return request({
    url: '/drp/accbook/subsidiary/datatables',
    method: 'post',
    data
  })
}

export function getSubsidiary(data) {
  return request({
    url: '/drp/accbook/subsidiary/datatables',
    method: 'post',
    data
  })
}

export function getBalance(data) {
  return request({
    url: '/drp/accbook/balance/datatables',
    method: 'post',
    data
  })
}

export function getMultisubsidiary(data) {
  return request({
    url: '/drp/accbook/multisubsidiary/datatables',
    method: 'post',
    data
  })
}
export function getSubsidiarynum(data) {
  return request({
    url: '/drp/accbook/subsidiarynum/datatables',
    method: 'post',
    data
  })
}
export function getLedgernum(data) {
  return request({
    url: '/drp/accbook/ledgernum/datatables',
    method: 'post',
    data
  })
}

export function getProjsubsidiary(data) {
  return request({
    url: '/drp/accbook/projsubsidiary/datatables',
    method: 'post',
    data
  })
}

export function getVoucherTable(data) {
  return request({
    url: '/drp/accbook/voucher/datatables',
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

