import React, { Fragment, useEffect, useState } from 'react';
import './expert-detail.less';
import type ExpertResource from '@/types/expert_manage/expert-resource';
import { getExpertDetail } from '@/services/expert_manage/expert-resource';
import { history } from 'umi';
import { message, Space, Typography, Image, Divider } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProDescriptions from '@ant-design/pro-descriptions';
const { Title, Paragraph } = Typography;

export default () => {
  const [detail, setDetail] = useState<ExpertResource.Detail>({});
  const [loading, setLoading] = useState(true);
  const {
    expertName,
    duty,
    // dutyHide,
    phone,
    // phoneHide,
    email,
    // emailHide,
    areaName,
    workUnit,
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
    const id = history.location.query?.id as string;

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

  // 专家id

  useEffect(() => {
    prepare();
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
  ];

  return (
    <PageContainer loading={loading} className={'expert-container'}>
      <div className={'expert-detail-card'} style={{ marginTop: '20px' }}>
        <div className={'expert-detail-card-header'}>
          <Image alt={expertName} preview={false} width={135} height={170} src={personalPhoto} />
          <div className="basic-info">
            <Title className="expert-name">{expertName}</Title>
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
  );
};
