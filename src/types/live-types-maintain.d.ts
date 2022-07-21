import type Common from '../common';

namespace LiveTypesMaintain {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: integer; // userid
    userName?: string; // 用户名
    viewRange?: string; // 查看范围
    id?: string[]; // 查看范围id
    creatorUserName?: string; // 创建人
    createTime?: string; // 创建时间
    status?: boolean; // 启用状态
  };
}
export default LiveTypesMaintain;
