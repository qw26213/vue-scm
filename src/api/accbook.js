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

export function printLedger(data) {
  return request({
    url: '/drp/accbook/printLedger',
    method: 'post',
    data
  })
}

export function exportLedger(data) {
  var exportUrl = '/drp/accbook/exportLedger'
  var temp = document.createElement("form");
  temp.action = exportUrl;
  temp.method = "POST";
  temp.style.display = 'none';
  for (var x in data) {
      var opt = document.createElement("textarea")
      opt.name = x
      opt.value = data[x]
      temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

export function printSubsidiaryNum(data) {
  return request({
    url: '/drp/accbook/printSubsidiaryNum',
    method: 'post',
    data
  })
}

export function exportSubsidiaryNum(data) {
  var exportUrl = '/drp/accbook/exportSubsidiaryNum'
  var temp = document.createElement("form")
  temp.action = exportUrl
  temp.method = "POST"
  temp.style.display = 'none'
  for (var x in data) {
      var opt = document.createElement("textarea")
      opt.name = x
      opt.value = data[x]
      temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}
