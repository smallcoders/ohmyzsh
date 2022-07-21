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
  export enum Type {
    HOME = 0, // 首页
    INTRODUCE = 1, // 介绍
  }

  export type IntroduceResultList = {
    result: IntroduceContent[];
  } & Common.ResultCode;

  export type IntroduceContent = {
    id: integer; // id
    title?: string; // 数据标题
    actualNumber?: integer; // 实际数量
    manage?: boolean; // 是否由运营平台控制
    mockNumber?: integer; // 运营控制数量
    construction?: string; // 数据构成
    constructions?: {
      title?: string; // 数据项名称
      value?: number;
    }[]; // 数据构成
  };
}
export default DataColumn;
