<template>
    <div class="wrap_contents" v-loading="loading"
				element-loading-text="疯狂登录中"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="mainlogin">
            <div class="loginlogo">
                <img src="../assets/image/logo3.png" >
            </div>
            <div class="main-input">
				<div>
					<el-tag class="tags"><i class="icon iconfont icon-denglu"></i></el-tag>
					<el-input class="input" placeholder="请输入用户名" ref="focname" type="text" id="name" maxlength="50" v-model="name"></el-input>
				</div>

				<div>
					<el-tag class="tags"><i class="icon iconfont icon-mima"></i></el-tag>
					<el-input class="input" type="password" id="pass" ref="focpwd" placeholder="请输入密码" maxlength="30" v-model="password"></el-input>
				</div>

				<div>
					<el-tag class="tags"><i class="icon iconfont icon-yanzhengma"></i></el-tag>
					<el-input placeholder="验证码" type="text" class="codetxt" ref="foccode" id="codetxt" maxlength="4" v-model="code" @keyup.enter.native="Login()"></el-input>
					<img v-bind:src="src" id="canvas" @click="RestGetCode" />
				</div>
				<el-button class="btnlogin" @click="Login">登&nbsp;录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  // import '../assets/js/canvas-nest.min.js'
	import md5 from 'js-md5'
  import unit from '../js/units'

  export default {
  name: 'Login',
  data () {
    return {
      name:'',
      password:'',
      code:'',
      loading:false,
      src:'/getValidateCode',
    }
  },
  methods: {

    // 登录验证方法
    IsLogin: function() {
      let  _this = this;
      let login_bool = true;
      if(!unit.IsEmpty(this.name)){
        _this.$message({
          message: '请输入用户名',
          type: 'warning'
        });
        this.$refs.focname.focus();
        login_bool = false;
      } else if(!unit.IsEmpty(this.password)){
        _this.$message({
          message: '请输入密码',
          type: 'warning'
        });
        this.$refs.focpwd.focus();
        login_bool = false;
      } else {
        login_bool = true
      }

      return login_bool;
    },

    // 登录函数
    Login: function(){      //登录
      // let _this = this;
      // let params = {
      //   username:this.name,
      //   password:md5(this.password),
      //   // password: this.password,
      //   code:this.code
      // };
      // if (_this.IsLogin()) {
      //   this.axios.post('/login', params)
      //     .then(function(res){
      //       let data = res.data;
      //       _this.loading = true;
      //       if(data.status === 1){
      //         _this.$message({
      //           message: '登录成功,即将跳转首页',
      //           type: 'success'
      //         });
      //         //存储当前登录用户
      //         sessionStorage.setItem('user',_this.name);
      //         setTimeout(function(){
      //           _this.loading = false;
      //           _this.$router.push({path: '/Home'});
      //         },600);
      //       } else if(data.status === 0){
      //         _this.code = '';
      //         setTimeout(function(){
      //           _this.$message({
      //             message: data.msg,
      //             type: 'warning'
      //           });
      //           _this.loading = false;
      //           _this.RestGetCode();
      //         },500);
      //       } else {
      //         _this.code='';
      //         setTimeout(function(){
      //           _this.loading = false;
      //           _this.$message({
      //             message: data.msg,
      //             type: 'warning'
      //           }, 500);
      //         if(data.status === 999){
      //           _this.code='';
      //           _this.RestGetCode();
      //           _this.$refs.foccode.focus();
      //         }
      //       },600);
      //     }
      //       }).catch(function (error) {
      //         console.log(error);
      //   });
      // }
      var _this=this;
       _this.$router.push({path: '/Home'});
    },

    // 更新验证码函数
    RestGetCode: function () {
      this.src = '/getValidateCode' + '?' + Math.random();
    }
  },
  mounted(){
    let _this = this;
    this.$refs.focname.focus();
  },
  }
</script>
<style lang="less">
  @import "../style/login.less";

</style>
