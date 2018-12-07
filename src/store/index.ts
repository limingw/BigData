import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 导入状态
import pv from './modules/pv'
import options from './modules/options'
import status from './modules/status'

export default new Vuex.Store ({
  modules: {
    options,
    status
  }
})
