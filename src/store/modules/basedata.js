import { queryPurchaseSettleType, queryPurchaseReturnedSettleType, querySalesSettleType, querySalesReturnedSettleType, queryPresaleSettleType, queryPresaleReturnedSettleType, queryReceiptSettleType } from '@/api/store'
import { getSalesType } from '@/api/basedata'
const state = {
  settleTypeArr: [],
  truckList: [],
  salesTypeArr: []
}

const mutations = {
  SET_SETTLETYPE1: (state, data) => {
    state.settleTypeArr = data
  },
  SET_SETTLETYPE2: (state, data) => {
    state.settleTypeArr = data
  },
  SET_SETTLETYPE3: (state, data) => {
    state.settleTypeArr = data
  },
  SET_SETTLETYPE4: (state, data) => {
    state.settleTypeArr = data
  },
  SET_SETTLETYPE5: (state, data) => {
    state.settleTypeArr = data
  },
  SET_SETTLETYPE6: (state, data) => {
    state.settleTypeArr = data
  },
  SET_SETTLETYPE7: (state, data) => {
    state.salesTypeArr = data
  },
  SET_SETTLETYPE8: (state, data) => {
    state.settleTypeArr = data
  },
}

const actions = {
  getPurchaseSettleType({ commit }, data) {
    // if(state.settleTypeArr.length>0){return}
    queryPurchaseSettleType().then(res => {
      commit('SET_SETTLETYPE1', res.data.data)
    })
  },
  getPurchaseReturnedSettleType({ commit }, data) {
    // if(state.settleTypeArr.length>0){return}
    queryPurchaseReturnedSettleType().then(res => {
      commit('SET_SETTLETYPE2', res.data.data)
    })
  },
  getSalesSettleType({ commit }, data) {
    // if(state.settleTypeArr.length>0){return}
    querySalesSettleType().then(res => {
      commit('SET_SETTLETYPE3', res.data.data)
    })
  },
  getSalesReturnedSettleType({ commit }, data) {
    // if(state.settleTypeArr.length>0){return}
    querySalesReturnedSettleType().then(res => {
      commit('SET_SETTLETYPE4', res.data.data)
    })
  },
  getPresaleSettleType({ commit }, data) {
    // if(state.settleTypeArr.length>0){return}
    queryPresaleSettleType().then(res => {
      commit('SET_SETTLETYPE5', res.data.data)
    })
  },
  getPresaleReturnedSettleType({ commit }, data) {
    // if(state.settleTypeArr.length>0){return}
    queryPresaleReturnedSettleType().then(res => {
      commit('SET_SETTLETYPE6', res.data.data)
    })
  },
  getSalesTypeArr({ commit }, data) {
    // if(state.settleTypeArr.length>0){return}
    getSalesType().then(res => {
      commit('SET_SETTLETYPE7', res.data.data)
    })
  },
  getReceiptSettleType({ commit }, data) {
    // if(state.settleTypeArr.length>0){return}
    queryReceiptSettleType(data).then(res => {
      commit('SET_SETTLETYPE8', res.data.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

