<template>
  <div>
    <div ref="dom" class="charts echarts-line"></div>
  </div>
</template>
<script>
// 引入柱状图
// import 'echarts/lib/chart/line';
// import store from '@/store'
//公共的属性和方法
import mixins from '@/mixins/echarts'

const commonOption = {
  grid: {
    top: '2%',
    left: 80,
    right: 50,
    bottom: 30
  },
  xAxis: {
    axisTick: {
      show: true
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      textBorderColor: '#7f8fa4',
      textBorderWidth: 0,
      interval: 0,
      rotate: 45,
      fontSize: 10
    },
    axisPointer: {
      show: true,
      label: {
        color: '#2a9ff6',
        backgroundColor: '#fff',
        shadowBlur: 0
        /*        padding: [-5, 7, 10, 7],*/
      },
      lineStyle: {
        color: '#2a9ff6'
      }
    }
  },
  yAxis: Array.from({ length: 2 }).map(() => ({
    type: 'value',
    min: 0,
    axisTick: {
      show: false
    },
    axisLine: {
      onZero: false,
      show: false,
      lineStyle: {
        color: '#7f8fa4'
      }
    },
    axisLabel: {
      textBorderColor: '#7f8fa4',
      textBorderWidth: 0,
      interval: 0
    },
    splitLine: {
      lineStyle: {
        color: '#f1f2f4',
        width: 1,
        opacity: 1
      }
    }
  })),
  series: ['#44c14a', '#EB4D44'].map(color => ({
    type: 'line',
    lineStyle: {
      color: color,
      width: 3
    },
    symbol: 'circle',
    symbolSize: 8,
    itemStyle: {
      color: color,
      borderWidth: 4,
      borderColor: '#FFFFFF'
    },
    emphasis: {
      itemStyle: {
        color: color,
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }
    },
    yAxisIndex: 0,
    smooth: true
  })),
  tooltip: {
    trigger: 'item',
    backgroundColor: '#ffffff',
    padding: [25, 70, 25, 25],
    borderColor: '#dfe2e6',
    borderWidth: 1,
    position: function(pos, params, dom, rect, size) {
      //高度  鼠标居中
      let obj = { top: pos[1] - size.contentSize[1] / 2 }
      // 左侧的时候在右侧离左边10，右侧的时候在左侧离10
      obj.left = +(pos[0] < size.viewSize[0] / 2) ? pos[0] + 10 : pos[0] - 10 - size.contentSize[0]
      return obj
    },
    textStyle: {
      color: '#354052'
    },
    extraCssText: 'box-shadow: 0 6px 16px 0px rgba(127, 143, 164, 0.15);border-radius: 4px;'
  }
}

export default {
  name: 'EChartsLine',
  mixins: [mixins],
  data() {
    return {
      commonOption
    }
  }
}
</script>
<style lang="scss">
.charts {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  //   min-height: 140px;
}
</style>
