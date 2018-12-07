<template>
  <div id='app'>
    <!-- 顶部导航栏 -->
    <Header></Header>

    <input v-model='msg'>
    <p>msg: {{ msg }}</p>
    <p>computed msg: {{ computedMsg }}</p>
    <button @click='greet'>Greet</button>
    <router-view/>
  </div>
</template>

<script lang='ts'>
  // 入口APP.vue
  import Vue from 'vue'
  import Component from 'vue-class-component'

  // 引入组件
  import Header from './components/Header.vue'

  // 注册组件
  @Component({
    components: {
      Header
    }
  })
  export default class App extends Vue {
    // 初始化数据，data
    msg: number = 123

    // 声明周期钩子
    mounted () {
    }

    // 计算属性
    get computedMsg () {
      return 111 + this.msg
    }

     /* 方法 */
    greet () {
      console.log('greeting: ' + this.msg)
    }
  }

</script>

<style scoped>

</style>
