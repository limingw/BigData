<template>
  <aside :class="[isCollapse?'minaside':'maxaside']">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo items"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse"
      router
    >
      <el-menu-item
        :index="item.link"
        v-for="item in items"
        :key="item.link" >
        <i :class="item.icon"></i>
        <span slot="title" class="menuspan">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script>
  /*
  * 大数据客户端的左侧边栏
  * */
  import STATE from '../js/constant'
  import unit from '../js/units'

  export default {
    name: "Broadside",
    data () {
      return {
        items: [                  //菜单列表

        ],
        isCollapse:false,           //菜单伸缩
      }
    },
    methods:{
      Collapse(){              //伸缩展开菜单
        if(this.isCollapse){
          this.isCollapse=false;
        }else{
          this.isCollapse=true;
        }
      },
    },
    created: function () {
      let _this = this;
      _this.items = unit.ArrayCopy(STATE.Aside);
    }
  }
</script>

<style scoped lang="less">
  @import "../style/broadside.less";
</style>
