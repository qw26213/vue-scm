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