import request from '@/utils/request'

export function getTotalAccount(data) {
  return request({
    url: '/drp/accbook/ledger/datatables',
    method: 'post',
    data
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
  var temp = document.createElement('form')
  temp.action = exportUrl
  temp.method = 'POST'
  temp.style.display = 'none'
  for (var x in data) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = data[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

export function getProjbalance(data) {
  return request({
    url: '/drp/accbook/projbalance/datatables',
    method: 'post',
    data
  })
}

export function printProjbalance(data) {
  return request({
    url: '/drp/accbook/printProjbalance',
    method: 'post',
    data
  })
}

export function exportProjbalance(data) {
  var exportUrl = '/drp/accbook/exportProjbalance'
  var temp = document.createElement('form')
  temp.action = exportUrl
  temp.method = 'POST'
  temp.style.display = 'none'
  for (var x in data) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = data[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

export function getDetail(data) {
  return request({
    url: '/drp/accbook/subsidiary/datatables',
    method: 'post',
    data
  })
}

export function printSubsidiary(data) {
  return request({
    url: '/drp/accbook/printSubsidiary',
    method: 'post',
    data
  })
}

export function exportSubsidiary(data) {
  var exportUrl = '/drp/accbook/exportSubsidiary'
  var temp = document.createElement('form')
  temp.action = exportUrl
  temp.method = 'POST'
  temp.style.display = 'none'
  for (var x in data) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = data[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
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

export function printBalance(data) {
  return request({
    url: '/drp/accbook/printbalance',
    method: 'post',
    data
  })
}

export function exportBalance(data) {
  var exportUrl = '/drp/accbook/exportbalance'
  var temp = document.createElement('form')
  temp.action = exportUrl
  temp.method = 'POST'
  temp.style.display = 'none'
  for (var x in data) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = data[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

export function getMultisubsidiary(data) {
  return request({
    url: '/drp/accbook/multisubsidiary/datatables',
    method: 'post',
    data
  })
}

export function printMultisubsidiary(data) {
  return request({
    url: '/drp/accbook/printMultisubsidiary',
    method: 'post',
    data
  })
}

export function exportMultisubsidiary(data) {
  var exportUrl = '/drp/accbook/exportMultisubsidiary'
  var temp = document.createElement('form')
  temp.action = exportUrl
  temp.method = 'POST'
  temp.style.display = 'none'
  for (var x in data) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = data[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

export function getSubsidiarynum(data) {
  return request({
    url: '/drp/accbook/subsidiaryQty/datatables',
    method: 'post',
    data
  })
}

export function printSubsidiaryNum(data) {
  return request({
    url: '/drp/accbook/printSubsidiaryQty',
    method: 'post',
    data
  })
}

export function exportSubsidiaryNum(data) {
  var exportUrl = '/drp/accbook/exportSubsidiaryQty'
  var temp = document.createElement('form')
  temp.action = exportUrl
  temp.method = 'POST'
  temp.style.display = 'none'
  for (var x in data) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = data[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

export function getLedgernum(data) {
  return request({
    url: '/drp/accbook/ledgernum/datatables',
    method: 'post',
    data
  })
}

export function printLedgernum(data) {
  return request({
    url: '/drp/accbook/printLedgernum',
    method: 'post',
    data
  })
}

export function exportLedgernum(data) {
  var exportUrl = '/drp/accbook/exportLedgernum'
  var temp = document.createElement('form')
  temp.action = exportUrl
  temp.method = 'POST'
  temp.style.display = 'none'
  for (var x in data) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = data[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

export function getProjsubsidiary(data) {
  return request({
    url: '/drp/accbook/projsubsidiary/datatables',
    method: 'post',
    data
  })
}

export function printProjsubsidiary(data) {
  return request({
    url: '/drp/accbook/printProjsubsidiary',
    method: 'post',
    data
  })
}

export function exportProjsubsidiary(data) {
  var exportUrl = '/drp/accbook/exportProjsubsidiary'
  var temp = document.createElement('form')
  temp.action = exportUrl
  temp.method = 'POST'
  temp.style.display = 'none'
  for (var x in data) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = data[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
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
