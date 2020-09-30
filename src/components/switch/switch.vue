<template>
  <span tabindex="0" :class="wrapClasses" @click="toggle" @keydown.space="toggle">
    <input type="hidden" :name="name" :value="currentValue" />
    <span :class="innerClasses">
      <slot name="open" v-if="currentValue === trueValue"></slot>
      <slot name="close" v-if="currentValue === falseValue"></slot>
    </span>
  </span>
</template>
<script>
// import { oneOf } from '@/utils/assist'
// import Emitter from '@/mixins/emitter'

const prefixCls = 'ivu-switch'

export default {
  name: 'iSwitch',
  // mixins: [Emitter],
  props: {
    value: {
      type: [String, Number, Boolean],
      default: false
    },
    trueValue: {
      type: [String, Number, Boolean],
      default: true
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      validator(value) {
        return ['large', 'small', 'default'].indexOf(value) !== -1
      },
      default() {
        return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size
      }
    },
    name: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    beforeChange: {
      type: Function
    },
    rowData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-checked`]: this.currentValue === this.trueValue,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-loading`]: this.loading
        }
      ]
    },
    innerClasses() {
      return `${prefixCls}-inner`
    }
  },
  methods: {
    async toggle(event) {
      event.preventDefault()
      if (this.disabled || this.loading) {
        return false
      }
      if (this.beforeChange && typeof this.beforeChange == 'function') {
        let status
        if (this.rowData) {
          status = await this.beforeChange.apply(this, [
            this.currentValue === this.trueValue ? this.falseValue : this.trueValue,
            this.rowData
          ])
        } else {
          status = await this.beforeChange.apply(this, [this.currentValue])
        }
        if (status == false) return false
      }
      const checked = this.currentValue === this.trueValue ? this.falseValue : this.trueValue

      this.currentValue = checked
      this.$emit('input', checked)
      this.$emit('on-change', checked)
      this.dispatch('FormItem', 'on-form-change', checked)
    }
  },
  watch: {
    value(val) {
      if (val !== this.trueValue && val !== this.falseValue) {
        throw 'Value should be trueValue or falseValue.'
      }
      this.currentValue = val
    }
  }
}
</script>
<style scoped>
.ivu-switch {
  display: inline-block;
  min-width: 44px;
  height: 22px;
  line-height: 20px;
  border-radius: 22px;
  vertical-align: middle;
  border: 1px solid #ccc;
  background-color: #ccc;
  position: relative;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;
}
html .ivu-switch-checked {
  border: 1px solid #2198f0;
  background-color: #2198f0;
}

.ivu-switch-inner {
  color: #fff;
  font-size: 12px;
  margin-left: 23px;
  margin-right: 8px;
}
.ivu-switch-inner i {
  width: 12px;
  height: 12px;
  text-align: center;
  position: relative;
  top: -1px;
}
.ivu-switch-checked .ivu-switch-inner {
  left: 7px;
}
.ivu-switch:after {
  content: '';
  width: 18px;
  height: 18px;
  border-radius: 18px;
  background-color: #fff;
  position: absolute;
  left: 1px;
  top: 1.5px;
  cursor: pointer;
  transition: left 0.2s ease-in-out, width 0.2s ease-in-out;
}
.ivu-switch:active:after {
  width: 26px;
}
.ivu-switch:before {
  content: '';
  display: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: transparent;
  position: absolute;
  left: 3px;
  top: 3px;
  z-index: 1;
  border: 1px solid #2198f0;
  border-color: transparent transparent transparent #2198f0;
  animation: switch-loading 1s linear;
  animation-iteration-count: infinite;
}
.ivu-switch:focus {
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  outline: 0;
}
.ivu-switch:focus:hover {
  box-shadow: none;
}
.ivu-switch-checked:after {
  left: 23px;
}
.ivu-switch-loading {
  opacity: 0.4;
}
.ivu-switch-loading:before {
  display: block;
}
.ivu-switch-checked .ivu-switch-inner {
  left: 7px;
}
.ivu-switch-checked:after {
  left: 23px;
}

.ivu-switch-checked:before {
  left: 25px;
}

.ivu-switch-checked:active:after {
  left: 15px;
}

.ivu-switch-disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.ivu-switch-disabled:after {
  background: #fff;
  cursor: not-allowed;
}

.ivu-switch-disabled .ivu-switch-inner {
  color: #fff;
}

.ivu-switch-disabled.ivu-switch-checked {
  border-color: #2198f0;
  background-color: #2198f0;
  opacity: 0.4;
}
.ivu-switch-disabled.ivu-switch-checked:after {
  background: #fff;
}

.ivu-switch-disabled.ivu-switch-checked .ivu-switch-inner {
  color: #fff;
}
@keyframes switch-loading {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
