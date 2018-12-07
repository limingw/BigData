import Vue from 'vue'
import Router from 'vue-router'

// 引入页面
import Home from '@/views/Home.vue'
import Advert from '@/views/Advert.vue'
import User from '@/views/User.vue'
import Flow from '@/views/Flow.vue'
import PV from '@/views/PV.vue'
import Page from '@/views/Page.vue'
import Nozzle from '@/views/Nozzle.vue'
import Abnormal from '@/views/Abnormal.vue'
import Login from '@/views/Login.vue'

// 二级路由
import Collect from '@/components/PV/Collect.vue'
import Frequency from '@/components/PV/Frequency.vue'
import UserCollect from '@/components/User/UserCollect.vue'
import UserTag from '@/components/User/UserTag.vue'
import FlowCollect from '@/components/Flow/FlowCollect.vue'
import FlowDetail from '@/components/Flow/FlowDetail.vue'

// 分包加载
// const Home = () => import('@/views/Home.vue')
// const Advert = () => import('@/views/Advert.vue')
// const User = () => import('@/views/User.vue')
// const Flow = () => import('@/views/Flow.vue')
// const PV = () => import('@/views/PV.vue')
// const Page = () => import('@/views/Page.vue')
// const Nozzle = () => import('@/views/Nozzle.vue')
// const Abnormal = () => import('@/views/Abnormal.vue')
// const Login = () => import('@/views/Login.vue')
//
// const Collect = () => import('@/components/PV/Collect.vue')
// const Frequency = () => import('@/components/PV/Frequency.vue')
// const UserCollect = () => import('@/components/User/UserCollect.vue')
// const UserTag = () => import('@/components/User/UserTag.vue')
// const FlowCollect = () => import('@/components/Flow/FlowCollect.vue')
// const FlowDetail = () => import('@/components/Flow/FlowDetail.vue')


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'Login'
      },
      component: Login,
      children: [
        {
          path: '/Login',
          name: 'Login',
          component: Login
        }
      ]
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/Advert',
      name: 'Advert',
      component: Advert
    },
    {
      path: '/User',
      name: 'User',
      component: User,
      children: [
        {
          path: '/User/UserCollect',
          name: 'UserCollect',
          component: UserCollect
        },
        {
          path: '/User/UserTag',
          name: 'UserTag',
          component: UserTag
        }
      ]
    },
    {
      path: '/Flow',
      name: 'Flow',
      component: Flow,
      children: [
        {
          path: '/Flow/FlowCollect',
          name: 'FlowCollect',
          component: FlowCollect
        },
        {
          path: '/Flow/FlowDetail',
          name: 'FlowDetail',
          component: FlowDetail
        }
      ]
    },
    {
      path: '/PV',
      name: 'PV',
      component: PV,
      children: [
        {
          path: '/PV/Collect',
          name: 'Collect',
          component: Collect
        },
        {
          path: '/PV/Frequency',
          name: 'Frequency',
          component: Frequency
        }
      ]
    },
    {
      path: '/Page',
      name: 'Page',
      component: Page
    },
    {
      path: '/Nozzle',
      name: 'Nozzle',
      component: Nozzle
    },
    {
      path: '/Abnormal',
      name: 'Abnormal',
      component: Abnormal
    }
  ]
})
