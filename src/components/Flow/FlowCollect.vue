<template>
  <div class="body">
    <!--查询-->
    <el-row class="offset_1 row_margin_bottom">
      <el-col :span="2">
          <el-tag type="info">日期</el-tag>
      </el-col>
      <el-col :span="4" :offset="1">
          <el-date-picker
          v-model="send.l_date"
          align="center"
          type="date"
          @change="ChangeTime"
          :clearable='false'
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="options.time_items">
          </el-date-picker>
      </el-col>

      <el-col :span="2" :offset="1">
        <el-tag type="info">流量方</el-tag>
      </el-col>
      <!--用户唯一ID-->
      <el-col :span="4" :offset="1">
        <el-input
          placeholder="请输入流量方flow_id"
          clearable v-model="send.flow_id">
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

    <!--数据表格-->
    <el-row class="row_table">
      <el-table
        :data="search_result"
        style="width: 100%"
        height="650px"
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
  import STATE from '../../js/constant.ts'
  import unit from '../../js/units.ts'

  export default {
    name: "FlowCollect",
    data () {
        return {
          options:{
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
                prop: 'pv_counts',
                label: 'PV',
                width: '150'
              },
              {
                prop: 'show_counts',
                label: '广告展示量',
                width: '150'
              },
              {
                prop: 'click_counts',
                label: '广告点击量',
                width: '150'
              },
              {
                prop: 'click_rate',
                label: '点击率',
                width: '150'
              },
              {
                prop: 'l_date',
                label: '日期',
                width: '150'
              }
            ]
          },
          send:{
            // 日期
            l_date:'',
            // 流量方flow_id
            flow_id:'',
            // 页码
            page_number:1,
            // 页面大小
            page_size: 16,
          },
          // 用来存放处理的数据，需要展示
          search_result: [

          ]
        }
    },
    created: function () {
      let _this = this;

    },
    mounted: function() {
      let _this = this;
      // 赋值快捷日期
      _this.options.time_items = unit.ObjectCopy(STATE.timeItem);
      // 初始化日期选择
      _this.DefaultTime();
      _this.Search();
    },
    methods:{
      ChangeTime: function() {
        this.Search();
      },
      Search: function(){                   //查询函数
        let _this=this;
        if(this.send.l_date !== ''){
          _this.axios.get('/api/flow_summary',{
            params: _this.send
          }).then(function (res) {
            let data = res.data;
            let temp_arr = [];
            data.data.map(function (item, index) {
              if (item._source.click_rate) {
                item._source.click_rate = (item._source.click_rate * 100).toFixed(2) + '%';
              } else {
                item._source.click_rate = Math.round(item._source.click_counts / item._source.show_counts * 10000) / 100.00 + "%";
              }
              temp_arr.push(item._source);
            });
            _this.search_result = temp_arr;
            _this.options.total = data.total;
          }).catch(function (err) {
            console.log(err);
            _this.send.page_number = 1;
          })
        }else{
          this.$message({
            message:'请选择查询的时间段',
            type:'warning'
          });
        }
      },
      Resetting: function(){
        // 重置函数
        let _this=this;
        _this.DefaultTime();
        _this.send.flow_id = '';
        _this.send. page_number = 1;
        _this.send.page_size = 16;
        _this.Search();
      },
      SizeChange: function(val){
        // 页数改变
        this.send.page_size = val;
        this.send.page_number = 1;
        this.Search();
      },
      CurrentChange: function(val){             //页码改变
        this.send.page_number = val;
        this.Search();
      },
      // 初始化时间
      DefaultTime: function () {
        let _this = this;
        //设置默认时间
        let day1 = new Date();
        // _this.send.l_date = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();

        _this.send.l_date = '2018-10-07';
      }
    },
  }
</script>

<style scoped>

</style>
