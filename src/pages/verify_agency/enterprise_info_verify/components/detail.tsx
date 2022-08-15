import { useState } from 'react';
import { history } from 'umi';
import { Descriptions, Image} from 'antd';
import UploadForm from '@/components/upload_form';//上传组件
import { PageContainer } from '@ant-design/pro-layout';
import type EnterpriseInfoVerify from '@/types/verify/enterprise-info-verify';
import scopedClasses, { labelStyle, contentStyle } from '@/utils/scopedClasses';
import './detail.less';

const sc = scopedClasses('user-config-kechuang');
export const previewType = ['png', 'jpg', 'jpeg', 'jpeg2000', 'pdf']; // 可预览的格式

export default () => {
  const id = history.location.query?.id as string;
  const [detail, setDetail] = useState<EnterpriseInfoVerify.Detail | null>(null);

  const {
    businessLicense,
    patternOrganization,
    organizationName,
    creditCode,
    formedDate,
    scale,
    phone,
    areaName,
    detailedAddress,
    registeredCapital,
    aboutUs,
    ability,
    organizationLogo,
    natureOfunit,
    legalPersonName,
    allProperty,
    lastYearMoney,
    lastYearProfit,
    qualityRating,
    businessScope,
  } = detail || {};

  const basicContent1 = [
    {
      label: '营业执照',
      value: businessLicense ? (
        <Image className="img-photo" src={businessLicense} alt="营业执照" />
      ) : (
        ''
      ),
    },
    { label: '组织类型', value: patternOrganization},
    { label: '组织名称', value: organizationName},
    { label: '统一社会信用代码', value: creditCode},
    { label: '成立时间', value: formedDate},
    { label: '企业规模', value: scale},
    { label: '联系电话', value: phone},
    { label: '注册区域', value: areaName},
    { label: '详细地址', value: detailedAddress},
    { label: '注册资本', value: registeredCapital },
    { label: '组织简介', value: aboutUs},
    { label: '组织核心能力', value: ability},
  ];

  const basicContent2 = [
    {
      label: '组织logo',
      value: organizationLogo ? (
        <Image className="img-photo" src={organizationLogo} alt="组织logo" />
      ) : (
        ''
      ),
    },

    { label: '单位性质', value: natureOfunit},
    { label: '法人姓名', value: legalPersonName},
    { label: '总资产', value: allProperty},
    { label: '上年营收', value: lastYearMoney},
    { label: '上年利润', value: lastYearProfit},
    { label: '信用等级', value: qualityRating},
    { label: '经营范围', value: businessScope},
  ];

  const infoAuthContent = [
    { title: '组织基本信息', content: basicContent1},
    { title: '其他信息', content: basicContent2 },
  ];

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
                );
              })}
            </Descriptions>
          </div>
        );
      })}
    </PageContainer>
  );
};

