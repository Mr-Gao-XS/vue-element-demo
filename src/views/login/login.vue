<template>
  <div class="login-box">
    <div class="login-ad">
      <h1>BBS PAY管理后台</h1>
    </div>
    <div class="login-content" v-if="loginShowIndex === 0" v-loading="loading">
      <div class="logo">
        用户登录
      </div>
      <div class="login-form">
        <p class="error-info" v-if="fail"><el-icon type="warning"></el-icon>{{ errorInfo }}</p>
        <div class="login-item">
          <input type="text" placeholder="请输入用户名" maxlength="20" v-model="username" @keyup.enter="submit" />
          <el-icon type="username" />
        </div>
        <div class="login-item">
          <input type="password" placeholder="请输入密码" maxlength="20" v-model="password" @keyup.enter="submit" />
          <el-icon type="password" />
        </div>
        <div class="login-item" v-if="false">
          <input placeholder="请输入谷歌验证码" maxlength="6" v-model="code" @keyup.enter="submit" />
          <el-icon type="code" />
        </div>
        <div class="flex">
          <el-checkbox-group class="login-keep" v-show="false" v-model="savePassword">
            <el-checkbox value="true">记住登录信息</el-checkbox>
          </el-checkbox-group>
          <div class="forgot">
            <!-- <a href="javascript:;" @click="forgotPass">忘记密码</a> -->
          </div>
        </div>
        <el-button type="primary" round size="large" @click="submit">登录</el-button>
      </div>
      <div class="bot-tools" v-if="false">还未注册?<router-link to="/register">注册</router-link></div>
    </div>
    <div class="login-content" v-if="loginShowIndex !== 0" v-loading="loading">
      <div class="logo">
        登录
      </div>
      <div class="login-form">
        <p class="error-info" v-if="fail"><el-icon type="warning"></el-icon>{{ errorInfo }}</p>
        <template v-if="loginShowIndex === 1">
          <div class="login-item">
            <input type="text" placeholder="请输入验证码" maxlength="6" @keyup.enter="submitNow" v-model="code" />
            <el-icon type="code" />
          </div>
        </template>
        <template v-if="loginShowIndex === 2">
          <div class="login-item">
            <input
              type="password"
              placeholder="请输入密码"
              v-model="passwordnew"
              maxlength="20"
              @keyup.enter="submitNow"
            />
          </div>
          <div class="login-item">
            <input
              type="password"
              placeholder="再次输入密码"
              v-model="passwordconfirm"
              maxlength="20"
              @keyup.enter="submitNow"
            />
          </div>
        </template>
        <el-button
          type="primary"
          size="large"
          shape="circle"
          class="mt40"
          v-if="loginShowIndex === 1"
          @click.native="submitNow"
          >登录</el-button
        >
        <el-button
          type="primary"
          size="large"
          shape="circle"
          class="mt40"
          v-if="loginShowIndex === 2"
          @click.native="submitNow"
          >确认修改</el-button
        >
      </div>
      <div class="bot-tools" v-if="false">
        已有账号<a
          href="javascript:;"
          @click="
            loginShowIndex = 0
            clear()
          "
          >登录</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {},
  data() {
    return {
      username: '',
      password: '',
      vertifyCode: '',
      vertifyClick: false,
      times: 60,
      fail: false,
      forgotUrl: '/login/forgetpwd.json',
      getCodeUrl: '/login/getcode.json',
      resetUrl: '/login/setpwd.json',
      timer: null,
      mobile: '',
      passwordnew: '',
      passwordconfirm: '',
      savePassword: [],
      resetId: '',
      loginShowIndex: 0,
      remember: 0,
      loading: false,
      code: '',
      accept: false,
      errorInfo: '',
      token: ''
    }
  },
  watch: {
    savePassword(val) {
      val.length > 0 ? (this.remember = 1) : (this.remember = 0)
    }
  },
  methods: {
    ...mapActions('basic', ['DoLogin', 'AutoLogin', 'setMenu', 'handleAccessToken', 'handleLoginGoto']),
    clear() {
      this.fail = false
      this.username = ''
      this.mobile = ''
      this.vertifyCode = ''
      this.times = 60
      this.password = ''
      if (this.timer) {
        window.clearInterval(this.timer)
        this.timer = null
      }
      this.passwordnew = ''
      this.vertifyClick = false
      this.passwordconfirm = ''
      this.savePassword = []
    },
    forgotPass() {
      this.clear()
      this.loginShowIndex = 1
    },
    async checkGoogleAuth() {
      this.loading = true
      const res = await this.$post({
        url: '/login/check',
        data: {
          username: this.username
        }
      })
      if (res.accept) {
        this.accept = true
      } else {
        this.accept = false
      }
      this.loading = false
    },
    async resetPass() {
      if (!this.checkBeforeSubmit()) {
        return false
      }
      let obj = {
        phone: this.mobile,
        code: this.vertifyCode
      }
      let options = {
        url: this.forgotUrl,
        noDialog: true,
        data: obj
      }
      try {
        let res = await this.$post(options)
        this.resetId = res.msg
        let self = this
        self.loginShowIndex = 2
        self.clear()
        // Dialog({
        //   type: "default",
        //   text: "操作成功",
        //   cancel: false,
        //   onConfirm() {
        //     self.loginShowIndex = 2;
        //     self.clear();
        //   },
        //   onCancel() {
        //     self.loginShowIndex = 2;
        //     self.clear();
        //   }
        // });
      } catch (errMsg) {
        this.fail = true
        this.errorInfo = errMsg.data.msg
      }
    },
    async submitNow() {
      this.loading = true
      try {
        let res = await this.$post({
          url: '/login/google-auth',
          noDialog: true,
          data: { code: this.code, token: this.token }
        })
        this.loading = false
        if (res.access_token) {
          this.handleAccessToken(res.access_token)
          this.fail = false

          this.loading = false
          this.clear()
          this.handleLoginGoto(true)
          this.$router.push({ name: 'index' })
        } else {
          this.loading = false
          this.fail = true
          this.errorInfo = res
        }
      } catch (errMsg) {
        this.loading = false
        this.fail = true
        this.errorInfo = errMsg || '用户名或密码错误'
      }
    },
    checkMobile() {
      if (!/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.mobile)) {
        this.errorInfo = '请输入手机号码'
        this.fail = true
        return false
      }
      return true
    },
    checkBeforeSubmit(flag) {
      if (!flag) {
        let res = this.checkMobile()
        if (!res) {
          return res
        }
        if (this.vertifyCode === '') {
          this.errorInfo = '输入的验证码有误'
          this.fail = true
          return false
        }
      }
      if (flag) {
        if (!/^[A-Za-z0-9]{6,20}$/.test(this.passwordnew)) {
          this.errorInfo = '密码请输入6-20位英文数字'
          this.fail = true
          return false
        }
        if (this.passwordnew !== this.passwordconfirm) {
          this.errorInfo = '两次输入的密码不一致'
          this.fail = true
          return false
        }
      }
      return true
    },
    getVertifyCode() {
      if (!this.checkMobile()) {
        return false
      }
      let options = {
        url: this.getCodeUrl,
        noDialog: true,
        data: {
          phone: this.mobile
        }
      }
      this.vertifyClick = true
      let num = 60
      this.times = num
      let self = this
      this.$get(options)
        .then(() => {
          self.fail = false
          self.timer = window.setInterval(() => {
            if (num === 0) {
              window.clearInterval(self.timer)
              self.timer = null
              self.vertifyClick = false
            }
            num--
            self.times = num
          }, 1000)
        })
        .catch(errMsg => {
          self.fail = true
          self.errorInfo = errMsg.data.msg
          self.vertifyClick = false
        })
    },
    async submit() {
      let username = this.username.trim()
      let password = this.password.trim()
      if (!/^[A-Za-z0-9~!@#$%^&*_.-]{2,20}$/.test(username)) {
        this.errorInfo = '请输入2-20位英文数字或特殊字符'
        this.fail = true
        return false
      }
      if (!/^[A-Za-z0-9~!@#$%^&*_.-]{6,20}$/.test(password)) {
        this.errorInfo = '请输入6-20位英文数字或特殊字符'
        this.fail = true
        return false
      }

      this.loading = true
      try {
        // let res = await this.DoLogin({ remember, username, password, code: this.code })
        let res = await this.$post({
          url: '/login/index',
          noDialog: true,
          data: { username, password }
        })
        if (res.access_token) {
          this.handleAccessToken(res.access_token)
          this.fail = false

          this.loading = false
          this.clear()
          this.handleLoginGoto(true)
          this.$router.push({ name: 'index' })
        } else {
          this.token = res.token
          this.loading = false
          this.loginShowIndex = 1
        }
      } catch (errMsg) {
        this.loading = false
        this.fail = true
        this.errorInfo = errMsg || '用户名或密码错误'
      }
    }
  },
  mounted() {},
  created() {},
  activated() {
    this.clear()
  }
}
</script>

<style lang="scss">
html,
body {
  min-height: auto !important;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f8fa;
}
.login-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  box-shadow: 0 40px 40px rgba(219, 220, 223, 0.5);
  @media screen and (min-width: 750px) {
    height: auto;
  }
  background: #fff;
  .login-ad {
    display: none;
    @media screen and (min-width: 750px) {
      display: block;
      flex: 0 0 50%;
    }
    @media screen and (min-width: 970px) {
      flex: 0 0 62%;
    }
    min-height: 650px;
    background: url('/static/images/login.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    h1 {
      margin-top: 100px;
      font-size: 30px;
      color: #fff;
      text-align: center;
    }
  }
  .login-content {
    flex: 0 0 100%;
    @media screen and (min-width: 750px) {
      flex: 0 0 50%;
    }
    @media screen and (min-width: 970px) {
      flex: 0 0 38%;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 70px;
      text-align: center;
      img {
        width: 86px;
      }
    }
    .login-form {
      position: relative;
      width: 80%;
      @media screen and (min-width: 750px) {
        width: 60%;
      }
      margin: 0 auto;
    }
    .login-item {
      position: relative;
      padding-left: 37px;
      border-bottom: #e3e4e4 1px solid;
      input {
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        border: none;
        background: none;
        color: #354052;
        outline: none;
        caret-color: #1f96ee;
        &:focus + i {
          color: #1f96ee;
        }
        &::-webkit-input-placeholder {
          color: #c5ccd4;
        }
        &:-moz-placeholder {
          color: #c5ccd4;
        }
        &::-moz-placeholder {
          color: #c5ccd4;
        }
        &:-ms-input-placeholder {
          color: #c5ccd4;
        }
      }
      .bacctage-icon,
      .iconfont-more {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        color: #a6aab3;
      }
      .git-code {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .login-keep {
      display: block;
      margin: 20px 0 60px;
    }
    .el-button {
      width: 100%;
    }
  }
  .error-info {
    position: absolute;
    width: 100%;
    line-height: 34px;
    bottom: 100%;
    background: #fef3f3;
    border-radius: 4px;
    color: #f04040;
    i {
      margin: -2px 13px 0;
    }
  }
}
.bot-tools {
  margin-top: 80px;
  text-align: center;
  color: #cbd1d8;
  a {
    color: #1f96ee;
    margin-left: 10px;
  }
}
</style>
<style scoped lang="scss">
.login-box {
  position: relative;
}
.Loading {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%); /* IE 9 */
  -moz-transform: translateY(-50%); /* Firefox */
  -webkit-transform: translateY(-50%); /* Safari 和 Chrome */
  -o-transform: translateY(-50%); /* Opera */
}
.flex {
  display: flex;
  justify-content: flex-end;
  .forgot {
    margin-top: 20px;
    margin-bottom: 40px;
    a {
      color: #2d8cf0;
      background: transparent;
      text-decoration: none;
      outline: none;
      cursor: pointer;
      transition: color 0.2s ease;
    }
  }
}
.mt40 {
  margin-top: 40px;
}
</style>
