import { PageContainer } from '@ant-design/pro-layout';
import './service-config-diagnostic-tasks-detail.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import DiagnosisOrgAvatar from '@/assets/diagnosis/diagnosis-org-avatar.png';
import { getDiagnosisRecordById } from '@/services/diagnostic-tasks';
import { history } from 'umi';
import moment from 'moment';
import { Avatar, Col, Divider, Image, message, Row } from 'antd';
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
  const [detail, setDetail] = useState<{
    experts: DiagnosticTasks.Expert[];
    diagnosisVO: DiagnosticTasks.Content;
    diagnosisRecordDetailVOList: DiagnosticTasks.Record[];
    orgInfoVO: DiagnosticTasks.OrgInfo;
    conclusionVO: DiagnosticTasks.Conclusion;
    // diagnosisInstitution: DiagnosticTasks.DiagnosisInstitution;
  }>({
    diagnosisVO: {},
    diagnosisRecordDetailVOList: [],
    orgInfoVO: {},
    conclusionVO: {},
    experts: [],
    // diagnosisInstitution: {},
  });

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

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('container-detail')}>
        {title(detail.diagnosisVO.name || '')}
        <div>
          <span>任务编号：</span>
          <span className={sc('container-detail-value')}>
            {detail.diagnosisVO.applicationNumber}
          </span>
          <span>诊断时间：</span>
          <span className={sc('container-detail-value')}>
            {detail.diagnosisVO.startDate}至{detail.diagnosisVO.endDate}
          </span>
          <span>诊断状态：</span>
          <span className={sc('container-detail-value')}>
            {Object.prototype.hasOwnProperty.call(stateObj, detail.diagnosisVO?.state as any)
              ? stateObj[detail.diagnosisVO?.state as any]
              : '--'}
          </span>
        </div>
        <div style={{ width: '60%' }}>{detail.diagnosisVO.remark}</div>
      </div>
      {separate()}
      <Row gutter={10}>
        <Col span={16}>
          <div className={sc('container-records')}>
            {title('诊断记录')}
            {(detail.diagnosisRecordDetailVOList || []).map((p) => (
              <>
                <div className={sc('container-records-record-header')}>
                  <div>
                    <Avatar size={48} src={p.expertPhotoPath} />
                    <div style={{ display: 'inline-grid', marginLeft: 10 }}>
                      <span>{p.expertName}</span>
                      <span>{moment(p.submitTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
                  </div>
                  <div>
                    <EnvironmentOutlined style={{ marginRight: 5 }} />
                    <span>{p.address}</span>
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>{p.content}</div>
                <div className={sc('container-records-record-images')}>
                  <Row gutter={10}>
                    <Col sm={24} xxl={16}>
                      <Row gutter={10}>
                        <Image.PreviewGroup>
                          {p.photoPath
                            ? (p.photoPath || []).map((url) => (
                                <Col span={8}>
                                  <div className="image-contain">
                                    <Image
                                      className="image-contain-img"
                                      src={url}
                                      alt="图片资源损坏"
                                    />
                                  </div>
                                </Col>
                              ))
                            : ''}
                        </Image.PreviewGroup>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <Divider plain />
              </>
            ))}
          </div>
          {separate()}
          <div className={sc('container-conclusions')}>
            {title('诊断结论')}
            <div style={{ paddingTop: 10 }}>
              <span>提交时间：</span>
              <span className={sc('container-detail-value')}>
                {detail.conclusionVO?.submitTime
                  ? moment(detail.conclusionVO?.submitTime).format('YYYY-MM-DD HH:mm:ss')
                  : ''}
              </span>
            </div>
            <div>
              <span>提交专家：</span>
              <span className={sc('container-detail-value')}>
                {detail.conclusionVO?.expertName}
              </span>
            </div>
            <span>{detail.conclusionVO?.conclusion}</span>
            {detail.conclusionVO?.files && (
              <div style={{ paddingTop: 10 }}>
                <span>附件：</span>
                {detail.conclusionVO?.files.map((p) => (
                  <a style={{ marginRight: 20 }} href={p.path}>
                    {p.name + '.' + p.format}
                  </a>
                ))}
              </div>
            )}
          </div>
        </Col>
        <Col span={8}>
          <div className={sc('container-enterprises')}>
            {title('诊断企业')}
            <div className={sc('container-enterprises-content')}>
              <Image width={80} src={detail.orgInfoVO?.coverPath} alt="图片损坏" />
              <div>
                <span style={{ fontSize: 16 }}>{detail.orgInfoVO?.orgName}</span>
                <span>联系人：{detail.orgInfoVO?.contactName}</span>
                <span>手机号：{detail.orgInfoVO?.phone}</span>
              </div>
            </div>
          </div>
          {separate()}
          <div className={sc('container-experts')}>
            {title('诊断专家')}
            <Row>
              {(detail.experts || []).map((p) => (
                <Col span={8}>
                  <div className={sc('container-experts-expert')}>
                    <Avatar size={48} icon="user" src={p.expertPhotoPath} />
                    <div style={{ display: 'inline-grid', marginLeft: 10 }}>
                      <span>{p.expertName}</span>
                      <span>{p.expertPhone}</span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          {separate()}
          <div className={sc('container-org')}>
            {title('所属机构')}
            <div className={sc('container-org-content')}>
              <img src={DiagnosisOrgAvatar} />
              <div>
                <span>{detail?.diagnosisVO?.diagnosisInstitution?.name || '--'}</span>
                <span>{detail?.diagnosisVO?.diagnosisInstitution?.bag || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};
