<!--
    Author:hezhongyi
    Date:2018-11-19
    Description:提示弹窗组件
    使用案例：
    参数	        说明	        类型	                可选值	                默认值
    visible         是否显示弹窗    Boolean                 true/false              false
    model           是否显示蒙层    Boolean                 true/false              true
    text            提示的文本内容  String/Number           -                       -
    type            弹窗种类        String                  default/warning/error   -
    onConfirm	    点击确定之后触发
    onClose	        点击取消之后触发

-->
<template>
  <transition name="el-notification-fade">
    <div class="dialog-wrapper" v-show="visible" :style="wrapperStyles" :class="[isMobile ? 'mobile' : 'web']">
      <div role="dialog" aria-modal="true" aria-label="提示" class="el-dialog" v-if="!isMobile" key="web">
        <div class="el-dialog__close" @click="close">
          <Icon type="open" color="#354052" :size="10" class="close" />
        </div>
        <h1 v-if="title">{{ title }}</h1>
        <div class="el-dialog__header">
          <Icon type="warning" color="#fb4" :size="54" class="warning" v-if="type == 'warning'" />
          <Icon type="error" color="#f04040" :size="54" class="warning" v-if="type == 'error'" />
          <Icon type="common" color="#2198f0" :size="54" class="warning" v-if="type == 'default'" />
          <Icon type="success" color="#1BB934" :size="54" class="warning" v-if="type == 'success'" />
        </div>
        <div class="el-dialog__body" :class="{ 'text-left': textLeft }">
          <span>{{ text }}</span>
          <p v-if="subtext" :style="styleObj">{{ subtext }}</p>
          <p v-if="codeText" :style="styleObj">{{ codeText }}</p>
          <p v-for="(item, index) in list" :style="styleObj" :key="index">{{ item }}</p>
        </div>
        <div class="el-dialog__footer">
          <el-button @click.native="close" v-if="cancel">取消</el-button>
          <el-button
            type="primary"
            v-if="confirm"
            class="confirm"
            :class="{ ml40: cancel }"
            @click.native="confirmbtn"
            >{{ confirmTxt }}</el-button
          >
        </div>
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="提示"
        class="el-dialog-mobile"
        v-if="isMobile"
        key="mobile"
        :class="{
          'has-icon': icon,
          'has-cancel': cancel,
          'has-subtext': subtext
        }"
      >
        <div class="el-dialog__header" v-if="icon">
          <Icon type="warning" color="#fb4" class="warning" v-if="type == 'warning'" />
          <Icon type="error" color="#f04040" class="warning" v-if="type == 'error'" />
          <Icon type="common" color="#2198f0" class="warning" v-if="type == 'default'" />
          <Icon type="success" color="#1BB934" :size="54" class="warning" v-if="type == 'success'" />
        </div>
        <div class="el-dialog__body" :class="{ 'text-left': textLeft }">
          <p class="text">{{ text }}</p>
          <p class="subtext" v-for="(item, index) in list" :style="styleObj" :key="index">{{ item }}</p>
        </div>
        <div class="el-dialog__footer">
          <el-button @click.native="close" class="btn cancel" v-if="cancel">取消</el-button>
          <el-button class="btn confirm" @click.native="confirmbtn">{{ confirmTxt }}</el-button>
        </div>
        <div class="my-dialog__close" @click="close">
          <img src="/static/images/close.png" alt="" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import fp from 'lodash/fp'
import Icon from '_c/icon'
const components = {
  Icon
}
export default {
  name: 'ElDialog',
  components,
  data() {
    return {
      visible: false,
      modal: true,
      confirmTxt: '确认',
      text: '',
      type: 'default',
      cancel: true,
      confirm: true,
      icon: true,
      list: [],
      subtext: '',
      subtextColor: '',
      codeText: '',
      textLeft: false,
      isMobile: false,
      title: null,
      confirmNoClose: false
    }
  },
  computed: {
    wrapperStyles() {
      let styles = {}
      !this.modal && (styles.background = 'rgba(0,0,0,0)')
      return styles
    },
    styleObj() {
      return {
        color: this.subtextColor
      }
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        document.removeEventListener('keydown', this.keydown)
        this.$el.remove()
      }
    }
  },
  methods: {
    close() {
      this.visible = false

      if (typeof this.onCancel === 'function') {
        this.onCancel(this)
      }
    },
    confirmbtn() {
      if (!this.confirmNoClose) {
        this.visible = false
      }
      if (typeof this.onConfirm === 'function') {
        this.onConfirm(this)
      }
    },
    keydown(e) {
      if (e.keyCode === 27) {
        // esc关闭消息
        if (this.visible) {
          this.close()
        }
      }
    },
    resemd() {
      if (typeof this.onResend === 'function') {
        this.onResend(this)
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.keydown)
    this.isMobile = document.body.clientWidth < 768
    window.addEventListener(
      'resize',
      fp.throttle(200, () => {
        this.isMobile = document.body.clientWidth < 768
      })
    )
  }
}
</script>
<style scoped lang="scss">
.el-dialog__close {
  width: 40px;
  height: 40px;
  border-radius: 0px 4px 0px 0px;
  position: absolute;
  right: 0;
  top: 0;
}
.el-dialog__close:hover {
  background-color: #dc4b4b;
}
.el-dialog__close:hover /deep/ .s-icon {
  color: #fff !important;
}
.close {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}
.dialog-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 4001 !important;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s;
}
.el-dialog {
  width: 600px;
  min-height: 300px;
  background-color: #ffffff;
  box-shadow: 0px 6px 20px 0px rgba(154, 167, 179, 0.3);
  border-radius: 4px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2100;
}
.el-dialog__header {
  margin-top: 59px;
  text-align: center;
}
.el-dialog__body {
  text-align: center;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 1.4;
  letter-spacing: 0px;
  color: #354052;
  span {
    display: inline-block;
    margin-bottom: 15px;
    font-weight: bold;
    font-size: 18px;
    line-height: 1;
    color: #555;
  }
  p {
    margin: 0 0 10px;
    line-height: 1;
    font-size: 16px;
    color: #888;
  }
}
.el-dialog__footer {
  margin-top: 20px;
  text-align: center;
}
.ml40 {
  margin-left: 40px;
}

$v: 100vw/750;

.mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  &.dialog-wrapper {
    z-index: 100 !important;
  }

  .el-dialog-mobile {
    position: relative;
    width: rem(600);
    background-color: #fff;
    border-radius: rem(12);
    padding-bottom: rem(67);
    .my-dialog__close {
      position: absolute;
      top: rem(-127);
      right: 0;
      img {
        width: rem(66);
        height: rem(66);
      }
    }
  }
  .el-dialog__footer {
    height: rem(70);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: rem(70);
    .btn {
      width: rem(220);
      height: rem(70);
      font-size: rem(30);
      &:nth-child(2) {
        margin-left: rem(30);
      }
    }
    .confirm {
      color: #fff;
      border-left: none;
    }
    .cancel {
      color: #7f7f7f;
    }
  }
  .el-dialog__header {
    margin: rem(64);
    padding: 0;
    i {
      font-size: rem(70) !important;
    }
  }
  .el-dialog__body {
    padding: rem(29) 0 0;
    margin-top: 0;
    .text {
      font-size: rem(32);
      color: #323233;
      line-height: 1.6;
      font-weight: bold;
    }
    .subtext {
      margin: 0;
      font-size: rem(24);
      color: #808080;
      line-height: 1.5;
    }
  }
}
.web {
  .el-dialog__footer {
    margin-bottom: 54px;
  }
}
.text-left {
  line-height: 1.6;
  text-align: left;
  padding: 0 30px;
}
.el-notification-fade-enter.right {
  right: 0;
  transform: translateX(100%);
}

.el-notification-fade-enter.left {
  left: 0;
  transform: translateX(-100%);
}

.el-notification-fade-leave-active {
  opacity: 0;
}
h1 {
  margin-left: 24px;
  margin-top: 27px;
  font-size: 20px;
  font-weight: bold;
  color: #666;
}
.confirm {
  background: #298eff;
  color: #fff;
}
</style>
