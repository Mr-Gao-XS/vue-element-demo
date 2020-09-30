<template>
  <div class="container">
    <p>
      <span class="text-overflow">{{ name }}</span>
      <span>（{{ cSize }}M）</span>
    </p>
    <el-progress :percentage="per" :stroke-width="4" color="#2A9FF6" class="w140" :show-text="false" />
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '证件照文件名'
    },
    btnUploadList: {
      type: Array
    },
    size: {
      type: [String, Number],
      default: '69.09'
    },
    per: {
      type: Number,
      default: 25
    }
  },
  computed: {
    cSize() {
      return (this.size / 1024 / 1024).toFixed(2)
    }
  },
  name: 'upload-bar'
}
</script>

<style lang="scss" scoped>
.container {
  width: 400px;
  height: 130px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 226, 230, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.w140 {
  width: 140px;
}
.text-overflow {
  width: 82px;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
}
</style>
