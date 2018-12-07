<template>
    <div class="abnormal">
      <!--时间选择-->
      <el-row class="row_search offset_1 row_margin_bottom">
        <el-col :span="2">
          <el-tag type="info">时间段</el-tag>
        </el-col>
        <el-col :span="8" :offset="1" class="eltime">
          <el-date-picker
            v-model="send.time"
            type="datetimerange"
            :picker-options="timeItem"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
            :clearable='false'
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-col>
        <!--流量方ID-->
        <el-col :span="4" :offset="1">
          <el-input placeholder="请输入流量方ID"
            clearable v-model="send.flowId"
            ref="flowid">
          </el-input>
        </el-col>
      </el-row>

      <!--区域定向-->
      <el-row class="row_city offset_1 row_margin_bottom">
        <el-col :span="2">
          <el-tag type="info">区域定向</el-tag>
        </el-col>
        <el-col :span="8" :offset="1">
          <City></City>
        </el-col>

        <!--view_id-->
        <el-col :span="4" :offset="1">
          <el-input placeholder="请输入view_id"
            clearable v-model="send.viewId"
            ref="viewid">
          </el-input>
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

      <!--筛选数据汇总-->
      <el-row class="row_total">
        <h2>筛选数据总量：{{recieve.total}}</h2>
      </el-row>

      <!--数据表格-->
      <el-row class="row_table row_margin_bottom">
        <el-table
          :data="recieve.tableData"
          style="width: 100%"
          height="620px"
          stripe
          border
          :default-sort = "{prop: 'create_time', order: 'descending'}">
          <el-table-column 
            header-align="center"
            align="center"
            prop="create_time"
            label="时间"
            sortable>
          </el-table-column>
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
            label="view_id">
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
            prop="city"
            label="城市">
          </el-table-column>
          <el-table-column 
            header-align="center"
            align="center"
            prop="sex"
            label="性别"
            :formatter="FomatSex">
          </el-table-column>
          <el-table-column 
            header-align="center"
            align="center"
            prop="browser_model"
            label="浏览器信息">
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
    name: "Abnormal",
    components: {
      City
    },
    data () {
      return {
        recieve:{                    //接受数据
          tableData:[],           //表格数据
          total:0,              //分页总数
        },
        send:{                 //发送数据
          time:'',      //时间搜索
          flowId:'',           //流量方ID
          viewId:'',             //viewID
          currentPage:1,         //页码
          pagesize:16,            //页数
        },
        timeItem:'',                //日期时间快捷
      }
    },
    computed:{             //实时计算
      ...mapState({
       city_info: state => state.options.city,
      }),
    },
    methods:{
      AbnormalSummary(){                    //异常数据汇总
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
          city:cityinfo,
          flow_id:_this.send.flowId,
          view_id:_this.send.viewId
        };
        _this.axios.get('/api/pv_abnormal',{              //接口调用
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
          _this.AbnormalSummary();
        }
      },
      Reset(){                       //重置函数
        let _this=this;
        this.send.city='全国';
        _this.DefaultTime();
        _this.send.currentPage=1;
        _this.AbnormalSummary();
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
          let url='http://192.168.0.144:8088/api/downloadAbnormalPvExcel?city='+cityinfo+'&view_id='+_this.send.viewId+'&flow_id='+_this.send.flowId+'&start_time='+_this.send.time[0]+'&end_time='+_this.send.time[1];
          window.open(url); 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '下载取消'
          });          
        });
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
          default:
            break;
        }
      },
      FormatSuccess(row){                       //格式化是否成功
        if(row.after_oper_id!=''||row.after_oper_id!=null||row.after_oper_id!=undefined){
          return '成功';
        }
        return '失败';
      },
      FormatPv(row){                              //格式化PV时间
        if(row.gap_time!=''||row.row.gap_time!=null||row.row.gap_time!=undefined){
          return row.gap_time+'S';
        }
        return '';
      },
      SelectCity(){                    //城市选择
        let _this=this;
        
      },
      SizeChange(val){              //页数改变
        this.send.pagesize=val;
        this.send.currentPage=1;
        let _this=this;
        _this.AbnormalSummary();
      },
      CurrentChange(val){             //页码改变
        this.send.currentPage=val;
        let _this=this;
        _this.AbnormalSummary();
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
      let _this = this;
      _this.timeItem=STATE.timeItems;               //赋值快捷日期
      _this.DefaultTime();
      _this.AbnormalSummary();
    }
  }
</script>

<style scoped lang="less">
  @import '../style/abnormal.less';
</style>
