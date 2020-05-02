import request from '@/utils/request'
var fromData = [function (obj) {let c = '';for (let i in obj) {c += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&'}return c}];

export function getDept(data) {
  return request({
    url: '/drp/bd/dept/getAll',
    method: 'post',
    data
  })
}

export function saveDept(data) {
  return request({
    url: '/drp/bd/dept/save',
    method: 'post',
    data
  })
}

export function delDept(id) {
  return request({
    url: '/drp/bd/dept/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateDeptDisabled(data) {
  return request({
    url: '/drp/bd/dept/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getAllByDeptId(id){
  return request({
    url: '/drp/bd/staff/getAllByDeptId',
    method: 'post',
    data:{deptId:id}
  })
}

export function getStaff(data) {
  return request({
    url: '/drp/bd/staff/getAll',
    method: 'post',
    data
  })
}

export function saveStaff(data){
  return request({
    url: '/drp/bd/staff/save',
    method: 'post',
    data
  })
}

export function delStaff(id) {
  return request({
    url: '/drp/bd/staff/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateStaffDisabled(data) {
  return request({
    url: '/drp/bd/staff/updateIsDisableById',
    method: 'post',
    data
  })
}

export function updateCreditLimitById(data){
  return request({
    url: '/drp/bd/staff/updateCreditLimitById',
    method: 'post',
    data
  })
}

export function updateOverdraftBalanceById(data){
  return request({
    url: '/drp/bd/staff/updateOverdraftBalanceById',
    method: 'post',
    data
  })
}

export function updateOverdraftBalanceById1(data){
  return request({
    url: '/drp/bd/cust/updateOverdraftBalanceById',
    method: 'post',
    data
  })
}

export function getCust(data) {
  return request({
    url: '/drp/bd/cust/getResPageData',
    method: 'post',
    data
  })
}

export function getCustTypeTreeDataByParentId(data) {
  return request({
    url: '/drp/bd/custType/getTreeDataByParentId',
    method: 'post',
    data
  })
}

export function updateCustTypeIdByCustIdList(data) {
  return request({
    url: '/drp/bd/custType/updateCustTypeIdByCustIdList',
    method: 'post',
    data
  })
}
export function updateChannelTypeIdByCustIdList(data) {
  return request({
    url: '/drp/bd/channelType/updateChannelTypeIdByCustIdList',
    method: 'post',
    data
  })
}

export function saveCust(data){
  return request({
    url: '/drp/bd/cust/save',
    method: 'post',
    data
  })
}

export function delCust(id){
  return request({
    url: '/drp/bd/cust/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateCustDisabled(data){
  return request({
    url: '/drp/bd/cust/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getSupplier(data) {
  return request({
    url: '/drp/bd/supplier/getAll',
    method: 'post',
    data
  })
}

export function saveSupplier(data) {
  return request({
    url: '/drp/bd/supplier/save',
    method: 'post',
    data
  })
}

export function delSupplier(id){
  return request({
    url: '/drp/bd/supplier/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateSupplierDisabled(data){
  return request({
    url: '/drp/bd/supplier/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getWarehouse(data) {
  return request({
    url: '/drp/bd/warehouse/getAll',
    method: 'post',
    data
  })
}

export function saveWarehouse(data) {
  return request({
    url: '/drp/bd/warehouse/save',
    method: 'post',
    data
  })
}

export function delWarehouse(id){
  return request({
    url: '/drp/bd/warehouse/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateWarehouseDisabled(data){
  return request({
    url: '/drp/bd/warehouse/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getCustType(data) {
  return request({
    url: '/drp/bd/custType/getAll',
    method: 'post',
    data
  })
}

export function getCustTypeTree(data){
  return request({
    url: '/drp/bd/custType/getTreeDataByParentId',
    method: 'post',
    data
  })
}

export function saveCustType(data) {
  return request({
    url: '/drp/bd/custType/save',
    method: 'post',
    data
  })
}

export function delCustType(id){
  return request({
    url: '/drp/bd/custType/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateCustTypeDisabled(data){
  return request({
    url: '/drp/bd/custType/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getChannelTree(data) {
  return request({
    url: '/drp/bd/channelType/getTreeDataByParentId',
    method: 'post',
    data
  })
}

export function getChannelType(data) {
  return request({
    url: '/drp/bd/channelType/getChannelTypeAllChildrenByParentId',
    method: 'post',
    data
  })
}

export function saveChannelType(data) {
  return request({
    url: '/drp/bd/channelType/save',
    method: 'post',
    data
  })
}

export function delChannelType(id){
  return request({
    url: '/drp/bd/channelType/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateChannelTypeDisabled(data){
  return request({
    url: '/drp/bd/channelType/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getTruck(data) {
  return request({
    url: '/drp/bd/truck/getAll',
    method: 'post',
    data
  })
}

export function saveTruck(data) {
  return request({
    url: '/drp/bd/truck/save',
    method: 'post',
    data
  })
}

export function delTruck(id){
  return request({
    url: '/drp/bd/truck/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateTruckDisabled(data){
  return request({
    url: '/drp/bd/truck/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getBrand(data) {
  return request({
    url: '/drp/bd/brand/getAll',
    method: 'post',
    data
  })
}

export function saveBrand(data) {
  return request({
    url: '/drp/bd/brand/save',
    method: 'post',
    data
  })
}

export function delBrand(id){
  return request({
    url: '/drp/bd/brand/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateBrandDisabled(data){
  return request({
    url: '/drp/bd/brand/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getBizType(data) {
  return request({
    url: '/drp/bd/bizType/getAll',
    method: 'post',
    data
  })
}

export function saveBizType(data) {
  return request({
    url: '/drp/bd/bizType/save',
    method: 'post',
    data
  })
}

export function delBizType(id){
  return request({
    url: '/drp/bd/bizType/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateBizTypeDisabled(data){
  return request({
    url: '/drp/bd/bizType/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getBizProc(data) {
  return request({
    url: '/drp/bd/bizProc/getAll',
    method: 'post',
    data
  })
}

export function saveBizProc(data) {
  return request({
    url: '/drp/bd/bizProc/save',
    method: 'post',
    data
  })
}

export function delBizProc(id){
  return request({
    url: '/drp/bd/bizProc/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateBizProcDisabled(data){
  return request({
    url: '/drp/bd/bizProc/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getPaymentType(data) {
  return request({
    url: '/drp/bd/paymentType/getAll',
    method: 'post',
    data
  })
}

export function savePaymentType(data) {
  return request({
    url: '/drp/bd/paymentType/save',
    method: 'post',
    data
  })
}

export function delPaymentType(id){
  return request({
    url: '/drp/bd/paymentType/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updatePaymentTypeDisabled(data){
  return request({
    url: '/drp/bd/paymentType/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getPriceGroup(data) {
  return request({
    url: '/drp/bd/priceGroup/getCustList',
    method: 'post',
    data
  })
}

export function savePriceGroup(data) {
  return request({
    url: '/drp/bd/priceGroup/save',
    method: 'post',
    data
  })
}

export function delPriceGroup(id){
  return request({
    url: '/drp/bd/priceGroup/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updatePriceGroupDisabled(data){
  return request({
    url: '/drp/bd/priceGroup/updateIsDisableById',
    method: 'post',
    data
  })
}

export function updatePriceGroupIdByCustIdList(data){
  return request({
    url: '/drp/bd/priceGroup/updatePriceGroupIdByCustIdList',
    method: 'post',
    data
  })
}

export function updatePriceByItemIdPriceGroupIdList(data){
  return request({
    url: '/drp/bd/price/updatePriceByItemIdPriceGroupIdList',
    method: 'post',
    data
  })
}

export function updatePriceByItemIdPriceGroupId(data){
  return request({
    url: '/drp/bd/price/updatePriceByItemIdPriceGroupId',
    method: 'post',
    data
  })
}

export function getPrice(data) {
  return request({
    url: '/drp/bd/price/getByItemId',
    method: 'post',
    data
  })
}

export function savePrice(data) {
  return request({
    url: '/drp/bd/price/updatePriceById',
    method: 'post',
    data
  })
}

export function delPrice(id){
  return request({
    url: '/drp/bd/price/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updatePriceDisabled(data){
  return request({
    url: '/drp/bd/price/updateIsDisableById',
    method: 'post',
    data
  })
}

export function updateLastPriceByItemIdPriceGroupId(data){
  return request({
    url: '/drp/bd/price/updateLastPriceByItemIdPriceGroupId',
    method: 'post',
    data
  })
}

export function getProj(data) {
  return request({
    url: '/drp/bd/proj/getAll',
    method: 'post',
    data
  })
}

export function saveProj(data) {
  return request({
    url: '/drp/bd/proj/save',
    method: 'post',
    data
  })
}

export function delProj(id){
  return request({
    url: '/drp/bd/proj/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateProjDisabled(data){
  return request({
    url: '/drp/bd/proj/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getMeas(data) {
  return request({
    url: '/drp/bd/meas/getAll',
    method: 'post',
    data
  })
}

export function saveMeas(data) {
  return request({
    url: '/drp/bd/meas/save',
    method: 'post',
    data
  })
}

export function delMeas(id){
  return request({
    url: '/drp/bd/meas/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateMeasDisabled(data){
  return request({
    url: '/drp/bd/meas/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getRoute(data) {
  return request({
    url: '/drp/bd/route/getAll',
    method: 'post',
    data
  })
}

export function saveRoute(data) {
  return request({
    url: '/drp/bd/route/save',
    method: 'post',
    data
  })
}

export function delRoute(id){
  return request({
    url: '/drp/bd/route/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateRouteDisabled(data){
  return request({
    url: '/drp/bd/route/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getSalesType(data) {
  return request({
    url: '/drp/bd/salesType/getAll',
    method: 'post',
    data
  })
}

export function saveSalesType(data) {
  return request({
    url: '/drp/bd/salesType/save',
    method: 'post',
    data
  })
}

export function delSalesType(id){
  return request({
    url: '/drp/bd/salesType/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateSalesTypeDisabled(data){
  return request({
    url: '/drp/bd/salesType/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getSettleType(data) {
  return request({
    url: '/drp/bd/settleType/getAll',
    method: 'post',
    data
  })
}

export function saveSettleType(data) {
  return request({
    url: '/drp/bd/settleType/save',
    method: 'post',
    data
  })
}

export function delSettleType(id){
  return request({
    url: '/drp/bd/settleType/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateSettleTypeDisabled(data){
  return request({
    url: '/drp/bd/settleType/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getAllNoADVR(){
  return request({
    url: '/drp/bd/settleType/getAllNoADVR',
    method: 'post',
    data:{}
  })
}

export function getInvCatg(data) {
  return request({
    url: '/drp/bd/invCatg/getAll',
    method: 'post',
    data
  })
}

export function saveInvCatg(data) {
  return request({
    url: '/drp/bd/invCatg/save',
    method: 'post',
    data
  })
}

export function delInvCatg(id){
  return request({
    url: '/drp/bd/invCatg/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateInvCatgDisabled(data){
  return request({
    url: '/drp/bd/invCatg/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getAllByInvCatgId(id) {
  return request({
    url: '/drp/bd/item/getAllByInvCatgId',
    method: 'post',
    data:{invCatgId:id}
  })
}

export function getItem(data) {
  return request({
    url: '/drp/bd/item/getResPageData',
    method: 'post',
    data
  })
}

export function saveItem(data) {
  return request({
    url: '/drp/bd/item/save',
    method: 'post',
    data
  })
}

export function delItem(id){
  return request({
    url: '/drp/bd/item/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateItemDisabled(data){
  return request({
    url: '/drp/bd/item/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getItemChildrenByParentId(obj){
  return request({
    url: '/drp/bd/item/getChildrenByParentId',
    method: 'post',
    data
  })
}
export function getInvcatgChildrenByParentId(id){
  return request({
    url: '/drp/bd/invCatg/getChildrenByParentId',
    method: 'post',
    data:{parentId:id}
  })
}

export function getDeptTree(data) {
  return request({
    url: '/drp/bd/dept/getTreeDataByParentId',
    method: 'post',
    data
  })
}

export function getItemTree(data){
  return request({
    url: '/drp/bd/invCatg/getTreeDataByParentId',
    method: 'post',
    data
  })
}

export function getCurrency(data) {
  return request({
    url: '/drp/gl/currency/getAll',
    method: 'post',
    data
  })
}

export function saveCurrency(data) {
  return request({
    url: '/drp/gl/currency/save',
    method: 'post',
    data
  })
}

export function delCurrency(id){
  return request({
    url: '/drp/gl/currency/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateCurrencyDisabled(data){
  return request({
    url: '/drp/gl/currency/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getCatogery(data) {
  return request({
    url: '/drp/gl/catogery/getAll',
    method: 'post',
    data
  })
}

export function saveCatogery(data) {
  return request({
    url: '/drp/gl/catogery/save',
    method: 'post',
    data
  })
}

export function delCatogery(id){
  return request({
    url: '/drp/gl/catogery/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateCatogeryDisabled(data){
  return request({
    url: '/drp/gl/catogery/updateIsDisableById',
    method: 'post',
    data
  })
}

export function getTempletType(data) {
  return request({
    url: '/drp/gl/templetType/getAll',
    method: 'post',
    data
  })
}

export function saveTempletType(data) {
  return request({
    url: '/drp/gl/templetType/save',
    method: 'post',
    data
  })
}

export function delTempletType(id){
  return request({
    url: '/drp/gl/templetType/deleteById',
    method: 'post',
    data:{id:id}
  })
}

export function updateTempletTypeDisabled(data){
  return request({
    url: '/drp/gl/templetType/updateIsDisableById',
    method: 'post',
    data
  })
}

// 仓库分配
export function getWarehouseListByUserId(data){
  return request({
    url: '/drp/sys/userWarehouse/getWarehouseListByUserId',
    method: 'post',
    data
  })
}

export function getUserListByWarehouseId(data){
  return request({
    url: '/drp/sys/userWarehouse/getUserListByWarehouseId',
    method: 'post',
    data
  })
}

export function updateWarehouseIdByUserIdList(data){
  return request({
    url: '/drp/sys/userWarehouse/updateWarehouseIdByUserIdList',
    method: 'post',
    data
  })
}

export function updateUserIdByWarehouseIdList(data){
  return request({
    url: '/drp/sys/userWarehouse/updateUserIdByWarehouseIdList',
    method: 'post',
    data
  })
}

// 车辆分配
export function getTruckListByUserId(data){
  return request({
    url: '/drp/sys/userTruck/getTruckListByUserId',
    method: 'post',
    data
  })
}

export function getUserListByTruckId(data){
  return request({
    url: '/drp/sys/userTruck/getUserListByTruckId',
    method: 'post',
    data
  })
}

export function updateUserIdByTruckIdList(data){
  return request({
    url: '/drp/sys/userTruck/updateUserIdByTruckIdList',
    method: 'post',
    data
  })
}

export function updateTruckIdByUserIdList(data){
  return request({
    url: '/drp/sys/userTruck/updateTruckIdByUserIdList',
    method: 'post',
    data
  })
}

// 线路分配
export function getRouteListByUserId(data){
  return request({
    url: '/drp/sys/userRoute/getRouteListByUserId',
    method: 'post',
    data
  })
}

export function getUserListByRouteId(data){
  return request({
    url: '/drp/sys/userRoute/getUserListByRouteId',
    method: 'post',
    data
  })
}

export function updateUserIdByRouteIdList(data){
  return request({
    url: '/drp/sys/userRoute/updateUserIdByRouteIdList',
    method: 'post',
    data
  })
}

export function updateRouteIdByUserIdList(data){
  return request({
    url: '/drp/sys/userRoute/updateRouteIdByUserIdList',
    method: 'post',
    data
  })
}

export function getCustListByRouteId(data){
  return request({
    url: '/drp/bd/routeCust/getCustListByRouteId',
    method: 'post',
    data
  })
}

export function updateRouteIdByCustIdList(data){
  return request({
    url: '/drp/bd/routeCust/updateRouteIdByCustIdList',
    method: 'post',
    data
  })
}

// 品牌分配
export function getBrandListByUserId(data){
  return request({
    url: '/drp/sys/userBrand/getBrandListByUserId',
    method: 'post',
    data
  })
}

export function getUserListByBrandId(data){
  return request({
    url: '/drp/sys/userBrand/getUserListByBrandId',
    method: 'post',
    data
  })
}

export function updateUserIdByBrandIdList(data){
  return request({
    url: '/drp/sys/userBrand/updateUserIdByBrandIdList',
    method: 'post',
    data
  })
}

export function updateBrandIdByUserIdList(data){
  return request({
    url: '/drp/sys/userBrand/updateBrandIdByUserIdList',
    method: 'post',
    data
  })
}

// 商品分配[数据权限]
export function getItemListByUserId(data){
  return request({
    url: '/drp/sys/userItem/getItemListByUserId',
    method: 'post',
    data
  })
}

export function updateUserIdByItemIdList(data){
  return request({
    url: '/drp/sys/userItem/updateUserIdByItemIdList',
    method: 'post',
    data
  })
}

// 角色分配[数据权限]
export function getRoleListByUserIdAppsId(data){
  return request({
    url: '/drp/sys/userRole/getRoleListByUserIdAppsId',
    method: 'post',
    data
  })
}

export function updateUserIdByRoleIdList(data){
  return request({
    url: '/drp/sys/userRole/updateUserIdByRoleIdList',
    method: 'post',
    data
  })
}

// 客户分配[数据权限]
export function getCustListByUserId(data){
  return request({
    url: '/drp/sys/userCust/getCustListByUserId',
    method: 'post',
    data
  })
}

export function updateUserIdByCustIdList(data){
  return request({
    url: '/drp/sys/userCust/updateUserIdByCustIdList',
    method: 'post',
    data
  })
}

export function getUserList() {
  return request({
    url: '/drp/sys/user/cmemlist',
    method: 'post'
  })
}

export function saveUser(data) {
  return request({
    url: '/drp/sys/user/save',
    method: 'post',
    data
  })
}

export function delUser(data) {
  return request({
    url: '/drp/sys/user/deleteById',
    method: 'post',
    data
  })
}

export function getCustListByChannelTypeId(data){
  return request({
    url: '/drp/bd/cust/getCustListByChannelTypeId',
    method: 'post',
    data
  })
}

export function getCustListByCustTypeId(data){
  return request({
    url: '/drp/bd/cust/getCustListByCustTypeId',
    method: 'post',
    data
  })
}


