<template>
  <div class="frequency">
    <!--查询-->
    <el-row class="offset_1 row_margin_bottom">
      <el-col :span="2">
        <el-tag type="info">时间</el-tag>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-date-picker
          v-model="frenquency.time"
          align="center"
          type="date"
          :clearable='false'
          placeholder="选择日期"
          :picker-options="frenquency.timeItem"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
    </el-row>

    <!--流量方-->
    <el-row class="offset_1 row_margin_bottom">
      <el-col :span="2">
        <el-tag type="info">流量方</el-tag>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-select v-model="frenquency.selectFlowId"
          placeholder="请选择流量方"
          @change="SelectChange('flow')">
          <el-option
            v-for="item in frenquency.flowItem"
            :key="item.FlowId"
            :label="item.Name"
            :value="item.FlowId">
          </el-option>
        </el-select>
      </el-col>

      <!--流量方ID-->
      <!-- <el-col :span="4" :offset="1" v-show="frenquency.flowIdvshow">
        <el-input placeholder="请输入流量方ID"
         clearable v-model="frenquency.flowId"
         ref="flowid">
        </el-input>
      </el-col> -->
      
      <!--用户openid-->
      <el-col :span="4" :offset="1" v-show="frenquency.openIdvshow">
        <el-input placeholder="请输入用户openid"
         clearable v-model="frenquency.openId"
         ref="openid"
         :change="ChangeOpenId()"
         :disabled="frenquency.openid_dis">
        </el-input>
      </el-col>
      
    </el-row>

    <!--用户-->
    <el-row class="offset_1 row_margin_bottom">
      <el-col :span="2">
        <el-tag type="info">用户</el-tag>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-select v-model="frenquency.selectUserId"
          placeholder="请选择用户"
          @change="SelectChange('user')">
          <el-option
            v-for="item in frenquency.userItem"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-col>

      <!--用户唯一ID-->
      <el-col :span="4" :offset="1" v-show="frenquency.onlyUserIdvshow">
        <el-input placeholder="请输入用户唯一ID"
         clearable v-model="frenquency.onlyUserId"
         ref="onlyuserid"
         :change="ChangeUserId()"
         :disabled="frenquency.userid_dis">
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
        <el-button type='primary' @click="Reset">
          重置
        </el-button>
      </el-col>
    </el-row>

    <!--数据表格-->
    <el-row class="row_table">
      <el-table
        :data="frenquency.tableData"
        style="width: 100%"
        height="560px"
        stripe
        border
        :default-sort = "{prop: 'frenquency', order: 'descending'}">
        <el-table-column 
            header-align="center"
            align="center"
            prop="flow_id"
            label="流量方id"
            >
          </el-table-column>
          <el-table-column 
            header-align="center"
            align="center"
            prop="frenquency"
            label="频次"
            sortable>
          </el-table-column>
          <el-table-column 
            header-align="center"
            align="center"
            prop="people"
            label="人数">
          </el-table-column>
          <el-table-column 
            header-align="center"
            align="center"
            prop="time"
            label="日期">
          </el-table-column>
      </el-table>
    </el-row>

    <!--分页-->
    <el-row class="row_pagin">
      <el-pagination class="pagin"
        @size-change="SizeChange"
        @current-change="CurrentChange"
        :current-page.sync="frenquency.currentPage"
        :page-size="frenquency.pagesize"
        :pager-count="5"
        layout="total"
        :total="frenquency.total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import STATE from '../../js/constant.ts'
  import unit from '../../js/units.ts'
  import '../../style/frequency.less'
  export default {
    name: "Frequency",
    data () {
      return {
        frenquency:{
          time:'',         //搜索时间
          timeItem:[],            //日期快捷
          selectFlowId:'0',              //选择的流量方
          flowItem:[
            {
              FlowId:'0',
              Name:'全部流量方'
            },
          ],             //流量方列表
          selectUserId:'0',                //选择的用户
          userItem:[],                 //用户列表
          onlyUserId:'',                   //用户唯一ID
          onlyUserIdvshow:false,
          userid_dis:false,
          flowId:'',                        //流量方ID
          flowIdvshow:true,                 //v-show
          openId:'',                        //用户openId
          openIdvshow:false,                 //用户openID  v-show
          openid_dis:false,
          tableData:[],                      //表格数据
          tableItem:[],                      //表格列表
          currentPage:1,         //页码
          pagesize:16,            //页数
          total:0,              //分页总数
          pagesizeItem:[],          //分页数据
        },
      }
    },
    //静态方法
    methods:{
      FrequencySummary(){                        //频次接口查询
        let _this=this;
        _this.frenquency.tableData=[];
        let frenq=_this.frenquency;
        let params={};//参数
        if(frenq.selectFlowId==='0'&&frenq.selectUserId==='0'){                //全部流量方+全部用户
          params={
            page_size:frenq.pagesize,
            page_number:frenq.currentPage,
            l_date:frenq.time
          };
        }else if(frenq.selectFlowId!=='0'&&frenq.selectUserId==='0'){             //单一流量方+全部用户
          params={
            page_size:frenq.pagesize,
            page_number:frenq.currentPage,
            l_date:frenq.time,
            flow_id:frenq.selectFlowId
          };
        }else if(frenq.selectFlowId!=='0'&&frenq.selectUserId==='1'){               //单一流量方+单一用户
          params={
            page_size:frenq.pagesize,
            page_number:frenq.currentPage,
            l_date:frenq.time,
            flow_id:frenq.selectFlowId,
            open_id:frenq.openId,
            id:frenq.onlyUserId
          };
        }else if(frenq.selectFlowId==='0'&&frenq.selectUserId==='1'){              //全部流量方+单一用户
          params={
            page_size:frenq.pagesize,
            page_number:frenq.currentPage,
            l_date:frenq.time,
            flow_id:frenq.selectFlowId,
            id:frenq.onlyUserId
          };
        }

        _this.axios.get('/api/pv_frequency',{              //接口调用
          params:params
        }).then(function(response){
          let info=response.data;
          if(info!=''||info!=null){              //返回数据不为空
            if(info.code==='1'){                        //成功
              let infos=response.data.data;
              for (let i = 0; i < infos.flow_ids.buckets.length; i++) {           //循环拿流量方ID
                for (let j = 0; j < infos.flow_ids.buckets[i].l_date_terms.buckets.length; j++) {        //循环拿时间
                  for (let k = 0; k < infos.flow_ids.buckets[i].l_date_terms.buckets[j].freqsum.buckets.length; k++) {         //循环拿人数和频次
                    let tabledata={};
                    tabledata.flow_id=infos.flow_ids.buckets[i].key;
                    tabledata.time=infos.flow_ids.buckets[i].l_date_terms.buckets[j].key_as_string;
                    tabledata.people=infos.flow_ids.buckets[i].l_date_terms.buckets[j].freqsum.buckets[k].doc_count;
                    tabledata.frenquency=infos.flow_ids.buckets[i].l_date_terms.buckets[j].freqsum.buckets[k].key;
                    frenq.tableData.push(tabledata);
                  }
                }
              }
              frenq.total=frenq.tableData.length;
            }else{
              frenq.tableData=[];
            }
          }else{
            frenq.tableData=[];
            frenq.total=0;
          }
          
        }).catch(function(error){
          console.log(error);
          _this.$message({
            message:'服务器错误',
            type:'error'
          });
        });
      },
      GetFlowList(){                     //获取流量方列表
        let _this=this;
        _this.axios.post('/Admin/InavAd/GetFlowList').then(function(response){
          let info=response.data;
          if(info!=''||info!=null){
            if(info.length>0){
              for (let index = 0; index < info.length; index++) {
                _this.frenquency.flowItem.push(info[index]);
              }
            }else{
              _this.frenquency.flowItem=[];
            }
            
          }else{
            _this.frenquency.flowItem=[];
          }
          
        }).catch(function(error){
          console.log(error);
          _this.$message({
            message:'服务器错误',
            type:'error'
          });
        });
      },
      Search(){                  //查询函数
        let _this=this;
        if(_this.frenquency.time==''){                //日期时间为空
          _this.$message({
            message:'请选择要查询的时间段',
            type:'warning'
          });
          return; 
        }else {               //单一流量方+单一用户
          if(_this.frenquency.selectFlowId!=='0'&&_this.frenquency.selectUserId==='1'){
            if(_this.frenquency.openId!==''&&_this.frenquency.onlyUserId!==''){
              _this.$message({
                message:'请在open_id和用户唯一ID中选填',
                type:'warning'
              });
              return;
            }else if(_this.frenquency.openId===''&&_this.frenquency.onlyUserId===''){
              _this.$message({
                message:'请输入open_id或用户唯一ID中选填',
                type:'warning'
              });
              return;
            }
          }
          _this.currentPage=1;
          _this.FrequencySummary();
        }
      },
      Reset(){                                //重置函数
        let frenquency=this.frenquency;
        frenquency.time='';
        frenquency.onlyUserId='';
        frenquency.flowId='';
        frenquency.openId='';
        frenquency.currentPage=1;
        this.DefaultTime();
        this.FrequencySummary();
      },
      ChangeUserId(value){                //输入用户唯一ID时触发
        let _this=this.frenquency;
        if(_this.onlyUserId!==''){
          _this.openid_dis=true;
        }else{
          _this.openid_dis=false;
        }
      },
      ChangeOpenId(value){                       //输入open_id时触发
        let _this=this.frenquency;
        if(_this.openId!==''){
          _this.userid_dis=true;
        }else{
          _this.userid_dis=false;
        }
      },
      SelectChange(type){                   //下拉列表改变
        let _this=this;
        _this.frenquency.onlyUserId='';
        _this.frenquency.openId='';
        if(type=='flow'){                       //流量方下拉列表
          _this.frenquency.flowid='';
          if(_this.frenquency.selectUserId==='0'&&_this.frenquency.selectFlowId==='0'){        //全部用户+全部流量方
            _this.frenquency.openIdvshow=false;
            _this.frenquency.onlyUserIdvshow=false
          } else if(_this.frenquency.selectUserId==='1'&&_this.frenquency.selectFlowId!=='0'){         //单一用户+单一流量方
            _this.frenquency.openIdvshow=true;
            _this.frenquency.onlyUserIdvshow=true;
          } else if(_this.frenquency.selectUserId==='1'&&_this.frenquency.selectFlowId==='0'){           //单一用户+全部流量方
            _this.frenquency.openIdvshow=false;
            _this.frenquency.onlyUserIdvshow=true;
          }
        }else if(type=='user'){                    //用户下拉列表
          _this.frenquency.openId='';
          if(_this.frenquency.selectUserId=='0'){           //全部用户
            _this.frenquency.openIdvshow=false;
            _this.frenquency.onlyUserIdvshow=false;
          }else if(_this.frenquency.selectUserId==='1'&&_this.frenquency.selectFlowId==='0'){
            _this.frenquency.openIdvshow=false;
            _this.frenquency.onlyUserIdvshow=true;
          } else if(_this.frenquency.selectUserId==='1'&&_this.frenquency.selectFlowId!=='0'){                                             //单一用户
            _this.frenquency.openIdvshow=true;
            _this.frenquency.onlyUserIdvshow=true;
          }
        }
        
      },
      SizeChange(val){              //页数改变
        this.frenquency.pagesize=val;
        this.frenquency.currentPage=1;
      },
      CurrentChange(val){             //页码改变
        this.frenquency.currentPage=val;
      },
      Appendzero(obj)                      //时间补0
      {
        if(obj<10) return "0" +""+ obj;
        else return obj;
      },
      DefaultTime(){                     //设置默认时间
        let _this=this;
        let date=new Date();                
        let time=date.getFullYear()+'-'+_this.Appendzero(parseInt(date.getMonth()+1))+'-'+_this.Appendzero(parseInt(date.getDate()-1));
        _this.frenquency.time=time;
      },
    },
    created: function () {
      let _this=this;
    },
    mounted:function(){
      let _this = this;
      _this.frenquency.userItem=unit.ArrayCopy(STATE.userItem);                //赋值用户下拉列表
      _this.frenquency.timeItem=STATE.timeItem;               //赋值快捷日期
      _this.DefaultTime();                      //设置默认时间
      _this.FrequencySummary();                 //获取频次列表
      _this.GetFlowList();                      //获取流量方列表
    },
  }
</script>

<style scoped>

</style>
