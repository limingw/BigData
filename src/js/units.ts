const unit = {
  // 判空方法
  IsEmpty: function (str: any) {
    let bool = str === null || str === '' || str === undefined || str === false;
    return !bool;
  },
  // 对象浅拷贝
  ObjectCopy: function (target: object) {
    let o = {};
    for (let i in target) {
      o[i] = target[i];
    }
    return o;
  },
  // 数组浅拷贝
  ArrayCopy: function(arr: Array<any>) {
    let a = [];
    arr.map(function (item, index) {
      a.push(item);
    });
    return a;
  },
  // 判断字符在不在数组中
  IsInArray: function (arr: Array<any>, target: any) {
    arr.map(function (item) {
      if(target === item) {
        return true;
      }
    });
    return false;
  },

  GetCookie(name: string) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return (arr[2]);
    } else {
      return null;
    }
  },
  // 给赋值昨天的时间
  GetYesterdayTime: function (type: number) {
    let day1 = new Date();
    day1.setTime(day1.getTime()-24*60*60*1000);
    let s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
    let s2 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
    let a = [];
    if (type === 1) {
      a = [s1, s2];
    } else if (type === 2) {
      a = ['00:00:00', '00:16:59'];
    } else {
      a = [s1 + ' 00:00:00', s1 + ' 23:59:59'];
    }
    return a;
  },
};

export default unit
