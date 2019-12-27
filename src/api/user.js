import request from '@/utils/request'
var fromData = [function (obj) {let c = '';for (let i in obj) {c += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&'}return c}];

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

