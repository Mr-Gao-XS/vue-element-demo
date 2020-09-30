import fp from 'lodash/fp'

import { Message } from 'element-ui'
export default {
  props: {
    // 表单的id
    formMinxinId: {
      type: [String, Number],
      default: ''
    },
    // 表单的标题
    formMixinTitle: {
      type: String,
      default: ''
    },
    // 表单的状态add:新增,edit:编辑,details:详情
    formMixinStatus: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 表单loading的text
      formMixin_loadingText: {
        // 刷新中的提示
        get: `正在加载${this.formMixinTitle}`,
        // 更新中提示
        up: `正在更新${this.formMixinTitle}`,
        add: `正在添加${this.formMixinTitle}`
      },
      // 表单正忙
      formMixin_isLoading: false,
      // 表单的数据,请在组件里重写
      formMixin_form: {},
      // 从接口更新表单的时候是否是assign更新,避免接口返回的数据不全引起错误
      formMixin_form_assign: true,
      // 表单的校验规则,请在组件里重写
      formMixin_rules: {},
      // 表单更新的次数,不为0表示更新成功,此后每更新一次,次数加一(组件中的某些值要在这个时机更新，而又不适合使用监听器)
      formMixin_updateNums: 0
    }
  },
  mounted() {
    if (['edit', 'details', 'rank'].indexOf(this.formMixinStatus) !== -1) {
      this.formMixin_getItem()
    }
  },
  methods: {
    // 请求表单数据的接口
    formMixin_api_getItem() {
      throw new Error('必须在组件中实现 formMixin_api_getItem')
    },
    // 表单新增信息的接口
    formMixin_api_add() {
      throw new Error('必须在组件中实现 formMixin_api_submit')
    },
    // 表单修改的接口
    formMixin_api_up() {
      throw new Error('必须在组件中实现 formMixin_api_up')
    },
    // 请求表单数据的方法
    async formMixin_getItem() {
      this.formMixin_isLoading = true
      try {
        const res = await this.formMixin_api_getItem({
          id: this.formMinxinId
        })
        // const dataData = fp.get('data.data',res) || {};
        let _data = this.formMixin_dealData(res)
        const dataData = _data || {}
        if (this.formMixin_form_assign) {
          this.formMixin_form = {
            ...this.formMixin_form,
            ...dataData
          }
        } else {
          this.formMixin_form = dataData
        }
        // 表单更新计数器加1,表示表单更新完毕
        this.formMixin_updateNums++
      } catch (error) {
        // 请求不到数据就关闭表单,避免逻辑错误
        const timer = setTimeout(() => {
          this.$emit('on-form-mixin-confirm')
        }, 500)
        this.$once('hook:beforeDestroy', () => {
          clearTimeout(timer)
        })
      } finally {
        this.formMixin_isLoading = false
      }
    },
    // 表单数据处理
    formMixin_dealData(data) {
      return data
    },
    // 修改表单的方法
    async formMixin_up(params) {
      try {
        // 校验表单
        const flag = await this.$refs.formMixin_refForm.validate()
        console.log(2223)
        console.log(flag, 111)
        if (!flag) {
          throw 'form invalidate'
        }
        this.formMixin_isLoading = true
        // 请求接口
        // 该项目中所有的修改接口都不需要'add_time','edit_time',而this.formMixin_form中可能有这些字段
        await this.formMixin_api_up(params || fp.omit(['add_time', 'edit_time'], this.formMixin_form))
        // 触发修改成功事件
        this.$emit('on-form-mixin-confirm')
        this.formMixin_emitTableRefresh()
      } catch (error) {
        if (error !== 'form invalidate' && error !== false) {
          console.log(error)
          if (fp.get('data.msg.msg', error) && fp.get('data.msg.errno', error) === 20025) {
            Message.warning(fp.get('data.msg.msg', error))
          } else {
            Message.warning(fp.get('msg', error) || error || '修改失败,请稍候再试!')
          }
        }
        // this.$utils.fetchCatch(error);
      } finally {
        this.formMixin_isLoading = false
      }
    },
    // 表单新增的方法
    async formMixin_add(params) {
      try {
        // 校验表单
        const flag = await this.$refs.formMixin_refForm.validate()
        if (!flag) {
          throw 'form invalidate'
        }
        this.formMixin_isLoading = true
        // 请求接口
        // 该项目中所有的新增接口都不需要'_id'而this.formMixin_form中可能有这些字段
        let res = await this.formMixin_api_add(params || fp.omit(['_id'], this.formMixin_form))
        // 触发新增成功事件
        this.$emit('on-form-mixin-confirm', res)
        this.formMixin_emitTableRefresh()
      } catch (error) {
        console.log(error)
        if (error && error !== 'form invalidate') {
          Message.warning(fp.get('msg', error) || error || '新增失败,请稍候再试!')
        }
      } finally {
        this.formMixin_isLoading = false
      }
    },
    // 保存按钮的点击事件
    formMixin_handleSubmitBtnClick() {
      if (this.formMixinStatus === 'edit') {
        this.formMixin_up()
      } else if (this.formMixinStatus === 'add' || this.formMixinStatus === 'rank') {
        this.formMixin_add()
      }
    },
    // 取消按钮点击事件
    formMixin_handleCancelBtnClick() {
      this.$emit('on-form-mixin-cancel')
    },
    // emit表格刷新事件
    formMixin_emitTableRefresh() {
      this.$emit('on-form-mixin-table-fefresh')
    }
  }
}
