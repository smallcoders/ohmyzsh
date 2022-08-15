import { useState, useEffect } from 'react';
import { history } from 'umi';
import { Descriptions, Image, Upload, Select, Input, Form, InputNumber } from 'antd';
// import UploadForm from '@/components/upload_form'; //上传组件

import { PageContainer } from '@ant-design/pro-layout';
import type ExpertAuthVerify from '@/types/verify/expert-auth-verity';
import scopedClasses, { labelStyle, contentStyle } from '@/utils/scopedClasses';
import './detail.less';

import { httpGetEnterpriseInfoVerifyCheck} from '@/services/verify/enterprise-info-verify'
const sc = scopedClasses('user-config-kechuang');
export const previewType = ['png', 'jpg', 'jpeg', 'jpeg2000', 'pdf']; // 可预览的格式



  


export default () => {
  const id = history.location.query?.id as string;
  const [detail, setDetail] = useState<ExpertAuthVerify.Detail | null>(null);
  // console.log(detail);
  
  
  

  const {
    areaName,
    phone,
    businessLicense,
    patternOrganization,
    organizationName,
    SocialCredit,
    formedDate,
    scale,
    detailedAddress,
    registeredCapital,
    organizeMeetings,
    organizingAbilitys,
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
    { label: '组织类型', value: patternOrganization  },
    { label: '组织名称', value: organizationName },
    { label: '统一社会信用代码', value: SocialCredit },
    { label: '成立时间', value: formedDate},
    { label: '企业规模', value: scale  },
    { label: '联系电话', value: phone},
    { label: '注册区域', value: areaName },
    { label: '详细地址', value: detailedAddress },
    { label: '注册资本', value: registeredCapital},
    { label: '组织简介', value: organizeMeetings },
    { label: '组织核心能力', value: organizingAbilitys},
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

    { label: '单位性质', value: natureOfunit  },
    { label: '法人姓名', value: legalPersonName },
    { label: '总资产', value: allProperty},
    { label: '上年营收', value: lastYearMoney },
    { label: '上年利润', value: lastYearProfit },
    { label: '信用等级', value: qualityRating},
    { label: '经营范围', value: businessScope },
  ];

  const infoAuthContent = [
    { title: '组织基本信息', content: basicContent1 },
    { title: '其他信息', content: basicContent2 },
  ];

  const details =async(id:string)=>{//审核接口
    try{
      const {code, result} =await httpGetEnterpriseInfoVerifyCheck(id)
        
      if(code === 0) {
        setDetail(result)
      }else {
        
      }
    }catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    details("1")
  }, [])

  return (
    <PageContainer className={sc('container')}>
      {infoAuthContent?.map((item, index) => {
        return (
          <div key={index}>
            <div
              className={sc('header')}
              style={{ fontSize: 20, background: '#F5F5F5', color: '#000000' }}
            >
              {item?.title}
            </div>
            <Descriptions column={1} labelStyle={labelStyle} contentStyle={contentStyle}>
              {item?.content?.map((item1, index1: number) => {
                return (
                  <Descriptions.Item
                    style={{ background: '#ffffff' }}
                    key={item1?.label || index1}
                    label={item1?.label || null}
                  >
                    {item1.value}
                    {/* {item?.value || '--'}      */}
                    {/* {item?.label === '组织类型' && <p>000</p>} */}

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
