<template>
    <div class="body advert">
      <!--时间选择-->
      <Date ref="my_date" v-on:get_day="GetDay" v-on:get_time="GetTime" />

      <el-row class="row_margin_bottom offset_1">
        <!--区域定向-->
        <el-col :span="2">
          <el-tag type="info">区域定向</el-tag>
        </el-col>
        <el-col :span=14 :offset="1">
          <City ref="my_city" v-on:getstr="GetCity"></City>
        </el-col>
      </el-row>

      <!--查询条件-->
      <el-row class="row_margin_bottom offset_1">
        <el-col :span="2">
          <el-tag type="info">流量条件</el-tag>
        </el-col>

        <!--流量方选择-->
        <el-col :span="4" :offset="1">
          <el-select
            v-model="send.flow_id"
            filterable placeholder="请选择">
            <el-option
              v-for="item in filter_flows"
              :key="item.FlowId"
              :label="item.Name"
              :value="item.FlowId">
            </el-option>
          </el-select>
        </el-col>

        <!--广告id-->
        <el-col :span="4" :offset="1">
          <el-input
            placeholder="请输入广告ID"
            clearable v-model="send.ad_id"
            ref="adverid">
          </el-input>
        </el-col>
      </el-row>

      <el-row class="row_margin_bottom offset_1">
        <!--页面选择-->
        <el-col :span="2">
          <el-tag type="info">页面选择</el-tag>
        </el-col>

        <!--页面id-->
        <el-col :span="4" :offset="1">
          <el-input
            placeholder="请输入页面ID"
            clearable
            v-model="send.view_id"
            ref="pageid">
          </el-input>
        </el-col>

        <!--查询-->
        <el-col :span="2" :offset="1">
          <el-button type='primary' @click="DisposeSearch">
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

      <!--数据表格-->
      <div class="loading"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.2)">
        <el-row class="row_table">
          <el-table
            :data="filter_result"
            style="width: 100%"
            height="550px"
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
  import STATE from '../js/constant.ts'
  import unit from '../js/units'
  import City from '../components/NewCity'
  import Date from '../components/Date'

  // 配置文件
  import adClass from '../js/adClass.json'

  export default {
    name: "Advert",
    components: {
      City,
      Date
    },
    data () {
      return {
        loading: false,
        send:{
          start_date: '',
          end_date: '',
          start_time: '',
          end_time: '',
          // 选择的流量方Id
          flow_id: '',
          // 选择的页面id
          view_id: '',
          // 广告ID
          ad_id:'',
          //页码
          page_number:1,
          //页数
          page_size: 16,
          // 城市
          city: '全国'
        },

        // 展示的状态
        options: {
          city_code: '010',
          //分页总数
          total: 0,
          // 表头列表
          page_sizes: [ 16, 32, 64, 128, 256, 512 ],
          //广告数据表头
          tableItems:[
            {
              prop:'ad_id',
              label:'广告ID',
              width:'150',
            },
            {
              prop:'ad_type',
              label:'广告类型',
              width:'150',
            },
            {
              prop:'show_count',
              label:'展示次数',
              width:'150',
            },
            {
              prop:'click_count',
              label:'点击次数',
              width:'150',
            },
            {
              prop:'click_rate',
              label:'点击率',
              width:'150',
            },
            {
              prop:'create_time',
              label:'时间',
              width:'150',
            },
          ]
        },

        // 流量方
        flows: [
          {
            CurPv: 99,
            FlowId: "1334a",
            LastPv: 23,
            Link: "",
            Name: "测试1",
            Shield: null
          }
        ],

        // 用来存放处理的数据，需要展示
        search_result: []
      }
    },

    // 计算属性
    computed: {
      filter_flows: function () {
        let _this = this;
        let a = [];
        a.push({
          CurPv: 0,
          FlowId: "",
          LastPv: 0,
          Link: "",
          Name: "全部流量方",
          Shield: null
        });
        return a.concat(_this.flows);
      },

      filter_result: function () {
        let _this = this;
        let number = _this.send.page_number;
        let size = _this.send.page_size;
        let min_number = size * (number - 1);
        let max_number = size * number;
        let temp = [];
        _this.search_result.map(function (item, index) {
          if (index > min_number && index <= max_number) {
            if (adClass.json_list[item.ad_type - 1]) {
              item.ad_type = adClass.json_list[item.ad_type - 1];
            }
            temp.push(item);
          }
        });
        return temp;
      }
    },
    // 挂载完成
    mounted: function() {
      let _this = this;
      _this.options.page_sizes = unit.ArrayCopy(STATE.PAGE_SIZE);
      _this.DisposeSearch();
    },

    //静态方法
    methods:{
      // 将查询回来的参数进行处理
      DisposeSearch: function(data) {
        let _this = this;
        let temp_arr = [];
        _this.Search().then(function (res) {
          if (res.code === '1') {
            res.data.map(function (item, index) {
              item.click_count = Number.parseInt(item.click_count);
              item.show_count = Number.parseInt(item.show_count);
              if (item.click_count === 0) {
                item.click_rate = '0%';
              } else {
                item.click_rate = Math.round(item.click_count / item.show_count * 10000) / 100.00 + "%";
              }
              temp_arr.push(item);
            });
            _this.search_result = temp_arr;
            _this.options.total = res.data.length;
            _this.loading = false;
          } else if (res.code === '10000') {
            let msg = '查询范围过大，请重新选择搜索范围!';
            _this.$message({
              message: msg,
              type: 'warning'
            });
            _this.loading = false;
          } else {
            _this.$message(res.msg);
            _this.loading = false;
          }
        }).catch(function (error) {
          let str = '获取ad_data接口失败';
          _this.$message(str);
          _this.send.page_number = 1;
          _this.loading = false;
        })
      },

      // 查询函数, 异步返回结果
      Search: function(){
        let _this = this;
        let send = _this.send;
        _this.loading = true;
        return new Promise(function (resolve, reject) {
          // 接口调用
          _this.axios.get('/api/ad_data', {
            params: send
          })
            .then(function (res) {
              resolve(res.data);
            })
            .catch(function (err) {
              reject(err);
            })
        })
      },
      // 重置函数
      Resetting: function(){
        let _this = this;
        _this.send.ad_id = '';
        _this.send.view_id = '';
        _this.send.page_number = 1;

        _this.$refs.my_date.DefaultTime();
        _this.$refs.my_city.defaultCity();

        _this.Search();
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
      // 页数改变
      SizeChange: function(val){
        this.send.page_size = val;
        this.send.page_number = 1;
      },
      //页码改变
      CurrentChange: function(val){
        this.send.page_number = val;
      },
    },

  }
</script>

<style scoped>

</style>
