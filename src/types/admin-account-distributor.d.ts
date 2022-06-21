import type Common from '../common';

namespace AdminAccountDistributor {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: integer; // userid
    userName?: string; // 用户名
    viewRange?: string; // 查看范围
    viewRangeIds?: string[]; // 查看范围id
    creator?: string; // 创建人
    createTime?: string; // 创建时间
    isEdit?: boolean; // 能否编辑
    name?: string;
  };
}
export default AdminAccountDistributor;
