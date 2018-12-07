<template>
    <div class="usercollect">
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
        <!--open_id-->
        <el-col :span="2">
        <el-tag type="info">用户条件</el-tag>
        </el-col>

        <el-col :span="4" :offset="1">
          <el-input placeholder="请输入open_id"
                    clearable v-model="send.open_id"
                    ref="flowid">
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
        element-loading-background="rgba(0, 0, 0, 0.2)"
      >
        <!--数据表格-->
        <el-row class="row_table">
          <el-table
            :data="search_result"
            style="width: 100%"
            height="500px"
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
          :page-sizes=options.page_sizes
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
  import City from '../../components/NewCity'

    //用户数据汇总
  export default {
    name: "UserCollect",
    components: {
      Date,
      City
    },
    data () {
      return {
        loading: false,
        options:{
          // 表格列表
          tableItems:[
            {
              prop: 'open_id',
              label: '用户open_id',
              width: '150'
            },
            {
              prop: 'id',
              label: '用户唯一ID',
              width: '250'
            },
            {
              prop: 'type',
              label: '操作类型(展现或点击)',
              width: '150'
            },
            {
              prop: 'ad_id',
              label: '广告id',
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

        // 用来请求发送的对象
        send: {
          // 日期
          start_date: '',
          end_date: '',
          // 时间
          start_time: '',
          end_time: '',
          // 页码
          page_number: 1,
          // 输入的open_id
          open_id: '',
          // 页数
          page_size: 16,
          city: '全国'
        },

        // 用来存放处理的数据，需要展示
        search_result: []
      }
    },
    mounted: function() {
      let _this = this;
      _this.Search();
    },
    methods:{
      // 查询函数
      Search: function(){
        let _this = this;
        _this.loading = true;
        _this.axios.get('/api/user_summary', {
          params: _this.send
        }).then(function (res) {
          let data = res.data;
          let temp_arr = [];
          if (data.code === '1') {
            data.data.map(function (item, index) {
              temp_arr.push(item._source);
              _this.loading = false;
            });
            _this.search_result = temp_arr;
            _this.options.total = data.total;
          } else {
            _this.$message(data.msg);
            _this.loading = false;
          }
        }).catch(function (err) {
          let str = '获取user_summary用户汇总接口失败';
          _this.$message(str);
          _this.send.page_number = 1;
          _this.loading = false;
        });
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

      // 重置函数
      Resetting: function(){
        let _this = this;
        _this.options.open_id = '';
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
    },
  }
</script>

<style scoped lang="less">
 @import '../../style/user.less';

</style>
