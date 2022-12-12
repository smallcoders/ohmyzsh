import { message, Image, Form, Space, Pagination, Divider, Typography, Breadcrumb } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, Fragment } from 'react';
import { history, Prompt, Link } from 'umi';
import LeaveWordVerify from '@/types/leave-word-verify';
import VerifyInfoDetail from '@/components/verify_info_detail/verify-info-detail';
import scopedClasses from '@/utils/scopedClasses';
import type Common from '@/types/common';
import type { PaginationProps } from 'antd';
import { getExpertDetail } from '@/services/expert_manage/expert-resource';
import type ExpertResource from '@/types/expert_manage/expert-resource';
import ProDescriptions from '@ant-design/pro-descriptions';
import { getOfficeRequirementVerifyDetail } from '@/services/office-requirement-verify';
import { getCommentsDetailPage, getCommentsCurrent } from '@/services/leave-word-verify';
import { getDemandDetail } from '@/services/creative-demand'

import './detail.less';
const { Title, Paragraph } = Typography;
const sc = scopedClasses('solution-properties-message-detail');
const stateObj = {
  AUDITING: '待审核',
  AUDIT_SUCCESS: '已通过',
  AUDIT_FAIL: '已拒绝',
};

const orgIndustryData = {
  NEW_IT: '新一代信息技术',
  INTELLIGENT_VEHICLES: '新能源汽车和智能网联汽车',
  DIGITAL_CREATIVITY: '数字创意',
  EQUIPMENT_MANUFACTURING: '高端装备制造',
  NEW_ENERGY: '新能源和节能环保',
  GREEN_FOOD: '绿色食品',
  LIFE_HEALTH: '生命健康',
  SMART_APPLIANCES: '智能家电',
  MATERIAL: '新材料',
  AI: '人工智能',
  OTHER: '其他',
}

export default () => {
  const auditId = history.location.query?.auditId as string;
  const commentId = history.location.query?.commentId as string;
  const detailId = history.location.query?.detailId as string;
  const tab = history.location.query?.tab as string;
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
    pageTotal: 0,
  });
  const [currentData, setCurrentData] = useState<any>({})

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);

  const [searchInfo, setSearchInfo] = useState<any>({});

  // 获取企业详情
  // 查询当前审核的留言
  const _getCommentsCurrent = async (id: any) => {
    try {
      const res = await getCommentsCurrent({
        commentId: id
      })
      if (res?.code === 0) {
        setCurrentData(res?.result)
      } else {
        throw new Error("");
      }
    } catch (error) {
      console.log('获取当前审核留言失败')
    }
  }
  // 企业
  const [detail, setDetail] = useState<any>({});
  const prepareDemandModal = async (id: any) => {
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
  };
  // 专家
  const [expertDetail, setExpertDetail] = useState<ExpertResource.Detail>({});
  // 专家
  const prepareExpertDetail = async (id: any) => {
    if (id) {
      try {
        const res = await getExpertDetail(id);
        if (res.code === 0) {
          console.log(res);
          setExpertDetail(res.result);
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
  // 创新需求
  const [innovaDetail, setInnovateDetail] = useState<any>({});
  
  const prepareInnovateDemand = async (id: any) => {
    if (id) {
      try {
        const res = await getDemandDetail(id);
        if (res.code === 0) {
          setInnovateDetail(res.result);
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
  const prepare = (id: any) => {
    // 根据详情判断是需求还是，专家资源. 所属板块
    if (tab === 'DEMAND') {
      prepareDemandModal(id);
      return;
    }
    if (tab === 'EXPERT') {
      prepareExpertDetail(id)
      return;
    }
    if (tab === 'CREATIVE_DEMAND') {
      prepareInnovateDemand(id)
      return;
    }
  };
  // 需求详情
  const DemandModal = (props: {
    id: string;
    setLoading: (loading: boolean) => void;
    detail: any
  }) => {
    const {id , detail} = props;

    return (
      <div className={sc('container-left')}>
        <div className={sc('container-left-title')}>{detail?.name || '--'}</div>
        <div style={{marginBottom: '20px'}}>
          <Image height={300} width={400} src={detail?.coverUrl} />
        </div>
        <div className={sc('container-left-desc')}>
          <span>需求类型：</span>
          <span>{detail?.typeNames ? detail?.typeNames.join('、') : '--'}</span>
        </div>
        <div className={sc('container-left-desc')}>
          <span>需求区域：</span>
          <span>{detail?.orgAreaName ? detail?.orgAreaName : '--'}</span>
        </div>
        <div className={sc('container-left-desc')}>
          <span>需求时间范围：</span>
          <span>{detail?.startDate ? `${detail?.startDate}~${detail?.endDate}` : '--'}</span>
        </div>
        <div className={sc('container-left-desc')}>
          <span>需求内容：</span>
          <span>{detail?.content || '--'}</span>
        </div>
        <div className={sc('container-left-label')}>企业基础信息</div>
        <div className={sc('container-left-desc')}>
          <span>组织信息展示：</span>
          <span>{detail?.hide ? '隐藏' : '显示'}</span>
        </div>
        <div className={sc('container-left-desc')}>
          <span>企业名称：</span>
          <span>{detail?.orgName ? detail?.orgName : '--'}</span>
        </div>
        <div className={sc('container-left-desc')}>
          <span>企业所在地：</span>
          <span>{detail?.orgAreaName ? detail?.orgAreaName : '--'}</span>
        </div>
        <div className={sc('container-left-desc')}>
          <span>所属产业：</span>
          <span>{detail?.orgIndustryName ? detail?.orgIndustryName : '--'}</span>
        </div>
        <div className={sc('container-left-label')}>联系信息</div>
        <div className={sc('container-left-desc')}>
          <span>联系人：</span>
          <span>{detail?.contact ? detail?.contact : '--'}</span>
        </div>
        <div className={sc('container-left-desc')}>
          <span>联系电话：</span>
          <span>{detail?.phone ? detail?.phone : '--'}</span>
        </div>
      </div>
    );
  };
  const ExpertDetail = (props: {
    id: string;
    setLoading: (loading: boolean) => void;
    expertDetail: any
  }) => {
    const { id, setLoading, expertDetail } = props;
    // 专家
    // 根据expertDetail 结构
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
      workExp = '暂无',
      projectExp = '暂无',
      skilledField = '暂无',
      expertSkill = '暂无',
      expertIntroduction = '暂无',
      typeNames,
      diagnosisRecordList,
    } = expertDetail || {};

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
      <div className={'expert-detail-card'}>
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
    );
  };
  const InnovateDemand = (props: {
    id: string
    setLoading: (loading: boolean) => void 
    innovaDetail: any
  }) => {
    const {id, setLoading,innovaDetail } = props || {}
  
    return (
      <div className={sc('innovateDemand')}>
        <div className={sc('innovateDemand-container')}>
          <div className={sc('container-title')}>创新需求信息</div>
          <div style={{ marginLeft: 200 }}>
            <Image height={200} width={300} src={innovaDetail?.cover} />
          </div>
          <div className={sc('container-desc')}>
            <span>需求名称：</span>
            <span>{innovaDetail?.name || '--'}</span>
          </div>
          <div className={sc('container-desc')}>
            <span>需求类型：</span>
            <span>{innovaDetail?.typeName || '--'}</span>
          </div>
          <div className={sc('container-desc')}>
            <span>行业类别：</span>
            <span>{innovaDetail?.industryTypeNames ? innovaDetail?.industryTypeNames.join('，') : '--'}</span>
          </div>
          <div className={sc('container-desc')}>
            <span>关键词：</span>
            <span>{innovaDetail?.typeName || '--'}</span>
          </div>
          <div className={sc('container-desc')}>
            <span>需求区域：</span>
            <span>{innovaDetail?.areaNames ? innovaDetail?.areaNames.join('，') : '--'}</span>
          </div>
          <div className={sc('container-desc')}>
            <span>需求时间范围：</span>
            <span>{innovaDetail?.startDate ? `${innovaDetail?.startDate}~${innovaDetail?.endDate}` : '--'}</span>
          </div>
          <div className={sc('container-desc')}>
            <span>需求内容：</span>
            <span>{innovaDetail?.content || '--'}</span>
          </div>
          <div className={sc('container-title')}>基本信息</div>
          <div className={sc('container-desc')}>
            <span>联系人：</span>
            <span>{innovaDetail?.contactName || '--'}</span>
          </div>
          <div className={sc('container-desc')}>
            <span>联系电话：</span>
            <span>{innovaDetail?.contactPhone || '--'}</span>
          </div>
          <div className={sc('container-desc')}>
            <span>需求企业名称：</span>
            <span>{innovaDetail?.orgName || '--'}</span>
          </div>
        </div>
      </div>
    )
  };

  const detailDom = {
    DEMAND: <DemandModal id={detailId} setLoading={setLoading} detail={detail} />,
    EXPERT: <ExpertDetail id={detailId} setLoading={setLoading} expertDetail={expertDetail} />,
    CREATIVE_DEMAND: <InnovateDemand id={detailId} setLoading={setLoading} innovaDetail={innovaDetail} />,
  }[tab];

  const [dataSource, setDataSource] = useState<any>([]);

  const onChange = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    // 修改searchInfo的值，
    try {
      const { result, totalCount, pageTotal, code } = await getCommentsDetailPage({
        pageIndex,
        pageSize,
        detailId: detailId,
        tabEnum: tab,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // VerifyInfoDetail 
  const [verifyId, setVerifyId] = useState<string>('')
  useEffect(() => {
    setVerifyId(auditId)
    _getCommentsCurrent(commentId)
    prepare(detailId);
    onChange();
  }, [tab]);

  const handleItemComment = (item: any) => {
    setVerifyId(item.auditId)
    _getCommentsCurrent(item.commentId)
  }

  return (
    <PageContainer
      header={{
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/solution-properties/message-management">留言管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {'详情'}
            </Breadcrumb.Item>
          </Breadcrumb>
        )
      }}
    >
    {/* <PageContainer loading={loading}> */}
      <div className={sc('container')}>
        {detailDom}
        {/* 留言列表 */}
        <div className={sc('container-right')}>
          <div className={sc('container-right-title')}>全部留言</div>
          <div className={sc('container-right-content')}>
            {/* 循环体 */}
            {dataSource?.map((item: any) => {
              const { commentId, type, status, fromUserName, photoUrl, content, createTime, isAnonymity } =
                item || {};
              return (
                <React.Fragment key={commentId}>
                  <div className={sc('container-right-content-box')} onClick={()=>handleItemComment(item)}>
                    <div className={sc('container-right-content-box-left')}>
                      <img src={photoUrl} style={{ width: '30px', height: '30px' }} />
                    </div>
                    <div className={sc('container-right-content-box-right')}>
                      <div className={sc('container-right-content-box-right-header')}>
                        <span>{fromUserName}</span>
                        <span>{createTime}</span>
                      </div>
                      <div className={sc('container-right-content-box-right-label')}>
                        <span 
                          className={
                            sc('container-right-content-box-right-label-states')
                          }
                          >
                          {stateObj[status]}
                        </span>
                        {isAnonymity && (
                          <span className={sc('container-right-content-box-right-label-anonymity')}>
                            匿名
                          </span>
                        )}
                      </div>
                      <div className={sc('container-right-content-box-right-content')}>{content}</div>
                    </div>
                  </div>
                  <Divider style={{margin: '10px 0px 0px'}} />
                </React.Fragment>
              );
            })}
            {/* 分页 total由列表的total来赋值，⭐   */}
            <div className={sc('container-right-content-pagination')}>
              <Pagination
                current={pageInfo.pageIndex}
                pageSize={pageInfo.pageSize}
                total={pageInfo.totalCount}
                showQuickJumper
                onChange={onChange}
                onShowSizeChange={onChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: '#fff', margin: '20px 0', paddingTop: 20 }}>
        <div className='expert-message'>
          <div className='expert-message-title'>当前审核留言</div>
          <div className='expert-message-content'>
            <div className='expert-message-content-left'>
              <img src={currentData?.photoUrl} className='expert-message-content-left-img' />
            </div>
            <div className='expert-message-content-right'>
              <div className='expert-message-content-right-header'>
                <span className='expert-message-content-right-header-name'>
                  {currentData?.name}
                </span>
                {
                  currentData?.isAnonymity && <span className='expert-message-content-right-header-label'>匿名</span>
                }
                <span className='expert-message-content-right-header-time'>
                  {currentData?.createTime}
                </span>
              </div>
              <div className='expert-message-content-right-content'>
                {currentData?.content}
              </div>
            </div>
          </div>
        </div>
        <div className='expert-message'>
          <div className='expert-message-title'>审核</div>
        </div>
        <VerifyInfoDetail auditId={verifyId} reset={()=>{prepare(detailId)}} />
      </div>
    </PageContainer>
  );
};
