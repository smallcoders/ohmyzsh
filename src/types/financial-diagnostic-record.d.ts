import type Common from './common';

namespace DiagnosticRecord {
  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }
  // 诊断记录查询列表
  export type Content = {
    id?: number; //诊断id
    diagnoseNum?: string; //诊断编号
    orgName?: string; //企业名称
    exclusiveService?: boolean; //是否满足金融专属服务 true是 false否
    type?: number; // 诊断类型
    typeContent?: string; // 诊断类型说明
    amount?: number; //拟融资金额
    term?: number; // 拟融资期限
    createTime?: string; //  诊断时间
    linkCustomer?: boolean; //是否对接客户 true是 false否
    applyNum?: number; //申请数量
  };
  export type CustomerDemand = {
    id?: number; //主键
    diagnoseId?: number; //诊断id
    loanDemand?: boolean; //是否有贷款需求 true是 false否
    amount?: number; //拟融资额度
    term?: number; //拟融资期限(个月)
    purpose?: string; //融资用途
    recProduct?: string; //推荐产品id，逗号隔开
    status?: number; //状态 0-未删除 1-删除
  };
  export interface CustomerDemandObj extends Common.ResultCode {
    result: CustomerDemand[];
  }

  // 诊断详情查询
  export type CustomerInfo = {
    name?: string; //企业名称
    legalPersonName?: string; //法定代表人
    formedDate?: string; //成立时间
    regAddress?: string; //注册地址
    contacts?: string; //联系人
    phone?: string; //联系方式
    revenueLastYear?: number; //上年营收
  };
  export type DiagnoseRecord = {
    diagnoseNum?: string; //诊断编号
    createTime?: string; //诊断时间
    amount?: number; //期望融资金额
    term?: number; //期望融资期限
    purpose?: number; //融资用途 关联loan_purpose表
    purposeContent?: string; //融资用途说明
    purposeRemark?: string; //融资用途为其他时的备注
    applyNum?: number; //产品申请数量
    qualification?: string; //企业资质（多选，逗号隔开） 1 规上企业 2 高新技术企业 3 科技型中小企业 4 民营科技企业 5 专精特新企业
    revenueContent?: string;
    urgency?: number; // 资金需求紧迫度  1  急需解决资金问题/近期有融资计划 2希望获得产品推介/近期无融资计划
    urgencyRemark?: string; //到账时间
    type?: number; // 1 快速诊断 2 精准诊断
  };
  export type OrgAssets = {
    typeContent?: string; //资产类型 1自有产权土地、2自有高价值设备
    cost?: number; //购买成本
    buyTime?: string; //购置时间
    clear?: boolean; //贷款是否结清 true已结清、false未结清
  };
  export type DiagnoseCreditVO = {
    id?: number; //业务申请id
    productName?: string; //产品名称
  };

  export type DiagnoseDetail = {
    customerInfo?: CustomerInfo; //用户信息
    diagnoseRecord?: DiagnoseRecord; //诊断信息
    orgAssets?: OrgAssets[]; //资产信息
    diagnoseCreditVO?: DiagnoseCreditVO[]; //产品申请
  };
  export interface DiagnoseDetailData extends Common.ResultCode {
    result: DiagnoseDetail;
  }
}

export default DiagnosticRecord;
