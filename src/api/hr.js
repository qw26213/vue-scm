import request from '@/utils/request'

export function getEmployee(data) {
  return request({
    url: '/drp/hr/employee/getAll',
    method: 'post',
    data
  })
}

export function saveEmployee(data) {
  return request({
    url: '/drp/hr/employee/save',
    method: 'post',
    data
  })
}

export function getPayData(data) {
  return request({
    url: '/drp/hr/pay/datatables',
    method: 'post',
    data
  })
}

export function employeeImport(data) {
  return request({
    url: '/drp/hr/employee/importData',
    method: 'post',
    data
  })
}

export function paydetailImport(data) {
  return request({
    url: '/drp/hr/paydetail/importData',
    method: 'post',
    data
  })
}

export function getNationalityType() {
  return request({
    url: '/drp/std/nationalityType/getAll',
    method: 'post'
  })
}

export function getCertificateType() {
  return request({
    url: '/drp/std/certificateType/getAll',
    method: 'post'
  })
}
