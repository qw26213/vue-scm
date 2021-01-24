import request from '@/utils/request'

export function getDeptData(data) {
  const userInfo = JSON.parse(sessionStorage.userInfo)
  let path = 'rpt2013f1'
  if (userInfo.glBookEntity && (userInfo.glBookEntity.coahierarchyId == 1||userInfo.glBookEntity.coahierarchyId == 2007)) {
      path = 'rpt2007f1'
  }
  return request({
    url: '/drp/' + path + '/build',
    method: 'post',
    data
  })
}

export function printDeptData(data) {
  const userInfo = JSON.parse(sessionStorage.userInfo)
  let path = 'rpt2013f1'
  if (userInfo.glBookEntity && (userInfo.glBookEntity.coahierarchyId == 1||userInfo.glBookEntity.coahierarchyId == 2007)) {
      path = 'rpt2007f1'
  }
  return request({
    url: '/drp/' + path + '/printPDF',
    method: 'post',
    data
  })
}

export function exportDeptData(data) {
  const userInfo = JSON.parse(sessionStorage.userInfo)
  let path = 'rpt2013f1'
  if (userInfo.glBookEntity && (userInfo.glBookEntity.coahierarchyId == 1||userInfo.glBookEntity.coahierarchyId == 2007)) {
      path = 'rpt2007f1'
  }
  const exportUrl = '/drp/' + path + '/exportExcel'
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

export function getProfitData(data) {
  const userInfo = JSON.parse(sessionStorage.userInfo)
  let path = 'rpt2013f2'
  if (userInfo.glBookEntity && (userInfo.glBookEntity.coahierarchyId == 1||userInfo.glBookEntity.coahierarchyId == 2007)) {
      path = 'rpt2007f2'
  }
  return request({
    url: '/drp/' + path + '/build',
    method: 'post',
    data
  })
}

export function printProfitData(data) {
  const userInfo = JSON.parse(sessionStorage.userInfo)
  let path = 'rpt2013f2'
  if (userInfo.glBookEntity && (userInfo.glBookEntity.coahierarchyId == 1||userInfo.glBookEntity.coahierarchyId == 2007)) {
      path = 'rpt2007f2'
  }
  return request({
    url: '/drp/' + path + '/printPDF',
    method: 'post',
    data
  })
}

export function exportProfitData(data) {
  const userInfo = JSON.parse(sessionStorage.userInfo)
  let path = 'rpt2013f2'
  if (userInfo.glBookEntity && (userInfo.glBookEntity.coahierarchyId == 1||userInfo.glBookEntity.coahierarchyId == 2007)) {
      path = 'rpt2007f2'
  }
  const exportUrl = '/drp/' + path + '/exportExcel'
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
