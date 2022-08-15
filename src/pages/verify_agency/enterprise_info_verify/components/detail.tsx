import { useState } from 'react';
import { history } from 'umi';
import { Descriptions, Image,Upload, Select,Input,Form,InputNumber} from 'antd';
import UploadForm from '@/components/upload_form';//上传组件

import { PageContainer } from '@ant-design/pro-layout';
import type ExpertAuthVerify from '@/types/verify/expert-auth-verity';
import scopedClasses, { labelStyle, contentStyle } from '@/utils/scopedClasses';
import './detail.less';

const sc = scopedClasses('user-config-kechuang');
export const previewType = ['png', 'jpg', 'jpeg', 'jpeg2000', 'pdf']; // 可预览的格式

export default () => {
  const id = history.location.query?.id as string;
  const [detail, setDetail] = useState<ExpertAuthVerify.Detail | null>(null);

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
    { label: '组织类型', value: patternOrganization,type:"Select"},
    { label: '组织名称', value: organizationName,type:"Input"},
    { label: '统一社会信用代码', value: SocialCredit ,type:"Input"},
    { label: '成立时间', value: formedDate,type:"Input"},
    { label: '企业规模', value: scale,type:"Select"},
    { label: '联系电话', value: phone,type:"Input"},
    { label: '注册区域', value: areaName,type:"Select" },
    { label: '详细地址', value: detailedAddress,type:"Input"},
    { label: '注册资本', value: registeredCapital,type:"Input" },
    { label: '组织简介', value: organizeMeetings,type:"Textarea" },
    { label: '组织核心能力', value: organizingAbilitys,type:"Textarea"},
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

    { label: '单位性质', value: natureOfunit,type:"Select"},
    { label: '法人姓名', value: legalPersonName,type:"Input" },
    { label: '总资产', value: allProperty,type:"Input"},
    { label: '上年营收', value: lastYearMoney,type:"Input"},
    { label: '上年利润', value: lastYearProfit,type:"Input"},
    { label: '信用等级', value: qualityRating,type:"Input"},
    { label: '经营范围', value: businessScope,type:"Textarea"},
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
            <div className={sc('header')} style={{fontSize: 20 ,background: "#F5F5F5",color:'#000000' }} >{item?.title}</div>    
            <Descriptions column={1} labelStyle={labelStyle} contentStyle={contentStyle}>
              {item?.content?.map((item, index: number) => {
                
                return (
                  <Descriptions.Item style={{background: "#ffffff"}}  key={item?.label || index} label={item?.label || null}>
                    {/* {item?.value || '--'}      */}
             

             {/* {item?.label === '组织类型' && <Select></Select>}
             {item?.label === '企业规模' &&
            <Select placeholder="请选择" allowClear style={{ width: '300px' }}>
            <Select.Option value={1}>0～50人</Select.Option>
            <Select.Option value={2}>50～100人</Select.Option>
            <Select.Option value={3}>100～200人</Select.Option>
            <Select.Option value={4}>200～500人</Select.Option>
            <Select.Option value={5}>500人以上</Select.Option>
          </Select>}
             {item?.label === '注册区域' && <Select></Select>}
             {item?.label === '单位性质' && <Select placeholder="请选择"></Select>}
             { item?.label === '组织名称' && <Input></Input>}
             {item?.label === '组织简介' && <Input.TextArea placeholder="请输入"></Input.TextArea>} 
             {item?.label ==='组织核心能力' && <Input.TextArea placeholder="请输入"></Input.TextArea>}
             {item?.label ==='总资产' && <Input></Input>}
             {item?.label ==='经营范围' && <Input.TextArea></Input.TextArea>}
             {item?.label ==='上年营收' && <Input placeholder="请精确到小数点后两位"></Input>}
             {item?.label ==='上年利润' && <Input placeholder="请精确到小数点后两位"></Input>}
             {item?.label ==='法人姓名' && <Input placeholder="请输入"></Input>}
             {item?.label ==='信用等级' && <Input placeholder="请输入"></Input>}
             {item?.label ==='联系电话' && <Input placeholder="请输入"></Input>}
             {item?.label ==='详细地址' && <Input.TextArea placeholder="请输入"></Input.TextArea>}
             {item?.label ==='成立时间' && <Input.TextArea placeholder="请输入"></Input.TextArea>}
             {item?.label ==='统一社会信用代码' && <Input.TextArea></Input.TextArea>}
            
             {item?.label ==='注册资本' &&
            <InputNumber
            style={{ width: '300px' }}
            min={0}
            max={99999999999}
            addonAfter={<div>万元</div>}
          />}

             {item?.label ==='组织logo' &&
             <UploadForm
            listType="picture-card"
            className="organizationLogo"
            showUploadList={false}
            maxSize={5}
            accept=".png,.jpeg,.jpg"
            tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG,且不超过5M</span>}
          />}

             {item?.label ==='营业执照' && 
            <UploadForm
            listType="picture-card"
            className="businessLicenser"
            showUploadList={false}
            maxSize={5}
            accept=".png,.jpeg,.jpg"
            tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG,且不超过5M</span>}
          />} */}

   

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

