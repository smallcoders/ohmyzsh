import { useState, useEffect, Fragment } from 'react';
import { message, Image, Button, Form, Space, Pagination, Rate, Divider, Typography,Input, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type ExpertResource from '@/types/expert_manage/expert-resource';
import { history } from 'umi';
import scopedClasses from '@/utils/scopedClasses';
import { getOfficeRequirementVerifyDetail } from '@/services/office-requirement-verify';
import { getDemandDetail as getAchievementDetail } from '@/services/achievements-manage';
import { getProgrammeVerifyDetail } from '@/services/service-programme-verify';
import { getEnumByName } from '@/services/common';
import { getCommentsDetail, getReportProcessed, getReportDetail } from '@/services/report-record-verify';
import { getDemandDetail } from '@/services/creative-demand'
import { renderSolutionType } from '../../../service_config/solution/solution';
import { getExpertDetail } from '@/services/expert_manage/expert-resource';
import ProDescriptions from '@ant-design/pro-descriptions';
const { Title, Paragraph } = Typography;

const sc = scopedClasses('report-record-detail');
import './index.less';

const stateObj = {
  true: '已处理',
  false: '未处理',
};

const module = {
  DEMAND: '企业需求',
  CREATIVE_ACHIEVEMENT: '科技成果',
  CREATIVE_DEMAND: '创新需求',
  SOLUTION: '解决方案',
  DEMAND_COMMENT: '需求留言',
  EXPERT_COMMENT: '专家留言'
}

const reportTypeText = {
  FALSE_INFORMATION: '不实信息',
  JUNK_ADVERTISING: '垃圾广告',
  INSULTS_ATTACKS: '辱骂、人身攻击等不友善行为',
  HARMFUL_INFORMATION: '有害信息',
  SUSPECTED_INFRINGEMENT: '涉嫌侵权',
  HARASS: '骚扰',
  CYBER_VIOLENCE: '网络暴力',
  OTHER: '其他',
};

const EnterpriseDemand = (props: {
  id: string
  setLoading: (loading: boolean) => void 
}) => {
  const { id, setLoading } = props || {}
  const [detail, setDetail] = useState<any>({});

  const prepare = async () => {
    if (id) {
      try {
        const res = await getOfficeRequirementVerifyDetail(id);
        if (res.code === 0) {
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

  useEffect(()=>{
    prepare()
  },[id])

  return (
    <div className={sc('enterprise-demand')}>
        <div className={sc('container-title')}>企业需求</div>
        <div style={{ marginLeft: 200 }}>
          <Image height={200} width={300} src={detail?.coverUrl} />
        </div>
        <div className={sc('container-desc')}>
          <span>需求名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求类型：</span>
          <span>{detail?.typeNames ?  detail?.typeNames.join('、') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求时间范围：</span>
          <span>{detail?.startDate ? `${detail?.startDate}~${detail?.endDate}` : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求内容：</span>
          <span>{detail?.content || '--'}</span>
        </div>
    </div>
  )
}

const EnterpriseDemandComment = (props: {
  id: string
  type?: string
  setLoading: (loading: boolean) => void 
}) => {
  const { id, setLoading, type } = props || {}
  const [detail, setDetail] = useState<any>({});

  const prepare = async (detailId?: string) => {
    if (id) {
      try {
        const res = await getOfficeRequirementVerifyDetail(detailId ? detailId :id);
        if (res.code === 0) {
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

  const [reportDetail, setReportDetail] = useState<any>({})
  const _getCommentsDetail = async () => {
    try {
      const res = await getCommentsDetail({ commentsId: Number(id) })
      if (res?.code === 0) {
        setReportDetail(res?.result)
        prepare(res?.result.detailId)
      }
    } catch (error) {
      message.error('服务器错误');
    }
  }

  const newContent = reportDetail?.toUserName 
    ? '回复' + reportDetail?.toUserName + '：' +  reportDetail?.content
    : reportDetail?.content

  useEffect(()=>{
    if (type) {
      console.log('type', type)
      _getCommentsDetail()
    } else {
      prepare()
    }
  },[id])

  return (
    <div className={sc('enterprise-demand')}>
      {
        type && (
          <>
            <div className={sc('container-title')}>举报内容</div>
            <div className={sc('report-content')}>
              <div className={sc('report-content-left')}>
                <img className={sc('report-content-left-img')} src="" alt="" />
              </div>
              <div className={sc('report-content-right')}>
                <div className={sc('report-content-right-header')}>
                  <div>{reportDetail?.fromUserName}</div>
                  {
                    reportDetail?.isAnonymity && (
                      <div className={sc('report-content-right-header-label')}>匿名</div>
                    )
                  }
                </div>
                <div className={sc('report-content-right-content')}>
                  {newContent}
                </div>
                <div className={sc('report-content-right-time')}>
                  {reportDetail?.createTime}
                </div>
              </div>
            </div>
          </>
        )
      }
        <div className={sc('container-title')}>企业需求</div>
        <div style={{ marginLeft: 200 }}>
          <Image height={200} width={300} src={detail?.coverUrl} />
        </div>
        <div className={sc('container-desc')}>
          <span>需求名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求类型：</span>
          <span>{detail?.typeNames ?  detail?.typeNames.join('、') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求时间范围：</span>
          <span>{detail?.startDate ? `${detail?.startDate}~${detail?.endDate}` : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求内容：</span>
          <span>{detail?.content || '--'}</span>
        </div>
    </div>
  )
}
// 成果详情
const Achievement = (props: {
  id: string
  setLoading: (loading: boolean) => void 
}) => {
  const { id, setLoading } = props || {}
  const [detail, setDetail] = useState<any>({});
  const [enums, setEnums] = useState<any>({});

  const getDictionary = async () => {
    try {
      const enumsRes = await Promise.all([
        getEnumByName('CREATIVE_ACHIEVEMENT_CATEGORY_ENUM'), // 成果类别
        getEnumByName('CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM'), // 属性
        getEnumByName('CREATIVE_MATURITY_ENUM'), // 成熟度
        getEnumByName('CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM'), // 技术领域
        getEnumByName('TRANSFER_TYPE_ENUM'), // 技术转换
      ]);
      setEnums({
        CREATIVE_ACHIEVEMENT_CATEGORY_ENUM: enumsRes[0].result,
        CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM: enumsRes[1].result,
        CREATIVE_MATURITY_ENUM: enumsRes[2].result,
        CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM: enumsRes[3].result,
        TRANSFER_TYPE_ENUM: enumsRes[4].result,
      });
    } catch (error) {
      message.error('服务器错误');
    }
  };

  const prepare = async () => {
    if (id) {
      try {
        const res = await getAchievementDetail(id);
        getDictionary();
        if (res.code === 0) {
          setDetail(res.result?.achievement);
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

  const getEnum = (enumType: string, enumName: string) => {
    try {
      return enums[enumType]?.filter((p: any) => p.enumName === enumName)[0].name;
    } catch (error) {
      return '--';
    }
  };

  useEffect(()=>{
    prepare()
  },[id])

  return (
    <div className={sc('achievement')}>
      <div className={sc('achievement-container')}>
        <div className={sc('container-title')}>{detail?.name || '--' }</div>
        <div className={sc('container-desc')}>
          <Image.PreviewGroup>
              {detail?.covers &&
                detail?.covers.map((p: any) => (
                  <Image key={p?.id} height={200} width={300} src={p?.path} />
                ))}
            </Image.PreviewGroup>
          <span style={{marginLeft: '20px'}}>
            价格：{detail?.transferPrice}
          </span>
        </div>
        <div className={sc('container-desc')}>
          <span>成果年份：</span>
          <span>{detail?.achievementYear || '--'}</span>
        </div>
        {/* 转让方式 */}
        <div className={sc('container-desc')}>
          <span>成果类别：</span>
          <span>{getEnum('CREATIVE_ACHIEVEMENT_CATEGORY_ENUM', detail?.category)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>成果属性：</span>
          <span>{getEnum('CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM', detail?.attribute)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>成果成熟度：</span>
          <span>{getEnum('CREATIVE_MATURITY_ENUM', detail?.maturity)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>所属技术领域：</span>
          <span>
            {getEnum('CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM', detail?.technicalField)}
          </span>
        </div>
        <div className={sc('container-desc')}>
          <span>主要应用行业：</span>
          <span>{detail?.types ? detail?.types.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>专利编号：</span>
          <span>{detail?.patentCode || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>技术简介：</span>
          <div dangerouslySetInnerHTML={{ __html: detail?.introduction || '--' }} />
        </div>
        <div className={sc('container-desc')}>
          <span>证明材料：</span>
          <span>
            {detail?.files &&
              detail?.files.map((p: any) => {
                return (
                  <>
                    <a target="_blank" rel="noreferrer" style={{ marginRight: 20 }} href={p.path}>
                      {p.name}.{p.format}
                    </a>
                  </>
                );
              })}
          </span>
        </div>
      </div>
    </div>
  )
}
// 创新需求
const InnovateDemand = (props: {
  id: string
  setLoading: (loading: boolean) => void 
}) => {
  const {id, setLoading} = props || {}
  const [detail, setDetail] = useState<any>({});

  const prepare = async () => {
    if (id) {
      try {
        const res = await getDemandDetail(id);
        if (res.code === 0) {
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

  return (
    <div className={sc('innovateDemand')}>
      <div className={sc('innovateDemand-container')}>
        <div className={sc('container-title')}>创新需求信息</div>
        <div style={{ marginLeft: 200 }}>
          <Image height={200} width={300} src={detail?.cover} />
        </div>
        <div className={sc('container-desc')}>
          <span>需求名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求类型：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>行业类别：</span>
          <span>{detail?.industryTypeNames ? detail?.industryTypeNames.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>关键词：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求区域：</span>
          <span>{detail?.areaNames ? detail?.areaNames.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求时间范围：</span>
          <span>{detail?.startDate ? `${detail?.startDate}~${detail?.endDate}` : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求内容：</span>
          <span>{detail?.content || '--'}</span>
        </div>
        <div className={sc('container-title')}>基本信息</div>
        <div className={sc('container-desc')}>
          <span>联系人：</span>
          <span>{detail?.contactName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>联系电话：</span>
          <span>{detail?.contactPhone || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求企业名称：</span>
          <span>{detail?.orgName || '--'}</span>
        </div>
      </div>
    </div>
  )
}
// 解决方案
const Solution = (props: {
  id: string
  setLoading: (loading: boolean) => void 
}) => {
  const {id, setLoading} = props || {}
  const [detail, setDetail] = useState<any>({});

  const prepare = async () => {
    if (id) {
      try {
        const res = await getProgrammeVerifyDetail(id); 
        if (res.code === 0) {
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

  return (
    <div className={sc('solution')}>
      <div className={sc('solution-container')}>
        <div className={sc('container-title')}>解决方案信息</div>
        <div style={{ marginLeft: 200 }}>
          <Image height={200} width={300} src={detail?.coverUrl} />
        </div>
        <div className={sc('container-desc')}>
          <span>方案内容：</span>
          <span>{detail?.content || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>方案类型：</span>
          <span>{renderSolutionType(detail?.types)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>服务区域：</span>
          <span>{detail?.areas?.map((e) => e.name).join('、')}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>服务行业：</span>
          <span>{detail?.industryName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>相关附件：</span>
          <span>
            {detail?.paths &&
              detail?.paths.map((p: any) => {
                return (
                  <>
                    <a target="_blank" rel="noreferrer" style={{ marginRight: 20 }} href={p.path}>
                      {p.name}.{p.format}
                    </a>
                  </>
                );
              })}
          </span>
        </div>
      </div>
    </div>
  )
}

// 专家详情
const ExpertComment = (props: {
  id: string
  setLoading: (loading: boolean) => void 
})=>{
  const {id, setLoading} = props
  const [detail, setDetail] = useState<ExpertResource.Detail>({});
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
    <PageContainer className={'expert-container'}>
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
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

// 处理举报
const ReportingInfo = (props: {
  id: string
}) => {
  const { id } = props || {}
  const [reportInfo, setReportInfo] = useState<any>({})

  // 获取举报信息
  // form表单
  const [reportingForm] = Form.useForm();
  // 单选框
  const [value, setValue] = useState(1);
  // 提交返回

  const reportingInfo = [
    {
      label: '举报所属模块：',
      value: module[reportInfo.module]
    },
    {
      label: '举报类型：',
      value: reportTypeText[reportInfo.reportType]
    },
    {
      label: '举报详细描述：',
      value: reportInfo.content
    },
    {
      label: '举报人：',
      value: reportInfo.reportLoginName
    }
  ]

  const onFinish = async (values: any) => {
    try {
      const res = await getReportProcessed({
        id: Number(reportInfo.id),
        processScheme: values.radio,
        remark: values.text,
      })
      if (res?.code === 0) {
        message.success('提交完成');
        reportingForm.resetFields();
        onBack()
      } else {
        throw new Error("");
      }
    } catch (error) {
      message.error('服务器错误');
    }
  }

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value)
  }

  const onBack = () => {
    history.goBack();
  }

  const _getReportDetail = async () => {
    try {
      const res = await getReportDetail({ reportId: Number(id)})
      if (res?.code === 0) {
        setReportInfo(res?.result)
      } else {
        throw new Error("");
      }
    } catch (error) {
      message.error('服务器错误');
    }
  }

  useEffect(()=>{
    _getReportDetail()
  },[id])

  return (
    <div className={sc('reporting')}>
      <div className={sc('reporting-info')}>
        <div className={sc('reporting-info-title')}>举报信息</div>
        {
          reportingInfo?.map(p=>{
            return (
              <div key={p.label} className={sc('reporting-info-desc')}>
                <span>{p?.label}</span>
                <span>{p?.value}</span>
              </div>
            )
          })
        }
      </div>
      <div className={sc('reporting-form')}>
        <div className={sc('reporting-form-title')}>处理</div>
        <div className={sc('reporting-form-desc')}>
          <span>处理状态：</span>
          <span>{reportInfo.processed ?  '已处理': '未处理'}</span>
        </div>
        <Form 
          layout={'vertical'}
          form={reportingForm}
          onFinish={onFinish}
        >
          <Form.Item 
            label="处理方案" 
            name="radio"
            rules={[{ required: true,message: '请选择处理方案' }]}
          >
          {
            reportInfo.processed 
            ? <div>{reportInfo.processScheme}</div> 
            :             
            <Radio.Group onChange={onChange} value={value}>
              <Space direction="vertical">
                <Radio value={'NOT_HANDLED'}>举报不实，不予处理</Radio>
                <Radio value={'OFF_SHELF'}>下架内容</Radio>
                <Radio value={'DISABLE_ACCOUNT'}>禁用发布者账号</Radio>
              </Space>
            </Radio.Group>
          }
          </Form.Item>
          <Form.Item label="补充说明" name="text" >
          {
            reportInfo.processed 
              ? <div>{reportInfo.remark}</div> 
              : <Input.TextArea allowClear showCount maxLength={200} />
          }
          </Form.Item>
          {
            reportInfo.processed && (
              <>
                <Form.Item label="处理人" name="text" >
                顾满月
                </Form.Item>
                <Form.Item label="处理时间" name="text" >
                2022-12-21  21:09:12
                </Form.Item>
              </>
            )
          }
          <Form.Item>
            {/* 根据处理状态，展示或隐藏提交按钮 */}
            {
              !reportInfo.processed && (
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              )
            }

            <Button htmlType="button" onClick={onBack} style={{marginLeft: '30px'}}>
              返回
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default () => {
  const id = history.location.query?.id as string;
  const bizId = history.location.query?.bizId as string;
  const module = history.location.query?.type as string;

  const [loading, setLoading] = useState<boolean>(false)

  // 根据所属模块 ⭐ 需要一个字段返回是什么板块 孟哥加一个参数判断类别
  const object = {
    'DEMAND': <EnterpriseDemand id={bizId} setLoading={setLoading} ></EnterpriseDemand>,
    'CREATIVE_ACHIEVEMENT': <Achievement id={bizId} setLoading={setLoading}></Achievement>,
    'CREATIVE_DEMAND': <InnovateDemand id={bizId} setLoading={setLoading}></InnovateDemand>,
    'SOLUTION': <Solution id={bizId} setLoading={setLoading}></Solution>,
    'DEMAND_COMMENT': <EnterpriseDemandComment id={bizId} setLoading={setLoading} type='DEMAND_COMMENT' ></EnterpriseDemandComment>,
    'EXPERT_COMMENT': <ExpertComment id={bizId} setLoading={setLoading} ></ExpertComment>,
  }[module]

  const prepare = () => {

  }

  useEffect(()=>{
    console.log('history.location',history.location)
    prepare()
  },[id])

  return (
      <PageContainer loading={loading}>
      <div className={sc('container')}>
        <div className={sc('container-left')}>
          {object}
        </div>
        <div className={sc('container-right')}>
          <ReportingInfo id={id}></ReportingInfo>
        </div>
      </div>
    </PageContainer>
  )
}