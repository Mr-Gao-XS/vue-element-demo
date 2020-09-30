import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import '@babel/polyfill'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/assets/scss/reset.scss'
import globalMixin from '@/mixins/globalMixin'
import '@/assets/libs/libs'
// import '@/assets/libs/against-cheating'

Vue.config.productionTip = false
Vue.mixin(globalMixin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
