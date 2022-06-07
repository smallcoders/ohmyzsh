import Common from './common';

namespace AuthenticationInfo {
  export enum AuthenticationType {
    ENTERPRISE = 'ENTERPRISE', // 工业企业
    SERVICE_PROVIDER = 'SERVICE_PROVIDER', // 服务机构
    EXPERT = 'EXPERT', // 专家
  }

  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: number; //	企业、机构、专家id
    orgName?: string; //	认证名称
    userName?: string; //	用户名
    createTime?: string; //	认证时间
    phone?: string; //	手机号
    area?: string; //	区域
  };

  export type SearchContent = {
    auditType?: string; //	认证类型。工业企业：BUSINESS_INFO，服务机构：FACILITATOR_INFO，专家：EXPERT
    orgName?: string; //	认证名称
    userName?: string; //	用户名
    startDate?: string; //	认证开始时间

    endDate?: string; //	认证结束时间

    phone?: string; //	手机号
    areaCode?: string; //	区域id
  };
  export type EnterpriseDetail = {
    id?: number; //主键 自增
    orgName?: string; //企业名称
    phone?: string; //电话
    areaCode?: number; //所属区域 市
    areaName?: string; //所属区域 市名称
    countyCode?: number; //所属区域 县
    countyName?: string; //所属区域 县名称
    address?: string; //地址
    businessLicenseId?: string; //营业执照 Id
    businessLicense?: string; //营业执照Url
    creditCode?: string; //统一社会信用代码
    formedDate?: string; //成立时间

    registeredCapital?: number; //注册资本（万元）
    scale?: number; //企业规模 1:0～50人，2:50～100人，3:100～200人，4:200～500人，5:500人以上
    coverId?: string; //公司封面 Id
    cover?: string; //公司封面Url
    aboutUs?: string; //企业简介
    ability?: string; //核心能力
    auditState?: number; //认证状态 0尚未填报 1填报中 2审核中 3审核成功 4审核退回
  };

  export type InstitutionDetail = {
    id?: number; //主键 自增
    orgName?: string; //企业名称
    phone?: string; //电话
    areaCode?: number; //所属区域 市
    areaName?: string; //所属区域 市名称
    countyCode?: number; //所属区域 县
    countyName?: string; //所属区域 县名称
    address?: string; //地址
    orgTypeId?: string; //机构类型id
    orgTypeName?: string; //机构类型名称
    businessLicenseId?: string; //营业执照 Id
    businessLicense?: string; //营业执照Url
    creditCode?: string; //统一社会信用代码
    formedDate?: string; //成立时间
    registeredCapital?: number; //注册资本（万元）
    scale?: number; //企业规模 1:0～50人，2:50～100人，3:100～200人，4:200～500人，5:500人以上
    coverId?: string; //公司封面 Id
    cover?: string; //公司封面Url
    aboutUs?: string; //企业简介
    ability?: string; //核心能力
    auditState?: number; //认证状态 0尚未填报 1填报中 2审核中 3审核成功 4审核退回
  };

  export type ExpertDetail = {
    id?: string; //主键
    orgId?: string; // 工作单位id
    personalPhotoId?: string; //个人照片Id
    personalPhoto?: string; //个人照片url
    expertName?: string; //专家姓名
    phone?: string; //手机号
    workUnit?: string; //工作单位
    duty?: string; //职务
    areaCode?: number; //所属区域 市
    areaName?: string; //区域名称 市
    expertType?: string; //专家类型Id,分割
    typeName?: string; //类型名称,分割
    expertIntroduction?: string; //专家介绍
    fileIds?: string; //相关附件id,分割
    fileList?: Common.CommonFile[]; //附件
    auditState?: number; //认证状态 0尚未填报 1填报中 2审核中 3审核成功 4审核退回
  };
}
export default AuthenticationInfo;
