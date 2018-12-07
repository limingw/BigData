<template>
    <div class="usertag">
      <!--查询条件顶栏-->
      <el-row class="row_margin_bottom row_navmenu">
        <el-menu default-active="1"
          class="el-menu-demo" mode="horizontal"
          @select="handleSelect"
          text-color="#000">
          <el-menu-item index="1">标签查询</el-menu-item>
          <el-menu-item index="2">用户查询</el-menu-item>
        </el-menu>
      </el-row>

      <el-row class="row_margin_bottom offset_1">
        <!--标签查询部分-->
        <div v-show="is_index === 1">
          <!--查询条件-->
            <el-col :span="2">
              <el-tag type="info">筛选条件</el-tag>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-cascader
                :options="tag.selectItem"
                v-model="tag.selectTag"
                change-on-select
              ></el-cascader>
            </el-col>
        </div>

        <!--用户查询部分-->
        <div v-show="is_index === 2">
          <!--查询条件-->
          <el-col :span="2">
            <el-tag type="info">筛选条件</el-tag>
          </el-col>

          <!--用户唯一id-->
          <el-col :span="4" :offset="1">
            <el-input placeholder="请输入用户id"
                      clearable v-model="user.id"
                      ref="user_id">
            </el-input>
          </el-col>

          <!--流量方id-->
          <el-col :span="4" :offset="1">
            <el-input placeholder="请输入流量方flow_id"
                      clearable v-model="user.flow_id"
                      ref="flow_id">
            </el-input>
          </el-col>

          <!--用户open_id-->
          <el-col :span="4" :offset="1">
            <el-input placeholder="请输入用户open_id"
                      clearable v-model="user.open_id"
                      ref="open_id">
            </el-input>
          </el-col>
        </div>

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

      <!--数据表格-->
      <el-row class="row_table">
        <el-table
          :data="usertag.tableData"
          style="width: 100%"
          stripe
          border>
          <el-table-column
            v-for="item in usertag.tableItem"
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
          :current-page.sync="control.current_page"
          :page-sizes="[2, 4, 6, 8, 10, 12]"
          :page-size="control.page_size"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="control.total">
        </el-pagination>
      </el-row>
    </div>
</template>

<script>
  import STATE from '@/js/constant.ts'
  import unit from '../../js/units'
    //用户数据标签
  export default {
    name: "UserTag",
    data () {
        return {
          usertag:{               //主页面
            tableData:[],                      //表格数据
            tableItem:[],                      //表格列表
          },
          // 用于控制查询的长度什么的
          control: {
            total:0,              //分页总数
            current_page:1,         //页码
            page_size:8,            //页数
          },
          tag:{                   //标签查询页面
            index:true,           //v-show
            selectTag:['hunan', 'changde'],          //联级下拉选择
            selectItem:[{          //联级列表
              value: 'guangdong',
              label: '广东省',
              children: [{
                  value: 'shenzhen',
                  label: '深圳市',
                },
                {
                  value: 'guangzhou',
                  label: '广州市',
                },
                {
                  value: 'huizhou',
                  label: '惠州市',
                }]
            },
            {
              value: 'hunan',
              label: '湖南省',
              children: [{
                  value: 'changsha',
                  label: '长沙市',
                },
                {
                  value: 'yiyang',
                  label: '益阳市',
                },
                {
                  value: 'changde',
                  label: '常德市',
                }]
            }]
          },
          user:{                    //用户查询页面
            id:'',          //用户唯一ID
            flow_id:'',              //流量方id
            open_id:'',              //用户open_id
          },
          // v-show标签查询或者用户查询
          is_index: 1,
        }
    },
    //静态方法
    methods: {
      handleSelect: function(key, keyPath) {              //顶栏标签查询选择
        if(key === '1'){
          this.is_index = 1;
        }else if(key === '2'){
          this.is_index = 2;
        }
      },
      //查询函数
      Search: function(){
        let _this = this;
        let is_index  = _this.is_index;
        // 标签查询
        if(is_index === 1){
          _this.$message({
            message:'请选择要查询的标签',
            type:'warning'
          });
        }else if(is_index === 2){
          // 用户查询
          if (_this.ProvUser()) {
            console.log(_this.user);
          }
        }
      },

      // 用户标签验证
      ProvUser: function() {
        let _this = this;
        let user = _this.user;
        let bool = true;

        if(user.id === ''){
          //用户唯一ID为空
          _this.$message({
            message:'请输入要查询的用户唯一id',
            type:'warning'
          });
          _this.$refs.user_id.focus();
          bool = false;
        }else if(user.flow_id === ''){
          //流量方ID为空
          _this.$message({
            message:'请输入要查询的流量方flow_id',
            type:'warning'
          });
          _this.$refs.flow_id.focus();
          bool = false;
        }else if(_this.user.open_id === ''){
          _this.$message({
            message:'请输入要查询的open_id',
            type:'warning'
          });
          _this.$refs.open_id.focus();
          bool = false;
        }
        return bool;
      },
      // 重置函数
      Resetting: function(){
        let _this = this;
        let is_index = _this.is_index;
        //tag查询重置
        if(is_index === 1){
          let tag = this.tag;
          tag.selectTag=['hunan', 'changde'];
        } else if(is_index === 2){               //用户查询重置
          let user=this.user;
          user.id='';
          user.flow_id='';
          user.open_id='';
        }
        this.control.current_page=1;
      },
      SizeChange(val){              //页数改变
        this.control.page_size=val;
        this.control.current_page=1;
      },
      CurrentChange(val){             //页码改变
        this.control.current_page=val;
      },
    },
    created: function () {
      let _this = this;
      _this.usertag.tableItem = unit.ArrayCopy(STATE.TagTable);       //赋值表头
    }
  }
</script>

<style scoped lang="less">
  @import '../../style/user.less';

</style>
