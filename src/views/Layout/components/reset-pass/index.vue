<template>
  <div class="c-reset-pass-form" v-loading="formMixin_isLoading">
    <el-form ref="formMixin_refForm" label-width="200px" :model="formMixin_form" :rules="cRules" @submit.native.prevent>
      <el-form-item label="原密码" prop="password">
        <el-input v-model="formMixin_form.password" type="password" placeholder="请输入原密码" class="w400"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="passwordNew">
        <el-input
          v-model="formMixin_form.passwordNew"
          type="password"
          placeholder="请输入新密码"
          class="w400"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="passwordConfirm">
        <el-input
          v-model="formMixin_form.passwordConfirm"
          type="password"
          placeholder="请输入新密码"
          class="w400"
        ></el-input>
      </el-form-item>

      <el-form-item class="mt30 tar">
        <el-button @click="formMixin_handleCancelBtnClick">取消</el-button>
        <el-button type="primary" @click="formMixin_handleSubmitBtnClick()">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import formMixin from '@/mixins/TableAndForm/formMixin'

export default {
  name: 'resetPass',
  mixins: [formMixin],
  data() {
    return {
      formMixin_form: {
        password: '',
        passwordNew: '',
        passwordConfirm: ''
      }
    }
  },
  computed: {
    // 表单的校验规则
    cRules() {
      return {
        password: [
          {
            required: ['add'].indexOf(this.formMixinStatus) !== -1,
            message: '必填'
          },
          {
            pattern: /^[A-Za-z0-9~!@#$%^&*_.-]{6,20}$/,
            message: '请输入6-20位英文数字或特殊字符'
          }
        ],
        passwordNew: [
          {
            required: ['add'].indexOf(this.formMixinStatus) !== -1,
            message: '必填'
          },
          {
            pattern: /^[A-Za-z0-9~!@#$%^&*_.-]{6,20}$/,
            message: '请输入6-20位英文数字或特殊字符'
          }
        ],
        passwordConfirm: [
          {
            required: ['add'].indexOf(this.formMixinStatus) !== -1,
            message: '必填'
          },
          {
            validator: (rule, value, callback) => {
              if (this.formMixin_form.passwordNew !== value) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  watch: {},
  methods: {
    // 表单新增接口
    formMixin_api_add({ password, passwordNew, passwordConfirm }) {
      let data = {
        old_password: password,
        new_password: passwordNew,
        confirm_password: passwordConfirm
      }
      return this.$post({
        url: '/admin-user/reset-password',
        noDialog: true,
        data
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
