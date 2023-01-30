import { PageContainer } from '@ant-design/pro-layout';
import { Select, Tooltip } from 'antd';

import './index.less';

import scopedClasses from '@/utils/scopedClasses';
import questionIcon from '@/assets/page_creat_manage/question_icon.png';

const sc = scopedClasses('digital-app-data');

export default () => {
  const timeZoneOption = [
    { label: '今日', value: 1 },
    { label: '近7天', value: 2 },
    { label: '近30天', value: 3 },
    { label: '自上线后（总量）', value: 4 },
  ];

  const overviewCards = [
    {
      name: '人社访客量',
      tooltip:
        '从人社跳转过来的数量（今日：当天人社访问数（0点23点59分）；近7天：近7天的人社访客数；近30天：近30天的人社访客数）',
    },
    {
      name: '礼包领取量',
      tooltip:
        '点击领取的用户总数，未点击关闭页面的不计数（今日：当天人社领取数（0点23点59分）；近7天：近7天的人社领取数；近30天：近30天的人社领取数）',
    },
    {
      name: '人社注册量',
      tooltip:
        '人社链接跳转并且新注册量（今日：当天人社注册量（0点23点59分）；近7天：近7天的人社注册量；近30天：近30天的人社注册量）',
    },
    {
      name: '人社认证量',
      tooltip:
        '人社链接跳转并完成认证的企业数量（今日：当天人社认证量（0点23点59分）；近7天：近7天的人社认证量；近30天：近30天的人社认证量）',
    },
    {
      name: '应用使用量',
      tooltip:
        '应用被点击次数的总和(同账户可以多次累加,按点击次数累加）（今日：当天应用使用量（0点23点59分）；近7天：近7天的应用使用量；近30天：近30天的应用使用量） ',
    },
  ];

  const othersCard = [
    {
      name: '平均停留时长(分钟)',
      tooltip: '总时长（所有访客数的浏览时间累加）/总跳访客数（人社访客数）',
    },
  ];

  return (
    <PageContainer>
      <div className={sc('container')}>
        <div className="title">人社厅礼包统计</div>
        <div className="overview-title">
          <span className="extra-line">概览</span>
          <Select options={timeZoneOption} placeholder="请选择" style={{ width: 200 }} />
        </div>
        <ul className="overview-card-container">
          {overviewCards.map((item) => (
            <li key={item.name}>
              <div className="card-name">
                {item.name}
                <Tooltip title={item.tooltip}>
                  <img className="question-icon" src={questionIcon} alt="" />
                </Tooltip>
              </div>
              <p className="num">234</p>
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
                <Tooltip title={item.tooltip}>
                  <img className="question-icon" src={questionIcon} alt="" />
                </Tooltip>
              </div>
              <p className="num">234</p>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
};
