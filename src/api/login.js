import request from '@/utils/request'

export function registerLoadTaxfilingcategory() {
  return request({
    url: '/drp/registerLoadTaxfilingcategory',
    method: 'post'
  })
}

export function registerLoadArea() {
  return request({
    url: '/drp/registerLoadArea',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/drp/registerSave',
    method: 'post',
    data
  })
}

export function forgotOrgCode9(data) {
  return request({
    url: '/drp/forgotOrgCode9',
    method: 'post',
    data
  })
}

export function forgotSentVerifyCode(data){
  return request({
    url: '/drp/forgotSentVerifyCode',
    method: 'post',
    data
  })
}

export function forgotPSWSave(data){
  return request({
    url: '/drp/forgotPSWSave',
    method: 'post',
    data
  })
}

export function home1TopN(data){
  return request({
    url: '/drp/gp/grossprofit/home1TopN',
    method: 'post',
    data
  })
}

export function home2TopN(data){
  return request({
    url: '/drp/gp/grossprofit/home2TopN',
    method: 'post',
    data
  })
}

export function home3TopN(data){
  return request({
    url: '/drp/gp/grossprofit/home3TopN',
    method: 'post',
    data
  })
}

export function home4TopN(data){
  return request({
    url: '/drp/gp/grossprofit/home4TopN',
    method: 'post',
    data
  })
}

export function getVerifyImg() {
  return '/drp/getVerify9'
}

export function checkVerify9(data) {
  return request({
    url: '/drp/checkVerify9',
    method: 'post',
    data
  })
}
