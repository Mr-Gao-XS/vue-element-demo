<template>
  <div id="app" v-cloak>
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import fp from 'lodash/fp'

export default {
  methods: {
    ...mapActions('basic', [
      'handleAccessToken',
      'fetchDomain',
      'HandleSetDeviceType',
      'HandleSetDeviceScreen',
      'setLanguage'
    ])
  },
  created() {
    let lang = localStorage.getItem('language') || 'en'
    console.log(lang)
    this.setLanguage(lang)
    // let token = sessionStorage.getItem('accessToken') || ''
    // this.handleAccessToken(token)
    // this.fetchDomain()
  },
  mounted() {
    window.addEventListener(
      'resize',
      fp.throttle(200, () => {
        this.HandleSetDeviceType()
        this.HandleSetDeviceScreen()
      }),
      false
    )
    window.addEventListener('load', () => {
      this.HandleSetDeviceType()
      this.HandleSetDeviceScreen()
    })
  }
}
</script>

<style lang="scss">
[v-cloak] {
  display: none;
}

@media (min-width: 560px) {
  html {
    font-size: 54px;
  }
}
@mixin size {
  width: 100%;
  height: 100%;
}
html,
body {
  @include size;
  overflow: auto;
  margin: 0;
  padding: 0;
}
#app {
  @include size;
}
input[type='number'] {
  -moz-appearance: textfield;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
