import type { RadioChangeEvent } from 'antd';
import { Col, Row, Button, DatePicker, Modal, message } from 'antd';
import { ArrowUpOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Moment } from 'moment';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import './index.less';
import { getAddedDataYesterday, getStatistics } from '@/services/home';
import { useHistory } from 'react-router-dom';
import { routeName } from '@/../config/routes';
import { divide } from 'lodash';
import { Access, useAccess } from 'umi';

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
  { label: '科产首页', value: '8' },
];
const statisticsType = {
  USER: '用户注册数量',
  ENTERPRISE: '企业认证数量',
  EXPERT: '专家数量',
  ENTERPRISE_DEMAND: '企业需求数量',
  CREATIVE_DEMAND: '创新需求数量',
  CREATIVE_ACHIEVEMENT: '科技成果数量',
  APP: '应用数量',
  SOLUTION: '解决方案数量',
};

type RangeValue = [Moment | null, Moment | null] | null;

export default () => {
  const history = useHistory();
  const [addedDataYesterday, setAddedDataYesterday] = useState<any>({});
  const [statistics, setStatistics] = useState<any>([]);
  const [quicklyDate, setQuicklyDate] = useState('1');
  const [dates, setDates] = useState<RangeValue>(null);
  const [hackValue, setHackValue] = useState<RangeValue>(null);
  const [value, setValue] = useState<RangeValue>(null);
  // 拿到当前角色的access权限兑现
  const access = useAccess()
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
            backgroundColor: '#6a7985',
          },
        },
        backgroundColor: 'rgba(0,0,0,.7)',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        data: ['浏览次数（次）', '浏览人数（人）'],
        bottom: '5px',
      },
      xAxis: {
        type: 'category',
        data: [
          '2022-07-27',
          '2022-07-28',
          '2022-07-29',
          '2022-07-30',
          '2022-07-31',
          '2022-08-01',
          '2022-08-02',
        ],
      },
      yAxis: {
        type: 'value',
        max: 400,
        splitNumber: 1,
      },
      series: [
        {
          name: '浏览次数（次）',
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
        {
          name: '浏览人数（人）',
          data: [50, 330, 124, 298, 175, 197, 60],
          type: 'line',
        },
      ],
    });
  };

  const prepare = async () => {
    try {
      const res = await Promise.all([getAddedDataYesterday(), getStatistics()]);
      if (res[0].code === 0) {
        setAddedDataYesterday(res[0].result || {});
      } else {
        throw new Error("");
      }
      if (res[1].code === 0) {
        setStatistics(res[1].result || []);
      } else {
        throw new Error("");
      }
    } catch (error) {
      console.log(error);
      message.error('服务器错误');
    }
  };
  useEffect(() => {
    prepare();
    // chartShow();
  }, []);

  const {
    diagnosisIntentionCount,
    appConsultationCount,
    solutionIntentionCount,
    expertConsultationCount,
    liveIntentionCount,
  } = addedDataYesterday || {};

  const handleDataStatistic = (item: any) => {
    console.log('e',item)
    const { type } = item || {}
    switch (type) {
      case 'USER':
        if (!access['M_UM_YHXX']) {
          setModalOpen(true)
          return
        }
        history.push(`${routeName.USER_INFO_INDEX}`);
        break;
      case 'ENTERPRISE':
        // history.push(`${routeName.LOGOUT_RECORD}`);
        break;
      case 'EXPERT':
        if (!access['M_UM_ZJZY']) {
          setModalOpen(true)
          return
        }
        history.push(`/user-config/expert-manage/index?type=M_UM_ZJZY`);
        break;
      case 'ENTERPRISE_DEMAND':
        if (!access['M_SD_XQ']) {
          setModalOpen(true)
          return
        }
        history.push(`${routeName.DEMAND_MANAGEMENT_INDEX}`);
        break;
      case 'CREATIVE_DEMAND':
        if (!access['M_SM_XQGL']) {
          setModalOpen(true)
          return
        }
        history.push(`/science-technology-manage/creative-need-manage`);
        break;
      case 'CREATIVE_ACHIEVEMENT':
        if (!access['M_SM_CGGL']) {
          setModalOpen(true)
          return
        }
        history.push(`/science-technology-manage/achievements-manage`);
        break;
      case 'APP':
        if (!access['M_AM_YYZY']) {
          setModalOpen(true)
          return
        }
        history.push(`/apply-manage/app-resource/index`);
        break;
      case 'SOLUTION':
        if (!access['M_SD_FW']) {
          setModalOpen(true)
          return
        }
        history.push(`/supply-demand-setting/solution/index?type=M_SD_FW`);
        break;
    
      default:
        break;
    }
  }

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const handleModalOk = () => {
    setModalOpen(false)
  }
  const motal = (
    <Modal 
      width="300px" 
      title="提示" 
      visible={modalOpen} 
      onOk={handleModalOk}
      footer={[
        <Button key="ensure" type="primary" onClick={handleModalOk}>
          我知道了
        </Button>
      ]
      }
    >
      <p>您没有此页面查看权限，若需要查看，</p>
      <p>请联系权限配置管理员进行权限分配</p>
    </Modal>
  )

  const handleAddItem = (item: any) => {
    switch (item) {
      case '诊断意向报名':
        if (!access['M_DM_ZDBM']) {
          setModalOpen(true)
          return
        }
        history.push(`/diagnose-manage/diagnostic-tasks/index?type=M_DM_ZDBM`);
        break;
      case '应用咨询记录':
        if (!access['M_AM_ZXJL']) {
          setModalOpen(true)
          return
        }
        history.push(`/apply-manage/consult-record`);
        break;
      case '服务意向消息':
        if (!access['M_SD_FWXX']) {
          setModalOpen(true)
          return
        }
        history.push(`/supply-demand-setting/solution/index?type=M_SD_FWXX`);
        break;
      case '专家咨询记录':
        if (!access['M_UM_ZJZX']) {
          setModalOpen(true)
          return
        }
        history.push(`/user-config/expert-manage/index?type=M_UM_ZJZX`);
        break;
      case '直播意向管理':
        if (!access['M_LM_ZBYX']) {
          setModalOpen(true)
          return
        }
        history.push(`/live-management/intention-collect`);
        break;
    }
  }

  return (
    <>
      <div className={sc('container')}>
        <h3>业务咨询昨日新增数据</h3>
        <Row gutter={40}>
          <Col span={4} offset={2}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('诊断意向报名')}}>
              <p>诊断意向报名</p>
              <ArrowUpOutlined style={{ color: 'red' }} />
              <strong>{diagnosisIntentionCount || 0}</strong>
            </div>
          </Col>
          <Col span={4}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('应用咨询记录')}}>
              <p>应用咨询记录</p>
              <ArrowUpOutlined style={{ color: 'red' }} />
              <strong>{appConsultationCount || 0}</strong>
            </div>
          </Col>
          <Col span={4}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('服务意向消息')}}>
              <p>服务意向消息</p>
              <ArrowUpOutlined style={{ color: 'red' }} />
              <strong>{solutionIntentionCount || 0}</strong>
            </div>
          </Col>
          <Col span={4}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('专家咨询记录')}}>
              <p>专家咨询记录</p>
              <ArrowUpOutlined style={{ color: 'red' }} />
              <strong>{expertConsultationCount || 0}</strong>
            </div>
          </Col>
          <Col span={4}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('直播意向管理')}}>
              <p>直播意向管理</p>
              <ArrowUpOutlined style={{ color: 'red' }} />
              <strong>{liveIntentionCount || 0}</strong>
            </div>
          </Col>
        </Row>
      </div>
      <div className={sc('container')}>
        <h3>平台关键数据统计</h3>
        <Row gutter={40}>
          {statistics?.map((item: any) => {
            const { type, todayCount, yesterdayChangeCount, weekChangeCount, monthChangeCount } =
              item || {};
            return (
              <Col span={4}>
                <div className={sc('container-statistic-item')} onClick={()=>{handleDataStatistic(item)}}>
                  <p>{statisticsType[type]}</p>
                  <strong>{todayCount}</strong>
                  <p className={sc('container-statistic-item-content')}>
                    日
                    <span
                      style={{
                        position: 'absolute',
                        left: '55%',
                      }}
                    >
                      {yesterdayChangeCount >= 0 ? <PlusOutlined /> : <MinusOutlined />}
                      {yesterdayChangeCount >= 0 ? yesterdayChangeCount : -yesterdayChangeCount}
                    </span>
                  </p>
                  <p className={sc('container-statistic-item-content')}>
                    周
                    <span
                      style={{
                        position: 'absolute',
                        left: '55%',
                      }}
                    >
                      {weekChangeCount >= 0 ? <PlusOutlined /> : <MinusOutlined />}
                      {weekChangeCount >= 0 ? weekChangeCount : -weekChangeCount}
                    </span>
                  </p>
                  <p className={sc('container-statistic-item-content')}>
                    月
                    <span
                      style={{
                        position: 'absolute',
                        left: '55%',
                      }}
                    >
                      {monthChangeCount >= 0 ? <PlusOutlined /> : <MinusOutlined />}
                      {monthChangeCount >= 0 ? monthChangeCount : -monthChangeCount}
                    </span>
                  </p>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
      {/* <div className={sc('container')}>
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
            </div> */}
        {motal}
    </>
  );
};
