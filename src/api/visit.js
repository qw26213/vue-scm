import request from '@/utils/request'

export function getVisitData(data) {
  return request({
    url: '/drp/crm/visit/getResPageData',
    method: 'post',
    data
  })
}

export function getCrmFileInfo (data) {
  return request({
    url: '/drp/crm/crmFileInfo/getResPageCOSData',
    method: 'post',
    data
  })
}
