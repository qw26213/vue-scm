import request from '@/utils/request'
var fromData = [function (obj) { let c = ''; for (let i in obj) { c += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&' } return c }];

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

export function getRoles(data) {
    return request({
        url: '/drp/getFuncListS',
        method: 'post',
        transformRequest: fromData,
        data
    })
}

export function logout() {
    return request({
        url: '/logout',
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

// 操作员列表
export function getcmemlist(data) {
    return request({
        url: '/drp/sys/user/cmemlist',
        method: 'post',
        data
    })
}

export function saveUser(data) {
    return request({
        url: '/drp/sys/user/save',
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

export function getCurrencyList(data){
    return request({
        url: '/drp/dim/currency/getSelectList',
        method: 'post',
        data
    })
}

export function getCoaHierarchy(data){
    return request({
        url: '/drp/std/coaHierarchy/getAll',
        method: 'post',
        data
    })
}