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

export function delEmployee(id) {
  return request({
    url: '/drp/hr/employee/deleteById',
    method: 'post',
    data: { id: id }
  })
}

export function getSalaryHeader(data) {
  return request({
    url: '/drp/hr/salaryHeader/datatables',
    method: 'post',
    data
  })
}

export function delPayData(id) {
  return request({
    url: '/drp/hr/salaryHeader/deleteById',
    method: 'post',
    data: { id: id }
  })
}

export function getSalaryData(periodCode) {
  return request({
    url: '/drp/hr/salaryDetail/getByPeriodCode',
    method: 'post',
    data: { periodCode }
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
    url: '/drp/hr/salaryDetail/importData',
    method: 'post',
    data
  })
}

export function copySalary(data) {
  return request({
    url: '/drp/hr/salaryDetail/copySalary',
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

export function exportEmployee(data) {
  const exportUrl = '/drp/hr/employee/exportEmployee'
  var temp = document.createElement('form')
  temp.action = exportUrl
  temp.method = 'POST'
  temp.style.display = 'none'
  for (var x in data) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = data[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

export function exportSalary(data) {
  const exportUrl = '/drp/hr/salaryDetail/exportSalary'
  var temp = document.createElement('form')
  temp.action = exportUrl
  temp.method = 'POST'
  temp.style.display = 'none'
  for (var x in data) {
    var opt = document.createElement('textarea')
    opt.name = x
    opt.value = data[x]
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}
