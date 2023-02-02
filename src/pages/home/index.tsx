import { Col, Row, Button, DatePicker, Modal, message, Radio, Input, Tabs } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState, useEffect } from 'react';
import './index.less';
import { getAddedDataYesterday, getStatistics } from '@/services/home';
import { useHistory } from 'react-router-dom';
import { routeName } from '@/../config/routes';
import { Access, useAccess } from 'umi';
import UserData from './user_data/index';
import OrganizationData from './organization_data/index';
import EnterpriseData from './enterprise_demand_data/index';
import dayjs from 'dayjs';
import Arrowup from '@/assets/home/arrowup.png'

const sc = scopedClasses('home-page');
const statisticsType = {
  USER: '用户注册量',
  ENTERPRISE: '企业认证量',
  EXPERT: '专家数量',
  ENTERPRISE_DEMAND: '企业需求数量',
  CREATIVE_DEMAND: '创新需求数量',
  CREATIVE_ACHIEVEMENT: '科技成果数量',
  APP: '应用数量',
  SOLUTION: '解决方案数量',
  LOAN: '企业申请贷款笔数',
  CREDIT: '企业累计授信额（万元）',
};

type AuditType = '用户数据分析'|'组织数据分析'|'企业需求数据分析'

const updateTime = dayjs().format('YYYY-MM-DD 00:00:00')

export default () => {
  const history = useHistory();
  const [addedDataYesterday, setAddedDataYesterday] = useState<any>({});
  const [statistics, setStatistics] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<AuditType>('用户数据分析')
  // 拿到当前角色的access权限兑现
  const access = useAccess()

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
  }, []);

  const {
    diagnosisIntentionCount,
    appConsultationCount,
    solutionIntentionCount,
    expertConsultationCount,
    liveIntentionCount,
    financeDiagnosisCount,
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
      case '金融诊断记录':
        if (!access['M_FM_JRZD']) {
          setModalOpen(true)
          return
        }
        history.push(`/banking/financial_diagnostic_record/index`);
        break;
    }
  }

  return (
    <>
      <div className={sc('container-update-time')}>数据更新时间：{updateTime}</div>
      <div className={sc('container')}>
        <h3>业务咨询昨日新增数据</h3>
        <Row gutter={40}>
          <Col span={4}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('诊断意向报名')}}>
              <p>诊断意向报名</p>
              <div className={sc('container-add-item-text')}>
                <img className={sc('container-add-item-text-img')} src={Arrowup} />
                <strong>{diagnosisIntentionCount || 0}</strong>
              </div>
            </div>
          </Col>
          <Col span={4}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('应用咨询记录')}}>
              <p>应用咨询记录</p>
              <div className={sc('container-add-item-text')}>
                <img className={sc('container-add-item-text-img')} src={Arrowup} />
                <strong>{appConsultationCount || 0}</strong>
              </div>
            </div>
          </Col>
          <Col span={4}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('服务意向消息')}}>
              <p>服务意向消息</p>
              <div className={sc('container-add-item-text')}>
                <img className={sc('container-add-item-text-img')} src={Arrowup} />
                <strong>{solutionIntentionCount || 0}</strong>
              </div>
            </div>
          </Col>
          <Col span={4}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('专家咨询记录')}}>
              <p>专家咨询记录</p>
              <div className={sc('container-add-item-text')}>
                <img className={sc('container-add-item-text-img')} src={Arrowup} />
                <strong>{expertConsultationCount || 0}</strong>
              </div>
            </div>
          </Col>
          <Col span={4}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('直播意向管理')}}>
              <p>直播意向管理</p>
              <div className={sc('container-add-item-text')}>
                <img className={sc('container-add-item-text-img')} src={Arrowup} />
                <strong>{liveIntentionCount || 0}</strong>
              </div>
            </div>
          </Col>
          <Col span={4}>
            <div className={sc('container-add-item')} onClick={() => {handleAddItem('金融诊断记录')}}>
              <p>金融诊断记录</p>
              <div className={sc('container-add-item-text')}>
                <img className={sc('container-add-item-text-img')} src={Arrowup} />
                <strong>{financeDiagnosisCount || 0}</strong>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className={sc('container')}>
        <h3>平台关键数据统计</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '20% 20% 20% 20% 20%',
          gridTemplateRows: '210px',
        }}>
          {statistics?.map((item: any) => {
            const { type, currentCount, yesterdayChangeCount, weekChangeCount, monthChangeCount } =
              item || {};
            return (
                <div className={sc('container-statistic-item')} onClick={()=>{handleDataStatistic(item)}}>
                  <p>{statisticsType[type]}</p>
                  <strong>{currentCount}</strong>
                  <p className={sc('container-statistic-item-content')}>
                    <div className={sc('container-statistic-item-content-text')}>
                      <span className={sc('container-statistic-item-content-text-time')}>日</span>
                      <span 
                        className={`${sc('container-statistic-item-content-text-data')}
                        ${yesterdayChangeCount >= 0 ? sc('container-statistic-item-content-text-data-up') : sc('container-statistic-item-content-text-data-down')}`}
                      >
                        {yesterdayChangeCount >= 0 ? '+' : '-'}
                        {yesterdayChangeCount >= 0 ? yesterdayChangeCount : -yesterdayChangeCount}
                      </span>
                    </div>
                  </p>
                  <p className={sc('container-statistic-item-content')}>
                    <div className={sc('container-statistic-item-content-text')}>
                      <span className={sc('container-statistic-item-content-text-time')}>周</span>
                      <span 
                        className={`${sc('container-statistic-item-content-text-data')}
                        ${weekChangeCount >= 0 ? sc('container-statistic-item-content-text-data-up') : sc('container-statistic-item-content-text-data-down')}`}
                      >
                        {weekChangeCount >= 0 ? '+' : '-'}
                        {weekChangeCount >= 0 ? weekChangeCount : -weekChangeCount}
                      </span>
                    </div>
                  </p>
                  <p className={sc('container-statistic-item-content')}>
                    <div className={sc('container-statistic-item-content-text')}>
                      <span className={sc('container-statistic-item-content-text-time')}>月</span>
                      <span 
                        className={`${sc('container-statistic-item-content-text-data')}
                        ${monthChangeCount >= 0 ? sc('container-statistic-item-content-text-data-up') : sc('container-statistic-item-content-text-data-down')}`}
                      >
                        {monthChangeCount >= 0 ? '+' : '-'}
                        {monthChangeCount >= 0 ? monthChangeCount : -monthChangeCount}
                      </span>
                    </div>
                  </p>
                </div>
            );
          })}
        </div>
      </div>
      <div className={sc('container')}>
        <Tabs tabBarStyle={{color: '#556377'}} className={sc('container-tabs')} defaultActiveKey="用户数据分析" activeKey={activeTab} onChange={(e: string) => setActiveTab(e as AuditType) }>
          <Tabs.TabPane tab="用户数据分析" key="用户数据分析">
            <UserData></UserData>
          </Tabs.TabPane>
          <Tabs.TabPane tab="组织数据分析" key="组织数据分析">
            <OrganizationData></OrganizationData>
          </Tabs.TabPane>
          <Tabs.TabPane tab="企业需求数据分析" key="企业需求数据分析">
            <EnterpriseData></EnterpriseData>
          </Tabs.TabPane>
        </Tabs>
      </div>
      {motal}
    </>
  );
};
