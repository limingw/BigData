<template>
    <!-- 时间组件 -->
  <div class="date">
    <!--时间选择-->
    <el-row class="row_margin_bottom offset_1">
      <el-col :span="2">
        <el-tag type="info">日期</el-tag>
      </el-col>
      <el-col :span="6" :offset="1" class="eltime">
        <el-date-picker
          v-model="options.day"
          type="daterange"
          :picker-options="options.time_items"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getDay"
          align="center"
          :clearable=false
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :span="2" :offset="1" >
        <el-tag type="info">时间</el-tag>
      </el-col>
      <el-col :span="5" :offset="1" class="eltime">
        <el-time-picker
          is-range
          @change="getTime"
          v-model="options.time"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          value-format="HH:mm:ss"
          :default-value="options.time"
        >
        </el-time-picker>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import unit from '../js/units'

  export default {
    name: "Date",
    data () {
      return {
        options: {
          // 日期
          day: [],
          // 时间
          time: [],
          //公共日期时间段快捷选择
          time_items: {
            disabledDate(time) {
              return time.getTime() > (Date.now() - 3600 * 1000 * 24)
            },
            shortcuts: [
              {
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              },
              {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              },
              {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }
            ]
          },
        }
      }
    },
    created: function() {

    },

    mounted: function () {
      let _this = this;
      _this.DefaultTime();
    },

    methods: {
      // 得到日期
      getDay: function() {
        this.$emit('get_day', this.options.day);
      },

      // 得到时间
      getTime: function() {
        this.$emit('get_time', this.options.time);
      },

      // 初始化时间
      DefaultTime: function(){
        let _this = this;
        _this.options.day = ['2018-10-07', '2018-10-07'];

        // _this.options.day = unit.GetYesterdayTime(1);
        _this.options.time = unit.GetYesterdayTime(2);

        _this.getDay();
        _this.getTime();
      },
    }
  }
</script>

<style scoped>

</style>
