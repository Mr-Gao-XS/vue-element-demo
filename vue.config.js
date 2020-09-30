const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const BASE_URL = process.env.NODE_ENV === 'production' ? './' : '/'

module.exports = {
  publicPath: BASE_URL,
  lintOnSave: true,
  assetsDir: 'static',
  //   outputDir: 'buildDir/dist',
  transpileDependencies: [
    'element-ui',
    'copy-text-to-clipboard',
    'vue-i18n',
    'better-calc',
    'lodash',
    'js-calculation'
  ], // 需要编译的依赖包名
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'BBS PAY'
      return args
    })

    config.resolve.alias.set('@', resolve('src')).set('_c', resolve('src/components'))
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
  },
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  configureWebpack:
    process.env.NODE_ENV === 'production'
      ? {
          optimization: {
            minimizer: [
              new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                  compress: {
                    drop_console: true,
                    drop_debugger: true
                  }
                }
              })
            ]
          }
        }
      : {},
  devServer: {
    proxy: {
      '/server': {
        // target: 'http://admin.okpay.com',
        // target: 'http://kz.downok.cn',
        target: 'http://192.168.2.103:8033',
        // target: 'http://testapi.pc.goitw.com',
        changeOrigin: true,
        pathRewrite: {
          '/server': '/'
          // '/server': '/api'
        }
      }
    }
  }
}

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [path.resolve(__dirname, './src/assets/scss/variable.scss')]
    })
}
