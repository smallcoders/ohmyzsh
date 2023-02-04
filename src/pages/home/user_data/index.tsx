import React, { useState, useEffect, useMemo } from 'react';
import { DatePicker, message, Radio} from 'antd';
import type { RadioChangeEvent } from 'antd';
import moment from 'moment';
import type { Moment } from 'moment';
import scopedClasses from '@/utils/scopedClasses';
import { getUserStatistice, getUserLineList } from '@/services/home';
import * as echarts from 'echarts';
import './index.less';
import dayjs from 'dayjs';

const sc = scopedClasses('home-page-user-data');
const { RangePicker } = DatePicker;

enum pageOptionsEnum {
  ACCOUNT_TYPE = 'ACCOUNT_TYPE',
  DISTRIBUTION = 'DISTRIBUTION',
  SOURCE = 'SOURCE',
}

type RangeValue = [Moment | null, Moment | null] | null;

export const endDateTime = dayjs().format('YYYY-MM-DD')
export const sevenDayTime = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
export const fifteenDayTime = dayjs().subtract(15, 'day').format('YYYY-MM-DD')
export const thirtyDayTime = dayjs().subtract(30, 'day').format('YYYY-MM-DD')

// 获取最近几天的数组 7 15 30, 返回数组
export const getDay = (data: any,endDate?: any) => {
  // endDate 基准时间
  let arr = []
  for (let i = 0; i < data; i++) {
    const time = data - i;
    if (endDate) {
      arr.push(dayjs(endDate).subtract(time, 'day').format('YYYY-MM-DD'))
    } else {
      arr.push(dayjs().subtract(time, 'day').format('YYYY-MM-DD'))
    }
  }
  return arr
}

//计算天数差的函数，通用  
export function DateDiff(sDate1: string,  sDate2: string){    //sDate1和sDate2是2006-12-18格式  
  var  aDate,  oDate1,  oDate2,  iDays  
  aDate  =  sDate1.split("-")  
  oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2006格式  
  aDate  =  sDate2.split("-")  
  oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  
  iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
  return  iDays  
}

// 这里的最近7天，我来处理，传参数也是开始时间和结束时间
export const options = [
  { 
    label: '最近7天', 
    value: '1'
  },
  { 
    label: '最近15天', 
    value: '2'
  },
  { 
    label: '最近30天', 
    value: '3'
  },
];

type quicklyDateValue = string | null;

export default () => {
  const [activeCount, setActiveCount] = useState<number>(0)
  const [cancelCount, setCancelCount] = useState<number>(0)
  const [pageType, setPageType] = useState('ACCOUNT_TYPE');
  // 时间选择器
  const [quicklyDate, setQuicklyDate] = useState<quicklyDateValue>('1'); // 数据时间的默认值
  const [dates, setDates] = useState<RangeValue>(null);
  const [hackValue, setHackValue] = useState<RangeValue>(null);
  const [value, setValue] = useState<RangeValue>(null);
  // 限制时间选择器的开始和结束时间
  const disabledDate = (current: Moment) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    return !!tooEarly || !!tooLate || current > moment().startOf('day');
  };
  const onOpenChange = (open: boolean) => {
    if (open) {
      // 开启时：展示hackValue的值
      setHackValue([null, null]);
      setDates([null, null]);
    } else {
      // 关闭时，展示value的值
      setHackValue(null);
    }
  };

  // 当前label的Name，用于Echarts
  const pageOptionsName = {
    [pageOptionsEnum.ACCOUNT_TYPE]: '用户类型',
    [pageOptionsEnum.DISTRIBUTION]: '用户各端分布',
    [pageOptionsEnum.SOURCE]: '用户来源',
  }[pageType];

  const pageOptions = [
    { label: '用户类别', value: 'ACCOUNT_TYPE' },
    { label: '用户各端分布', value: 'DISTRIBUTION' },
    { label: '用户来源', value: 'SOURCE' },
  ];

  const changePageType = ({ target: { value } }: RadioChangeEvent) => {
    setPageType(value);
  };

  const chartShow = (data?: any) => {
    let myChart = echarts.init(document.getElementById('home-page-user-data-charts'));
    myChart.setOption({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        top:'12%',
        right: '1px',
        selectedMode: false, // 标签是否支持点击
        icon: 'circle', // 标签icon类型 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'，
        // formatter: `{name} ${dataSource}`,
        formatter: function (name:any) {
          let p = ''
          data.items.forEach((item: any) => {
            if (item.name === name) {
              p = item.rate + '%'
            }
          })
          return `${name} ${p}`
        },
      },
      series: [
        {
          center: ['25%', '40%'], // 饼图的位置
          name: pageOptionsName, //label的title
          type: 'pie',
          radius: ['40%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 3,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data && data.items,
        },
      ],
    });
  };

  const chartRightShow = (data?: any) => {
    const {xAxisData, series} = data || {}
    const dataSource = series && series?.map((item: any) => {
      return item?.name
    })
    let myChart = echarts.init(document.getElementById('home-page-user-data-charts-right'));
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
        backgroundColor: 'rgba(0,0,0,.7)',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        data: dataSource,
        bottom: '5px',
        icon: 'rect', // 标签icon类型 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'，
        itemHeight: 3, //修改icon图形大小
      },
      xAxis: {
        type: 'category',
        // X轴的区间，需要根据search进行改变
        data: xAxisData,
        axisTick: { alignWithLabel: true}, // 控制样式里的X轴字在中间距离Y轴还有点距离
      },
      yAxis: {
        type: 'value',
        // maxNumber 显示最大值
        // max: 400,
        // splitLine: {
        //   show: true,
        // },
      },
      series: series,
    });
  };

  const changeQuicklyDate = ({ target: { value } }: RadioChangeEvent) => {
    setValue(null);
    setQuicklyDate(value);
  };

  const prepare = async (data: string) => {
    try {
      const res = await getUserStatistice(data)
      if (res?.code === 0) {
        const {activeCount, cancelCount, pieChart } = res?.result || {}
        // 根据res,组织对象
        let a = {
          activeCount: activeCount, // 昨日活跃用户数
          cancelCount: cancelCount, // 昨日注销用户数
          items: pieChart?.items?.map((item: any) => {
            return {
              name: item.name,
              count: item.count,
              rate: item.rate,
              value: item.count, // 饼图的提示
            }
          })
        }
        setActiveCount(activeCount)
        setCancelCount(cancelCount)
        // 将整理好的数据传给echarts
        chartShow(a);
      } else {
        message.error(res?.result.message);
      }
    } catch (error) {
      console.log('error',error)
    }
  };

  const prepareRight = async (data?: any) => {
    try {
      const {startDate, endDate, xAxisData} = data || {}
      const res = await getUserLineList({
        startDate: startDate || '',
        endDate: endDate || '',
      })
      if (res?.code === 0) {
        const {items, maxNumber} = res?.result || {}
        let series = [] as any
        // 渲染折线图
        series = items?.map((item: any) => {
          let data = [] as any
          item?.data?.forEach((item: any) => {
            const {count, date} = item || {}
             data.push(count)
          })
          return {
            name: item?.name,
            data: data,
            type: 'line',
          }
        })
        chartRightShow({xAxisData, series})
      } else {
        throw new Error("");
      }
    } catch (error) {
      console.log('error',error)
    }
  }

  // 左侧统计数据
  useEffect(() => {
    prepare(pageType)
  }, [pageType]);

  useEffect(() => {
    if (!value) return;
    setQuicklyDate(null)
    const startDate = moment(value[0]).format('YYYY-MM-DD');
    const endDate = moment(value[1]).format('YYYY-MM-DD');
    let xAxisData = [] as any;
    let data = DateDiff(startDate,dayjs(endDate).add(1, 'day').format('YYYY-MM-DD'))
    if (data > 1) {
      xAxisData = getDay(data, dayjs(endDate).add(1, 'day').format('YYYY-MM-DD'));
      xAxisData.pop();
    } else {
      xAxisData = [startDate];
    }
    // 传参，拿数据，修改折线图数据
    prepareRight({startDate, endDate, xAxisData})
  },[value])

  useEffect(() => {
    if (!quicklyDate) return;
    let xAxisData = [] as any;
    let startDate = '';
    let endDate = endDateTime;
    switch (quicklyDate) {
      case '1':
        xAxisData = getDay(7);
        startDate = sevenDayTime;
        break;
      case '2':
        startDate = fifteenDayTime;
        xAxisData = getDay(15);
        break;
      case '3':
        startDate = thirtyDayTime;
        xAxisData = getDay(30);
        break;
      default:
        break;
    }
    // 传参，拿数据，修改折线图数据
    prepareRight({startDate, endDate, xAxisData})
  },[quicklyDate])

  return (
    <div className={sc('container')}>
      <div className={sc('container-left')}>
        <div className={sc('container-left-top')}>
          <div className={sc('container-left-top-cart')}>
            <div className={sc('container-left-top-cart-label')}>昨日活跃用户数</div>
            <div className={sc('container-left-top-cart-value')}>{activeCount || 0}</div>
          </div>
          <div className={sc('container-left-top-cart')}>
            <div className={sc('container-left-top-cart-label')}>昨日注销用户数</div>
            <div className={sc('container-left-top-cart-value')}>{cancelCount || 0}</div>
          </div>
        </div>
        <div className={sc('container-left-bottom')}>
          <div className={sc('container-left-bottom-label')}>
            <label>统计维度：</label>
            <Radio.Group
              options={pageOptions}
              onChange={changePageType}
              value={pageType}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <div className={sc('container-left-bottom-charts')}>
            <div id="home-page-user-data-charts" style={{ width: '100%', height: 350 }}></div>
          </div>
        </div>
      </div>
      <div className={sc('container-right')}>
          <div className={sc('container-right-search')}>
              <div className={sc('container-right-search-item')}>
                  <label className={sc('container-right-search-item-label')}>数据时间：</label>
                  <Radio.Group
                    options={options}
                    onChange={changeQuicklyDate}
                    value={quicklyDate}
                    optionType="button"
                    buttonStyle="solid"
                  />
                  <RangePicker 
                    size='large'
                    className={sc('container-right-search-item-rangePicker')}
                    allowClear={false}
                    value={hackValue || value}
                    disabledDate={disabledDate}
                    onCalendarChange={val => setDates(val)}
                    onChange={val => setValue(val)}
                    onOpenChange={onOpenChange}
                  />
              </div>
          </div>
          <div id='home-page-user-data-charts-right' style={{width: '100%', height: 420}}></div>
      </div>
    </div>
  );
};
