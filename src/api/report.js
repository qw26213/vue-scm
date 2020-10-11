import request from '@/utils/request'

export function getDeptData(data) {
  return request({
    url: '/drp/rpt2013f1/build',
    method: 'post',
    data
  })
}

export function getProfitData(data) {
  return request({
    url: '/drp/rpt2013f2/build',
    method: 'post',
    data
  })
}

export function getFlowData(data) {
  return request({
    url: '/drp/rptcashflow/socfDatatabls',
    method: 'post',
    data
  })
}

export function getPeriodList() {
  return request({
    url: '/drp/gl/period/getSelectList',
    method: 'post'
  })
}
