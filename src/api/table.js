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

export function getAggregate(type) {
  return request({
    url: '/drp/rpt/'+ type +'/getAggregate',
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

export function getDefaultSalesQueryConf() {
  return request({
    url: '/drp/rpt/sales/getDefaultQueryConf',
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

export function getDefaultSalesReturnedQueryConf() {
  return request({
    url: '/drp/rpt/salesReturned/getDefaultQueryConf',
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

export function getDefaultPurchaseQueryConf() {
  return request({
    url: '/drp/rpt/purchase/getDefaultQueryConf',
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
  var exportUrl = '/drp/rpt/purchase/exportFromLine8'
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

export function getDefaultPurchaseReturnedQueryConf() {
  return request({
    url: '/drp/rpt/purchaseReturned/getDefaultQueryConf',
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

// -------------------销售出库统计----------------

export function getOutboundOrderQueryConfList() {
  return request({
    url: '/drp/rpt/outboundOrder/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultOutboundOrderQueryConf() {
  return request({
    url: '/drp/rpt/outboundOrder/getDefaultQueryConf',
    method: 'post'
  })
}

export function saveOutboundOrderQueryConf(data) {
  return request({
    url: '/drp/rpt/outboundOrder/saveQueryConf',
    method: 'post',
    data
  })
}

export function delOutboundOrderTemplate(id) {
  return request({
    url: '/drp/rpt/outboundOrder/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getOutboundOrderTable(data) {
    return request({
        url: '/drp/rpt/outboundOrder/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportOutboundOrderBook(data) {
  var exportUrl = '/drp/rpt/outboundOrder/exportFromLine8';
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

export function printOutboundOrderBook(data) {
  return request({
    url: '/drp/rpt/outboundOrder/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------销售退库统计----------------

export function getOutboundOrderReturnedQueryConfList() {
  return request({
    url: '/drp/rpt/outboundOrderReturned/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultOutboundOrderReturnedQueryConf() {
  return request({
    url: '/drp/rpt/outboundOrderReturned/getDefaultQueryConf',
    method: 'post'
  })
}

export function saveOutboundOrderReturnedQueryConf(data) {
  return request({
    url: '/drp/rpt/outboundOrderReturned/saveQueryConf',
    method: 'post',
    data
  })
}

export function delOutboundOrderReturnedTemplate(id) {
  return request({
    url: '/drp/rpt/outboundOrderReturned/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getOutboundOrderReturnedTable(data) {
    return request({
        url: '/drp/rpt/outboundOrderReturned/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportOutboundOrderReturnedBook(data) {
  var exportUrl = '/drp/rpt/outboundOrderReturned/exportFromLine8';
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

export function printOutboundOrderReturnedBook(data) {
  return request({
    url: '/drp/rpt/outboundOrderReturned/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------入库统计----------------

export function getWarehousingEntryQueryConfList() {
  return request({
    url: '/drp/rpt/warehousingEntry/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultWarehousingEntryQueryConf() {
  return request({
    url: '/drp/rpt/warehousingEntry/getDefaultQueryConf',
    method: 'post'
  })
}

export function saveWarehousingEntryQueryConf(data) {
  return request({
    url: '/drp/rpt/warehousingEntry/saveQueryConf',
    method: 'post',
    data
  })
}

export function delWarehousingEntryTemplate(id) {
  return request({
    url: '/drp/rpt/warehousingEntry/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getWarehousingEntryTable(data) {
    return request({
        url: '/drp/rpt/warehousingEntry/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportWarehousingEntryBook(data) {
  var exportUrl = '/drp/rpt/warehousingEntry/exportFromLine8';
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

export function printWarehousingEntryBook(data) {
  return request({
    url: '/drp/rpt/warehousingEntry/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------退货出库统计----------------

export function getWarehousingEntryReturnedQueryConfList() {
  return request({
    url: '/drp/rpt/warehousingEntryReturned/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultWarehousingEntryReturnedQueryConf() {
  return request({
    url: '/drp/rpt/warehousingEntryReturned/getDefaultQueryConf',
    method: 'post'
  })
}

export function saveWarehousingEntryReturnedQueryConf(data) {
  return request({
    url: '/drp/rpt/warehousingEntryReturned/saveQueryConf',
    method: 'post',
    data
  })
}

export function delWarehousingEntryReturnedTemplate(id) {
  return request({
    url: '/drp/rpt/warehousingEntryReturned/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getWarehousingEntryReturnedTable(data) {
    return request({
        url: '/drp/rpt/warehousingEntryReturned/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportWarehousingEntryReturnedBook(data) {
  var exportUrl = '/drp/rpt/warehousingEntryReturned/exportFromLine8';
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

export function printWarehousingEntryReturnedBook(data) {
  return request({
    url: '/drp/rpt/warehousingEntryReturned/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------盘点----------------

export function getInventoryQueryConfList() {
  return request({
    url: '/drp/rpt/inventory/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultInventoryQueryConf() {
  return request({
    url: '/drp/rpt/inventory/getDefaultQueryConf',
    method: 'post'
  })
}

export function saveInventoryQueryConf(data) {
  return request({
    url: '/drp/rpt/inventory/saveQueryConf',
    method: 'post',
    data
  })
}

export function delInventoryTemplate(id) {
  return request({
    url: '/drp/rpt/inventory/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getInventoryTable(data) {
    return request({
        url: '/drp/rpt/inventory/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportInventoryBook(data) {
  var exportUrl = '/drp/rpt/inventory/exportFromLine8';
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

export function printInventoryBook(data) {
  return request({
    url: '/drp/rpt/inventory/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------调拨----------------

export function getAllocationQueryConfList() {
  return request({
    url: '/drp/rpt/allocation/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultAllocationQueryConf() {
  return request({
    url: '/drp/rpt/allocation/getDefaultQueryConf',
    method: 'post'
  })
}

export function saveAllocationQueryConf(data) {
  return request({
    url: '/drp/rpt/allocation/saveQueryConf',
    method: 'post',
    data
  })
}

export function delAllocationTemplate(id) {
  return request({
    url: '/drp/rpt/allocation/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getAllocationTable(data) {
    return request({
        url: '/drp/rpt/allocation/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportAllocationBook(data) {
  var exportUrl = '/drp/rpt/allocation/exportFromLine8';
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

export function printAllocationBook(data) {
  return request({
    url: '/drp/rpt/allocation/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------移库----------------

export function getMovementQueryConfList() {
  return request({
    url: '/drp/rpt/movement/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultMovementQueryConf() {
  return request({
    url: '/drp/rpt/movement/getDefaultQueryConf',
    method: 'post'
  })
}

export function saveMovementQueryConf(data) {
  return request({
    url: '/drp/rpt/movement/saveQueryConf',
    method: 'post',
    data
  })
}

export function delMovementTemplate(id) {
  return request({
    url: '/drp/rpt/movement/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getMovementTable(data) {
    return request({
        url: '/drp/rpt/movement/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportMovementBook(data) {
  var exportUrl = '/drp/rpt/movement/exportFromLine8';
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

export function printMovementBook(data) {
  return request({
    url: '/drp/rpt/movement/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------多维度毛利----------------

export function getGrossProfitQueryConfList() {
  return request({
    url: '/drp/rpt/grossProfit/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultGrossProfitQueryConf() {
  return request({
    url: '/drp/rpt/grossProfit/getDefaultQueryConf',
    method: 'post'
  })
}

export function saveGrossProfitQueryConf(data) {
  return request({
    url: '/drp/rpt/grossProfit/saveQueryConf',
    method: 'post',
    data
  })
}

export function delGrossProfitTemplate(id) {
  return request({
    url: '/drp/rpt/grossProfit/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getGrossProfitTable(data) {
    return request({
        url: '/drp/rpt/grossProfit/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportGrossProfitBook(data) {
  var exportUrl = '/drp/rpt/grossProfit/exportFromLine8';
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

export function printGrossProfitBook(data) {
  return request({
    url: '/drp/rpt/grossProfit/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------预收统计----------------

export function getPresaleQueryConfList() {
  return request({
    url: '/drp/rpt/presale/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultPresaleQueryConf() {
  return request({
    url: '/drp/rpt/presale/getDefaultQueryConf',
    method: 'post'
  })
}

export function savePresaleQueryConf(data) {
  return request({
    url: '/drp/rpt/presale/saveQueryConf',
    method: 'post',
    data
  })
}

export function delPresaleTemplate(id) {
  return request({
    url: '/drp/rpt/presale/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getPresaleTable(data) {
    return request({
        url: '/drp/rpt/presale/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportPresaleBook(data) {
  var exportUrl = '/drp/rpt/presale/exportFromLine8';
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

export function printPresaleBook(data) {
  return request({
    url: '/drp/rpt/presale/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------收款----------------

export function getReceiptQueryConfList() {
  return request({
    url: '/drp/rpt/receipt/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultReceiptQueryConf() {
  return request({
    url: '/drp/rpt/receipt/getDefaultQueryConf',
    method: 'post'
  })
}

export function saveReceiptQueryConf(data) {
  return request({
    url: '/drp/rpt/receipt/saveQueryConf',
    method: 'post',
    data
  })
}

export function delReceiptTemplate(id) {
  return request({
    url: '/drp/rpt/receipt/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getReceiptTable(data) {
    return request({
        url: '/drp/rpt/receipt/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportReceiptBook(data) {
  var exportUrl = '/drp/rpt/receipt/exportFromLine8';
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

export function printReceiptBook(data) {
  return request({
    url: '/drp/rpt/receipt/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------付款----------------

export function getPaymentQueryConfList() {
  return request({
    url: '/drp/rpt/payment/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultPaymentQueryConf() {
  return request({
    url: '/drp/rpt/payment/getDefaultQueryConf',
    method: 'post'
  })
}

export function savePaymentQueryConf(data) {
  return request({
    url: '/drp/rpt/payment/saveQueryConf',
    method: 'post',
    data
  })
}

export function delPaymentTemplate(id) {
  return request({
    url: '/drp/rpt/payment/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getPaymentTable(data) {
    return request({
        url: '/drp/rpt/payment/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportPaymentBook(data) {
  var exportUrl = '/drp/rpt/payment/exportFromLine8';
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

export function printPaymentBook(data) {
  return request({
    url: '/drp/rpt/payment/printFromLine8',
    method: 'post',
    data
  })
}

// -------------------拜访----------------

export function getVisitQueryConfList() {
  return request({
    url: '/drp/rpt/Visit/getQueryConfList',
    method: 'post'
  })
}

export function getDefaultVisitQueryConf() {
  return request({
    url: '/drp/rpt/Visit/getDefaultQueryConf',
    method: 'post'
  })
}

export function saveVisitQueryConf(data) {
  return request({
    url: '/drp/rpt/Visit/saveQueryConf',
    method: 'post',
    data
  })
}

export function delVisitTemplate(id) {
  return request({
    url: '/drp/rpt/Visit/deleteTemplateById',
    method: 'post',
    data: { id }
  })
}

export function getVisitTable(data) {
    return request({
        url: '/drp/rpt/Visit/queryFromLine8',
        method: 'post',
        data
    })
}

export function exportVisitBook(data) {
  var exportUrl = '/drp/rpt/Visit/exportFromLine8';
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

export function printVisitBook(data) {
  return request({
    url: '/drp/rpt/Visit/printFromLine8',
    method: 'post',
    data
  })
}
