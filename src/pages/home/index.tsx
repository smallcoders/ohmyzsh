import type { RadioChangeEvent } from 'antd';
import { Col, Row, Radio, DatePicker, Input, message } from 'antd';
import { ArrowUpOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Moment } from 'moment';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState, useEffect } from 'react';
import * as echarts from "echarts";
import './index.less'
import {getAddedDataYesterday, getStatistics} from '@/services/home'

const sc = scopedClasses('home-page');
const { RangePicker } = DatePicker;

const options = [
    { label: '最近7天', value: '1' },
    { label: '最近30天', value: '2' },
    { label: '最近90天', value: '3' },
];
const pageOptions = [
    { label: '全站', value: '1' },
    { label: '首页', value: '2' },
    { label: '应用列表', value: '3' },
    { label: '政策首页', value: '4' },
    { label: '诊断首页', value: '5' },
    { label: '需求列表', value: '6' },
    { label: '解决方案列表', value: '7' },
    { label: '科产首页', value: '8' }
];
const statisticsType = {
    'USER': '用户注册数量',
    'ENTERPRISE': '企业认证数量',
    'EXPERT': '专家数量',
    'ENTERPRISE_DEMAND': '企业需求数量',
    'CREATIVE_DEMAND': '创新需求数量',
    'CREATIVE_ACHIEVEMENT': '科技成果数量',
    'APP': '应用数量',
    'SOLUTION': '解决方案数量'
}

type RangeValue = [Moment | null, Moment | null] | null;

export default () => {
    const [addedDataYesterday, setAddedDataYesterday] = useState<any>({})
    const [statistics, setStatistics] = useState<any>([])
    const [quicklyDate, setQuicklyDate] = useState('1');
    const [dates, setDates] = useState<RangeValue>(null);
    const [hackValue, setHackValue] = useState<RangeValue>(null);
    const [value, setValue] = useState<RangeValue>(null);
    const disabledDate = (current: Moment) => {
        if (!dates) {
          return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 90;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 90;
        return !!tooEarly || !!tooLate || current > moment().startOf('day');
    };
    const onOpenChange = (open: boolean) => {
        if (open) {
            setHackValue([null, null]);
            setDates([null, null]);
        } else {
            setHackValue(null);
        }
    };
    const changeQuicklyDate = ({ target: { value } }: RadioChangeEvent) => {
        console.log('date checked', value);
        setQuicklyDate(value);
    };

    const [pageType, setPageType] = useState('1');
    const changePageType = ({ target: { value } }: RadioChangeEvent) => {
        console.log('page checked', value);
        setPageType(value);
    };

    const chartShow = () => {
        let myChart = echarts.init(document.getElementById('charts'));
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                },
                backgroundColor: 'rgba(0,0,0,.7)',
                textStyle: {
                    color: '#fff'
                }
            },
            legend: {
                data: ['浏览次数（次）', '浏览人数（人）'],
                bottom: '5px'
              },
            xAxis: {
                type: 'category',
                data: ['2022-07-27', '2022-07-28', '2022-07-29', '2022-07-30', '2022-07-31', '2022-08-01', '2022-08-02']
            },
            yAxis: {
                type: 'value',
                max: 400,
                splitNumber: 1
            },
            series: [
                {
                    name: '浏览次数（次）',
                    data: [150, 230, 224, 218, 135, 147, 260],
                    type: 'line'
                },
                {
                    name: '浏览人数（人）',
                    data: [50, 330, 124, 298, 175, 197, 60],
                    type: 'line'
                }
            ]
        })
    }

    const prepare = async () => {
        try {
            const res = await Promise.all([
                getAddedDataYesterday(),
                getStatistics()
            ])
            setAddedDataYesterday(res[0].result || {})
            setStatistics(res[1].result || {})
            console.log('@@@',res[0].result)
            console.log('@@@',res[1].result) // 数组
        } catch (error) {
            console.log(error)
            message.error('服务器错误');
        }
    }
    useEffect(() => {
        prepare()
        chartShow();
    },[]);

    const {diagnosisIntentionCount, appConsultationCount, solutionIntentionCount, expertConsultationCount, liveIntentionCount} = addedDataYesterday || {}

    return (
        <>
            <div className={sc('container')}>
                <h3>业务咨询昨日新增数据</h3>
                <Row gutter={40}>
                    <Col span={4} offset={2}>
                        <a className={sc('container-add-item')}
                            href={`/service-config/diagnostic-tasks/index?type=3`}
                        >
                            <p>诊断意向报名</p>
                            <ArrowUpOutlined  style={{ color: 'red' }}/><strong>{diagnosisIntentionCount || 0}</strong>
                        </a>
                    </Col>
                    <Col span={4}>
                        <a className={sc('container-add-item')}
                            href={'/service-config/app-manage/index?type=2'}
                        >
                            <p>应用咨询记录</p>
                            <ArrowUpOutlined  style={{ color: 'red' }}/><strong>{appConsultationCount || 0}</strong>
                        </a>
                    </Col>
                    <Col span={4}>
                        <a className={sc('container-add-item')}
                            href={'/service-config/solution/index?type=2'}
                        >
                            <p>服务意向消息</p>
                            <ArrowUpOutlined  style={{ color: 'red' }}/><strong>{solutionIntentionCount || 0}</strong>
                        </a>
                    </Col>
                    <Col span={4}>
                        <a className={sc('container-add-item')}
                            href={'/service-config/expert-manage/index?type=2'}
                        >
                            <p>专家咨询记录</p>
                            <ArrowUpOutlined  style={{ color: 'red' }}/><strong>{expertConsultationCount || 0}</strong>
                        </a>
                    </Col>
                    <Col span={4}>
                        <a className={sc('container-add-item')}
                            href={'/live-management/intention-collect'}
                        >
                            <p>直播意向管理</p>
                            <ArrowUpOutlined  style={{ color: 'red' }}/><strong>{liveIntentionCount || 0}</strong>
                        </a>
                    </Col>
                </Row>
            </div>
            <div className={sc('container')}>
                <h3>平台关键数据统计</h3>
                <Row gutter={40}>
                    {
                        statistics?.map((item: any)=>{
                            const {type, todayCount, yesterdayChangeCount, weekChangeCount, monthChangeCount} = item || {}
                            return (
                                <Col span={4}>
                                    <div className={sc('container-statistic-item')}>
                                        <p>{statisticsType[type]}</p>
                                        <strong>{todayCount}</strong>
                                        <p>日 <span><PlusOutlined/>{yesterdayChangeCount}</span></p>
                                        <p>周 <span><PlusOutlined/>{weekChangeCount}</span></p>
                                        <p>月 <span><PlusOutlined/>{monthChangeCount}</span></p>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
            <div className={sc('container')}>
                <h3>页面流量统计</h3>
                <div className={sc('container-search')}>
                    <div className={sc('container-search-item')}>
                        <label>数据时间：</label>
                        <Radio.Group
                            options={options}
                            onChange={changeQuicklyDate}
                            value={quicklyDate}
                            optionType="button"
                            buttonStyle="solid"
                        />
                        <RangePicker 
                            value={hackValue || value}
                            disabledDate={disabledDate} 
                            onCalendarChange={val => setDates(val)}
                            onChange={val => setValue(val)}
                            onOpenChange={onOpenChange}
                            style={{marginLeft: 8}}
                        />
                    </div>
                    <div className={sc('container-search-item')}>
                        <label>统计页面：</label>
                        <Radio.Group
                            options={pageOptions}
                            onChange={changePageType}
                            value={pageType}
                            optionType="button"
                            buttonStyle="solid"
                        />
                        <Input placeholder="请输入要查看页面流量的页面地址" style={{width: 256, marginLeft: 8}}/>
                    </div>
                </div>
                <div id='charts' style={{width: '100%', height: 500}}></div>
            </div>
        </>
    )
}