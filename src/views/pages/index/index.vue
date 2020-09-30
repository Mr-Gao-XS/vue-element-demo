<template>
  <section class="p-index">1111</section>
</template>

<script>
// import tableMixin from '@/mixins/TableAndForm/tableMixin'

export default {
  // mixins: [tableMixin],
  data() {
    return {}
  },
  computed: {},
  methods: {},
  created() {}
}
</script>

<style lang="scss" scoped>
.p-index {
  @include p(30, 30, 30, 30);
  .p-index__header {
    justify-content: center;
    @include flex;
    .c-index-card {
      &:nth-child(n + 2) {
        margin-left: 29px;
      }
    }
  }
  .p-index-container {
    margin-top: 30px;
    padding: 30px;
    background: #fff;
    border-radius: 4px;
    .p-index-container-header {
      @include flex-between-center;
    }
  }
}
</style>
