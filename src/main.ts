import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router/index'
import axios from 'axios'
import store from './store/index'
import unit from './js/units'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.prototype.axios = axios;

// 引入公共css样式
import './assets/font/font_icon/iconfont.css'
import './style/reset.less'

// // 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//   let zht = unit.GetCookie('admin_info_zht');
//   if (!unit.IsEmpty(zht)) {
//     router.push('/login');
//     location.reload();
//   }
//   return response;
// }, function (error) {
//   // 对响应错误做点什么
//   return error;
// });

new Vue({
  store,
  router, // 使用路由
  render: h => h(App) // 挂载
}).$mount('#app')
