<template>
  <section class="p-layout">
    <aside class="p-layout-aside">
      <header class="logo">
        <router-link to="/index"> <img src="/static/images/logo.png" alt="" /> <span>BBS PAY</span> </router-link>
      </header>
      <SideMemu></SideMemu>
    </aside>
    <div class="p-layout-main">
      <header class="p-layout-main-header">
        <div class="header-left"></div>
        <div class="header-right">
          <el-dropdown @command="dropdownClick">
            <button class="Poptip-btn">
              <span class="ml10">{{ $fp.get('user.realname', userinfo) || '' }}</span>
              <i class="el-icon-arrow-down pop-arrow-down"></i>
              <img src="/static/images/avatar.png" class="poptip-btn-img" alt="" />
            </button>
            <el-dropdown-menu>
              <el-dropdown-item command="password"><el-icon type="modify" /><span>修改密码</span></el-dropdown-item>
              <el-dropdown-item command="google"><el-icon type="modify" /><span>绑定谷歌验证器</span></el-dropdown-item>
              <el-dropdown-item command="logout"><el-icon type="sign-out" /><span>退出</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </header>
      <el-scrollbar :noresize="true" :native="false" wrapClass="p-layout-main-body">
        <router-view />
      </el-scrollbar>
    </div>

    <!-- 修改密码 -->
    <el-dialog width="750px" :visible="isShowForm" :title="cFormTitle" :before-close="handleFormClose">
      <ResetPass
        v-if="isShowForm"
        :form-minxin-id="formId"
        :form-mixin-status="formStatus"
        :form-mixin-title="formTitle"
        @on-form-mixin-cancel="isShowForm = false"
        @on-form-mixin-confirm="isShowForm = false"
        @on-form-mixin-table-fefresh="finishResetPass"
      />
    </el-dialog>

    <el-dialog width="650px" :visible="isShowGoogle" title="谷歌验证器" :before-close="handleGoogleClose">
      <el-google-auth
        v-if="isShowGoogle"
        :form-minxin-id="formGoogleId"
        :form-mixin-status="formGoogleStatus"
        :form-mixin-title="formGoogleTitle"
        @on-form-mixin-cancel="isShowGoogle = false"
        @on-form-mixin-confirm="isShowGoogle = false"
        @on-form-mixin-table-fefresh="successBind"
      />
    </el-dialog>
  </section>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { SideMemu, ResetPass } from './components'

export default {
  name: '',
  components: { SideMemu, ResetPass },
  data() {
    return {
      isShowForm: false,
      formTitle: '',
      formStatus: 'add',
      formId: '',
      formGoogleStatus: 'add',
      isShowGoogle: false,
      formGoogleId: '',
      formGoogleTitle: ''
    }
  },
  computed: {
    ...mapState('basic', ['isMobile', 'userinfo', 'breadCrumbList', 'domain', 'language', 'userinfo']),
    cFormTitle() {
      return '修改密码'
    }
  },
  watch: {
    userinfo: {
      handler: function(val) {
        if (val && val.info && val.info.bind === 0) {
          this.isShowGoogle = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapActions('basic', [
      'DoLogout',
      'setShowUploadModal',
      'handleAccessToken',
      'AutoLogin',
      'SET_BREAD_CRUMB',
      'HandleSetDeviceType',
      'HandleSetDeviceScreen',
      'setLanguage'
    ]),
    async exit() {
      await this.DoLogout()
      this.$router.push('/login')
    },
    dropdownClick(name) {
      console.log(name, 222)
      if (name === 'userInfo') {
        this.$router.push({ name: 'userInfo' })
      } else if (name === 'password') {
        this.addApp()
      } else if (name === 'google') {
        this.isShowGoogle = true
        console.log(33333)
      } else {
        this.exit()
      }
    },
    handleFormClose() {
      this.isShowForm = false
    },
    handleGoogleClose() {
      this.isShowGoogle = false
    },
    addApp() {
      this.formStatus = 'add'
      this.isShowForm = true
    },
    finishResetPass() {
      this.handleAccessToken('')
      this.AutoLogin()
      this.$dialog({
        type: 'default',
        text: '操作成功',
        cancel: false
      })
    },
    successBind() {
      this.$message.success('绑定成功')
      this.AutoLogin()
    }
  },
  async created() {
    await this.AutoLogin()
  }
}
</script>
<style lang="scss" scoped>
$header-height: 50px;
$aside-width: 200px;

.p-layout {
  width: 100%;
  height: 100%;
  background: #f5f7f9;
  @include flex;
  .p-layout-aside {
    width: $aside-width;
    height: 100%;
    background-color: #373c4d;
    box-shadow: 6px 0px 16px 0px rgba(154, 167, 179, 0.2);
    .logo {
      a {
        display: block;
        width: 100%;
        font-size: 0;
        text-decoration: none;
        text-align: center;
        img {
          margin-top: 5px;
          margin-right: 10px;
          width: 40px;
        }
        span {
          display: inline-block;
          vertical-align: top;
          font-size: 22px;
          font-weight: bold;
          color: #067afe;
        }
      }
    }
  }
  .p-layout-main {
    height: 100%;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    background-color: #ebedf2;
    @include flex;
    .p-layout-main-header {
      padding-right: 30px;
      @include flex;
      .header-left {
        flex: 1;
      }
      .header-right {
        .Poptip-btn {
          height: 100%;
          background: none;
          border: none;
          cursor: pointer;
          outline: 0;
          @include flex-center;
          img {
            width: 26px;
            border-radius: 50%;
          }
        }
      }
    }
    /deep/.p-layout-main-body {
      flex: 1;
      overflow-x: hidden;
    }
  }
  header {
    position: relative;
    padding: 0;
    height: $header-height;
    line-height: $header-height;
    z-index: 3;
    background-color: #fff;
    box-shadow: 0px 6px 16px 0px rgba(154, 167, 179, 0.2);
    flex-shrink: 0;
    @include flex;
  }
}
</style>
