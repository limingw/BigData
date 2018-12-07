<template>
    <div class="body">
      <!--时间选择-->
      <Date ref="my_date" v-on:get_day="GetDay" v-on:get_time="GetTime" />

      <!--区域定向-->
      <el-row class="row_margin_bottom offset_1">
        <el-col :span="2">
          <el-tag type="info">区域定向</el-tag>
        </el-col>
        <el-col :span="14" :offset="1">
          <City ref="my_city" v-on:getstr="GetCity"></City>
        </el-col>
      </el-row>

      <el-row class="row_margin_bottom offset_1">
        <!--用户唯一ID-->
        <el-col :span="2">
          <el-tag type="info">流量条件</el-tag>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-input placeholder="请输入flow_id"
          clearable v-model="send.flowId"
          ref="onlyuserid">
          </el-input>
        </el-col>

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

      <!--查询后的数据汇总-->
      <div class="row_total row_margin_bottom">
        <el-row class="total_content">
          <!--<el-col :span="4" :offset="1">-->
            <!--<span>信息汇总</span>-->
          <!--</el-col>-->
          <el-col :span="5" :offset="1">
            <span>所选时间内总曝光：{{search_collect.show_count}}</span>
          </el-col>
          <el-col :span="5" :offset="1">
            <span>所选时间内总点击：{{search_collect.click_count}}</span>
          </el-col>
          <el-col :span="4" :offset="2">
            <span>点击率：{{search_collect.click_rate}}</span>
          </el-col>
        </el-row>
      </div>

      <!--数据表格-->
      <el-row class="row_margin_bottom">
        <el-table
          :data="search_result"
          style="width: 100%"
          height="550px"
          stripe
          border
          :default-sort = "{prop: 'create_time', order: 'descending'}">
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
  // 引入组件
  import Date from '@/components/Date.vue'
  import City from '@/components/NewCity'

  export default {
    name: "Page",
    components: {
      Date,
      City
    },
    data () {
      return {
        options:{
          // 表格列表
          tableItems:[
            {
              prop: 'view_id',
              label: 'view_id',
              width: '150'
            },
            {
              prop: 'show_count',
              label: '展示次数',
              width: '250'
            },
            {
              prop: 'click_count',
              label: '点击次数',
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
            },
          ],
          // 分页总数
          total: 0,
          page_sizes: [ 16, 32, 64, 128, 256, 512 ]
        },
        // 发送数据
        send:{
          // 日期
          start_date: '',
          end_date: '',
          // 时间
          start_time: '',
          end_time: '',
          // 流量方ID
          flow_id:'',
          // 城市
          city: '全国',
          page_number: 1,         //页码
          page_size: 16,            //页数
        },

        // 用来存放处理的数据，需要展示
        search_result: [],
        // 汇总的对象
        search_collect: {
          show_count: 0,
          click_count: 0,
          click_rate: '0%',
        }
      }
    },
    mounted: function() {
      let _this = this;
      _this.Search();

      console.log(_this.search_result);
    },
    methods:{
      Search: function(){                   //查询函数
        let _this = this;
        _this.get_page_summary();
        _this.get_page_detail();
      },

      // 获取列表信息
      get_page_detail: function() {
        let _this = this;
        _this.axios.get('/api/page_detail', {
          params: _this.send
        }).then(function (res) {
          let data = res.data;
          if (data.code === '1') {
            let temp = [];
            data.data.map(function (item, index) {
              item.click_rate = item.click_rate = Math.round(item.click_count / item.show_count * 10000) / 100.00 + "%";
              temp.push(item);
            });
            _this.search_result = temp;
            _this.options.total = res.data.length;
          } else {
            _this.$message(data.msg);
          }
        }).catch(function (err) {
          let str = '获取get_page_detail失败';
          _this.$message(str);
          _this.send.page_number = 1;
        })
      },
      // 获取总信息
      get_page_summary: function() {
        let _this = this;
        _this.axios.get('/api/page_summary', {
          params: _this.send
        }).then(function (res) {
          let data = res.data;
          if (data.code === '1') {
            let temp = {
              show_count: data.data.show_count.value,
              click_count: data.data.click_count.value,
          }
            temp.click_rate = Math.round(temp.click_count / temp.show_count * 10000) / 100.00 + "%";
            _this.search_collect = temp;
          } else {
            _this.$message(data.msg);
          }
        }).catch(function (err) {
          let str = '获取page_summary失败';
          _this.$message(str);
        })
      },

      // 重置函数
      Resetting: function(){
        let _this = this;
        _this.options.flow_id = '';
        _this.options.page_number = 1;

        _this.$refs.my_date.DefaultTime();
        _this.$refs.my_city.defaultCity();

        _this.Search();
      },
      SizeChange: function(val){              //页数改变
        this.send.page_size = val;
        this.send.page_number = 1;
        this.Search();
      },
      CurrentChange: function(val){             //页码改变
        this.options.page_number = val;
        this.Search();
      },

      GetDay: function(val) {
        let _this = this;
        if (val !== null && val !== '' && val.length > 0) {
          _this.send.start_date = val[0];
          _this.send.end_date = val[1];
        } else {
          _this.$message('时间错误，必选')
        }
      },
      GetTime: function(val) {
        let _this = this;
        if (val !== null && val !== '' && val.length > 0) {
          _this.send.start_time = val[0];
          _this.send.end_time = val[1];
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
    },
  }
</script>

<style scoped lang="less">

</style>
