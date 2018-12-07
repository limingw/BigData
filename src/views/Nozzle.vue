<template>
    <div class="nozzle">
      <!--时间选择-->
      <el-row class="row_search offset_1 row_margin_bottom">
        <el-col :span="2">
          <el-tag type="info">时间段</el-tag>
        </el-col>
        <el-col :span="8" :offset="1" class="eltime">
          <el-date-picker
            v-model="send.time"
            type="datetimerange"
            :picker-options="recieve.timeItem"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
            :clearable='false'
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-col>
      </el-row>

      <!--区域定向-->
      <el-row class="row_margin_bottom offset_1">
        <el-col :span="2">
          <el-tag type="info">区域定向</el-tag>
        </el-col>
        <el-col :span="6" :offset="1">
          <City></City>
        </el-col>

        <el-col :span="5" :offset="1">
          <el-select v-model="recieve.select"
            placeholder="请选择用户"
            @change="SelectChange">
            <el-option
              v-for="item in recieve.selectItem"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="2" :offset="1">
          <el-button type='primary' @click="Search">
            查询
          </el-button>
        </el-col>

        <!--重置-->
        <el-col :span="2" :offset="1">
          <el-button type='primary' @click="Reset">
            重置
          </el-button>
        </el-col>

        <el-col :span="2" class="btnfloat_right">
          <el-button type='primary' @click="DownLoad">
            下载明细
          </el-button>
        </el-col>
      </el-row>

      <!--数据表格-->
    <el-row class="row_table">
      <el-table
        :data="recieve.tableData"
        style="width: 100%"
        height="660px"
        stripe
        border
        :default-sort = "{prop: 'create_time', order: 'descending'}">
        <el-table-column 
          header-align="center"
          align="center"
          prop="open_id"
          label="用户open_id">
        </el-table-column>
        <el-table-column 
          header-align="center"
          align="center"
          prop="id"
          label="用户唯一ID">
        </el-table-column>
        <el-table-column 
          header-align="center"
          align="center"
          prop="view_id"
          label="平台id">
        </el-table-column>
        <el-table-column 
          header-align="center"
          align="center"
          prop="ip"
          label="IP">
        </el-table-column>
        <el-table-column 
          header-align="center"
          align="center"
          prop="flow_id"
          label="flow_id"
          >
        </el-table-column>
        <el-table-column 
          header-align="center"
          align="center"
          prop="city"
          label="城市">
        </el-table-column>
        <el-table-column 
          header-align="center"
          align="center"
          prop="sex"
          label="性别"
          :formatter="FomatSex"
          >
        </el-table-column>
        <el-table-column 
          header-align="center"
          align="center"
          prop="browser_model"
          label="浏览器信息">
        </el-table-column>
        <el-table-column 
          header-align="center"
          align="center"
          prop="create_time"
          label="调用接口时间"
          sortable>
        </el-table-column>
      </el-table>
    </el-row>

      <!--分页-->
      <el-row class="row_pagin">
        <el-pagination class="pagin"
          @size-change="SizeChange"
          @current-change="CurrentChange"
          :current-page.sync="send.currentPage"
          :page-sizes="[ 16, 50, 100,200,300,400]"
          :page-size="send.pagesize"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="recieve.total">
        </el-pagination>
      </el-row>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import City from '../components/City'
  import STATE from '../js/constant.ts' 
  import unit from '../js/units.ts'
  export default {
    name: "Nozzle",
    components: {
      City
    },
    data () {
      return {
        recieve:{                    //接收数据
          tableData:[],            //表格数据
          timeItem:[],
          total:0,              //数据总数
          select:'0',           //下拉选择
          selectItem:[{
            value:'0',
            name:'getad'
          }],
        },
        send:{                      //发送数据
          time:'',               //时间
          flowId:'',              //流量方ID
          currentPage:1,         //页码
          pagesize:16,            //页数
        },
      }
    },
    computed:{             //实时计算
      ...mapState({
       city_info: state => state.options.city,
      }),
    },
    methods:{
      NozzleSumary(){                        //接口数据
        let _this=this;
        _this.recieve.tableData=[];
        let cityinfo='';
        if(_this.city_info==='全国'){      //如果是全国就传空值
          cityinfo='';
        }else{
          cityinfo=_this.city_info;
        }
        let params={                       //参数
          page_size:_this.send.pagesize,
          page_number:_this.send.currentPage,
          start_time:_this.send.time[0],
          end_time:_this.send.time[1],
          city:cityinfo
        };
        _this.axios.get('/api/interface_data',{              //接口调用
          params:params
        }).then(function(response){
          let info=response.data;
          if(info!=''||info!=null){              //返回数据不为空
            if(info.code=='1'){                        //成功
              for (let index = 0; index < info.data.length; index++) {          //循环赋值
                _this.recieve.tableData.push(info.data[index]._source);
              }
            }else{
              _this.recieve.tableData=[];
            }
            _this.recieve.total=info.total;
          }else{
            _this.recieve.tableData=[];
            _this.recieve.total=0;
          }
          
        }).catch(function(error){
          console.log(error);
          _this.$message({
            message:'服务器错误',
            type:'error'
          });
        });
      },
      Search(){                   //查询函数
        let _this=this;
        if(this.send.time==''){
          this.$message({
            message:'请选择查询的时间段',
            type:'warning'
          });
          return;
        }else{
          _this.send.currentPage=1;
          _this.NozzleSumary();
        }
      },
      Reset(){                       //重置函数
        let _this=this;
        _this.DefaultTime();
        _this.send.currentPage=1;
        _this.NozzleSumary();
      },
      DownLoad(){            //下载明细
        this.$confirm('是否下载明细报表?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _this=this;
          let cityinfo='';
          if(_this.city_info==='全国'){      //如果是全国就传空值
            cityinfo='';
          }else{
            cityinfo=_this.city_info;
          }
          let url='http://192.168.0.144:8088/api/downloadInterfaceExcel?city='+cityinfo+'&start_time='+_this.send.time[0]+'&end_time='+_this.send.time[1];
          window.open(url); 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '下载取消'
          });          
        });
      },
      SelectChange(){                   //下拉列表改变
        var _this=this;
        
      },
      SizeChange(val){              //页数改变
        this.send.pagesize=val;
        this.send.currentPage=1;
        let _this=this;
        _this.NozzleSumary();
      },
      CurrentChange(val){             //页码改变
        this.send.currentPage=val;
        let _this=this;
        _this.NozzleSumary();
      },
      FomatSex(row){                  //格式化性别
        switch (row.sex) {
          case '0':
            return '女'
            break;
          case '1':
            return '男'
            break;
          case '2':
            return '未知'
            break;
          default: ' '
            break;
        }
      },
      Appendzero(obj)                      //时间补0
      {
        if(obj<10) return "0" +""+ obj;
        else return obj;
      },
      DefaultTime(){                     //设置默认时间
        let _this=this;
        let date=new Date();                
        let start_time=date.getFullYear()+'-'+_this.Appendzero(parseInt(date.getMonth()+1))+'-'+_this.Appendzero(parseInt(date.getDate()-1))+' 00:'+'00:'+'00';
        let end_time=date.getFullYear()+'-'+_this.Appendzero(parseInt(date.getMonth()+1))+'-'+_this.Appendzero(date.getDate()-1)+' 23:'+'59:'+'59';
        _this.send.time=[start_time,end_time];
      },
    },
    created: function () {
      let _this=this;
    },
    mounted:function(){
      let _this = this;
      _this.recieve.timeItem=STATE.timeItem;               //赋值快捷日期
      _this.DefaultTime();
      _this.NozzleSumary();
    }
  }
</script>

<style scoped lang="less">
  @import '../style/nozzle.less';
</style>
