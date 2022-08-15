import type Common from '../common';

namespace EnterpriseInfoVerify {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; // id
    orgName?: string; // 组织名称
    accountType?: string; // 组织类型  枚举备注: ENTERPRISE :企业 COLLEGE :高校 INSTITUTION :科研机构 OTHER :其他
    userName?: string; // 申请人姓名
    phone?: string; // 手机号
    state?: string; // 状态
    updateTime?: string; // 最新操作时间
  };

  export type Detail = {
    businessLicense: string; //营业执照
    patternOrganization: string; //组织类型
    organizationName: string; //组织名称
    creditCode: string; //统一社会信用代码
    formedDate: string; //成立时间
    scale: number; //企业规模
    phone: string; // 联系电话
    areaName: string; // 注册区域
    detailedAddress: string; // 详细地址
    registeredCapital: string; // 注册资本
    aboutUs: string; // 组织简介
    ability: string; // 组织核心能力
    organizationLogo: string; //组织logo
    natureOfunit: string; //单位性质
    legalPersonName: string; //法人姓名
    allProperty: number; //总资产
    lastYearMoney: number; //上年营收
    lastYearProfit: number; //上年利润
    qualityRating: string; //信用等级
    businessScope: string; //经营范围
  };
}

export default EnterpriseInfoVerify;
