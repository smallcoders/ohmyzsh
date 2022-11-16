import type Common from './common';

namespace ActivityProject {
  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }

  export type Content = {
    id?: string; // id
    userId?: string; // 用户id
    name?: string; // 姓名
    phone?: string; // 手机号
    registerTime?: string; // 注册时间
    registerSource?: string; //	注册端
    role?: string; //	身份
    orgName?: number; //所属组织
    assistanceCount?: string; //	邀请人数
    exchange?: string; //	是否兑换
    operationTime?: string; //	操作时间
    operationName?: string; //	操作名称
  };

  export type SearchContent = {
    phone?: string; // 手机号
    name?: string; // 姓名
    orgName?: string; // 组织名称
    identity?: string; // 身份
    startTime?: string; // 日期开始
    endTime?: string; // 日期结束
  };
}
export default ActivityProject;
