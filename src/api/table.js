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

export function getAggregate() {
  return request({
    url: '/drp/rpt/sales/getAggregate',
    method: 'post'
  })
}

// -----------------销售统计--------------------

export function getSalesQueryConfList() {
  return request({
    url: '/drp/rpt/sales/getQueryConfList',
    method: 'post'
  })
}

export function saveSalesQueryConf(data) {
  return request({
    url: '/drp/rpt/sales/saveQueryConf',
    method: 'post',
    data
  })
}

export function delSalesTemplate(id) {
  return request({
    url: '/drp/rpt/sales/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getSalesTable(data) {
    return request({
        url: '/drp/rpt/sales/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportSalesBook(data) {
  var exportUrl = '/drp/rpt/sales/exportFromLine8';
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

export function printSalesBook(data) {
  return request({
    url: '/drp/rpt/sales/printFromLine8',
    method: 'post',
    data
  })
}

// -----------------销售退货统计--------------------

export function getSalesReturnedQueryConfList() {
  return request({
    url: '/drp/rpt/salesReturned/getQueryConfList',
    method: 'post'
  })
}

export function saveSalesReturnedQueryConf(data) {
  return request({
    url: '/drp/rpt/salesReturned/saveQueryConf',
    method: 'post',
    data
  })
}

export function delSalesReturnedTemplate(id) {
  return request({
    url: '/drp/rpt/salesReturned/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getSalesReturnedTable(data) {
    return request({
        url: '/drp/rpt/salesReturned/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportSalesReturnedBook(data) {
  var exportUrl = '/drp/rpt/salesReturned/exportFromLine8';
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

export function printSalesReturnedBook(data) {
  return request({
    url: '/drp/rpt/salesReturned/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------采购统计----------------

export function getPurchaseQueryConfList() {
  return request({
    url: '/drp/rpt/purchase/getQueryConfList',
    method: 'post'
  })
}

export function savePurchaseQueryConf(data) {
  return request({
    url: '/drp/rpt/purchase/saveQueryConf',
    method: 'post',
    data
  })
}

export function delPurchaseTemplate(id) {
  return request({
    url: '/drp/rpt/purchase/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getPurchaseTable(data) {
    return request({
        url: '/drp/rpt/purchase/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportPurchaseBook(data) {
  var exportUrl = '/drp/rpt/purchase/exportFromLine8';
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

export function printPurchaseBook(data) {
  return request({
    url: '/drp/rpt/purchase/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------采购退货统计----------------

export function getPurchaseReturnedQueryConfList() {
  return request({
    url: '/drp/rpt/purchaseReturned/getQueryConfList',
    method: 'post'
  })
}

export function savePurchaseReturnedQueryConf(data) {
  return request({
    url: '/drp/rpt/purchaseReturned/saveQueryConf',
    method: 'post',
    data
  })
}

export function delPurchaseReturnedTemplate(id) {
  return request({
    url: '/drp/rpt/purchaseReturned/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getPurchaseReturnedTable(data) {
    return request({
        url: '/drp/rpt/purchaseReturned/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportPurchaseReturnedBook(data) {
  var exportUrl = '/drp/rpt/purchaseReturned/exportFromLine8';
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

export function printPurchaseReturnedBook(data) {
  return request({
    url: '/drp/rpt/purchaseReturned/printFromLine8',
    method: 'post',
    data
  })
}

