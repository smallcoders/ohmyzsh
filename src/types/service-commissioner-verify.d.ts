namespace ServiceCommissionerVerify {
  export enum State {
    AUDITING = 'AUDITING', // 正在审核
    AUDIT_PASSED = 'AUDIT_PASSED', // 审核通过
    AUDIT_REJECTED = 'AUDIT_REJECTED', // 审核拒绝
  }

  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; //主键
    auditId?: string; //审核id
    expertShowId?: string; //专家资源Id
    expertName?: string; //专家名称
    phone?: string; //手机号
    serviceTypeIds?: string; //服务类型id,
    serviceTypeNames?: string[]; //服务类型
    submitTime?: string; //提交时间
    state?: string; //状态	 AUDITING :正在审核 AUDIT_PASSED :审核通过 AUDIT_REJECTED :审核拒绝
    auditDateTime?: string; //审核时间
    operatorName?: string; //操作人名称
  };

  export type SearchContent = {
    expertName?: string; //专家名称
    phone?: string; //手机号
    serviceTypeId?: integer; //服务类型Id
    startSubmitTime?: string; //提交时间 >=
    endSubmitTime?: string; //提交时间 <=
    state?: string; //审核状态
  };
}
export default ServiceCommissionerVerify;
