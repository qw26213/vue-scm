import request from '@/utils/request'

//-------------------------------------销售单----------------------------------------

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

export function auditSales(id, date) {
    return request({
        url: '/drp/so/sales/auditByHeaderId',
        method: 'post',
        data: { id: id, billDate: date }
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

//-------------------------------------销售订单----------------------------------------

export function getSalesOrder(data) {
    return request({
        url: '/drp/so/salesOrder/getResPageData',
        method: 'post',
        data
    })
}

export function getSalesOrderById(id) {
    return request({
        url: '/drp/so/salesOrder/getByHeaderId',
        method: 'post',
        data: { id: id }
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

export function auditSalesOrder(id, date) {
    return request({
        url: '/drp/so/salesOrder/auditByHeaderId',
        method: 'post',
        data: { id: id, billDate: date }
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

//-------------------------------------销售退货----------------------------------------

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

export function auditSalesReturned(id) {
    return request({
        url: '/drp/so/salesReturned/auditByHeaderId',
        method: 'post',
        data: { id: id }
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

//-------------------------------------销售配送----------------------------------------

export function getDelivery(data) {
    return request({
        url: '/drp/so/delivery/getResPageData',
        method: 'post',
        data
    })
}

export function getDeliveryById(id, date) {
    return request({
        url: '/drp/so/delivery/getByHeaderId',
        method: 'post',
        data: { id: id, billDate: date }
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

export function auditDelivery(id, date) {
    return request({
        url: '/drp/so/delivery/auditByHeaderId',
        method: 'post',
        data: { id: id, billDate: date }
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


//-------------------------------------销售发票----------------------------------------

export function getInvoice(data) {
    return request({
        url: '/drp/so/invoice/getResPageData',
        method: 'post',
        data
    })
}

export function getInvoiceById(id) {
    return request({
        url: '/drp/so/invoice/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function saveInvoice(data) {
    return request({
        url: '/drp/so/invoice/save',
        method: 'post',
        data
    })
}

export function delInvoice(id) {
    return request({
        url: '/drp/so/invoice/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditInvoice(id, date) {
    return request({
        url: '/drp/so/invoice/auditByHeaderId',
        method: 'post',
        data: { id: id, billDate: date }
    })
}

export function buildInvoice(data) {
    return request({
        url: '/drp/so/invoice/buildOutboundOrderByHeaderId',
        method: 'post',
        data
    })
}

export function buildInvoiceVoucherByHeaderId(data) {
    return request({
        url: '/drp/so/invoice/buildVoucherByHeaderId',
        method: 'post',
        data: data
    })
}
