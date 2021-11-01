import Common from './common';

namespace DataColumn {
  export type ResultList = {
    result: Content[];
  } & Common.ResultCode;

  export type Content = {
    id?: string; // 主键
    amount?: number; // 数据数量
    title?: string; // 封面图片访问路径
    sort: number; // 排序
  };
}
export default DataColumn;
