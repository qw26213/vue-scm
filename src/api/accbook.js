import request from '@/utils/request'

export function getTotalAccount(data) {
  return request({
    url: '/drp/accbook/ledger/datatables',
    method: 'post',
    data
  })
}

export function getData2(data) {
  return request({
    url: '/drp/accbook/ledger/datatables',
    method: 'post',
    data
  })
}

export function getData3(data) {
  return request({
    url: '/drp/accbook/ledger/datatables',
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
