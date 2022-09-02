import type Common from './common';

namespace LeaveWordVerify {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id: string // id
    auditId?: string
    commentId?: string
    userName?: string // 用户名称
    content?: string // 留言内容 
    time?: string // 时间
    regions?: string // 所属板块
    state?: string // 状态
    status?: string
    tab?: string
    detailId?: string
  };

  export type Detail = {
    auditId?: string;
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

export default LeaveWordVerify