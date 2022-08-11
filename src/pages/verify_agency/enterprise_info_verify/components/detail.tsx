import { useState } from 'react';
import { history } from 'umi';
import { Descriptions, Image, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type ExpertAuthVerify from '@/types/verify/expert-auth-verity';
import scopedClasses, { labelStyle, contentStyle } from '@/utils/scopedClasses';
import './detail.less';

const sc = scopedClasses('user-config-kechuang');
export const previewType = ['png', 'jpg', 'jpeg', 'jpeg2000', 'pdf'] // 可预览的格式

export default () => {
  const id = history.location.query?.id as string;
  const [detail, setDetail] = useState<ExpertAuthVerify.Detail | null>(null);

  const {
    personalPhoto,
    expertName,
    areaName,
    typeName,
    industryList,
    phone,
    workUnit,
    duty,
    email,
  } = detail || {}

  const basicContent1 = [
    {
      label: '个人照片',
      value: personalPhoto ? (
        <Image className="img-photo" src={personalPhoto} alt="个人照片" />
      ) : (
        ''
      ),
    },
    { label: '专家姓名', value: expertName },
    { label: '所属区域', value: areaName },
    { label: '专家类型', value: typeName?.replace(/,/g, '、') || '' },
    { label: '产业方向', value: industryList?.replace(/,/g, '、') || '' },
  ]

  const basicContent2 = [
    { label: '联系电话', value: phone },
    { label: '工作单位', value: workUnit },
    { label: '职务', value: duty },
    { label: '邮箱', value: email },
  ]

  const infoAuthContent = [
    { title: '组织基本信息', content: basicContent1 },
    { title: '其他信息', content: basicContent2 },
  ]

  return (
    <PageContainer className={sc('container')}>
      {infoAuthContent?.map((item, index) => {
        return (
          <div key={index}>
            <div className={sc('header')}>{item?.title}</div>
            <Descriptions column={1} labelStyle={labelStyle} contentStyle={contentStyle}>
              {item?.content?.map((item, index: number) => {
                return (
                  <Descriptions.Item key={item?.label || index} label={item?.label || null}>
                    {item?.value || '--'}
                  </Descriptions.Item>
                )
              })}
            </Descriptions>
          </div>
        )
      })}
    </PageContainer>
  );
};
