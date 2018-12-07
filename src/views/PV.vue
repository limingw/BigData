<template>
  <div class="pv">
    <div class="nav">
      <div class="router">
        <el-row>
          <el-col :span="2" :offset="1">
            <router-link to="/PV/Collect">
              <el-button type='primary'>
                汇 总
              </el-button>
            </router-link>
          </el-col>

          <el-col :span="2" :offset="1">
            <router-link to="/PV/Frequency">
              <el-button type='primary'>
                频次统计
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
  import '../../src/style/pv.less'
  export default {
    name: "PV",
    data() {
      return {

      }
    }
  }
</script>

<style scoped>

</style>
