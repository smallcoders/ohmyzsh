import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Col, Row, Button, DatePicker, Modal, message, Radio, Select, Tabs } from 'antd';
import type { RadioChangeEvent } from 'antd';
import moment from 'moment';
import type { Moment } from 'moment';
import scopedClasses from '@/utils/scopedClasses';
import { getDemandStatistics, getAnalysisDemandList } from '@/services/home';
import * as echarts from 'echarts';
import './index.less';
import dayjs from 'dayjs';
import { options, DateDiff, getDay, endDateTime, sevenDayTime, fifteenDayTime, thirtyDayTime, colorList } from '../user_data/index'
import { getAhArea } from '@/services/area';

const sc = scopedClasses('home-page-enterprise-data');
const { RangePicker } = DatePicker;

enum pageOptionsEnum {
  TYPE = 'TYPE',
}

type quicklyDateValue = string | null;

type RangeValue = [Moment | null, Moment | null] | null;

export default () => {
  const [demandCount, setDemandCount] = useState<number>(0);
  const [pageType, setPageType] = useState('TYPE');
  // 所属区域(16地市 + 其他)
  const [area, setArea] = useState<any[]>([]);
  const [ selectDate, setSelectDate] = useState<quicklyDateValue>(null);
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
    [pageOptionsEnum.TYPE]: '需求区域分布',
  }[pageType];

  // 复选框的值
  const pageOptions = [
    { label: '需求区域分布', value: 'TYPE' },
  ];

  const changePageType = ({ target: { value } }: RadioChangeEvent) => {
    setPageType(value);
  };

  useEffect(() => {
    prepare(pageType)
  }, [pageType]);

  const chartShow = (data?: any) => {
    let myChart = echarts.init(document.getElementById('home-page-enterprise-data-charts'));
    myChart.setOption({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        // width: '300px',
        height: '160px',
        // height: '130px',
        orient: 'vertical', // 排列方向，横纵 horizontal vertical
        itemWidth: 14, // 设置宽度
        itemHeight: 14, // 设置高度
        bottom:'0px',
        right: 'center',
        selectedMode: true, // 标签是否支持点击
        icon: 'circle', // 标签icon类型 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'，
        formatter: function (name:any) {
          let p = ''
          data.items.forEach((item: any) => {
            if (item.name === name) {
              p = item.rate
            }
          })
          return `${name}    ${p}`
        },
      },
      series: [
        {
          center: ['50%', '28%'], // 饼图的位置
          name: pageOptionsName, //label的title
          type: 'pie',
          radius: ['40%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 3,
            borderColor: '#fff',
            borderWidth: 2,
            color: function (colors: any) {
              var colorList = [
                '#0068FF',
                '#1CD8ED',
                '#0FEA97',
                '#25D48F',
                '#0FEA97',
                '#DFF32D',
                '#FFD900',
                '#FF8E02',
                '#FF4F17',
                '#FF1975',
                '#CE11F0',
                '#6714FF',
                '#593472',
                '#934747',
                '#9A8E46',
                '#649A46',
                '#46889A',
              ];
              return colorList[colors.dataIndex];
            }
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

  const prepare = async (data: string) => {
    try {
      const res = await getDemandStatistics()
      if (res?.code === 0) {
        const {demandCount, pieChart } = res?.result || {}
        // 根据res,组织对象
        let a = {
          items: pieChart?.items?.map((item: any) => {
            return {
              name: item.name,
              count: item.count,
              rate: item.count, // 列表的展示
              value: item.count, // 饼图的提示
            }
          })
        }
        setDemandCount(demandCount)
        chartShow(a);
      } else {
        message.error(res?.result.message);
      }
    } catch (error) {
      console.log('error',error)
    }
  };

  useEffect(() => {
    getAhArea().then((res) => {
      setArea(res)
    })
  }, []);

  // 最近标签事件
  const changeQuicklyDate = ({ target: { value } }: RadioChangeEvent) => {
    setValue(null);
    setQuicklyDate(value);
  };

  const chartRightShow = (data?: any) => {
    const {xAxisData, series} = data || {}
    const dataSource = series && series?.map((item: any) => {
      return item?.name
    })
    let myChart = echarts.init(document.getElementById('home-page-enterprise-demand-data-charts-right'));
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
      grid: {
        top: '40',
        // height: '244',
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
        // }
      },
      series: series,
    });
  };

  const prepareRight = async (data?: any) => {
    try {
      const {startDate, endDate, areaCode, xAxisData} = data || {}
      const res = await getAnalysisDemandList({
        startDate: startDate || '',
        endDate: endDate || '',
        areaCode: areaCode || '',
      })
      if (res?.code === 0) {
        // 拿数据
        const {items, maxNumber } = res?.result || {}
        let series = [] as any;
        series = items?.map((item: any, index: any) => {
          let data = [] as any
          item?.data?.forEach((item: any) => {
            const {count, date} = item || {}
             data.push(count)
          })
          return {
            name: item?.name,
            data: data,
            type: 'line',
            itemStyle: {
              normal: {
                color: colorList[index],
                lineStyle: {
                  color: colorList[index],
                }
              }
            }
          }
        })
        // 渲染折线图
        chartRightShow({xAxisData, series})
      } else {
        throw new Error("");
      }
    } catch (error) {
      console.log('error',error)
    }
  }

  const watchTime = (value: any) => {
    let startDate = moment(value[0]).format('YYYY-MM-DD');
    let endDate = moment(value[1]).format('YYYY-MM-DD');
    if (startDate == endDate) {
      endDate = dayjs(endDate).add(1, 'day').format('YYYY-MM-DD')
    }
    let xAxisData = [] as any;
    let data = DateDiff(startDate,dayjs(endDate).add(1, 'day').format('YYYY-MM-DD'))
    if (data > 1) {
      xAxisData = getDay(data, dayjs(endDate).add(1, 'day').format('YYYY-MM-DD'));
      xAxisData.pop();
    } else {
      xAxisData = [startDate];
    }
    return {
      startDate,
      endDate,
      xAxisData
    }
  }
  // 监听时间选择器
  useEffect(() => {
    if (!value) return;
    setQuicklyDate(null);
    if (selectDate) {
      watchSelectDate(selectDate)
    } else {
      prepareRight(watchTime(value))
    }
  },[value])

  const watchSelectDate = (selectDate: any) => {
    let areaCode = {areaCode: selectDate}
    if (value) {
      let dataSource = Object.assign(watchTime(value), areaCode)
      prepareRight(dataSource)
      return
    }
    if (quicklyDate) {
      let dataSource = Object.assign(watchDateTime(quicklyDate), areaCode)
      prepareRight(dataSource)
      return
    }
  }
  useEffect(() => {
    if (!selectDate) return;
    watchSelectDate(selectDate)
  },[selectDate])

  const watchDateTime = (quicklyDate: any) => {
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
    return {
      startDate,
      endDate,
      xAxisData
    }
  }
  // 监听最近7 15 30
  useEffect(() => {
    if (!quicklyDate) return;
    if (selectDate) {
      watchSelectDate(selectDate)
    } else {
      prepareRight(watchDateTime(quicklyDate))
    }
  },[quicklyDate])

  const selectClear = () => {
    if (value) {
      prepareRight(watchTime(value))
    }
    if (quicklyDate) {
      prepareRight(watchDateTime(quicklyDate))
    }
  }

  return (
    <div className={sc('container')}>
      <div className={sc('container-left')}>
        <div className={sc('container-left-top')}>
          <div className={sc('container-left-top-cart')}>
            <div className={sc('container-left-top-cart-label')}>企业需求累计总数（去重后数据）</div>
            <div className={sc('container-left-top-cart-value')}>{demandCount || 0}</div>
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
            <div id="home-page-enterprise-data-charts" style={{ width: '100%', height: 350 }}></div>
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
          <div className={sc('container-right-search-item')} style={{paddingTop: '14px'}}>
            <label className={sc('container-right-search-item-label')}>所属区域：</label>
            <Select 
              className={sc('container-right-search-item-select')} 
              placeholder="请选择" 
              allowClear 
              onChange={val => setSelectDate(val)}
              onClear={() => selectClear()}
              size='large'
            >
              {area?.map((item: any) => (
                <Select.Option key={item?.code} value={Number(item?.code)}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <div id='home-page-enterprise-demand-data-charts-right' style={{width: '100%', height: 420}}></div> 
      </div>
    </div>
  );
};
