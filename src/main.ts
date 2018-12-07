import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

Vue.config.productionTip = false

// 引入公共css样式
import './style/reset.less'

new Vue({
  router, // 使用路由
  render: h => h(App) // 挂载
}).$mount('#app')
