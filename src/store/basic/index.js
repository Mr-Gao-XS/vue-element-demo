/**
 * @desc 保存全局信息
 * 用户名、权限等
 */
// eslint-disable-next-line camelcase
import { post, get } from '@/api'

const htmlEl = document.documentElement
const getBreadCrumbList = route => {
  return [route]
}
export default {
  namespaced: true,
  state: {
    isMobile: null,
    screenWidth: 0,
    screenHeight: 0,
    breadCrumbList: [],
    userinfo: null, // 用户信息
    menuType: 1,
    showUploadApp: false,
    appList: null,
    // 域名和静态资源路径
    domain: {},
    accessToken: '',
    loginGoto: false,
    store_underlying: null,
    language: 'zh'
  },
  getters: {},
  mutations: {
    SET_DEVICE_TYPE(state, value) {
      state.isMobile = value
    },
    SET_DEVICE_SCREEN(state) {
      state.screenWidth = htmlEl.clientWidth
      state.screenHeight = htmlEl.clientHeight
    },
    SET_BREAD_CRUMB(state, route) {
      state.breadCrumbList = getBreadCrumbList(route)
    },
    SET_USERINFO(state, payload) {
      state.userinfo = payload
    },

    SET_MENUTYPE(state, payload) {
      state.menuType = payload
    },
    CLEAR_USERINFO(state) {
      state.userinfo = null
    },
    SET_SHOW_UPLOAD_APP(state, val) {
      state.showUploadApp = val
    },
    SET_APP_LIST(state, val) {
      state.appList = val
    },
    SET_DOMAIN(state, val = {}) {
      state.domain = val
    },
    SET_ACCESS_TOKEN(state, val = '') {
      state.accessToken = val
    },
    SET_LOGIN_GOTO(state, val = false) {
      state.loginGoto = val
    },
    SET_STORE_UNDERLYING(state, data) {
      state.store_underlying = data
    },
    SET_LANGUAGE(state, val) {
      state.language = val
    }
  },
  actions: {
    HandleSetDeviceType({ commit }) {
      return commit('SET_DEVICE_TYPE', document.body.clientWidth < 768)
    },
    HandleSetDeviceScreen({ commit }) {
      return commit('SET_DEVICE_SCREEN')
    },
    AutoLogin: ({ commit }) =>
      new Promise((resolve, reject) => {
        get({
          url: '/admin-user/info',
          data: {}
        })
          .then(res => {
            resolve(res)
            console.log(res)
            commit('SET_USERINFO', res)
          })
          .catch(err => {
            return reject(err)
          })
      }),
    // eslint-disable-next-line no-unused-vars
    DoLogin: ({ commit }, data) =>
      new Promise((resolve, reject) => {
        console.log(data)
        post({ data, url: '/login/index', noDialog: true })
          .then(res => {
            resolve(res)
          })
          .catch(err => reject(err))
      }),
    DoLogout: ({ commit }) =>
      new Promise(resolve => {
        post({ url: '/login/logout' }).then(() => {
          sessionStorage.setItem('accessToken', '')
          commit('CLEAR_USERINFO')
          resolve()
        })
      }),
    setMenu: ({ commit }, data) => {
      commit('SET_MENUTYPE', data)
    },
    async fetchDomain({ commit }) {
      try {
        const res =
          (await get({
            url: '/app'
          })) || {}
        document.title = res.name
        commit('SET_DOMAIN', {
          domain: '',
          static: '',
          ...res
        })
      } catch (error) {
        console.log(error)
      }
    },
    handleAccessToken({ commit }, data) {
      sessionStorage.setItem('accessToken', data)
      commit('SET_ACCESS_TOKEN', data)
    },
    handleLoginGoto({ commit }, data) {
      commit('SET_LOGIN_GOTO', data)
    },
    store_setUnderlying({ commit }, data) {
      commit('SET_STORE_UNDERLYING', data)
    },
    setLanguage: ({ commit }, data) => {
      commit('SET_LANGUAGE', data)
    }
  }
}
