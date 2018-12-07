// 用于存放常量配置
const STATE = {
  // 默认的时间time


  // 侧边栏的数据
  Aside: [
    {
      name: '首   页',
      link: '/Home',
      icon: 'icon iconfont icon-yemian'
    },
    {
      name: '广告数据',
      link: '/Advert',
      icon: 'icon iconfont icon-guanggaoshuju'
    },
    {
      name: '用户数据',
      link: '/User/UserCollect',
      icon: 'icon iconfont icon-yonghushuju'
    },
    {
      name: '流量方数据',
      link: '/Flow/FlowCollect',
      icon: 'icon iconfont icon-liuliang'
    },
    {
      name: 'PV数据',
      link: '/PV/Collect',
      icon: 'icon iconfont icon-PV'
    },
    {
      name: '页面数据',
      link: '/Page',
      icon: 'icon iconfont icon-yemianshuju'
    },
    {
      name: ' 异常数据',
      link: '/Abnormal',
      icon: 'icon iconfont icon-ycsj'
    },
    {
      name: '接口数据',
      link: '/Nozzle',
      icon: 'icon iconfont icon-jiekou'
    }
  ],

  paginItem:{                  //公共分页数据
    pagesizeItem:[16,50,100,200,300],
    currentPage:1,         //页码
    pagesize:16,            //页数
  },

  //公共日期快捷选择
  timeItem: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    }]
  },

  //公共日期时间段快捷选择
  timeItems: {
    shortcuts: [
      {
        text: '最近一周',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit('pick', [start, end]);
        }
      }
    ]
  },

  //PV汇总表头
  CollectTable:[
    {
      prop:'open_id',
      label:'用户open_id',
      width:'150',
    },
    {
      prop:'id',
      label:'用户唯一ID',
      width:'150',
    },
    // {
    //   prop:'4543',
    //   label:'平台id',
    //   width:'150',
    // },
    {
      prop:'view_id',
      label:'view_id',
      width:'150',
    },
    {
      prop:'ip',
      label:'IP',
      width:'150',
    },
    {
      prop:'city',
      label:'city',
      width:'150',
    },
    {
      prop:'sex',
      label:'sex',
      width:'150',
    },
    {
      prop:'browser_model',
      label:'浏览器信息',
      width:'150',
    },
    {
      prop:'gap_time',
      label:'PV时间',
      width:'150',
    },
    {
      prop:'after_oper_id',
      label:'是否成功',
      width:'150',
    },
    {
      prop:'create_time',
      label:'时间',
      width:'150',
    },
  ],

  //PV频次统计表头
  FrequencyTable:[
    {
      prop:'data',
      label:'流量方id',
      width:'150',
    },
    {
      prop:'dsd',
      label:'频次',
      width:'150',
    },
    {
      prop:'4543',
      label:'人数',
      width:'150',
    },
    {
      prop:'yhtr',
      label:'日期',
      width:'150',
    },
  ],

    //Pv频次统计的用户下拉
  userItem:[
    {
      userId:'0',
      userName:'全部用户',
    },
    {
      userId:'1',
      userName:'单一用户',
    },
  ],

  //广告数据表头
  AdeverTable:[
    {
      prop:'ad_id',
      label:'广告ID',
      width:'150',
    },
    {
      prop:'advert_type',
      label:'广告类型',
      width:'150',
    },
    {
      prop:'show_sum',
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
      prop:'time',
      label:'时间',
      width:'150',
    },
  ],

  //广告数据页面选择下拉列表
  pageItem:[
    {
      userId:'0',
      userName:'全部页面',
    },
    {
      userId:'1',
      userName:'选择页面',
    },
  ],

  //用户数据汇总表头
  UserCollectTable:[
    {
      prop:'data',
      label:'用户open_id',
      width:'150',
    },
    {
      prop:'dsd',
      label:'用户唯一ID',
      width:'150',
    },
    {
      prop:'4543',
      label:'操作类型(展现或点击)',
      width:'150',
    },
    {
      prop:'yhtr',
      label:'广告ID',
      width:'150',
    },
    {
      prop:'gfd2',
      label:'时间',
      width:'150',
    },
  ],

  //用户数据用户标签标签表头
  TagTable:[
    {
      prop:'data',
      label:'标签',
      width:'150',
    },
    {
      prop:'dsd',
      label:'用户唯一ID',
      width:'150',
    },
    {
      prop:'4543',
      label:'标签匹配度',
      width:'150',
    },
  ],

  // 分页的大小数组
  PAGE_SIZE: [ 16, 32, 64, 128, 256 ]

};
export default STATE;
