<template>
  <sn-menu
    :default-active="activeRoute"
    :router="true"
    text-color="#7f8fa4"
    active-text-color="#2d8cf0"
    background-color="#373c4d"
    accordion
    width="siderWidth"
    ref="sideMenu"
    :unique-opened="true"
    :default-openeds="['dataRecord']"
  >
    <template v-for="(item, index) in cMenuList">
      <Submenu :index="item.name" :key="index" v-if="item.children">
        <template slot="title">
          <sn-icon :type="item.icon" />
          <span>{{ item.title }}</span>
        </template>
        <sn-menu-item
          class="m-item-no-icon"
          v-for="(child, idx) in item.children"
          :key="idx"
          :name="child.name"
          :index="child.path"
          ><span>{{ child.title }}</span
          ><el-popover
            v-if="child.name === 'consumeRecord' && $fp.get('tips.withdraw', userinfo)"
            width="200"
            trigger="hover"
            content="当前申述数量"
            placement="right"
          >
            <div class="count" slot="reference">{{ $fp.get('tips.withdraw', userinfo) }}</div>
          </el-popover></sn-menu-item
        >
      </Submenu>
      <sn-menu-item v-else :key="index" :name="item.name" :index="item.path">
        <sn-icon :type="item.icon" />
        {{ item.title }}</sn-menu-item
      >
    </template>
  </sn-menu>
</template>

<script>
import { Icon } from '_c'
import { Menu, MenuItem, MenuItemGroup, Submenu } from 'element-ui'
import { mapState } from 'vuex'
const components = {
  'sn-icon': Icon,
  'sn-menu': Menu,
  'sn-menu-item': MenuItem,
  MenuItemGroup,
  Submenu,
  Icon
}

export default {
  name: 'sideMenu',
  components,
  data() {
    return {}
  },
  props: {
    siderWidth: {
      String,
      default: '200px'
    }
  },
  computed: {
    ...mapState('basic', ['userinfo', 'menuType', 'domain']),
    activeRoute() {
      return '/' + this.$route.name
    },
    cMenuList() {
      let list = [
        {
          title: '首页',
          icon: 'index',
          name: 'index',
          path: '/index'
        },
        // {
        //   title: '分类',
        //   icon: 'index',
        //   simulator: true,
        //   name: 'categories',
        //   path: '/categories'
        // }
        {
          title: '数据记录',
          icon: 'data',
          name: 'dataRecord',
          children: [
            {
              title: '消费记录',
              name: 'consumeRecord',
              path: '/consumeRecord'
            },
            {
              title: '充币记录',
              name: 'rechargeRecord',
              path: '/rechargeRecord'
            },
            {
              title: '提币记录',
              name: 'getCoinRecord',
              path: '/getCoinRecord'
            }
          ]
        },
        {
          title: '供应商管理',
          icon: 'superlier',
          name: 'supplierManage',
          path: '/supplierManage'
        },
        {
          title: '商户管理',
          icon: 'consume',
          name: 'vendorManage',
          path: '/vendorManage'
        },
        {
          title: '银行管理',
          icon: 'bank',
          name: 'bankManage',
          path: '/bankManage'
        },
        // {
        //   title: '权限管理',
        //   icon: 'authority',
        //   name: 'authority',
        //   children: [
        //     {
        //       title: '用户管理',
        //       name: 'userManage',
        //       path: '/userManage'
        //     },
        //     {
        //       title: '角色管理',
        //       name: 'roleManage',
        //       path: '/roleManage'
        //     }
        //   ]
        // },
        // {
        //   title: '操作记录',
        //   icon: 'opt',
        //   name: 'optRecord',
        //   path: '/optRecord'
        // },
        {
          title: '账号管理',
          icon: 'account',
          name: 'account',
          path: '/account'
        },
        {
          title: '系统设置',
          icon: 'setting',
          name: 'systemSetting',
          path: '/systemSetting'
        }
      ]
      return list
    }
  }
}
</script>
<style lang="scss" scoped>
.el-menu-item {
  display: flex;
  align-items: center;
  height: 48px;
  font-size: 14px;
  i {
    margin-right: 10px;
  }
  span {
    margin-left: 10px;
  }
  .count {
    width: 24px;
    height: 24px;
    color: #fff;
    background: $error-color;
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
  }
  &.is-active,
  &:hover {
    background: #494f61 !important;
    border: none;
    span {
      color: #2d8cf0;
    }
    &:after {
      display: none;
    }
  }
}
.el-menu {
  width: 100%;
  /deep/ .el-submenu__title {
    display: flex;
    align-items: center;
    height: 48px;
    span {
      margin-left: 10px;
    }
    &:hover,
    &:focus {
      background-color: #494f61;
      span,
      i {
        color: #2d8cf0;
      }
    }
  }
  /deep/ .el-submenu {
    &.is-active {
      .el-submenu__title {
        span,
        i {
          color: #d5e4f5;
        }
      }
    }
    .el-menu-item {
      padding-left: 46px !important;
    }
  }
}
/deep/ .el-menu-item-group__title {
  padding: 0;
}
</style>
