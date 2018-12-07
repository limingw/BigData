<template>
  <div class="body">
    <!-- 时间选择 -->
    <Date ref="my_date" v-on:get_day="GetDay" v-on:get_time="GetTime" />

    <!-- 区域定向 -->
    <el-row class="row_margin_bottom offset_1">
      <el-col :span="2">
        <el-tag type="info">区域定向</el-tag>
      </el-col>
      <el-col :span=14 :offset="1">
        <City ref="my_city" v-on:getstr="GetCity"></City>
      </el-col>
    </el-row>

    <!-- 流量筛选 -->
    <el-row class="row_margin_bottom offset_1">
      <el-col :span="2">
        <el-tag type="info">流量筛选</el-tag>
      </el-col>
      <el-col :span=4 :offset="1">
        <el-input
          v-model="send.flow_id"
          placeholder="请输入广告flow_id"
          clearable>
        </el-input>
      </el-col>

      <!--查询-->
      <el-col :span="2" :offset="1">
        <el-button type='primary' @click="Search">
          查询
        </el-button>
      </el-col>

      <!--重置-->
      <el-col :span="2" :offset="1">
        <el-button type='primary' @click="Resetting">
          重置
        </el-button>
      </el-col>
    </el-row>

    <div
      class="loading"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.2)">
      <!--数据表格-->
      <el-row class="row_table">
        <el-table
          :data="filter_result"
          style="width: 100%"
          height="480px"
          stripe
          border>
          <el-table-column
            v-for="item in options.tableItems"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            header-align="center"
            align="center">
          </el-table-column>
        </el-table>
      </el-row>
    </div>

    <!--分页-->
    <el-row class="row_pagin">
      <el-pagination class="pagin"
         @size-change="SizeChange"
         @current-change="CurrentChange"
         :current-page.sync="send.page_number"
         :page-sizes="options.page_sizes"
         :page-size="send.page_size"
         :pager-count="5"
         layout="total, sizes, prev, pager, next, jumper"
         :total="options.total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import STATE from '../../js/constant.ts'

  // 引入组件
  import Date from '../Date.vue'
  import City from '@/components/NewCity.vue'

  export default {
    name: "FlowDetail",
    components: {
      Date,
      City
    },
    data () {
      return {
        loading: false,
        options: {
          // 数据总数
          total:0,
          page_sizes: [16, 32, 64, 128, 256, 512],
          // 表格数据
          tableItems: [
            {
              prop: 'flow_id',
              label: '流量方flow_id',
              width: '150'
            },
            {
              prop: 'ad_id',
              label: '广告ID',
              width: '150'
            },
            {
              prop: 'show_count',
              label: '曝光量',
              width: '150'
            },
            {
              prop: 'click_count',
              label: '点击量',
              width: '150'
            },
            {
              prop: 'click_rate',
              label: '点击率',
              width: '150'
            },
            {
              prop: 'create_time',
              label: '时间',
              width: '150'
            }
          ]
        },
        send: {
          start_date: '',
          end_date: '',
          start_time: '',
          end_time: '',
          city: '',
          flow_id: '',
          page_size: 16,
          page_number: 1
        },
        // 用来存放处理的数据，需要展示
        search_result: []
      }
    },
    computed: {
      filter_result: function () {
        let _this = this;
        let number = _this.send.page_number;
        let size = _this.send.page_size;
        let min_number = size * (number - 1);
        let max_number = size * number;
        let temp = [];
        _this.search_result.map(function (item, index) {
          if (index > min_number && index <= max_number) {
            temp.push(item);
          }
        });
        return temp;
      }
    },
    mounted: function() {
      this.Search();
    },
    methods: {
      // 查看函数
      Search: function() {
        let _this = this;
        let send = _this.send;
        _this.loading = true;
        _this.axios.get('/api/flow_detail', {
          params: send
        }).then(function (res) {
            let data = res.data;
            console.log(data);
            let temp_arr = [];
            data.data.map(function (item, index) {
              item.click_count = Number.parseInt(item.click_count);
              item.show_count = Number.parseInt(item.show_count);
              if (item.click_count === 0) {
                item.click_rate = '0%';
              } else {
                item.click_rate = Math.round(item.click_count / item.show_count * 10000) / 100.00 + "%";
              }
              temp_arr.push(item);
            })

            _this.search_result = temp_arr;
            _this.options.total = temp_arr.length;
          _this.loading = false;
          }).catch(function (err) {
            _this.$message(err);
            _this.send.page_number = 1;
            _this.loading = false;
          })
      },
      // 重置函数
      Resetting: function() {
        let _this = this;
        _this.send.page_number = 1;
        _this.send.flow_id = '';

        _this.$refs.my_date.DefaultTime();
        _this.$refs.my_city.defaultCity();

        this.Search();
      },
      SizeChange: function(val) {
        this.send.page_size = val;
        this.send.page_number = 1;
      },
      CurrentChange: function(val) {
        this.send.page_number = val;
      },

      // 获取他日期
      GetDay: function(val) {
        let _this = this;
        if (val !== null && val !== '' && val.length > 0) {
          _this.send.start_date = val[0];
          _this.send.end_date = val[1];
          _this.send.page_number = 1;
        } else {
          _this.$message('时间错误，必选')
        }
      },
      // 获取他时间
      GetTime: function(val) {
        let _this = this;
        if (val !== null && val !== '' && val.length > 0) {
          _this.send.start_time = val[0];
          _this.send.end_time = val[1];
          _this.send.page_number = 1;
        } else {
          _this.send.start_time = '';
          _this.send.end_time = '';
        }
      },
      // 城市方法
      GetCity: function(val) {
        let _this = this;
        _this.send.city = val;
      },
      // // 初始化时间
      // DefaultTime: function(){
      //   let _this = this;
      //   _this.options.day = ['2018-10-07', '2018-10-07'];
      //
      //   // _this.options.day = unit.GetYesterdayTime(1);
      //   _this.options.time = unit.GetYesterdayTime(2);
      // },
    }
  }
</script>

<style scoped>

</style>
