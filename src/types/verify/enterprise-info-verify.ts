import type Common from '../common';

namespace EnterpriseInfoVerify {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    auditId?: string; // 审核Id 通过审核Id获取详情
    orgName?: string; // 组织名称
    orgTypeId: number; //机构类型id
    orgTypeName?: string; //机构类型名称
    username?: string; // 申请人姓名
    phone?: string; // 手机号
    auditState?: string; // 状态
    operationTime?: string; // 最新操作时间
  };

  export type Detail = {
    businessLicense: string; //营业执照
    orgTypeName: string; //组织类型
    orgName: string; //组织名称
    creditCode: string; //统一社会信用代码
    formedDate: string; //成立时间
    scale: number; //企业规模 1:0～50人，2:50～100人，3:100～200人，4:200～500人，5:500人以上
    phone: string; // 联系电话
    provinceName: string; // 所属区域-省名称
    cityName: string; // 所属区域-市名称
    countyName: string; // 所属区域-县名称
    address: string; // 详细地址
    registeredCapital: string; // 注册资本
    aboutUs: string; // 组织简介
    ability: string; // 组织核心能力
    cover: string; // 组织logo
    businessType: string; // 单位性质 1国营 2民营 3三资 4其他（事业单位、科研院所等）
    legalName: string; // 法人姓名
    totalAssets: number; // 总资产
    revenueLastYear: number; // 上年营收
    profitLastYear: number; // 上年利润
    creditRating: string; // 信用等级
    businessScope: string; // 经营范围
  };
}

export default EnterpriseInfoVerify;
