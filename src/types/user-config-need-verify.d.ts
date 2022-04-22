import Common from './common';

namespace NeedVerify {
  export type ResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; //	成果/需求id
    auditId?: string; //	审核id
    name?: string; //	成果/需求名称
    type?: string; //	行业类型
    userName?: string; //	用户名
    submitDateTime?: string; //	提交时间

    auditState?: string; //	审核状态

    // 枚举: AUDITING,AUDIT_PASSED,AUDIT_REJECTED

    // 枚举备注: AUDITING :审核中 AUDIT_PASSED :审核通过 AUDIT_REJECTED :审核拒绝

    auditDateTime?: string; //	审核时间

    operatorName?: string; //	操作人名称
  };
}
export default NeedVerify;
