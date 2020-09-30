<template>
  <div class="p-categories">
    <div class="p-categories__header">
      <div class="p-categories-header__left">
        <el-button type="primary">刷新</el-button>
        <el-button type="primary" @click="tableMixin_openAddForm">添加</el-button>
      </div>
      <div class="p-categories-header__right"></div>
    </div>
    <Table
      :data="tableMixin_tableData"
      :columns="cColumns"
      :tableLoading="tableMixin_isLoading"
      :pageIndex="tableMixin_query.page"
      :pageSize="tableMixin_query.row"
      :total="tableMixin_total"
      @tableSizeChange="handlePageSizeChange"
      @tablePageChange="handlePageChange"
    >
      <template slot-scope="{ row }" slot="status">
        <i-switch
          :true-value="0"
          :false-value="1"
          v-model="row.locked"
          :beforeChange="value => handleBeforeStatusChange({ value, row })"
        ></i-switch>
        <!-- <el-switch></el-switch> -->
      </template>
      <template slot-scope="{ row }" slot="opt">
        <el-button size="mini" @click="tableMixin_openEditForm({ id: row.id })">编辑</el-button>
        <el-button size="mini" @click="tableMixin_delTableItem({ id: row.id })" v-if="row.locked !== 0">删除</el-button>
      </template>
    </Table>
    <el-dialog
      width="750px"
      :visible="tableMixin_isShowForm"
      :title="tableMixin__cFormTitle"
      :before-close="tableMixin_HandleFormClose"
    >
      <TableForm
        v-if="tableMixin_isShowForm"
        :form-minxin-id="tableMixin__formId"
        :form-mixin-status="tableMixin__formStatus"
        :form-mixin-title="tableMixin__formTitle"
        @on-form-mixin-cancel="tableMixin_isShowForm = false"
        @on-form-mixin-confirm="tableMixin_isShowForm = false"
        @on-form-mixin-table-fefresh="tableMixin_getTableData"
      />
    </el-dialog>
  </div>
</template>

<script>
import tableMixin from '@/mixins/TableAndForm/tableMixin'
import { Table, Switch } from '_c'
import TableForm from './components/TableForm'

export default {
  components: {
    Table,
    'i-switch': Switch,
    TableForm
  },
  mixins: [tableMixin],
  data() {
    return {
      tableMixin_query: {},
      tableMixin_loadingText: {
        delConfirmText: '是否确定删除该标签？'
      }
    }
  },
  computed: {
    cColumns() {
      return [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '标签名称',
          prop: 'tag_name'
        },
        {
          label: '状态',
          slotName: 'status'
        },
        {
          label: '权重',
          prop: 'weight'
        },
        {
          label: '资源数',
          prop: 'total_num'
        },
        {
          label: '操作',
          prop: 'addr',
          headerAlign: 'center',
          width: '160',
          align: 'center',
          slotName: 'opt'
        }
      ]
    }
  },
  methods: {
    // 获取表格数据的接口
    tableMixin_api_getTableData(data = {}) {
      console.log('tableMixin_api_getTableData')
      let _data = {
        page: data.page,
        row: data.row
      }
      return this.$get({
        url: '/tag/list',
        data: _data
      })
    },
    // 状态改变事件
    async handleBeforeStatusChange({ row, value }) {
      const self = this

      try {
        // 表格忙碌
        self.tableMixin_isLoading = true
        // 请求关闭
        await this.$fetch({
          method: 'PUT',
          url: '/tag/lock' + `?id=${row.id}`,
          data: {
            id: row.id,
            operation: value === 0 ? 'lock' : 'unlock'
          }
        })
        // 表格不忙碌,很重要,否则self.tableMixin_getTableData不执行
        self.tableMixin_isLoading = false
        await self.tableMixin_getTableData()
      } catch (error) {
        console.log(error)
      } finally {
        self.tableMixin_isLoading = false
      }

      // 这里永远返回false
      return false
    },
    // 删除表格数据的接口
    tableMixin_api_delTableItem({ id }) {
      return this.$fetch({
        method: 'DELETE',
        noDialog: true,
        url: `/tag/remove?id=${id}`,
        data: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.p-categories {
  padding: 30px;
  .p-categories__header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    .p-categories-header__left {
      display: flex;
      .el-input {
        margin-left: 10px;
      }
    }
  }
}
</style>
