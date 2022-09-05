import { message, Image, Button, Form, Space, Pagination, Divider, Typography   } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, Fragment } from 'react';
import { history } from 'umi';
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

import './index.less';
const { Title, Paragraph } = Typography;
const sc = scopedClasses('leave-word-audit-detail');

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
  // 企业
  const [detail, setDetail] = useState<LeaveWordVerify.Detail>({});

  const [searchInfo, setSearchInfo] = useState<any>({});

  // 获取企业详情
  const prepareDemandModal = async () => {
    try {
      const res = await getOfficeRequirementVerifyDetail(detailId);
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
  // 查询当前审核的留言
  const _getCommentsCurrent = async () => {
    try {
      const res = await getCommentsCurrent({
        commentId: commentId
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
  const prepare = () => {
    _getCommentsCurrent()
    // 根据详情判断是需求还是，专家资源. 所属板块
    if (tab === 'DEMAND') {
      prepareDemandModal();
      return;
    }
    if (tab === 'EXPERT') {
      return;
    }
    if (tab === 'CREATIVE_DEMAND') {
      return;
    }
  };
  // 需求详情
  const DemandModal = (props: {
    id: string;
    setLoading: (loading: boolean) => void;
    detail: any;
  }) => {
    const { detail } = props;
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
      </div>
    );
  };
  const ExpertDetail = (props: {
    id: string;
    setLoading: (loading: boolean) => void;
    detail: any;
  }) => {
    const { id, setLoading } = props;
    // 专家
    const [expertDetail, setExpertDetail] = useState<ExpertResource.Detail>({});
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

    const prepare = async () => {
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
  }) => {
    const {id, setLoading} = props || {}
    const [detail, setDetail] = useState<any>({});
  
    const prepare = async () => {
      if (id) {
        try {
          // const res = await getDemandDetail('1662023545000001');
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

  const detailDom = {
    DEMAND: <DemandModal id={detailId} setLoading={setLoading} detail={detail} />,
    EXPERT: <ExpertDetail id={detailId} setLoading={setLoading} detail={detail} />,
    CREATIVE_DEMAND: <InnovateDemand id={detailId} setLoading={setLoading} />,
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

  useEffect(() => {
    prepare();
    onChange();
  }, [tab]);

  return (
    <PageContainer>
    {/* <PageContainer loading={loading}> */}
      <div className={sc('container')}>
        {detailDom}
        {/* 留言列表 */}
        <div className={sc('container-right')}>
          <div className={sc('container-right-title')}>全部留言</div>
          <div className={sc('container-right-content')}>
            {/* 循环体 */}
            {dataSource?.map((item: any) => {
              const { commentId, type, fromUserName, photoUrl, content, createTime, isAnonymity } =
                item || {};
              return (
                <React.Fragment key={commentId}>
                  <div className={sc('container-right-content-box')}>
                    <div className={sc('container-right-content-box-left')}>
                      <img src={photoUrl} style={{ width: '30px', height: '30px' }} />
                    </div>
                    <div className={sc('container-right-content-box-right')}>
                      <div className={sc('container-right-content-box-right-header')}>
                        <span>{fromUserName}</span>
                        <span>{createTime}</span>
                      </div>
                      <div className={sc('container-right-content-box-right-label')}>
                        <span className={sc('container-right-content-box-right-label-states')}>
                          待审核
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
        <VerifyInfoDetail auditId={auditId} reset={prepare} />
      </div>
    </PageContainer>
  );
};
