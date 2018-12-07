<template>
    <div class="flow">
      <div class="nav">
        <div class="router">
          <el-row>
            <el-col :span="2" :offset="1">
              <router-link to="/Flow/FlowCollect">
                <el-button type='primary'>
                  汇 总
                </el-button>
              </router-link>
            </el-col>

            <el-col :span="2" :offset="1">
              <router-link to="/Flow/FlowDetail">
                <el-button type='primary'>
                  明 细
                </el-button>
              </router-link>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="pv-page">
        <router-view />
      </div>
    </div>
</template>

<script>
  export default {
    name: "Flow"
  }
</script>

<style scoped>

</style>
