import { queryPurchaseSettleType, queryPurchaseReturnedSettleType, querySalesSettleType, querySalesReturnedSettleType, queryPresaleSettleType, queryPresaleReturnedSettleType } from '@/api/store'

const state = {
  settleTypeArr: [],
  truckList: []
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

