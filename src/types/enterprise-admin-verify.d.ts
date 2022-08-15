import type Common from '../common';

namespace EnterpriseAdminVerify {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string // id
    orgName?: string // 组织名称
    accountType?: string // 组织类型  枚举备注: ENTERPRISE :企业 COLLEGE :高校 INSTITUTION :科研机构 OTHER :其他
    userName?: string // 申请人姓名
    phone?: string // 手机号
    state?: string // 状态
    updateTime?: string // 最新操作时间
    
  };

  export type Detail = {
    userName?: string; // 申请人姓名
    phone?: string; // 手机号
    orgTypeId?: string; // 组织类型id
    orgName?: string; // 组织名称
    legalName?: string; // 法人名称
    legalCardNumber?: string; // 法人身份证号
    orgAddress?: string; // 企业地址
    licenseUrl?: string; // 营业执照
    officialLetter?: string; // 认证公函
    accountType?: string; // 组织类型 例如 ENTERPRISE
    // 枚举备注: ENTERPRISE :企业 COLLEGE :高校 INSTITUTION :科研机构 OTHER :其他
    auditList?: {
      id?: string; // id
      auditor?: string; // 审核人
      reason?: string; // 意见说明
      stateEnum?: string; // 审核状态
      // 枚举备注: AUDITING :审核中 AUDIT_PASSED :审核通过 AUDIT_REJECTED :审核拒绝
      auditTime?: string; // 审核时间
    }[]; // 审核信息
  };
}

export default EnterpriseAdminVerify;
