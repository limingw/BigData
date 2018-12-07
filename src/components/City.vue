<template>
    <div class="city">
      <div class="time">
        <el-input placeholder="城市信息" type="button" class="city_input" v-model="selectcity" @click.native="click"></el-input>
      </div>

      <el-dialog
        title="选择城市"
        :visible.sync="dialogCity">
        <div class="city_selected">
          <span class="select_title">最多可选择6项</span>
          <span class="select_content"
            v-for="(item,index) in result_city" :key="index">{{item.city[0]}}
          <i @click="DeleteResult(item.code,'delete')">×</i></span>
        </div>
        <div class="city_search" v-show="!countrydis">
          <div class="data_search">
                <input
                  class="search-input"
                  v-model="search_content"
                  @blur="stopSearch()"
                  placeholder="请输入城市..."  />
                <div class="search-result" v-show="search_bool">
                  <a
                    href="javascript:;"
                    v-for="(item, index) in search_result"
                    :key="index"
                    @click="AddSearchCity(item.code)"
                    class="area_menu">
                    <em>{{item.pinyin}}</em>
                    {{item.name}}
                  </a>
                </div>
                </div>
        </div>
        <div class="city_header">
          <ul>
            <li :class="[this.province.vshow?'header_title header_active':'header_title']" @click="ShowProvince()">
              <span>全部</span>
            </li>
          </ul>
          <ul v-show="this.province.vshow">
            <li :class="[this.province.vshow?'header_title':'header_title header_active']">
              <span>{{province.name}}</span>
            </li>
          </ul>
        </div>
        <div class="city_content">
          <!--选择省份后的城市信息-->
          <div class="province_city" v-show="this.province.vshow">
            <div class="province_content">
              <ul>
                <li v-for="(item,index) in this.province_city" :key="index">
                  <span :class="[item.active?'active':'']" @click="ChangeCity(item.code,index)">{{item.city[0]}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="city_all"  v-show="!this.province.vshow">
            <p class="hot_title">热门城市</p>
            <div class="hot_content">
              <ul>
                <li :class="[countrydis?'disabeld':'undisabeld']" v-for="(item,index) in this.hot_city" :key="index">
                  <span :class="[item.active?'active':'']" @click="ChangeHotCity(item.code,index)">{{item.city[0]}}</span>
                </li>
              </ul>
            </div>
            <p class="hot_title">全部省份</p>
            <div class="province_content">
              <ul>
                <li :class="[countrydis?'disabeld':'undisabeld']" v-for="(item,index) in this.province_list" :key="index">
                  <span :class="[item.active?'active':'']" @click="ChangeProvince(item.code)">{{item.city[0]}}</span>
                  <label v-show="item.num > 0">{{item.num}}</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" class="country" @click="ClickCountry()">全 国</el-button>
          <el-button @click="dialogCity = false">取 消</el-button>
          <el-button type="primary" @click="SelectCitySure">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  import LocalDataCities from '../js/City_data.js'
  import '../style/city.less'
  export default {
    name: "City",
    data () {
      return {
        dialogCity:false,                 //城市选择对话框
        countrydis:false,                 //全国后的禁选
        hot_city: [{                    //热门城市列表
          active: false,
          code: '',
          city: [],
          num: ''
        }],
        hot_city_code:LocalDataCities.category.hotcities,                     //热门城市code
        province_code: LocalDataCities.category.provinces,                     //省份code
        province:[{
          name:'',
          vshow:false,
        }],                    //省份
        province_list: [{            //省份列表
          active: false,
          code: '',
          city: [],
          num: ''
        }],
        province_city: [],
        province_city_title: {
          code: '',
          active: false,
          city: []
        },
        result_city: [],                 //已选城市
        search_CityItem:[],                    //联想城市数组
        searchindex:'',               //搜索城市
        searchindexItem:[],
        selectcity:'全国',
        // 搜索结果
        search_bool: false,
        search_content: '',
        // 搜索结果
        search_result: {},

        // 搜索内容
        search_value: [],
      }
    },
    // 静态方法
    methods: {
      click(){              //打开城市选择对话框
        this.dialogCity=true;
      },
      ClickCountry:function(){             //全国函数
        var _this=this;
        _this.countrydis=true;
        _this.DeleteCity();
      },

      // 删除选中对象
      DeleteResult: function(code,target) {
        let _this=this;
        let index=0;
        if(code==='000'){
          _this.result_city=[];
          _this.countrydis=false;
        }
        if(target==='hot'){                 //热门城市
          for (let key in _this.hot_city) {            //循环热门城市
            if (code === key) {
              if (_this.hot_city[key].active === false) {      //未选
                _this.hot_city[key].active=true;
              } else {                               //已选
                _this.hot_city[key].active=false;
              }
            }
          }
        }else if(target==='province'){                  //选择省份后的城市
          for (let key in _this.province_city) {            //循环热门城市
            if (code === key) {
              if (_this.province_city[key].active === false) {      //未选
                _this.province_city[key].active=true;
              } else {                               //已选
                _this.province_city[key].active=false;
              }
            }
          }
        }else if(target==='delete'){                        //删除当前已选城市
          _this.ClearCity(code);
        }
        for (let i=0;i<_this.result_city.length;i++) {        //确认相对应的城市索引
          if (code === _this.result_city[i].code) {
            index=i;
          }
        }
        if(index>-1){             //删除已选城市
          _this.result_city.splice(index,1);
        }

        let values=code.substr(0,3);
        for (let key in _this.province_list) {                         //删除相对应城市所属省份的数量
          if(values==_this.province_list[key].code){
            _this.province_list[key].num=_this.province_list[key].num-1;
          }
        }
      },
      // 增加选中对象
      AddResult: function(code, target) {
        let _this = this;
        if(_this.result_city.length>=6){
          _this.$message({
            message:'您最多可选六个城市',
            type:'warning'
          });
          return;
        }
        if(target=='hot'){              //热门城市
          for (let key in _this.hot_city) {
            if (code === key) {
              _this.result_city.push(_this.hot_city[key]);
            }
          }
        }else if(target=='province'){           //选择省份后的城市
          for (let key in _this.province_city) {
            if (code === key) {
              _this.result_city.push(_this.province_city[key]);
            }
          }
        }

        let values=code.substr(0,3);
        for (let key in _this.province_list) {         //增加省份相对应的已选城市数量
          if(values==_this.province_list[key].code){
            _this.province_list[key].num=_this.province_list[key].num+1;
          }
        }

      },
      AddSearchCity(code){                           //搜索城市后添加到已选城市
        var _this=this;
        if(_this.result_city.length>=6){
          _this.$message({
            message:'您最多可选六个城市',
            type:'warning'
          });
          return;
        }
        if(_this.result_city.length>0){                 //判断已选城市有没有当前code
          for (let index = 0; index < _this.result_city.length; index++) {
            if(_this.result_city[index].code.indexOf(code)!==-1){
              return;
            }
          }

          for (let key in _this.hot_city) {     //循环热门城市
            if (code === key) {
              _this.hot_city[key].active=true;
            }
          }

          for (let key in _this.search_result) {          //循环搜索城市
            if(code===_this.search_result[key].code){
              let city={
                code:'',
                city:[],
              };
              city.code=_this.search_result[key].code;
              city.city[0]=_this.search_result[key].name;
              _this.result_city.push(city);
            }
          }

          let values=code.substr(0,3);
          for (let key in _this.province_list) {         //增加省份相对应的已选城市数量
            if(values==_this.province_list[key].code){
              _this.province_list[key].num=_this.province_list[key].num+1;
            }
          }
        }else{
          for (let key in _this.hot_city) {
            if (code === key) {
              _this.hot_city[key].active=true;
            }
          }

          for (let key in _this.search_result) {          //循环搜索城市
            if(code===_this.search_result[key].code){
              let city={
                code:'',
                city:[],
              };
              city.code=_this.search_result[key].code;
              city.city[0]=_this.search_result[key].name;
              _this.result_city.push(city);
            }
          }

          let values=code.substr(0,3);
          for (let key in _this.province_list) {         //增加省份相对应的已选城市数量
            if(values==_this.province_list[key].code){
              _this.province_list[key].num=_this.province_list[key].num+1;
            }
          }
        }
      },
      // 选中全国删除所有
      DeleteCity: function() {
        let _this = this;
        _this.result_city=[];
        for(let key in _this.hot_city){         //移除选中状态
          _this.hot_city[key].active=false;
        }
        for(let key in _this.province_city){
          _this.province_city[key].active=false;
        }
        for(let key in _this.province_list){         //移除数量
          _this.province_list[key].num=0;
          _this.province_list[key].active=false;
        }
        _this.province.vshow=false;
        _this.result_city=[
          {
            code:'000',
            city:['全国'],
          }
        ];
      },
      // 选择城市
      ChangeHotCity: function(code,index) {
        let _this = this;
        if(_this.countrydis==true){
          return;
        }

        for (let key in _this.hot_city) {            //循环热门城市
          if (code === key) {
            if (_this.hot_city[key].active === false) {      //未选
              if(_this.result_city.length>=6){
                _this.$message({
                  message:'您最多可选六个城市',
                  type:'warning'
                });
                return;
              }
              _this.hot_city[key].active=true;
              _this.AddResult(code,'hot');
            } else {                               //已选
              _this.hot_city[key].active=false;
              _this.DeleteResult(code,'hots');
            }
          }
        }

      },
      // 选中省份内的城市
      ChangeCity: function(code) {
        let _this = this;

        for (let key in _this.province_city) {            //循环省份中的城市
          if (code === key) {
            if (_this.province_city[key].active === false) {      //未选
              if(_this.result_city.length>=6){
                _this.$message({
                  message:'您最多可选六个城市',
                  type:'warning'
                });
                return;
              }
              _this.province_city[key].active=true;
              _this.AddResult(code,'province');
            } else {                               //已选
              _this.province_city[key].active=false;
              _this.DeleteResult(code,'provinces');
            }
          }
        }

        for (let key in _this.hot_city) {            //循环热门城市
          if (code === key) {
            if (_this.hot_city[key].active === false) {      //未选
              _this.hot_city[key].active=true;
            } else {                               //已选
              _this.hot_city[key].active=false;
            }
          }
        }
      },

      // 清空所有
      ClearCity: function(code) {
        let _this = this;
        for (let key in _this.hot_city) {            //循环热门城市
            if (code === key) {
              if (_this.hot_city[key].active === false) {      //未选
                _this.hot_city[key].active=true;
              } else {                               //已选
                _this.hot_city[key].active=false;
              }
            }
          }
          for (let key in _this.province_city) {            //循环热门城市
            if (code === key) {
              if (_this.province_city[key].active === false) {      //未选
                _this.province_city[key].active=true;
              } else {                               //已选
                _this.province_city[key].active=false;
              }
            }
          }
      },
      // 点击省份进入省份选择
      ChangeProvince: function(code) {
        let _this = this;
        if(_this.countrydis==true){
          return;
        }
        for (let key in _this.province_list) {            //循环省份
          if (code === key) {
            if (_this.province_list[key].active === false) {      //未选
              _this.province_list[key].active=true;
              _this.province.name=_this.province_list[key].city[0];
              _this.province.vshow=true;
              _this.GetProvinceCity(code);
            } else {                               //已选
              _this.province_list[key].active=false;
            }
          }
        }
      },

      // 获取省份内的城市
      GetProvinceCity: function(code) {
        let _this = this;
        let a = {};
        LocalDataCities.relations[code].map(function (item) {
          let temp = {};
          temp.code = item;
          temp.city = LocalDataCities.list[item];
          temp.active = false;
          a[item] = temp;
          for (let key in _this.result_city) {
            if (key === item) {
              a[item] = _this.result_city[key];
            }
          }
          for (let index = 0; index < _this.result_city.length; index++) {     //已选择城市
            if(item===_this.result_city[index].code){
              temp.active=true;
            }
          }
        });
        _this.province_city = a;
      },
      // 展示省份城市
      ShowProvince: function() {
        var _this=this;
        for (let key in _this.province_list) {            //循环热门城市
          _this.province_list[key].active=false;
        }
        _this.province.vshow=false;
      },

      // 生成热门城市
      AddHotCity: function() {
        let _this = this;
        let a = {};
        _this.hot_city_code.map(function (item) {
          let temp = {};
          temp.code = item;
          temp.active = false;
          temp.city = LocalDataCities.list[item];
          a[item] = (temp);
        });
        return a;
      },
      // 生成省份
      AddProvince:function() {
        let _this = this;
        let a = {};
        _this.province_code.map(function (item) {
          let temp = {};
          temp.code = item;
          temp.active = false;
          temp.num = 0;
          temp.city = LocalDataCities.list[item];
          a[item] = temp;
        });
        return a;
      },
      ProduceCity(){                      //生成搜索城市函数
        let _this=this;
        let city_code=[];
        let allcity_code=[];
        let allcity=[];
        for (let key in LocalDataCities.relations) {          //循环拿各省份下的市区code
          for (let index = 0; index < LocalDataCities.category.provinces.length; index++) {
            if(key===LocalDataCities.category.provinces[index]){
              city_code.push(LocalDataCities.relations[key]);
            }

          }
        }
        for (let index = 0; index < city_code.length; index++) {            //市的合集code
          for (let indexs = 0; indexs < city_code[index].length; indexs++) {
            allcity_code.push(city_code[index][indexs]);
          }

        }

        for (let key in LocalDataCities.list) {               //市的信息合集
          for (let index = 0; index < allcity_code.length; index++) {
            if(key===allcity_code[index]){
              let codecity={};
              codecity.code=key;
              codecity.city=LocalDataCities.list[key];
              allcity.push(codecity);
            }
          }
        }

        for (let index = 0; index < allcity.length; index++) {      //赋值放入搜索联想
          let citys={};
          citys.value=allcity[index].city[0];
          citys.code=allcity[index].code;
          _this.search_CityItem.push(citys);
        }
        let directly=[
          {code:'010',value:'北京'},
          {code:'020',value:'上海'},
          {code:'030',value:'天津'},
          {code:'040',value:'重庆'},
        ];       //直辖市
        for (let index = 0; index < directly.length; index++) {
          _this.search_CityItem.push(directly[index]);
        }
      },
      SearchCity(){              //搜索城市确认
        let _this=this;
        for (let index = 0; index < _this.search_CityItem.length; index++) {
          if(_this.searchindex===_this.search_CityItem[index].value){
            _this.AddSearchCity(_this.search_CityItem[index].code);
          }
        }
      },
      SelectCitySure(){              //确认所选城市信息
        let _this=this;
        _this.selectcity='';
        for (let index = 0; index < _this.result_city.length; index++) {
          _this.selectcity+=_this.result_city[index].city[0]+',';
        }
        _this.selectcity=_this.selectcity.substring(0,_this.selectcity.length-1);
        _this.dialogCity=false;
        _this.$store.commit('ChangeCity',_this.selectcity);                //所选城市提交到全局
      },
      // 停止搜索
      stopSearch: function() {
        let _this = this;
        setTimeout(function () {
          _this.search_bool = false;
        }, 200)
      },
      // 搜索方法
      search: function(v) {
        let _this = this;
        let searchValue = _this.search_value;
        let i, loaded = {};
        let target = {

        };
        //搜索以关键词开头的应用
        for (i in searchValue) {
          if (isNaN(i) || loaded[i] || !searchValue[i].name) {
            continue;
          }
          let temp = {};
          temp.code = searchValue[i].code
          temp.name = searchValue[i].name;
          temp.pinyin = searchValue[i].pinyin;
          temp.py = searchValue[i].py;
          let re_bool = temp.name.indexOf(v) >= 0 || temp.pinyin.indexOf(v) >= 0 || temp.py.indexOf(v) >= 0 || temp.pinyin.toLowerCase().indexOf(v) >= 0 || temp.py.toLowerCase().indexOf(v) >= 0;
          if (re_bool) {
            loaded[i] = 1;
            target[i] = temp;
          }
        }
        // 搜索结果的长度
        let len = Object.keys(target).length;
        if (len > 0) {
          _this.search_bool = true;
          _this.search_result = target;
        } else {
          // 隐藏搜索框
          _this.search_bool = false;
        }
        _this.search_result = target;
      },
      // 停止搜索
      stopSearch: function() {
        let _this = this;
        setTimeout(function () {
          _this.search_bool = false;
        }, 200)
      },

      // 搜索的数组
      searchData: function() {
        let list    = LocalDataCities.list;
        let dataArr = [];
        for (let i in list) {
          if (i.length == 3 && i != '010' && i != '020' && i != '030' && i != '040') {
            continue;
          }
          if (i.length > 6 || i == 'hwgat') {
            continue;
          }
          if (parseInt(i.toString().substring(0, 2)) >= 32) {
            continue;
          }
          let temp = {};
          temp.code   = i;
          temp.name   = list[i][0];
          temp.pinyin = list[i][1];
          temp.py     = list[i][2];
          dataArr.push(temp);
        }
        return dataArr;
      },
    },
    // 实例挂载完成钩子函数
    mounted: function () {
      var _this=this;
      _this.hot_city = _this.AddHotCity();
      _this.province_list = _this.AddProvince();
      _this.search_value = _this.searchData();
    },
    watch: {
      search_content: function (val) {
        this.search(val);
      }
    },
    // 实时计算
    computed: {
      filter_len_bool: function () {
        return Object.keys(this.result_city).length < this.max_len;
      },
    },
  }
</script>

<style scoped lang="less">
  
</style>
