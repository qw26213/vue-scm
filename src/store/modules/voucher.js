import { getSummarys, getAllUnion, getCoas, getAuxiliaryType, getTempletTypeList } from '@/api/voucher'
import { getPeriodList } from '@/api/user'
const state = {
    coaArr: [],
    summaryArr: [],
    summaryTable: [],
    auxiliaryArr: [],
    templetTypeList:[],
    periodArr: []
}

const mutations = {
    SET_COA: (state, data) => {
        state.coaArr = data
    },
    SET_SUMMARY: (state, data) => {
        state.summaryArr = data
    },
    SET_SUMMARYTABLE: (state, data) => {
        state.summaryTable = data
    },
    SET_TEMPLETTYPE: (state, data) => {
        state.templetTypeList = data
    },
    SET_AUXILIARY: (state, data) => {
        state.auxiliaryArr = data
    },
    SET_PERIODARR: (state, data) => {
        state.periodArr = data
    }
}

const actions = {
    getCoaList({ commit }, data) {
        var obj = { includeRoot: data }
        getCoas(obj).then(res => {
            commit('SET_COA', res.data.data || [])
        })
    },
    getSummaryList({ commit }, data) {
        getSummarys().then(res => {
            commit('SET_SUMMARYTABLE', res.data.data || [])
        })
    },
    getTempletType({ commit }, data) {
        getTempletTypeList().then(res => {
            commit('SET_TEMPLETTYPE', res.data.data || [])
        })
    },
    getAuxiliaryTypeList({ commit }, data) {
        getAuxiliaryType().then(res => {
            commit('SET_AUXILIARY', res.data.data || [])
        })
    },
    getSummaryTable({ commit }, data) {
        getAllUnion().then(res => {
            commit('SET_SUMMARY', res.data.data || [])
        })
    },
    getPeriod({ commit }, data) {
        getPeriodList().then(res => {
            commit('SET_PERIODARR', res.data.data || [])
        })
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}