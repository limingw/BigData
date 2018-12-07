<template>
    <div class="home">
      <div class="time">
        <span class="timer">{{user}},当前时间为：{{nowtime}}</span><hr>
      </div>
    </div>
</template>

<script>
  import '../../src/style/home.less'
  import LocalDataCities from '../js/City_data.js'
  export default {
    name: "Home",
    data () {
      return {
        nowtime:new Date().toLocaleString(),           //当前时间
        user:'欢迎',                       //当前登录用户
      }
    },
    //注册组件
    components: {

    },
    // 实时计算函数
    computed: {

    },

    // 静态方法
    methods: {
      
    },
    // 数据侦听属性
    watch: {

    },
    // 实例创建前生命周期钩子
    beforeCreate: function() {

    },
    // dom挂载前钩子
    created: function () {
      
    },
    // 实例挂载完成之前生命周期钩子
    beforeMount: function() {

    },
    // 实例挂载完成钩子函数
    mounted: function () {
      var _this=this;
			this.timer=setInterval(function(){
				_this.nowtime=new Date().toLocaleString();//修改date数据
      },1000);
      
      //获取当前登录用户名
      let username=sessionStorage.getItem('user');
      if(username===null||username===''){
        _this.user='请登录';
        return;
      }else{
        _this.user='欢迎'+username;
      }
    },
    // 实例更新前端生命周期钩子
    beforeUpdate: function() {

    },
    // 更新实例生命周期钩子
    updated: function () {

    },
    // 实例销毁之前的生命周期钩子
    beforeDestroy: function() {
      if(this.timer){
				clearInterval(this.timer);
			}
    },
    // 实例销毁函数钩子
    destroyed: function () {

    },
  }
</script>

<style scoped>

</style>
