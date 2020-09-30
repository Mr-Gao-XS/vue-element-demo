import Vue from 'vue'

// element引用
import {
  Button,
  Popover,
  Menu,
  Radio,
  RadioButton,
  RadioGroup,
  CheckboxGroup,
  Checkbox,
  Submenu,
  MenuItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  MenuItemGroup,
  Select,
  Option,
  Pagination,
  Table,
  TableColumn,
  Switch,
  Dialog,
  Loading,
  Form,
  FormItem,
  Input,
  Tabs,
  TabPane,
  Tree,
  DatePicker,
  upload,
  Progress,
  Image,
  Icon,
  Tag,
  Col,
  inputNumber,
  Message,
  Scrollbar,
  Steps,
  Step
} from 'element-ui'

Vue.use(Button)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Popover)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tree)
Vue.use(upload)
Vue.use(DatePicker)
Vue.use(Progress)
Vue.use(Image)
Vue.use(Tag)
Vue.use(Col)
Vue.use(Icon)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(inputNumber)
Vue.use(Loading.directive)
Vue.use(Scrollbar)
Vue.use(Steps)
Vue.use(Step)
Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message

// 自写组件
import { Icon as MyIcon, uploadBar, Dialog as MyDialog, Table as MyTable, Switch as MySwitch, BindGoogleAuth } from '_c'
Vue.component('el-icon', MyIcon)
Vue.component('el-upload-bar', uploadBar)
Vue.component('el-my-table', MyTable)
Vue.component('el-my-switch', MySwitch)
Vue.component('el-google-auth', BindGoogleAuth)
Vue.prototype.$dialog = MyDialog

// api请求
import { get, post, put, del } from '@/api'
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$put = put
Vue.prototype.$del = del

import fetch from '@/api/fetch'
Vue.prototype.$fetch = fetch

// 工具方法

// 第三方方法
import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

import fp from 'lodash/fp'
Vue.prototype.$fp = fp

import copy from 'copy-text-to-clipboard'
Vue.prototype.$copy = copy

import calc from 'js-calculation'
Vue.prototype.$calc = calc
