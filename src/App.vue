<template>
  <div v-else id="app">
    <transition name="fade" class="islogin" v-if="is_login">
      <router-view />
    </transition>
    <div class="nologin" v-else>
      <div class="header" >
        <Header />
      </div>
      <div class="main">
        <div class="aside">
          <Broadside />
        </div>
        <div class="page">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  // 引入组件
  import Header from './components/Header'
  import Broadside from './components/Broadside'

  export default {
    name: 'App',
    data() {
      return {
        is_login: false
      }
    },
    // 注册组件
    components: {
      Header,
      Broadside
    },
    // dom挂载前钩子
    created(){

      let _this=this;
      let path = _this.$route.path;
      let bool = path === '/' || path === '/Login' || path === '/login';
      if (bool) {
        _this.is_login = true
      } else {
        _this.is_login = false
      }
    },
    methods: {

    },

    // 侦听函数
    watch: {
      $route(to,from) {
        let _this = this;
        let path = to.path;
        let bool = path === '/' || path === '/Login' || path === '/login';
        if (bool) {
          _this.is_login = true
        } else {
          _this.is_login = false
        }
      }
    }
  }
</script>

<style lang="less">
  @import "./style/App.less";
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
