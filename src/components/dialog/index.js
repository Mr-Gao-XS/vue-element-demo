import Vue from 'vue'
import ElDialog from './src/component'

let DialogContructor = Vue.extend(ElDialog)

export const Dialog = function(options) {
  options = options || {}

  let instance = new DialogContructor({
    data: options
  })
  console.log(options)
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true
  instance.dom = instance.vm.$el
  instance.dom.style.zIndex = 1000

  return instance.vm
}

export default ElDialog
