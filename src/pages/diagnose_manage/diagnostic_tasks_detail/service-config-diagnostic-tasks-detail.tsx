import { PageContainer } from '@ant-design/pro-layout';
import './service-config-diagnostic-tasks-detail.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { getDiagnosisRecordById } from '@/services/diagnostic-tasks';
import { history } from 'umi';
import moment from 'moment';
import { Avatar, Col, Divider, Empty, Image, message, Row, Steps } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import DiagnosticTasks from '@/types/service-config-diagnostic-tasks';

const sc = scopedClasses('service-config-diagnostic-tasks-detail');
const stateObj = {
  1: '待诊断',
  2: '诊断中',
  3: '已完成',
  4: '已延期',
};
export default () => {
  const [{ diagnoseBaseInfoVO, diagnosisStageVOList = [] }, setDetail] =
    useState<DiagnosticTasks.DiagnosisTaskDetail>({
      diagnoseBaseInfoVO: {
        currentStage: 0,
        diagnoseExpertVOList: [],
        diagnoseOrgInfoVo: {},
        diagnoseConclusionVO: {},
        diagnosisInstitution: {},
      },
      diagnosisStageVOList: [],
    });

  const [diagnosisStage, setDiagnosisStage] = useState<DiagnosticTasks.DiagnosisStageEnum>();

  const {
    diagnoseExpertVOList = [],
    diagnoseOrgInfoVo = {},
    diagnoseConclusionVO = {},
    diagnosisInstitution = {},
  } = diagnoseBaseInfoVO;

  const currentStage = diagnoseBaseInfoVO.currentStage || 1;

  const separate = () => <div style={{ width: '100%', height: 24 }} />;

  const title = (text: string) => <span style={{ fontWeight: 700, fontSize: 16 }}>{text}</span>;

  /**
   * 准备根据路由参数获取数据
   */
  const prepare = async () => {
    try {
      const { detailId } = history.location.query as { detailId: string | undefined };
      if (detailId) {
        const recordRes = await getDiagnosisRecordById(detailId);
        if (recordRes.code === 0) {
          setDetail(recordRes.result);
        } else {
          message.error(`获取诊断详情失败，原因:{${recordRes.message}}`);
        }
      } else {
        // history.push(routeName.DIAGNOSTIC_TASKS);
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  const getDesc = () => {
    return (
      <div className={sc('container-detail')}>
        {title(diagnoseBaseInfoVO.name || '')}
        <div>
          <span>任务编号：</span>
          <span className={sc('container-detail-value')}>
            {diagnoseBaseInfoVO.applicationNumber}
          </span>
          <span>诊断时间：</span>
          <span className={sc('container-detail-value')}>
            {diagnoseBaseInfoVO.startDate}至{diagnoseBaseInfoVO.endDate}
          </span>
          <span>诊断状态：</span>
          <span className={`${sc('container-detail-value')} state${diagnoseBaseInfoVO?.state}`}>
            {stateObj[diagnoseBaseInfoVO?.state] || '--'}
          </span>
        </div>
        <div style={{ width: '60%' }}>{diagnoseBaseInfoVO.remark}</div>
      </div>
    );
  };

  const getProjectLeader = () => {
    return (
      <div>
        <div className={sc('container-diagnosis-info-title')}>项目负责人</div>
        <div className={sc('container-diagnosis-info-value')}>
          {diagnoseBaseInfoVO.projectLeaderName || '--'}，
          {diagnoseBaseInfoVO.projectLeaderContact || '--'}
        </div>
      </div>
    );
  };

  /**
   * 技术专家
   * @returns
   */
  const getTechnician = () => {
    return (
      <div>
        <div className={sc('container-diagnosis-info-title')}>技术专家</div>
        <div className={sc('container-diagnosis-info-value')}>
          {(diagnoseBaseInfoVO?.technicians || []).map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </div>
    );
  };

  const getExperts = () => {
    return (
      <div>
        <div className={sc('container-diagnosis-info-title')}>诊断专家</div>
        <div className={sc('container-diagnosis-info-value')}>
          {diagnoseExpertVOList.map((p: any) => (
            <span key={p.id}>
              {p.expertName || '--'},{p.phone || '--'}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const getEnterprises = () => {
    return (
      <div>
        <div className={sc('container-diagnosis-info-title')}>诊断企业</div>
        <div className={sc('container-diagnosis-info-value')}>
          {diagnoseOrgInfoVo?.orgName}，{diagnoseOrgInfoVo?.phone || '--'}
        </div>
      </div>
    );
  };

  const getInstitution = () => {
    return (
      <div>
        <div className={sc('container-diagnosis-info-title')}>诊断机构</div>
        <div className={sc('container-diagnosis-info-value')}>
          <span>{diagnosisInstitution?.name || '--'}</span>
          <span>{diagnosisInstitution?.bag || '--'}</span>
        </div>
      </div>
    );
  };

  const getRecords = () => {
    const records =
      diagnosisStageVOList[(diagnosisStage || currentStage) - 1]?.diagnosisRecords || [];
    return (
      <div className={sc('container-records')}>
        {title('阶段记录')}
        {records.length === 0 ? (
          <div className={sc('container-nothing')}>
            <Empty description="" />
            <span
              style={{
                fontSize: 20,
                color: 'rgba(0,0,0,0.85)',
              }}
            >
              等待提交
            </span>
          </div>
        ) : (
          records.map((p) => (
            <>
              <div className={sc('container-records-record-header')}>
                <div>
                  <Avatar size={48} src={p.expertPhotoPath} />
                  <div style={{ display: 'inline-grid', marginLeft: 10 }}>
                    <span>{p.expertName || '--'}</span>
                    <span>{moment(p.submitTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </div>
                </div>
                <div>
                  <EnvironmentOutlined style={{ marginRight: 5 }} />
                  <span>{p.address || '--'}</span>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>{p.content || '--'}</div>
              <div className={sc('container-records-record-images')}>
                <Row gutter={10}>
                  <Image.PreviewGroup>
                    {p.photoPath
                      ? (p.photoPath || []).map((path) => (
                          <Col xs={4} xxl={2} key={path}>
                            <div className="image-contain">
                              <Image className="image-contain-img" src={path} />
                            </div>
                          </Col>
                        ))
                      : ''}
                  </Image.PreviewGroup>
                </Row>
              </div>
              <Divider plain />
            </>
          ))
        )}
      </div>
    );
  };

  const getConclusions = () => {
    return (
      <div className={sc('container-conclusions')}>
        {title('诊断结论')}
        <div style={{ paddingTop: 10 }}>
          <span>提交时间：</span>
          <span className={sc('container-detail-value')}>
            {diagnoseConclusionVO?.submitTime
              ? moment(diagnoseConclusionVO?.submitTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'}
          </span>
        </div>
        <div>
          <span>提交专家：</span>
          <span className={sc('container-detail-value')}>
            {diagnoseConclusionVO?.expertName || '--'}（{diagnoseConclusionVO?.phone || '--'}）
          </span>
        </div>
        <span>{diagnoseConclusionVO?.conclusion}</span>
        {diagnoseConclusionVO?.files && (
          <div style={{ paddingTop: 10 }}>
            <span>附件：</span>
            {diagnoseConclusionVO?.files.map((p) => {
              return (
                <>
                  <a target="_blank" rel="noreferrer" style={{ marginRight: 20 }} href={p.path}>
                    {p.name}.{p.format}
                  </a>
                </>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const getProgress = () => {
    console.log('currentStage', currentStage, diagnosisStage);
    return (
      <div className={sc('container-progress')}>
        {title('诊断进度')}
        <Steps
          size="small"
          current={currentStage - 1}
          // onChange={(current) => setdiagnosisStage(current + 1)}
          progressDot
          style={{ marginTop: 10 }}
        >
          {diagnosisStageVOList.map((p, index) => (
            <Steps.Step
              key={p.name}
              title={
                <span
                  onClick={() => {
                    if (p.stage > currentStage) return;
                    setDiagnosisStage(p.stage);
                  }}
                  style={{
                    color:
                      index === (diagnosisStage || currentStage || 1) - 1
                        ? '#6680ff'
                        : 'rgba(0, 0, 0, 0.85)',
                    cursor: p.stage > currentStage ? 'no-drop' : 'pointer',
                  }}
                >
                  {p.name}
                </span>
              }
              description={
                (p.updateTime && moment(p.updateTime).format('YYYY-MM-DD HH:mm:ss')) || '等待提交'
              }
            />
          ))}
        </Steps>
      </div>
    );
  };

  const getStepInfo = () => {
    const stage = diagnosisStageVOList[(diagnosisStage || currentStage) - 1] || {
      participants: [],
      files: [],
    };
    console.log(stage, diagnosisStageVOList, diagnosisStage, currentStage);
    return (
      <div className={sc('container-info')}>
        {title('阶段信息')}
        {stage.id ? (
          <div className={sc('container-diagnosis-step-stage-info')}>
            <div>
              <div className={sc('container-diagnosis-step-stage-info-title')}>阶段用时：</div>
              <div className={sc('container-diagnosis-step-stage-info-value')}>
                {stage.startDate || '--'}~{stage.endDate || '--'}
              </div>
            </div>

            <div>
              <div className={sc('container-diagnosis-step-stage-info-title')}>参与人员：</div>
              <div className={sc('container-diagnosis-step-stage-info-value')}>
                {stage?.participants && stage.participants.map((p) => <span key={p}>{p}</span>)}
              </div>
            </div>

            <div>
              <div className={sc('container-diagnosis-step-stage-info-title')}>阶段描述：</div>
              <div className={sc('container-diagnosis-step-stage-info-value')}>
                {stage.stageDescription || '--'}
              </div>
            </div>

            <div>
              <div className={sc('container-diagnosis-step-stage-info-title')}>问题描述：</div>
              <div className={sc('container-diagnosis-step-stage-info-value')}>
                {stage.problemDescription || '--'}
              </div>
            </div>

            <div>
              <div className={sc('container-diagnosis-step-stage-info-title')}>附件：</div>
              <div className={sc('container-diagnosis-step-stage-info-value')}>
                {stage?.files &&
                  stage?.files.map((p) => {
                    return (
                      <div key={p.id}>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          style={{ marginRight: 20 }}
                          href={p.path}
                        >
                          {p.name}.{p.format}
                        </a>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className={sc('container-nothing')}>
            <Empty description="" />
            <span
              style={{
                fontSize: 20,
                color: 'rgba(0,0,0,0.85)',
              }}
            >
              等待提交
            </span>
          </div>
        )}
      </div>
    );
  };
  return (
    <PageContainer className={sc('container')}>
      {getDesc()}
      {separate()}
      <Row gutter={20}>
        <Col span={16}>
          {diagnoseBaseInfoVO?.state === 1 ? (
            <div className={sc('container-empty')}>
              <Empty description="诊断暂未开始" />
            </div>
          ) : (
            <>
              {diagnoseBaseInfoVO?.state === 3 && getConclusions()}
              <div className={sc('container-step')}>
                {getProgress()}
                {getStepInfo()}
                {getRecords()}
              </div>
              {separate()}
            </>
          )}
        </Col>
        <Col span={8}>
          <div className={sc('container-diagnosis-info')}>
            {getProjectLeader()}
            {getTechnician()}
            {getEnterprises()}
            {separate()}
            {getExperts()}
            {separate()}
            {getInstitution()}
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};
