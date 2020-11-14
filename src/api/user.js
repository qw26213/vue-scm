import request from '@/utils/request'
var fromData = [function(obj) { let c = ''; for (const i in obj) { c += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&' } return c }]

export function loginCheck(data) {
  return request({
    url: '/drp/loginCheck',
    method: 'post',
    transformRequest: fromData,
    data
  })
}

export function getIndexInfo(data) {
  return request({
    url: '/drp/getIndexInfo',
    method: 'post',
    transformRequest: fromData,
    data
  })
}

export function getUserList() {
  return request({
    url: '/drp/sys/user/cmemlist',
    method: 'post'
  })
}

export function getUsers() {
  return request({
    url: '/drp/sys/user/getSelectList',
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

export function getFuncData(data) {
  return request({
    url: '/drp/sys/roleFuncButton/getFuncButtonListByUserIdAppsId',
    method: 'post',
    data
  })
}

export function getMessage(data) {
  return request({
    url: '/drp/sys/message/messageList',
    method: 'post',
    data
  })
}

export function getFuncByRoleId(data) {
  return request({
    url: '/drp/sys/roleFunc/getFuncByRoleId',
    method: 'post',
    data
  })
}

export function getRole(data) {
  return request({
    url: '/drp/sys/role/list',
    method: 'post',
    data
  })
}

export function saveRole(data) {
  return request({
    url: '/drp/sys/role/save',
    method: 'post',
    data
  })
}

export function delRole(data) {
  return request({
    url: '/drp/sys/role/deleteById',
    method: 'post',
    data
  })
}

export function toLogout() {
  return request({
    url: '/drp/logout',
    method: 'post'
  })
}

export function updatePSW(data) {
  return request({
    url: '/drp/sys/user/updatePSW',
    method: 'post',
    data
  })
}
// 企业信息
export function getmanagementInfo(data) {
  return request({
    url: '/drp/cm/management/datatables',
    method: 'post',
    data
  })
}

// 编辑企业信息
export function updateInfo(data) {
  return request({
    url: '/drp/cm/management/updateInfo',
    method: 'post',
    data
  })
}

// 操作员信息
export function getMapById(data) {
  return request({
    url: '/drp/sys/user/getMapById',
    method: 'post',
    data
  })
}

// 行业列表
export function registerLoadIndustry(data) {
  return request({
    url: '/drp/registerLoadIndustry',
    method: 'post',
    data
  })
}

// 地区列表
export function registerLoadArea(data) {
  return request({
    url: '/drp/registerLoadArea',
    method: 'post',
    data
  })
}

// 纳税人类型
export function registerLoadTaxfilingcategory(data) {
  return request({
    url: '/drp/registerLoadTaxfilingcategory',
    method: 'post',
    data
  })
}

// 注销企业
export function closeAccount(data) {
  return request({
    url: '/drp/cm/management/closeAccount',
    method: 'post',
    data
  })
}

// 修改纳税类型
export function updateTaxFilingCategory(data) {
  return request({
    url: '/drp/cm/management/updateTaxFilingCategory',
    method: 'post',
    data
  })
}

// 注销企业
export function killUser(data) {
  return request({
    url: '/drp/killUser',
    method: 'post',
    data
  })
}

// 清除账套
export function resetBook(data) {
  return request({
    url: '/drp/gl/book/resetBook',
    method: 'post',
    data
  })
}

// 重置账套
export function resetAccount(data) {
  return request({
    url: '/drp/gl/book/deleteById',
    method: 'post',
    data
  })
}

// 重置账套
export function getAccount(data) {
  return request({
    url: '/drp/gl/book/get',
    method: 'post',
    data
  })
}

// 修改账套
export function saveBook(data) {
  return request({
    url: '/drp/gl/book/save',
    method: 'post',
    data
  })
}

// 重置账套
export function addBook(data) {
  return request({
    url: '/drp/gl/book/bookAuxSave',
    method: 'post',
    data
  })
}

export function getCurrencyList(data) {
  return request({
    url: '/drp/dim/currency/getSelectList',
    method: 'post',
    data
  })
}

export function getCoaHierarchy(data) {
  return request({
    url: '/drp/std/coaHierarchy/getAll',
    method: 'post',
    data
  })
}

export function reBalance(data) {
  return request({
    url: '/drp/cm/rebalance/reBalance',
    method: 'post',
    data
  })
}

// 会计期间
export function getPeriodList(data) {
  return request({
    url: '/drp/gl/period/getSelectList',
    method: 'post',
    data
  })
}

// 同步数据
export function synbasedata(data) {
  return request({
    url: '/drp/cm/synbasedata/synbasedata',
    method: 'post',
    data
  })
}
// 期初余额
export function getBalance(data) {
  return request({
    url: '/drp/gl/balance/getListForSetBegin',
    method: 'post',
    data
  })
}

// 保存期初余额
export function updateListForSetBegin(data) {
  return request({
    url: '/drp/gl/balance/updateListForSetBegin',
    method: 'post',
    data
  })
}

// 科目分类
export function coaClassification(data) {
  return request({
    url: '/drp/std/coaClassification/select',
    method: 'post',
    data
  })
}

// 科目列表
export function getCoaDatatables(data) {
  return request({
    url: '/drp/gl/coa/datatables',
    method: 'post',
    data
  })
}

export function getGlCoaCode(data) {
  return request({
    url: '/drp/gl/coa/getGlCoaCode',
    method: 'post',
    data
  })
}

export function updateDisabledCoa(data) {
  return request({
    url: '/drp/gl/coa/updateIsDisableById/',
    method: 'post',
    data
  })
}

export function getMsgBeforeDelete(id) {
  return request({
    url: '/drp/gl/coa/getMsgBeforeDelete',
    method: 'post',
    data: { id: id }
  })
}

export function delCoa(id) {
  return request({
    url: '/drp/gl/coa/deleteById',
    method: 'post',
    data: { id: id }
  })
}

export function getCoaCodeUsedByIdNoSysTemplet(id) {
  return request({
    url: '/drp/gl/coa/getCoaCodeUsedByIdNoSysTemplet',
    method: 'post',
    data: { id: id }
  })
}

export function getChildrenCountByParentId(parentId) {
  return request({
    url: '/drp/gl/coa/getChildrenCountByParentId',
    method: 'post',
    data: { parentId: parentId }
  })
}

export function getCoaCodeUsedById(id) {
  return request({
    url: '/drp/gl/coa/getCoaCodeUsedById',
    method: 'post',
    data: { id: id }
  })
}

export function saveCoa(data) {
  return request({
    url: '/drp/gl/coa/save',
    method: 'post',
    data
  })
}

export function updateDispName(bookId) {
  return request({
    url: '/drp/gl/coa/updateDispName/',
    method: 'post',
    data: { bookId: bookId }
  })
}

export function getProj() {
  return request({
    url: '/drp/bd/proj/list',
    method: 'post'
  })
}

export function getItem() {
  return request({
    url: '/drp/bd/item/list',
    method: 'post'
  })
}

export function getDept() {
  return request({
    url: '/drp/bd/dept/list',
    method: 'post'
  })
}

export function getCust() {
  return request({
    url: '/drp/bd/cust/list',
    method: 'post'
  })
}

export function getSupplier() {
  return request({
    url: '/drp/bd/supplier/list',
    method: 'post'
  })
}

export function getStaff() {
  return request({
    url: '/drp/bd/staff/list',
    method: 'post'
  })
}

export function getOpeningBalanceStatus() {
  return request({
    url: '/drp/gl/period/getOpeningBalanceStatus',
    method: 'post'
  })
}

// ---------------------------------权限管理---------------------------------
export function getFuncs(data) {
  return request({
    url: '/drp/sys/funcButton/datatables',
    method: 'post',
    data
  })
}

// ---------------------------------权限管理---------------------------------

export function getFuncsTree(data) {
  return request({
    url: '/drp/sys/funcButton/treeData',
    method: 'post',
    data
  })
}

export function getFuncButtonListByRoleId(data) {
  return request({
    url: '/drp/sys/roleFuncButton/getFuncButtonListByRoleId',
    method: 'post',
    data
  })
}

export function updateRoleIdByFuncButtonIdList(data) {
  return request({
    url: '/drp/sys/roleFuncButton/updateRoleIdByFuncButtonIdList',
    method: 'post',
    data
  })
}

// ---------------------------------客户导入---------------------------------

export function importCust(data) {
  return request({
    url: '/drp/importData/cust',
    method: 'post',
    data
  })
}

// ---------------------------------商品导入---------------------------------

export function importItem(data) {
  return request({
    url: '/drp/importData/item',
    method: 'post',
    data
  })
}

// ---------------------------------期初导入---------------------------------

export function importBeginBalance(data) {
  return request({
    url: '/drp/importData/beginBalance',
    method: 'post',
    data
  })
}

// ---------------------------------库存导入---------------------------------

export function importStore(data) {
  return request({
    url: '/drp/importData/onhand',
    method: 'post',
    data
  })
}

export function getCloseAccountStatus() {
  return request({
    url: '/drp/cm/management/getCloseAccountStatus',
    method: 'post'
  })
}

export function getCleanBookStatus() {
  return request({
    url: '/drp/gl/book/getCleanBookStatus',
    method: 'post'
  })
}
