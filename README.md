# 后台
## 目录说明
### assets(静态资源、全局样式以及翻译文件等等)
1. libs/libs.js
   项目按需引入文件
2. locale多语言目录
3. scss全局样式文件
4. theme(element自定义样式)
### common(全局配置)
baseurl配置
### components(全局组件)
1. dialog(全局弹窗组件)
2. echarts(echarts组件)
3. icon(iconfont封装组件)
4. main(项目入口组件)
   - side-menu(左侧菜单拦)
   - main(项目路由入口)
5. switch(包含beforeChange)
6. table
    ```
        对element table组件的二次封装
    ```
7. upload-bar(upload进度)
### api(接口请求)
```
封装了4个方法用于请求

this.$get
    this.$get({
        url: 'xxxx',
        data: {}
    })
this.$post
    this.$post({
        url: 'xxxx',
        data: {}
    })
this.$put
    this.$put({
        url: 'xxxx',
        data: {}
    })
this.$del
    this.$del({
        url: 'xxxx',
        data: {}
    })

也可以使用 this.$fetch 进行请求
    this.$fetch({
        method: 'POST',
        url: 'xxxx',
        data: {}
    })
```
### mixins
1. TableAndForm
    - tableMixin(table操作的mixin封装)
    - formMixin(form操作的mixin封装)
2. echarts(echarts相关mixin)
3. globalMixin(全局Mixin,包含formattime等工具方法)
### views(页面目录)

## 打包说明
1. 正式服
    ```
    npm run build
    ```
1. 测试服
    ```
    npm run test
    ```