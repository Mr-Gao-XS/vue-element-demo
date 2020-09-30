<template>
  <div class="charts echarts-bar"></div>
</template>
<script>
// import 'echarts/lib/chart/bar';
// import 'echarts/map/js/china.js';
//公共的属性和方法
import mixins from '@/mixins/echarts'
const commonOption = {
  tooltip: {
    trigger: 'item',
    backgroundColor: '#ffffff',
    padding: 15,
    borderColor: 'rgba(68, 91, 113, 0.2)',
    borderWidth: 1,
    textStyle: {
      color: '#354052'
    },
    extraCssText: 'box-shadow: 0 6px 16px 0px rgba(127, 143, 164, 0.15);border-radius: 4px;'
  },
  series: [
    {
      type: 'map',
      mapType: 'china',
      roam: false,
      //鼠标没有选中前地图的样式
      itemStyle: {
        areaColor: '#e3eaf0',
        borderColor: 'transparent'
      },
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      //鼠标选中后地图的样式
      emphasis: {
        itemStyle: {
          areaColor: '#2a9ff6'
        }
      }
    }
  ],
  grid: {
    left: '10',
    top: '10',
    bottom: '1',
    right: '10',
    containLabel: true
  },
  visualMap: {
    text: ['High', 'Low'],
    realtime: false,
    calculable: false,
    //show:false,
    inRange: {
      color: ['#e3eaf0', '#94cffa', '#2a9ff6']
    }
  }
}
export default {
  name: 'EChartsMap',
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
  //   min-height: 100%;
}
</style>
