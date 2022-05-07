import type Common from '../common';

namespace UserFeedback {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; //id
    createTime?: string; //反馈时间
    contactName?: string; //联系人
    tel?: string; //联系电话
    content?: string; //反馈内容
    remark?: string; //反馈内容
    handlerState?: boolean; //处理情况
    handlerTime?: string; //处理时间
    handlerName?: string; //处理人
  };

  export type SearchBody = {
    startTime?: string; // 咨询/申请时间
    endTime?: string; // 咨询/申请时间
    handlerState?: boolean; //联系情况 true 已联系  false未联系
  };
}
export default UserFeedback;
