// 选择城市数据 的页面

const state = {
    city: '全国',
  }
  
  // 提交方法
  const mutations = {
    ChangeCity(state,cityinfo){
      state.city=cityinfo;
    },
  }
  
  // 请求
  const actions = {
  
  }
  
  export default {
    state,
    mutations,
    actions
  }
  