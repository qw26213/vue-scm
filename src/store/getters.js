const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id: state => state.user.id,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  settleTypeArr: state => state.basedata.settleTypeArr,
  truckList: state => state.basedata.truckList,
  coaArr: state => state.voucher.coaArr,
  summaryArr: state => state.voucher.summaryArr,
  templetTypeList: state => state.voucher.templetTypeList,
  auxiliaryArr: state => state.voucher.auxiliaryArr,
  salesTypeArr: state => state.basedata.salesTypeArr,
  summaryTable: state => state.voucher.summaryTable,
  periodArr: state => state.voucher.periodArr,
  userInfo: state => state.user.userInfo
}

export default getters
