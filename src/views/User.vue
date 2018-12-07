<template>
    <div class="user">
      <div class="nav">
        <el-row>
          <el-col :span="2" :offset="1">
            <router-link to="/User/UserCollect">
              <el-button type='primary'>
                汇 总
              </el-button>
            </router-link>
          </el-col>

          <el-col :span="2" :offset="1">
            <router-link to="/User/UserTag">
              <el-button type='primary'>
                用户标签
              </el-button>
            </router-link>
          </el-col>
        </el-row>
      </div>
      <div class="pv-page">
        <router-view />
      </div>
    </div>
</template>

<script>
  export default {
    name: "User"
  }
</script>

<style scoped>

</style>
