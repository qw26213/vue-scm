import { getSummarys, getCoas, getAuxiliaryType } from '@/api/voucher'

const state = {
    coaArr: [],
    summaryArr: [],
    auxiliaryArr: []
}

const mutations = {
    SET_COA: (state, data) => {
        state.coaArr = data
    },
    SET_SUMMARY: (state, data) => {
        state.summaryArr = data
    },
    SET_AUXILIARY: (state, data) => {
        state.auxiliaryArr = data
    }
}

const actions = {
    getCoaList({ commit }, data) {
        getCoas().then(res => {
            commit('SET_COA', res.data)
        })
    },
    getSummaryList({ commit }, data) {
        getSummarys().then(res => {
            commit('SET_SUMMARY', res.data.data)
        })
    },
    getAuxiliaryTypeList({ commit }, data) {
        getAuxiliaryType().then(res => {
            commit('SET_AUXILIARY', res.data.data)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}