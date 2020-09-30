import Vue from 'vue'
import Vuex from 'vuex'
import basic from '@/store/basic'
import router from './router'
import panel from './panel'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    basic,
    router,
    panel
  }
})
