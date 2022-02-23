import Common from './common';

namespace LogoutVerify {
  export type ResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; // 主键
    auditType?: string; // 审核类型
    userName?: string; // 用户名
    certificateName?: string; // 认证名称
    phone?: string; // 手机号
    accountType?: string; // 账号类型
    submitTime?: string; // 提交时间
    auditPassed?: boolean; // 是否已经审核通过，true 审核已通过，false等待审核
    auditTime?: string; // 审核通过时间
    auditorName?: string; // 审核人姓名
  };
}
export default LogoutVerify;
