/**
 * @desc 保存控制面板信息
 * 权限控制
 */

export default {
  namespaced: true,
  state: {
    store_panel_robot_form: {}
  },
  getters: {},
  mutations: {
    SET_STORE_PANEL_ROBOT_FORM(state, data) {
      state.store_panel_robot_form = { ...data }
    }
  },
  actions: {
    store_setPanelRobotForm({ commit }, data) {
      commit('SET_STORE_PANEL_ROBOT_FORM', data)
    }
  }
}
