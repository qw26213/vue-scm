import request from '@/utils/request'

//-----进货单----
export function getPurchase(data) {
    return request({
        url: '/drp/po/purchase/getResPageData',
        method: 'post',
        data
    })
}

export function getPurchaseById(id) {
    return request({
        url: '/drp/po/purchase/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function savePurchase(data) {
    return request({
        url: '/drp/po/purchase/save',
        method: 'post',
        data
    })
}

export function delPurchase(id) {
    return request({
        url: '/drp/po/purchase/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditPurchase(data) {
    return request({
        url: '/drp/po/purchase/auditByHeaderId',
        method: 'post',
        data
    })
}

export function buildPurchaseEntry(data) {
    return request({
        url: '/drp/po/purchase/buildWarehousingEntryByHeaderId',
        method: 'post',
        data: data
    })
}

export function buildVoucherByHeaderId(data) {
    return request({
        url: '/drp/po/purchase/buildVoucherByHeaderId',
        method: 'post',
        data: data
    })
}

// -----------采购退货----------

export function getPurchaseReturned(data) {
    return request({
        url: '/drp/po/purchaseReturned/getResPageData',
        method: 'post',
        data
    })
}

export function getPurchaseReturnedById(id) {
    return request({
        url: '/drp/po/purchaseReturned/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function savePurchaseReturned(data) {
    return request({
        url: '/drp/po/purchaseReturned/save',
        method: 'post',
        data
    })
}

export function delPurchaseReturned(id) {
    return request({
        url: '/drp/po/purchaseReturned/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditPurchaseReturned(data) {
    return request({
        url: '/drp/po/purchaseReturned/auditByHeaderId',
        method: 'post',
        data
    })
}

export function buildPurchaseReturnedEntry(data) {
    return request({
        url: '/drp/po/purchaseReturned/buildWarehousingEntryReturnedByHeaderId',
        method: 'post',
        data: data
    })
}

export function buildVoucherReturnedByHeaderId(data) {
    return request({
        url: '/drp/po/purchaseReturned/buildVoucherByHeaderId',
        method: 'post',
        data: data
    })
}

//-----------------------------入库单----------------------------

export function getWarehousing(data) {
    return request({
        url: '/drp/ic/warehousingEntry/getResPageData',
        method: 'post',
        data
    })
}

export function getWarehousingById(id) {
    return request({
        url: '/drp/ic/warehousingEntry/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function saveWarehousing(data) {
    return request({
        url: '/drp/ic/warehousingEntry/save',
        method: 'post',
        data
    })
}

export function delWarehousing(id) {
    return request({
        url: '/drp/ic/warehousingEntry/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditWarehousing(data) {
    return request({
        url: '/drp/ic/warehousingEntry/auditByHeaderId',
        method: 'post',
        data
    })
}

export function buildWarehousingEntry(data) {
    return request({
        url: '/drp/ic/warehousingEntry/buildPurchaseByHeaderId',
        method: 'post',
        data
    })
}

// ------------销售退货出库-------------

export function getWarehousingReturned(data) {
    return request({
        url: '/drp/ic/warehousingEntryReturned/getResPageData',
        method: 'post',
        data
    })
}

export function getWarehousingReturnedById(id) {
    return request({
        url: '/drp/ic/warehousingEntryReturned/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function saveWarehousingReturned(data) {
    return request({
        url: '/drp/ic/warehousingEntryReturned/save',
        method: 'post',
        data
    })
}

export function delWarehousingReturned(id) {
    return request({
        url: '/drp/ic/warehousingEntryReturned/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditWarehousingReturned(data) {
    return request({
        url: '/drp/ic/warehousingEntryReturned/auditByHeaderId',
        method: 'post',
        data
    })
}

export function buildWarehousingEntryReturned(data) {
    return request({
        url: '/drp/ic/warehousingEntryReturned/buildPurchaseReturnedByHeaderId',
        method: 'post',
        data
    })
}

//-----出库单----
export function getOutboundOrder(data) {
    return request({
        url: '/drp/ic/outboundOrder/getResPageData',
        method: 'post',
        data
    })
}

export function getOutboundOrderById(id) {
    return request({
        url: '/drp/ic/outboundOrder/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function saveOutboundOrder(data) {
    return request({
        url: '/drp/ic/outboundOrder/save',
        method: 'post',
        data
    })
}

export function delOutboundOrder(id) {
    return request({
        url: '/drp/ic/outboundOrder/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditOutboundOrder(data) {
    return request({
        url: '/drp/ic/outboundOrder/auditByHeaderId',
        method: 'post',
        data
    })
}

export function buildOutboundOrder(data) {
    return request({
        url: '/drp/ic/outboundOrder/buildSalesByHeaderId',
        method: 'post',
        data
    })
}

export function buildDeliveryByHeaderId(data) {
    return request({
        url: '/drp/ic/outboundOrder/buildDeliveryByHeaderId',
        method: 'post',
        data
    })
}

// ------采购退货入库----
export function getOutboundOrderReturned(data) {
    return request({
        url: '/drp/ic/outboundOrderReturned/getResPageData',
        method: 'post',
        data
    })
}

export function getOutboundOrderReturnedById(id) {
    return request({
        url: '/drp/ic/outboundOrderReturned/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function saveOutboundOrderReturned(data) {
    return request({
        url: '/drp/ic/outboundOrderReturned/save',
        method: 'post',
        data
    })
}

export function delOutboundOrderReturned(id) {
    return request({
        url: '/drp/ic/outboundOrderReturned/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditOutboundOrderReturned(data) {
    return request({
        url: '/drp/ic/outboundOrderReturned/auditByHeaderId',
        method: 'post',
        data
    })
}

export function buildOutboundOrderReturned(data) {
    return request({
        url: '/drp/ic/outboundOrderReturned/buildSalesReturnedByHeaderId',
        method: 'post',
        data
    })
}

// 移库单
export function getMovement(data) {
    return request({
        url: '/drp/ic/movement/getResPageData',
        method: 'post',
        data
    })
}

export function getMovementById(id) {
    return request({
        url: '/drp/ic/movement/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function saveMovement(data) {
    return request({
        url: '/drp/ic/movement/save',
        method: 'post',
        data
    })
}

export function delMovement(id) {
    return request({
        url: '/drp/ic/movement/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditMovement(data) {
    return request({
        url: '/drp/ic/movement/auditByHeaderId',
        method: 'post',
        data
    })
}

export function buildMovement(id) {
    return request({
        url: '/drp/ic/movement/buildPurchaseByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function confirmMovement(id) {
    return request({
        url: '/drp/ic/movement/confirmByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

//-----调拨单----
export function getAllocation(data) {
    return request({
        url: '/drp/ic/allocation/getResPageData',
        method: 'post',
        data
    })
}

export function getAllocationById(id) {
    return request({
        url: '/drp/ic/allocation/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function saveAllocation(data) {
    return request({
        url: '/drp/ic/allocation/save',
        method: 'post',
        data
    })
}

export function delAllocation(id) {
    return request({
        url: '/drp/ic/allocation/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditAllocation(id) {
    return request({
        url: '/drp/ic/allocation/auditByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function buildAllocation(id) {
    return request({
        url: '/drp/ic/allocation/buildPurchaseByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function confirmAllocation(id) {
    return request({
        url: '/drp/ic/allocation/confirmByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

//-----预收单----
export function getPresale(data) {
    return request({
        url: '/drp/ps/presale/getResPageData',
        method: 'post',
        data
    })
}

export function getPresaleById(id) {
    return request({
        url: '/drp/ps/presale/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function savePresale(data) {
    return request({
        url: '/drp/ps/presale/save',
        method: 'post',
        data
    })
}

export function delPresale(id) {
    return request({
        url: '/drp/ps/presale/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditPresale(id) {
    return request({
        url: '/drp/ps/presale/auditByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function buildPresaleVoucher(data) {
    return request({
        url: '/drp/ps/presale/buildVoucherByHeaderId',
        method: 'post',
        data
    })
}
export function buildReturnedBill(id) {
    return request({
        url: '/drp/ps/presale/buildReturnedByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

// ---销售单获取商品价格
export function getItemPrice(data) {
    return request({
        url: '/drp/bd/price/getPriceSVOByItemIdCustId',
        method: 'post',
        data
    })
}

// --------预收退款
export function getPresaleReturned(data) {
    return request({
        url: '/drp/ps/presaleReturned/getResPageData',
        method: 'post',
        data
    })
}

export function getPresaleReturnedById(id) {
    return request({
        url: '/drp/ps/presaleReturned/getByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function getBillReturnedByPresaleHeaderId(id) {
    return request({
        url: '/drp/ps/presaleReturned/getByPresaleHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function savePresaleReturned(data) {
    return request({
        url: '/drp/ps/presaleReturned/save',
        method: 'post',
        data
    })
}

export function delPresaleReturned(id) {
    return request({
        url: '/drp/ps/presaleReturned/deleteByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function auditPresaleReturned(id) {
    return request({
        url: '/drp/ps/presaleReturned/auditByHeaderId',
        method: 'post',
        data: { id: id }
    })
}

export function buildPresaleReturnedVoucher(data) {
    return request({
        url: '/drp/ps/presaleReturned/buildVoucherByHeaderId',
        method: 'post',
        data
    })
}


// ---------------------结算方式（6个）-----------------

export function queryPurchaseSettleType() {
    return request({
        url: '/drp/po/purchase/getSettleTypeList',
        method: 'post'
    })
}

export function queryPurchaseReturnedSettleType() {
    return request({
        url: '/drp/po/purchaseReturned/getSettleTypeList',
        method: 'post'
    })
}

export function querySalesSettleType() {
    return request({
        url: '/drp/so/sales/getSettleTypeList',
        method: 'post'
    })
}

export function querySalesReturnedSettleType() {
    return request({
        url: '/drp/so/salesReturned/getSettleTypeList',
        method: 'post'
    })
}

export function queryPresaleSettleType() {
    return request({
        url: '/drp/ps/presale/getSettleTypeList',
        method: 'post'
    })
}

export function queryPresaleReturnedSettleType() {
    return request({
        url: '/drp/ps/presaleReturned/getSettleTypeList',
        method: 'post'
    })
}

export function queryReceiptSettleType(data) {
    return request({
        url: '/drp/rp/receiptPayment/getSettleTypeList',
        method: 'post',
        data
    })
}

// 获取带价格的商品列表

export function getResPageByFuzzyCustId(data) {
    return request({
        url: '/drp/bd/price/getResPageByFuzzyCustId',
        method: 'post',
        data
    })
}
