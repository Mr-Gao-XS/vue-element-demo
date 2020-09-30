import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import { Message } from 'element-ui'

import { LoadingBar } from '_c'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
router.beforeEach((to, from, next) => {
  //   LoadingBar.start()
  //   Message.closeAll()
  next()
})

router.afterEach(() => {
  //   LoadingBar.finish()
  window.scrollTo(0, 0)
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
