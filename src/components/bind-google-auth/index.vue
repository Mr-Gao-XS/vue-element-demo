<template>
  <div class="c-setting-table-form" v-loading="formMixin_isLoading">
    <ul class="c-setting-tabs">
      <li>
        <h2>
          <span>1</span>
          安装完成后打开Google
          Authenticatior，点击右上角（安卓为左下角）的“+”，选择“手动输入验证码“，页面中填入您的账户名和下方的验证码或扫描条形码
        </h2>
        <div class="c-setting-qrcode" v-if="formMixin_form.qrcode">
          <img :src="formMixin_form.qrcode" alt="" />
        </div>
        <div class="validate-code">
          {{ formMixin_form.secret }}
          <el-button type="text" @click="copyTxt(formMixin_form.secret)">复制</el-button>
        </div>
      </li>
      <li>
        <h2>
          <span>2</span>
          添加成功后，您将得到一个有一定时效的6位数字验证码，请将该验证码填入下方的输入框中（需要在验证码时效内）
        </h2>
      </li>
    </ul>
    <el-form
      ref="formMixin_refForm"
      label-width="200px"
      :model="formMixin_form"
      :rules="cRules"
      @submit.native.prevent
      label-position="top"
    >
      <template v-if="step === 1">
        <el-form-item label="谷歌验证码" prop="code">
          <el-input v-model="formMixin_form.code" placeholder="请输入谷歌验证码"></el-input>
        </el-form-item>

        <el-form-item class="mt30 tar">
          <el-button @click.native="formMixin_handleCancelBtnClick" plain>取消</el-button>
          <el-button type="primary" plain @click.native="formMixin_handleSubmitBtnClick()">确认</el-button>
        </el-form-item>
      </template>
      <template v-else-if="step === 2">
        <h2>输入6位验证码</h2>
        <p>验证码已发送至{{ formMixin_form.email }}</p>
        <el-validate v-model="formMixin_form.auth_code"></el-validate>
        <div class="err-info" v-if="showErr">验证码有误请重新输入</div>
        <div class="btn-layer tar">
          <el-button plain @click.native="formMixin_handleCancelBtnClick">取消</el-button>
          <el-button type="primary" plain @click.native="formMixin_handleSubmitBtnClick(false)">完成</el-button>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script>
import formMixin from '@/mixins/TableAndForm/formMixin'

export default {
  data() {
    return {
      step: 1,
      showErr: false,
      formMixin_isLoading: true,
      formMixin_form: {
        id: '',
        type: 1,
        email: '',
        auth_code: '',
        code: '',
        secret: '',
        qrcode: ''
      }
    }
  },
  mixins: [formMixin],
  computed: {
    // 表单的校验规则
    cRules() {
      return {
        email: [
          {
            required: ['add'].indexOf(this.formMixinStatus) !== -1,
            message: '必填'
          },
          {
            pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            message: '请输入正确的邮箱地址'
          }
        ],
        code: [
          {
            required: ['add'].indexOf(this.formMixinStatus) !== -1,
            message: '必填'
          }
        ],
        weight: [
          {
            required: ['add'].indexOf(this.formMixinStatus) !== -1,
            message: '必填'
          },
          {
            pattern: /^\d{1,}$/,
            message: '请输入整数数字'
          }
        ]
      }
    }
  },
  methods: {
    // 修改表单获取数据
    formMixin_api_getItem(data) {
      return this.$get({
        url: '/tag/info',
        data
      })
    },
    formMixin_success_add(data) {
      if (this.step === 1) {
        this.step = 2
      } else {
        this.$emit('on-form-mixin-confirm', data)
        this.$message.success('绑定邮箱成功')
        this.formMixin_emitTableRefresh()
      }
    },
    // 表单新增接口
    formMixin_api_add({ code }) {
      let data = {
        code
      }
      return this.$fetch({
        method: 'POST',
        url: '/admin-user/bind',
        noDialog: true,
        data
      })
      // if (this.step === 1) {
      //   data.type = type
      //   return this.$fetch({
      //     method: 'POST',
      //     url: '/mch/send-code',
      //     noDialog: true,
      //     data
      //   })
      // } else {
      //   data = {
      //     auth_code,
      //     email
      //   }
      //   return this.$fetch({
      //     method: 'POST',
      //     url: '/mch/set-email',
      //     noDialog: true,
      //     data
      //   })
      // }
    },
    // 表单修改接口
    formMixin_api_up({ id, tag_name, weight, locked }) {
      let obj = {
        id,
        tag_name,
        weight,
        locked
      }
      return this.$fetch({
        method: 'PUT',
        noDialog: true,
        url: '/tag/modify',
        data: obj
      })
    },
    async getGoogleAuth() {
      this.formMixin_isLoading = true
      try {
        const res = await this.$get({
          url: '/admin-user/google-auth'
        })
        this.formMixin_isLoading = false
        this.formMixin_form.secret = this.$fp.get('secret', res)
        this.formMixin_form.qrcode = this.$fp.get('qrcode', res)
      } catch (error) {
        this.formMixin_isLoading = false
        this.formMixin_handleCancelBtnClick()
      }
    },
    copyTxt(txt) {
      if (this.$copy(txt)) {
        this.$message.success('复制成功')
      } else {
        this.$message.warning('复制失败')
      }
    }
  },
  created() {
    this.getGoogleAuth()
  }
}
</script>

<style lang="scss" scoped>
.c-setting-table-form {
  .c-setting-tabs {
    li {
      margin-bottom: 20px;
      h2 {
        line-height: 1.5;
        span {
          display: inline-block;
          width: 24px;
          height: 24px;
          color: #fff;
          text-align: center;
          line-height: 24px;
          border-radius: 50%;
          background: $B1;
        }
      }
      .validate-code {
        margin-top: 5px;
        font-size: 16px;
        background: #f7f7f7;
        text-align: center;
        border-radius: 4px;
      }
    }
  }
  .c-setting-qrcode {
    margin-top: 10px;
    text-align: center;
    img {
      width: 200px;
    }
  }
  h2 {
    font-size: 16px;
  }
  p {
    margin-top: 10px;
    font-size: 14px;
  }
  .btn-layer {
    margin-top: 60px;
  }
  .err-info {
    margin-top: 10px;
    padding-left: 60px;
    color: $error-color;
  }
}
.tar {
  text-align: right;
}
</style>
