import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import PvData from '../views/PvData.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'Home'
      },
      component: Home,
      children: [
        {
          path: '/Home',
          name: 'Home',
          component: Home
        }
      ]
    },
    {
      path: '/PvData',
      name: 'PvData',
      component: PvData
    }
  ]
})
