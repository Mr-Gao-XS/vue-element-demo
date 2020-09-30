<template>
  <div class="charts echarts-bar"></div>
</template>
<script>
//公共的属性和方法
import mixins from '@/mixins/echarts'

const commonOption = {
  color: ['#44c14a', '#2a9ff6', '#ffbb44', '#8a5bf6', '#d25ee6', '#d18b4c', '#00c8dc', '#4ad8ae', '#eb4d44'],
  grid: {
    left: '30',
    top: '30',
    bottom: '30',
    right: '30',
    containLabel: true
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '50%'],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ],
  tooltip: {
    show: true,
    trigger: 'item',
    backgroundColor: '#ffffff',
    padding: 15,
    borderColor: 'rgba(68, 91, 113, 0.2)',
    borderWidth: 1,
    textStyle: {
      color: '#354052'
    },
    extraCssText: 'box-shadow: 0 6px 16px 0px rgba(127, 143, 164, 0.15);border-radius: 4px;'
  }
}

export default {
  name: 'EChartsPie',
  mixins: [mixins],
  data() {
    return {
      commonOption
    }
  }
}
</script>
<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 100%;
  flex: 1;
}
.s-home-web .charts {
  min-height: 130px;
}
</style>
