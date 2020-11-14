import { loginCheck, getIndexInfo, getFuncData, toLogout } from '@/api/user'
import { getToken, setToken, removeToken, setName, getName } from '@/utils/auth'
import { fetchRoles } from '@/utils/index'
import router, { resetRouter } from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    userInfo: {
        isAdmin: 0,
        userSalePriceType: 0,
        returnPriceType: 0
    }
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_ID: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
        setName(name)
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    USER_INFO: (state, data) => {
        state.userInfo = data
    }
}

const actions = {
    login({ commit }, obj) {
        return new Promise((resolve, reject) => {
            loginCheck(obj).then(res => {
                if (res.data.errorCode == 0) {
                    const { data } = res
                    let token = data.data || ''
                    commit('SET_TOKEN', token)
                    setToken(token)
                    resolve()
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            commit('SET_NAME', getName())
            getFuncData().then(res => {
                var roles = fetchRoles(res.data.data)
                if (!roles || roles.length <= 0) {
                    reject('roles must be a non-null array!')
                }
                commit('SET_ROLES', roles)
                resolve(roles)
                getIndexInfo(this.loginForm).then(res => {
                    const user = res.data.data.userInfo
                    sessionStorage.userInfo = JSON.stringify(user)
                    commit('USER_INFO', user || {})
                    commit('SET_NAME', user.userName)
                    commit('SET_AVATAR', 'https://panjiachen.gitee.io/vue-element-admin-site/home.png')
                    sessionStorage.taxFilingCategoryCode = user.taxFilingCategoryCode
                }).catch(err => {
                    console.log(err)
                })
            }).catch(error => {
                removeToken()
                reject(error)
            })
        })
    },
    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            toLogout().then(res => {
                removeToken()
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                sessionStorage.clear()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },
    getFuns({ commit }) {
        return new Promise(resolve => {
            getFuncData().then(res => {
                var roles = fetchRoles(res.data.data)
                commit('SET_ROLES', roles)
                resolve(roles)
            })
        })
    },
    // dynamically modify permissions
    changeRoles({ commit, dispatch }, role) {
        return new Promise(async resolve => {
            const token = role + '-token'
            commit('SET_TOKEN', token)
            setToken(token)
            const roles = await dispatch('getFuns')
            resetRouter()
            // generate accessible routes map based on roles
            const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
            // dynamically add accessible routes
            router.addRoutes(accessRoutes)
            // reset visited views and cached views
            dispatch('tagsView/delAllViews', null, { root: true })
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}