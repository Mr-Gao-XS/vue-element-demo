<!--
    Description:icon字体

    使用案例：
    参数	        说明	        类型	                可选值	                默认值
    type            icon的class     String                  -                       -
    size            icon的文字大小  Number,String                  -                       -
    color           icon的颜色      String                  -                       -

    事件：
    事件名称	        说明	                            回调参数
    click	            点击事件                            -
-->

<template>
  <i :class="classes" :style="styles" @click="handleClick"></i>
</template>
<script>
const prefixCls = 'bacctage-icon'
export default {
  name: 'Icon',
  props: {
    type: {
      type: String,
      default: ''
    },
    size: [Number, String],
    color: String,
    custom: {
      type: String,
      default: ''
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`bacctage-icon-${this.type}`]: this.type !== '',
          [`${this.custom}`]: this.custom !== ''
        }
      ]
    },
    styles() {
      let style = {}
      if (this.size) {
        style['font-size'] = `${this.size}px`
      }
      if (this.color) {
        style.color = this.color
      }
      return style
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event)
    }
  }
}
</script>
