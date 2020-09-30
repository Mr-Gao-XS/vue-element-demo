<template>
  <div>
    <el-form ref="formMixin_refForm" label-width="200px" :model="formMixin_form" :rules="cRules" @submit.native.prevent>
      <el-form-item label="状态" prop="locked">
        <el-switch v-model="formMixin_form.locked" :active-value="0" :inactive-value="1"></el-switch>
      </el-form-item>
      <el-form-item label="标签名称" prop="tag_name">
        <el-input class="w400" v-model="formMixin_form.tag_name" placeholder="请输入标签名称"></el-input>
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input class="w400" v-model="formMixin_form.weight" placeholder="请输入权重"></el-input>
      </el-form-item>
      <el-form-item class="mt30">
        <el-button type="primary" @click.native="formMixin_handleSubmitBtnClick">确定</el-button>
        <el-button @click.native="formMixin_handleCancelBtnClick">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import formMixin from '@/mixins/TableAndForm/formMixin'

export default {
  data() {
    return {
      formMixin_form: {
        id: '',
        locked: 1,
        tag_name: '',
        weight: '0'
      }
    }
  },
  mixins: [formMixin],
  computed: {
    // 表单的校验规则
    cRules() {
      return {
        tag_name: [
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
    // 表单新增接口
    formMixin_api_add({ tag_name, weight, locked }) {
      let data = {
        tag_name,
        weight,
        locked
      }
      return this.$fetch({
        method: 'POST',
        url: '/tag/add',
        noDialog: true,
        data
      })
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
