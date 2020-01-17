import { getAllNoADVR } from '@/api/basedata'

const state = {
  settleTypeArr: [],
  truckList: []
}

const mutations = {
  SET_SETTLETYPE: (state, data) => {
    state.settleTypeArr = data
  }
}

const actions = {
  getSettleType({ commit }, data) {
    if(state.settleTypeArr.length>0){return}
    getAllNoADVR().then(res => {
      commit('SET_SETTLETYPE', res.data.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

