import type Common from '../common';

namespace IntendMessage {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; //id
    enterprise?: string; //企业名称
    contact?: string; //联系人
    phone?: string; //联系电话
    solution?: {
      name?: string; //解决方案名称
      phone?: string; //联系电话
      enterprise?: string; //企业名称
    }; //服务方案
    content?: string; //意向内容
    remark?: string; //备注
    createTime?: string; //意向时间
    handlerState?: boolean; //处理情况
    handlerTime?: string; //处理时间
    handlerName?: string; //处理人
  };

  export type SearchBody = {
    enterprise?: string; //企业名称
    solution?: string; //服务名称
    intendStartTime?: string; //意向开始时间
    intendEndTime?: string; //意向结束时间
    handlerState?: string; //联系情况  true 已联系  false未联系
  };
}
export default IntendMessage;
