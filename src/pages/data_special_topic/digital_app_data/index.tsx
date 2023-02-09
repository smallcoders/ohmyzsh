import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message, Select, Tabs, Tooltip } from 'antd';
import TabPane from '@ant-design/pro-card/lib/components/TabPane';

import './index.less';

import scopedClasses from '@/utils/scopedClasses';
import { DateTypeEnum } from '@/types/data-special-topic.d';
import questionIcon from '@/assets/page_creat_manage/question_icon.png';
import { getRSStatistic } from '@/services/data-special-topic/digital-app-data';

const sc = scopedClasses('digital-app-data');

type StatisticTabContentPropsType = {
  currentTab: string;
  statisticInfo: Record<string, string | number> | null;
  dateType: DateTypeEnum;
  onHandleDateTypeChange: (value: DateTypeEnum) => void;
};

function StatisticTabContent(props: StatisticTabContentPropsType) {
  const isHRSSPage = props?.currentTab === '1';

  const timeZoneOption = [
    { label: '今日', value: DateTypeEnum.TODAY },
    { label: '近7天', value: DateTypeEnum.SEVEN_DAYS },
    { label: '近30天', value: DateTypeEnum.THIRTY_DAYS },
    { label: '自上线后（总量）', value: DateTypeEnum.ALL },
  ];

  const overviewCards = [
    {
      name: `${isHRSSPage ? '人社' : '活动'}访客量`,
      num: props?.statisticInfo?.pv,
    },
    {
      name: isHRSSPage ? '礼包领取量' : '领取礼包用户数',
      num: props?.statisticInfo?.amountReceive,
    },
    {
      name: `${isHRSSPage ? '人社' : '活动'}注册量`,
      num: props?.statisticInfo?.amountRegister,
    },
    {
      name: `${isHRSSPage ? '人社' : '活动'}认证量`,
      num: props?.statisticInfo?.amountCertification,
    },
    {
      name: '应用使用量',
      num: props?.statisticInfo?.amountUsage,
    },
  ];

  const othersCard = [
    {
      name: '平均停留时长(分钟)',
      num: props?.statisticInfo?.avgStayDuration,
      tooltip: '所有访客浏览招聘季数字化礼包领取介绍页时间累加/总访客数',
    },
  ];

  return (
    <>
      <div className={sc('container')}>
        <div className="title">{isHRSSPage ? '人社厅礼包统计' : '招聘季礼包统计'}</div>
        <div className="overview-title">
          <span className="extra-line">概览</span>
          <Select
            options={timeZoneOption}
            placeholder="请选择"
            style={{ width: 200 }}
            value={props?.dateType}
            onChange={props?.onHandleDateTypeChange}
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
                {!isHRSSPage && (
                  <Tooltip title={item.tooltip}>
                    <img className="question-icon" src={questionIcon} alt="" />
                  </Tooltip>
                )}
              </div>
              <p className="num">{item.num}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const DigitalAppData: React.FC = () => {
  const [dateType, setDateType] = useState<DateTypeEnum>(DateTypeEnum.TODAY);
  const [statisticInfo, setStatisticInfo] = useState<Record<string, number | string> | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('1');

  useEffect(() => {
    getRSStatistic(dateType, currentTab === '1' ? 'HRSS' : 'ZPJ').then((res) => {
      if (res?.code === 0) {
        setStatisticInfo(res?.result);
      } else {
        message.error(res?.message);
      }
    });
  }, [dateType, currentTab]);

  function handleDateTypeChange(type: DateTypeEnum) {
    setDateType(type);
  }

  function handleTabsChange(value: string) {
    setCurrentTab(value);
  }

  const keywords = [
    { tabName: '人社厅礼包', type: '1' },
    { tabName: '招聘季礼包', type: '2' },
  ];

  return (
    <PageContainer>
      <Tabs activeKey={currentTab} onChange={handleTabsChange}>
        {keywords.map((tab) => (
          <TabPane tab={tab?.tabName} key={tab?.type}>
            <StatisticTabContent
              currentTab={currentTab}
              dateType={dateType}
              statisticInfo={statisticInfo}
              onHandleDateTypeChange={handleDateTypeChange}
            />
          </TabPane>
        ))}
      </Tabs>
    </PageContainer>
  );
};

export default DigitalAppData;
