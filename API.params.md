#所有接口需要添加

分页查询大小: page_size

分页查询页码: page_number

string类型


#1、PV接口
汇总：

(1)、日期时间区间：start_time,end_time(精确到S)

(2)、城市: city: //直接传城市名

返回数据：

(1)、sex:0=>女,1=>男,2=>未知

(2)、gap_time：格式化...S

(3)、after_oper_id：null=>'失败',反之=>'成功'

(4)、code:'0'=>失败=>data:nulldata,'1'=>成功


频次统计：

(1)、日期(选择一天)：l_date

(2)、流量方：全部流量方：传空值,反之传=>flow_id

(3)、全部用户传空值，单一用户填open_id或者id

(4)、用户唯一id: id


#2、接口数据
(1)、日期时间区间：start_time,end_time(精确到S)

(2)、城市：city：默认全国(传空值),反正传城市名，用,隔开

返回数据：
(1)、sex:0=>女,1=>男,2=>未知


#3、异常数据
(1)、日期时间区间：start_time,end_time(精确到S)

(2)、城市：city：默认全国(传空值),反正传城市名，用,隔开

(3)、flow_id:流量方ID,可以传空值

(4)、view_id:view_id,可以传空值

返回数据：
(1)、sex:0=>女,1=>男,2=>未知

#4、广告数据
(1)、日期：start_date, end_date
(2)、时间：start_time, end_time
(3)、城市：string(,)隔开












