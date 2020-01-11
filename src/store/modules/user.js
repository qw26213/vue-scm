import { loginCheck,getIndexInfo,getRoles,logout } from '@/api/user'
import { getToken, setToken, removeToken,setName,getName } from '@/utils/auth'
import { fetchRoles } from '@/utils/index'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
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
  }
}

const actions = {
  // user login
  login({ commit }, obj) {
    const { orgCode,userAccount, password } = obj
    return new Promise((resolve, reject) => {
      loginCheck({ orgCode: orgCode.trim(),userAccount:userAccount.trim(), password: password }).then(res => {
        if(res.data.errorCode==0){
          const { data } = res;
          let token = data.body||"";
          commit('SET_TOKEN', token)
          setToken(token)
          getIndexInfo(this.loginForm).then(res=>{
            var user = res.data.userInfo;
            commit('SET_NAME', user.userName)
            commit('SET_AVATAR', 'https://panjiachen.gitee.io/vue-element-admin-site/home.png')
          }).catch( err => {
              console.log(err);
          });
          resolve()
        }else{
          reject(res.data.msg)
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
      getRoles().then(res => {
        var roles = fetchRoles(res.data)
        const data = {name:'王小二',id:'123456'}
        const { name, id } = data
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_ID', id)
        resolve(roles)
      }).catch(error => {
        removeToken()
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
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

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

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
