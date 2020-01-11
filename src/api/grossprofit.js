import request from '@/utils/request'

export function getData1(data) {
  return request({
    url: '/drp/gp/grossprofit/todayGrossProfitRotation',
    method: 'post',
    data
  })
}
export function getData2(data) {
  return request({
    url: '/drp/gp/grossprofit/queryGrossProfit',
    method: 'post',
    data
  })
}
export function getData3(data) {
  return request({
    url: '/drp/gp/grossprofit/queryGrossProfitRotation',
    method: 'post',
    data
  })
}
export function getData4(data) {
  return request({
    url: '/drp/gp/grossprofit/queryGrossProfitRotation',
    method: 'post',
    data
  })
}
export function getData5(data) {
  return request({
    url: '/drp/gp/grossprofit/queryGrossProfit7',
    method: 'post',
    data
  })
}
export function getData6(data) {
  return request({
    url: '/drp/gp/grossprofit/queryGrossProfit8',
    method: 'post',
    data
  })
}
