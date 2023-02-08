import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message, Select } from 'antd';

import './index.less';

import scopedClasses from '@/utils/scopedClasses';
import { DateTypeEnum } from '@/types/data-special-topic.d';
// import questionIcon from '@/assets/page_creat_manage/question_icon.png';
import { getRSStatistic } from '@/services/data-special-topic/digital-app-data';

const sc = scopedClasses('digital-app-data');

const DigitalAppData: React.FC = () => {
  const [dateType, setDateType] = useState<DateTypeEnum>(DateTypeEnum.TODAY);
  const [statisticInfo, setStatisticInfo] = useState<Record<string, number | string> | null>(null);

  const timeZoneOption = [
    { label: '今日', value: DateTypeEnum.TODAY },
    { label: '近7天', value: DateTypeEnum.SEVEN_DAYS },
    { label: '近30天', value: DateTypeEnum.THIRTY_DAYS },
    { label: '自上线后（总量）', value: DateTypeEnum.ALL },
  ];

  const overviewCards = [
    {
      name: '人社访客量',
      num: statisticInfo?.pv,
      tooltip:
        '从人社跳转过来的数量（今日：当天人社访问数（0点23点59分）；近7天：近7天的人社访客数；近30天：近30天的人社访客数）',
    },
    {
      name: '礼包领取量',
      num: statisticInfo?.amountReceive,
      tooltip:
        '点击领取的用户总数，未点击关闭页面的不计数（今日：当天人社领取数（0点23点59分）；近7天：近7天的人社领取数；近30天：近30天的人社领取数）',
    },
    {
      name: '人社注册量',
      num: statisticInfo?.amountRegister,
      tooltip:
        '人社链接跳转并且新注册量（今日：当天人社注册量（0点23点59分）；近7天：近7天的人社注册量；近30天：近30天的人社注册量）',
    },
    {
      name: '人社认证量',
      num: statisticInfo?.amountCertification,
      tooltip:
        '人社链接跳转并完成认证的企业数量（今日：当天人社认证量（0点23点59分）；近7天：近7天的人社认证量；近30天：近30天的人社认证量）',
    },
    {
      name: '应用使用量',
      num: statisticInfo?.amountUsage,
      tooltip:
        '应用被点击次数的总和(同账户可以多次累加,按点击次数累加）（今日：当天应用使用量（0点23点59分）；近7天：近7天的应用使用量；近30天：近30天的应用使用量） ',
    },
  ];

  const othersCard = [
    {
      name: '平均停留时长(分钟)',
      num: statisticInfo?.avgStayDuration,
      tooltip: '总时长（所有访客数的浏览时间累加）/总跳访客数（人社访客数）',
    },
  ];

  useEffect(() => {
    getRSStatistic(dateType).then((res) => {
      console.log('res: ', res);
      if (res?.code === 0) {
        setStatisticInfo(res?.result);
      } else {
        message.error(res?.message);
      }
    });
  }, [dateType]);

  function handleDateTypeChange(type: DateTypeEnum) {
    setDateType(type);
  }

  return (
    <PageContainer>
      <div className={sc('container')}>
        <div className="title">人社厅礼包统计</div>
        <div className="overview-title">
          <span className="extra-line">概览</span>
          <Select
            options={timeZoneOption}
            placeholder="请选择"
            style={{ width: 200 }}
            value={dateType}
            onChange={handleDateTypeChange}
          />
        </div>
        <ul className="overview-card-container">
          {overviewCards.map((item) => (
            <li key={item.name}>
              <div className="card-name">
                {item.name}
                {/* <Tooltip title={item.tooltip}>
                  <img className="question-icon" src={questionIcon} alt="" />
                </Tooltip> */}
              </div>
              <p className="num">{item.num}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className={sc('container')}>
        <div className="overview-title">
          <span className="extra-line">其他数据</span>
        </div>
        <ul className="overview-card-container">
          {othersCard.map((item) => (
            <li key={item.name}>
              <div className="card-name">
                {item.name}
                {/* <Tooltip title={item.tooltip}>
                  <img className="question-icon" src={questionIcon} alt="" />
                </Tooltip> */}
              </div>
              <p className="num">{item.num}</p>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
};

export default DigitalAppData;
