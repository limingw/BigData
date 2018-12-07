<template>
  <div class="city">
    <!-- 城市的结果 -->
    <div class="result" @click="choiceSet">
      <span v-for="(item, index) in last_city" :key="index">{{item}}</span>
      <span v-if="last_city.length === 0">全国</span>
    </div>

    <!-- 进行选择 -->
    <div class="choice_bg" v-show="choice_bool">
      <div class="choice_box" >
        <div class="aui_outer aui_border">
          <!-- 头部 -->
          <div class="aui_header">
            <div class="aui_title">选择城市</div>
            <div class="aui_close" @click="choiceSet"><i class="el-icon-close"></i></div>
          </div>

          <!-- 选中暂时存放的 -->
          <div class="aui_result">
            <!-- 提示 -->
            <div class="tic">最多可选择{{max_len}}项</div>
            <div class="data-result">
              <span v-for="(item, index) in result_city" :key="index">{{item.city[0]}}<i @click="deleteCity(index)">×</i></span>
            </div>
          </div>
          <div class="aui_content">
            <!-- 搜索的顶部 -->
            <div class="content_title">
              <!-- 标题栏，全部省份或者单独省份的城市的标题 -->
              <ul class="data_tabs">
                <li :class="{active: tap_bool}" @click="showProvince(1)">全部省份</li>
                <li class="active" v-show="!tap_bool">{{province_city_title}}</li>
              </ul>
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
                    @click="addSearch(item.code)"
                    class="area_menu">
                    <em>{{item.pinyin}}</em>
                    {{item.name}}
                  </a>
                </div>
              </div>
            </div>
            <div class="data-container">
              <div class="view-all" v-show="tap_bool">
                <div class="hot view">
                  <p class="data-title">热门城市</p>
                  <ul class="data-list">
                    <li v-for="(item, index) in hot_city" :key="index">
                      <span class="d-item" :class="{d_active: item.active}" @click="addHot(index)">
                        {{item.city[0]}}</span>
                    </li>
                  </ul>
                </div>
                <div class="province view">
                  <p class="data-title">全部省份</p>
                  <ul class="data-list">
                    <li v-for="(item, index) in province" :key="index">
                      <span class="d-item" @click="getProvinceCity(index)">
                        {{item.city[0]}}
                        <label v-show="item.num > 0">{{item.num}}</label>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- 一个省份的城市 -->
              <div class="view-one" v-show="!tap_bool">
                <ul class="data-list">
                  <li v-for="(item, index) in province_city" :key="index">
                    <span class="d-item" :class="{d_active: item.active}" @click="addProvinceCity(index)">{{item.city[0]}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="aui_footer">
              <div class="footer_left">
                <button class="btn" @click="allCity()">全国</button>
              </div>
              <div class="footer_right">
                <button class="btn" @click="choiceSet">取消</button>
                <button class="btn" @click="sure">确认</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LocalDataCities from '../js/City_data.js'
  export default {
    name: 'NewCity',
    data() {
      return {
        // 城市的数组
        last_city: [],
        choice_bool: false,
        tap_bool: true,
        // 热门城市
        hot_city: [
          {
            active: false,
            code: '',
            city: [],
          }
        ],
        // 省份
        province: [
          {
            active: false,
            code: '',
            city: [],
            num: ''
          }
        ],
        hot_city_code:LocalDataCities.category.hotcities,                     //热门城市code
        province_code: LocalDataCities.category.provinces,

        // 结果列表
        result_city: {},
        // 省份城市
        province_city: {},
        // 省名
        province_city_title: '',
        max_len: 6,
        // 搜索结果
        search_bool: false,
        search_content: '',
        // 搜索结果
        search_result: {},

        // 搜索内容
        search_value: [],
      }
    },
    // 实时计算
    computed: {
      filter_len_bool: function () {
        return Object.keys(this.result_city).length < this.max_len;
      },
    },
    // 实例挂载结束
    mounted: function() {
      let _this = this;
      _this.addHotCity();
      _this.addProvince();

      _this.search_value = _this.searchData();
    },
    watch: {
      search_content: function (val) {
        this.search(val);
      }
    },
    // 静态方法
    methods: {
      // 确定
      sure: function() {
        let _this = this;
        let a = [];
        for (let i in _this.result_city) {
          a.push(_this.result_city[i].city[0]);
        }
        _this.last_city = a;

        let b = a.join(',') || '全国';
        // 对父组件传值
        this.$emit('getstr', b)
        _this.choiceSet();
      },
      // 对象浅拷贝
      ObjectCopy: function (target) {
        let o = {};
        for (let i in target) {
          o[i] = target[i];
        }
        return o;
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
      choiceSet: function () {
        let _this = this;
        _this.choice_bool = !_this.choice_bool;
      },
      // 初始化热门城市
      addHotCity: function () {
        let _this = this;
        let a = {};
        _this.hot_city_code.map(function (item) {
          let temp = {};
          temp.code = item;
          temp.active = false;
          temp.city = LocalDataCities.list[item];
          a[item] = temp;
        });
        _this.hot_city = a;
      },
      // 初始化省份
      addProvince:function() {
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
        _this.province = a;
      },
      // 给省份选中的加1
      addProvinceNum: function(code, type) {
        let _this = this;
        let temp = code.substr(0,3);
        for (let key in _this.province) {         //增加省份相对应的已选城市数量
          if(temp === _this.province[key].code){
            if (type === 1) {
              _this.$set(_this.province[key], 'num', _this.province[key].num + 1);
            } else {
              _this.$set(_this.province[key], 'num', _this.province[key].num - 1);
            }
          }
        }
      },
      //添加搜索城市
      addSearch: function(code) {
        let _this = this;
        let temp = {};
        temp.code = code;
        temp.city = LocalDataCities.list[code];
        temp.active = true;
        if (_this.filter_len_bool) {
          _this.$set(_this.result_city, code, temp)
        } else {
          let str = '最多选中' + _this.max_len + '项';
          _this.$message(str);
        }
      },
      //添加热门城市
      addHot: function (code) {
        let _this = this;
        let hot = _this.hot_city[code];
        // 选中的
        if (hot.active) {
          _this.$set(_this.hot_city[code], 'active', false);
          this.$delete(this.result_city, code);
          _this.addProvinceNum(code, 0);
        } else {
          if (_this.filter_len_bool) {
            _this.$set(_this.hot_city[code], 'active', true);
            this.$set(this.result_city, code, _this.hot_city[code]);
            _this.addProvinceNum(code, 1);
          } else {
            let str = '最多选择' + _this.max_len + '项';
            _this.$message(str);
          }
        }
      },
      // 添加省份城市
      addProvinceCity: function(code) {
        let _this = this;
        // 未选中的
        let temp = _this.province_city[code];
        if (temp.active) {
          _this.$set(_this.province_city[code], 'active', false);
          this.$delete(this.result_city, code);
          _this.addProvinceNum(code, 0);
        } else {
          if (_this.filter_len_bool) {
            _this.$set(_this.province_city[code], 'active', true);
            this.$set(this.result_city, code, _this.province_city[code]);
            _this.addProvinceNum(code, 1);
          } else {
            let str = '最多选择' + _this.max_len + '项';
            _this.$message(str)
          }
        }
      },
      // 更新省份城市
      getProvinceCity: function (code) {
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
        });
        _this.province_city = a;
        _this.showProvince();
        _this.province_city_title = _this.province[code].city[0];
      },
      // 省份和全部之间切换
      showProvince: function (type) {
        let _this = this;
        if (type === 1) {
          _this.tap_bool = true;
          // 更新热门城市
          for (let code in _this.result_city) {
            for (let i in _this.hot_city) {
              if (code === i) {
                _this.$set(_this.hot_city[code], 'active', true);
              }
            }
          }
        } else {
          _this.tap_bool = false;
        }
      },
      // 删除选中结果
      deleteCity: function (code) {
        let _this = this;
        // 指向同一个对象，然后在从结果列表中删除
        _this.$set(_this.result_city[code], 'active', false);
        _this.$delete(this.result_city, code);

        if (_this.tap_bool) {
          // 遍历热门城市，然后和删除选中
          for (let i in _this.hot_city) {
            if (i === code) {
              _this.$set(_this.hot_city[code], 'active', false);
            }
          }
        } else {
          // 遍历省份城市，然后和删除选中
          for (let i in _this.province_city) {
            if (i === code) {
              _this.$set(_this.province_city[code], 'active', false);
            }
          }
        }
      },

      // 全国选中
      allCity: function () {
        let _this = this;
        for (let i in _this.result_city) {
          _this.deleteCity(i);
        }
        for (let j in _this.province) {
          _this.province[j].num = 0;
        }
      },

      // 重置按钮
      defaultCity: function () {
        this.allCity();
        let _this = this;
        let a = [];
        for (let i in _this.result_city) {
          a.push(_this.result_city[i].city[0]);
        }
        _this.last_city = a;
        let b = a.join(',') || '全国';
        // 对父组件传值
        this.$emit('getstr', b);
      }
    },
  }
</script>
<style scoped lang="less">
  @import "../style/city1.less";
</style>
