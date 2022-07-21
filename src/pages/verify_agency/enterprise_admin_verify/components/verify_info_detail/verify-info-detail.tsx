import React from 'react';
import VerifyStepsDetail from '../verify_steps';
import Common from '@/types/common.d';
// import { httpGetAuditList } from '@/service/http_request'
// 审核详情列表状态文本
export const VerifyListText = {
  [Common.AuditStatus.AUDIT_PASSED]: '审核通过',
  [Common.AuditStatus.AUDIT_REJECTED]: '审核拒绝',
  [Common.AuditStatus.AUDIT_SUBMIT]: '审核提交',
};

export default (props: {
  form: any;
  list: any;
  reset: () => void;
  before?: (state: Common.AuditStatus) => React.ReactNode;
}) => {
  const { list } = props || {};

  return (
    <div style={{ paddingLeft: 100 }}>
      {props.before && props.before(list && list.length > 0 && list[0].state)}
      <VerifyStepsDetail list={list} />
    </div>
  );
};
