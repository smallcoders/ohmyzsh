import { useState, useEffect } from 'react';
import { history } from 'umi';
import { Descriptions, Image } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type EnterpriseInfoVerify from '@/types/verify/enterprise-info-verify';
import { httpGetEnterpriseInfoVerifyDetail } from '@/services/verify/enterprise-info-verify'
import VerifyInfoDetail from '@/components/verify_info_detail';
import scopedClasses, { labelStyle, contentStyle } from '@/utils/scopedClasses';
import './detail.less';

const sc = scopedClasses('enterprise-info-verify-detail');

export default () => {
  const id = history.location.query?.id as string;
  const [detail, setDetail] = useState<EnterpriseInfoVerify.Detail | null>(null);

  const {
    businessLicense,
    orgTypeName,
    orgName,
    creditCode,
    formedDate,
    scale,
    phone,
    provinceName, // 所属区域-省名称
    cityName, // 所属区域-市名称
    countyName, // 所属区域-县名称
    address,
    registeredCapital,
    aboutUs,
    ability,
    cover,
    businessType,
    legalName,
    totalAssets,
    revenueLastYear,
    profitLastYear,
    creditRating,
    businessScope,
  } = detail || {};

  useEffect(() => {
    getEnterpriseInfoVerifyDetail(id)
  }, [])

  const getEnterpriseInfoVerifyDetail = async (id: string) => {
    try {
      const { code, result, message } = await httpGetEnterpriseInfoVerifyDetail(id)
      if (code === 0) {
        setDetail(result)
      } else {
        throw new Error(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const basicContent1 = [
    {
      label: '营业执照',
      value: businessLicense ? (
        <Image className="img-photo" src={businessLicense} alt="营业执照" />
      ) : (
        ''
      ),
    },
    { label: '组织类型', value: orgTypeName },
    { label: '组织名称', value: orgName },
    { label: '统一社会信用代码', value: creditCode },
    { label: '成立时间', value: formedDate },
    { label: '企业规模', value: scale },
    { label: '联系电话', value: phone },
    { label: '注册区域', value: provinceName + cityName + countyName },
    { label: '详细地址', value: address },
    { label: '注册资本', value: registeredCapital },
    { label: '组织简介', value: aboutUs },
    { label: '组织核心能力', value: ability },
  ];

  const basicContent2 = [
    {
      label: '组织logo',
      value: cover ? (
        <Image className="img-photo" src={cover} alt="组织logo" />
      ) : (
        ''
      ),
    },
    { label: '单位性质', value: businessType },
    { label: '法人姓名', value: legalName },
    { label: '总资产', value: totalAssets },
    { label: '上年营收', value: revenueLastYear },
    { label: '上年利润', value: profitLastYear },
    { label: '信用等级', value: creditRating },
    { label: '经营范围', value: businessScope },
  ];

  const infoAuthContent = [
    { title: '组织基本信息', content: basicContent1 },
    { title: '其他信息', content: basicContent2 },
  ];

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('detail-container')}>
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
      </div>
      <div className={sc('verify-container')}>
        <VerifyInfoDetail auditId={id}/>
      </div>
    </PageContainer>
  );
};
