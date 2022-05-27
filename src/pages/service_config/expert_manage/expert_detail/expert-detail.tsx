import { Fragment, useEffect, useState } from 'react';
import './expert-detail.less';
import type ExpertResource from '@/types/expert_manage/expert-resource';
import { getExpertDetail } from '@/services/expert_manage/expert-resource';
import { history } from 'umi';
import { message, Space, Typography, Image, Divider, Rate, Table, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProDescriptions from '@ant-design/pro-descriptions';
import Common from '@/types/common.d';
import {
  getCommissionerServicePageByUserId,
  signCommissioner,
} from '@/services/service-commissioner-verify';
import { DoubleRightOutlined, EditTwoTone } from '@ant-design/icons';
import VerifyInfoDetail from '@/components/verify_info_detail/verify-info-detail';
import SelfSelect from '@/components/self_select';
import { getDictionay } from '@/services/common';
const { Title, Paragraph } = Typography;

const ServiceRecord = ({ userId }: { userId: string }) => {
  const [dataSource, setDataSource] = useState<
    {
      createDate?: string;
      orgName?: string;
      grade?: number;
    }[]
  >([]);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      if (pageInfo.pageTotal < pageIndex && pageIndex != 1) {
        return;
      }
      const { result, totalCount, pageTotal, code } = await getCommissionerServicePageByUserId({
        pageIndex,
        pageSize,
        id: userId,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource([...dataSource, ...result]);
      } else {
        throw new Error();
      }
    } catch (error) {
      message.error(`服务记录请求失败`);
    }
  };

  useEffect(() => {
    getPage();
  }, [userId]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: ExpertResource.Content, index: number) => index + 1,
    },
    {
      title: '服务日期',
      dataIndex: 'createDate',
      key: 'createDate',
    },
    {
      title: '服务企业',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: '评分',
      key: 'grade',
      dataIndex: 'grade',
      render: (_: number) => <Rate value={_} disabled />,
    },
  ];
  return (
    <div
      style={{
        display: 'grid',
        alignItems: 'center',
      }}
    >
      <Table columns={columns} dataSource={dataSource as any} pagination={false} />
      <DoubleRightOutlined
        rotate={90}
        style={{ fontSize: 34 }}
        onClick={() => {
          getPage(pageInfo.pageIndex + 1);
        }}
      />
    </div>
  );
};

export default () => {
  const [detail, setDetail] = useState<ExpertResource.Detail>({});
  const [loading, setLoading] = useState(true);
  const [serviceTypes, setServiceType] = useState<any>([]);
  const [selectTypes, setSelectTypes] = useState<any>([]);
  const {
    expertName,

    number,
    commissioner,
    score,
    duty,
    // dutyHide,
    phone,
    // phoneHide,
    email,
    // emailHide,
    areaName,
    workUnit,
    serviceTypeNames,
    serviceTypeIds,
    // workUnitHide,
    personalPhoto,
    workExp,
    projectExp,
    skilledField,
    expertSkill,
    expertIntroduction,
    typeNames,
    diagnosisRecordList,
  } = detail || {};
  const { id = '', auditId = '' } = history.location.query as any;

  const prepare = async () => {
    if (id) {
      try {
        const res = await getExpertDetail(id);
        if (res.code === 0) {
          console.log(res);
          setDetail(res.result);
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    prepare();
  }, [id]);

  const initDictionaryData = async () => {
    try {
      getDictionay('COMMISSIONER_SERVICE_TYPE').then((data) => {
        setServiceType(data.result || []);
      });
    } catch (error) {
      message.error('数据初始化错误');
    }
  };
  useEffect(() => {
    initDictionaryData();
  }, []);

  const expertBasicInfoFirstPart = [
    { label: '职务', value: duty },
    { label: '联系电话', value: phone },
    { label: '邮箱', value: email },
    { label: '所属区域', value: areaName },
  ];

  const expertBasicInfoSecondPart = [
    { label: '工作单位', value: workUnit },
    { label: '专家类型', value: typeNames?.join('，') },
  ];

  const expertSkillInfo = [
    { label: '专家介绍', value: expertIntroduction },
    { label: '工作经验', value: workExp },
    { label: '项目经验', value: projectExp },
    { label: '擅长领域', value: skilledField },
    { label: '专家技能', value: expertSkill },
    {
      label: '诊断记录',
      value: diagnosisRecordList?.length
        ? diagnosisRecordList?.map((item, index) => (
            <Fragment key={item || index}>
              {`${index + 1}、${item}`}
              {index < diagnosisRecordList?.length - 1 && <br />}
            </Fragment>
          ))
        : null,
    },
    // commissioner &&
    // { label: '服务记录', value: <ServiceRecord userId={id} /> },
  ];

  return (
    <PageContainer loading={loading} className={'expert-container'}>
      <div className={'expert-detail-card'} style={{ marginTop: '20px' }}>
        <div className={'expert-detail-card-header'}>
          <Image alt={expertName} preview={false} width={135} height={170} src={personalPhoto} />
          <div className="basic-info">
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 800 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <Title className="expert-name">{expertName}</Title>{' '}
                {commissioner && (
                  <div
                    style={{ color: '#F59A23', background: 'rgba(254, 246, 241, 1)', height: 20 }}
                  >{`专员编号：${number || '--'}`}</div>
                )}
              </div>
              {commissioner && (
                <div
                  style={{ display: 'grid', padding: '0 10px', borderLeft: '1px solid #e4e0e0' }}
                >
                  <span>服务评分</span>
                  <span>{score}</span>
                  <Rate value={score} disabled />
                </div>
              )}
            </div>
            <Space className="first-part" size={0} split={<Divider type="vertical" />}>
              {expertBasicInfoFirstPart.map((item, index) => (
                <div className="first-part-item" key={item?.value || index}>
                  <label>{item?.label}</label>
                  <span>{item?.value || '--'}</span>
                </div>
              ))}
            </Space>
            <ProDescriptions className="second-part" column={1}>
              {expertBasicInfoSecondPart?.map((item, index) => {
                return (
                  <ProDescriptions.Item key={item?.label || index} label={item?.label}>
                    {item?.value}
                  </ProDescriptions.Item>
                );
              })}
            </ProDescriptions>
          </div>
        </div>
        <div className={'expert-detail-card-body'}>
          <div className="expert-skill-info">
            {expertSkillInfo.map((item, index) => {
              return (
                item?.value && (
                  <div key={item.label + index} className="expert-skill-info-item">
                    <Title className="title">{item.label}</Title>
                    <Paragraph className="content">{item?.value}</Paragraph>
                  </div>
                )
              );
            })}

            {commissioner && (
              <div className="expert-skill-info-item">
                <Title className="title">服务记录</Title>
                <Paragraph className="content">
                  <ServiceRecord userId={id} />
                </Paragraph>
              </div>
            )}
          </div>
        </div>
      </div>
      {auditId && (
        <div style={{ background: '#fff', marginTop: 20, paddingTop: 20 }}>
          <VerifyInfoDetail
            auditId={auditId as string}
            reset={prepare}
            before={(state) => {
              return (
                <div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}
                  >
                    <div
                      style={{
                        color: '#333',
                        fontSize: '20px',
                        lineHeight: '28px',
                        fontWeight: 600,
                      }}
                    >
                      申请服务类型
                    </div>
                    {state === Common.AuditStatus.AUDITING && (
                      <Popconfirm
                        icon={<span style={{ fontSize: 18 }}>请选择服务类型</span>}
                        title={
                          <div style={{ width: 500 }}>
                            <SelfSelect
                              dictionary={serviceTypes}
                              fieldNames={{
                                label: 'name',
                                value: 'id',
                              }}
                              value={selectTypes}
                              onChange={(values) => {
                                setSelectTypes(values);
                              }}
                            />
                          </div>
                        }
                        okButtonProps={{
                          disabled: selectTypes?.length === 0,
                        }}
                        okText="确定"
                        cancelText="取消"
                        onConfirm={async () => {
                          try {
                            const tooltipMessage = '编辑服务类型';
                            const updateStateResult = await signCommissioner({
                              expertShowId: id,
                              commissioner,
                              ids: selectTypes,
                            });
                            if (updateStateResult.code === 0) {
                              message.success(`${tooltipMessage}成功`);
                              prepare();
                            } else {
                              message.error(
                                `${tooltipMessage}失败，原因:{${updateStateResult.message}}`,
                              );
                            }
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      >
                        <EditTwoTone
                          onClick={() => {
                            setSelectTypes(serviceTypeIds);
                          }}
                        />
                      </Popconfirm>
                    )}
                  </div>
                  <Paragraph className="content">{serviceTypeNames?.join('，')}</Paragraph>
                </div>
              );
            }}
          />
        </div>
      )}
    </PageContainer>
  );
};
