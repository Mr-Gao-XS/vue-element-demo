<template>
  <div class="charts echarts-bar"></div>
</template>
<script>
// 引入柱状图
// import 'echarts/lib/chart/bar';
//公共的属性和方法
import mixins from '@/mixins/echarts'

const commonOption = {
  color: ['#2a9ff6'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    backgroundColor: '#2a9ff6',
    /*    position: function (point, params, dom, rect, size) {
      return [point[0], 10];
    },*/
    extraCssText: 'box-shadow: 0 6px 16px 0px rgba(42, 159, 246, 0.15);border-radius: 4px;'
  },
  grid: {
    left: '10',
    top: '10',
    bottom: '1',
    right: '10',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        textBorderColor: '#7f8fa4',
        textBorderWidth: 0,
        interval: 0,
        rotate: 45
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false,
        length: 2
      },
      axisLabel: {
        textBorderColor: '#7f8fa4',
        textBorderWidth: 0
      }
    }
  ],
  series: [
    {
      type: 'bar',
      barWidth: '20',
      itemStyle: {
        barBorderRadius: 3
      },
      markLine: {
        label: {
          show: false
        }
      }
    }
  ]
}

export default {
  name: 'EChartsBar',
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
