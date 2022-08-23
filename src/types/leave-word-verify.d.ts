import type Common from './common';

namespace LeaveWordVerify {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id: string // id
    userName?: string // 用户名称
    content?: string // 留言内容 
    time?: string // 时间
    regions?: string // 所属板块
    state?: string // 状态
  }
}

export default LeaveWordVerify