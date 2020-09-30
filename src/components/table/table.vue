<template>
  <div class="c-table">
    <div class="c-table__wrap">
      <el-table
        v-loading.lock="tableLoading"
        ref="table"
        :data="tableData"
        :border="border"
        :size="size"
        :stripe="stripe"
        :height="height"
        :max-height="maxHeight"
        :fit="fit"
        :show-header="showHeader"
        :highlight-current-row="highlightCurrentRow"
        :current-row-key="currentRowKey"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :row-ket="rowKey"
        :empty-text="emptyText"
        :default-expand-all="defaultExpandAll"
        :expand-row-keys="expandRowKeys"
        :default-sort="defaultSort"
        :tooltip-effect="tooltipEffect"
        :show-summary="showSummary"
        :sum-text="sumText"
        :summary-method="summaryMethod"
        :style="tableStyle"
        @select="(selection, row) => emitEventHandler('select', selection, row)"
        @select-all="selection => emitEventHandler('select-all', selection)"
        @selection-change="selection => emitEventHandler('selection-change', selection)"
        @cell-mouse-enter="(row, column, cell, event) => emitEventHandler('cell-mouse-enter', row, column, cell, event)"
        @cell-mouse-leave="(row, column, cell, event) => emitEventHandler('cell-mouse-leave', row, column, cell, event)"
        @cell-click="(row, column, cell, event) => emitEventHandler('cell-click', row, column, cell, event)"
        @cell-dblclick="(row, column, cell, event) => emitEventHandler('cell-dblclick', row, column, cell, event)"
        @row-click="(row, event, column) => emitEventHandler('row-click', row, event, column)"
        @row-dblclick="(row, event) => emitEventHandler('row-dblclick', row, event)"
        @row-contextmenu="(row, event) => emitEventHandler('row-contextmenu', row, event)"
        @header-click="(column, event) => emitEventHandler('header-click', column, event)"
        @sort-change="args => emitEventHandler('sort-change', args)"
        @filter-change="filters => emitEventHandler('filter-change', filters)"
        @current-change="(currentRow, oldCurrentRow) => emitEventHandler('current-change', currentRow, oldCurrentRow)"
        @header-dragend="
          (newWidth, oldWidth, column, event) => emitEventHandler('header-dragend', newWidth, oldWidth, column, event)
        "
        @expand-change="(row, expanded) => emitEventHandler('expand-change', row, expanded)"
      >
        <slot name="prepend" />

        <template v-for="(column, columnIndex) in columns">
          <el-table-column
            :key="columnIndex"
            :column-key="column.columnKey"
            :prop="column.prop"
            :label="column.label"
            :fixed="column.fixed"
            :render-header="column.renderHeader"
            :sortable="column.sortable"
            :sort-by="column.sortBy"
            :sort-method="column.method"
            :resizable="column.resizable"
            :formatter="column.formatter"
            :show-overflow-tooltip="column.showOverflowTooltip"
            :align="column.align"
            :header-align="column.headerAlign || column.align"
            :class-name="column.className"
            :label-class-name="column.labelClassName"
            :selectable="column.selectable"
            :width="column.width"
            :reserve-selection="column.reserveSelection"
            :filters="column.filters"
            :filter-placement="column.filterPlacement"
            :filter-multiple="column.filterMultiple"
            :filter-method="column.filterMethod"
            :filtered-value="column.filteredValue"
            v-if="column.type === undefined"
          >
            <template slot-scope="scope">
              <span v-if="column.filter">
                {{ Vue.filter(column['filter'])(scope.row[column.prop]) }}
              </span>
              <span v-else-if="column.slotName">
                <slot :name="column.slotName" :row="scope.row" :$index="scope.$index" />
              </span>
              <span v-else-if="column.render">
                {{ column.render(scope.row) }}
              </span>
              <span v-else-if="column.formatter">
                {{ column.formatter(scope.row, scope.column, scope.row[column.prop], scope.$index) }}
              </span>
              <span v-else>
                {{ $fp.get(column.prop, scope.row) || '-' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column v-bind="column" :key="columnIndex" v-else></el-table-column>
        </template>
        <slot name="append" />
        <template slot="empty">
          <div class="c-table-no-data">
            <img src="/static/images/404.png" alt="" />
            <p>暂无数据</p>
          </div>
        </template>
      </el-table>
    </div>
    <div v-if="showPagination" style="" class="el-my-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :background="background"
        :current-page="pageIndex"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="paginationLayout"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import fp from 'lodash/fp'
import props from './props'

export default {
  name: 'Table',
  props,
  data() {
    return {
      loading: false
    }
  },
  computed: {
    tableData() {
      return fp.get('data', this) || []
    }
  },
  methods: {
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1))
    },
    handleSizeChange(val) {
      console.log(val)
      this.$emit('tableSizeChange', val)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.$emit('tablePageChange', val)
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.c-table {
  padding: 0 0 30px;
  width: 100%;
  background: #fff;
  .c-table__wrap {
    background: #fff;
    .c-table-no-data {
      margin: 30px 0;
      p {
        margin: 0;
        text-align: center;
        line-height: 1;
      }
    }
  }
  .el-my-pagination {
    margin-top: 30px;
    text-align: right;
    padding-right: 30px;
  }
}
</style>
