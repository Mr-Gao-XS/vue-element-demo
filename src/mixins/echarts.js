/**
 * @desc 用于echarts组件的公共方法
 */

// 引入 ECharts 主模块
// import echarts from 'echarts/lib/echarts';
// 引入提示框和标题组件
// import 'echarts/lib/component/tooltip';
import { mapState } from 'vuex'
import { assignDeep } from '@/utils'

export default {
  props: {
    /*==========charts的配置参数===========*/
    option: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    /*===================用于echarts的初始化============================*/
    init() {
      // eslint-disable-next-line no-undef
      this.dom = echarts.init(this.$el)
      this.$nextTick(() => {
        this.dom.setOption(assignDeep(true, {}, this.$data.commonOption, this.option))
      })
    },
    /*=================用于防止改变窗口大小时不停的触发resize方法导致dom高度结算错误=======================*/
    domChange() {
      // this.dom.resize()
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer)
      }
      this.resizeTimer = setTimeout(() => {
        this.dom.resize()
      }, 200)
    }
    /*===========用于重新渲染数据=========*/
  },
  data() {
    return {
      dom: null
    }
  },
  computed: {
    ...mapState('basic', ['screenWidth', 'screenHeight'])
  },
  watch: {
    screenWidth: function() {
      this.domChange()
    },
    screenHeight: function() {
      this.domChange()
    },
    option: {
      handler(newVal, oldVal) {
        if (this.dom) {
          if (newVal) {
            this.dom.setOption(assignDeep(true, {}, this.$data.commonOption, newVal), true)
          } else {
            this.dom.setOption(assignDeep(true, {}, this.$data.commonOption, oldVal), true)
          }
        } else {
          this.init()
        }
      },
      deep: true //对象内部属性的监听，关键。
    }
  },
  mounted() {
    this.init()
    this.domChange()
  }
}
