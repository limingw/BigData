<template>
  <header class="container">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#fff">
      <el-menu-item index="1">
        消息中心
      </el-menu-item>

      <el-menu-item index="2">
        更改密码
      </el-menu-item>
      <el-tooltip class="item" effect="dark" :content="user" placement="top">
        <el-menu-item index="3" @click="LoginOut">安全退出</el-menu-item>
      </el-tooltip>
    </el-menu>

  </header>
</template>

<script>
  /*
  * 大数据客户端的顶部导航栏
  * */
  export default {
    name: "Header",
    data () {
      return {
        activeIndex:'1',
        user:'当前用户：',
      }
    },
    //静态方法
    methods:{
      // 退出登录
      LoginOut: function () {
        let _this = this;
        this.$confirm('此操作将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
          setTimeout(function () {
            _this.$router.push('/login')
          }, 100)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消注销登录'
          });
        });

      }
    },
    mounted(){
      let _this=this;
      //获取当前登录用户名
      let username=sessionStorage.getItem('user');
      if(username===null||username===''){
        _this.user='请登录';
        return;
      }else{
        _this.user='当前用户：'+username;
      }
    },
  }
</script>

<style scoped lang="less">
  @import "../style/header.less";
</style>
