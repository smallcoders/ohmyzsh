import type Common from './common';

namespace ProductType {
  export interface ResultList extends Common.ResultCode {
    result: Content[];
  }
  // 产品类型列表
  export type Content = {
    id?: number; // 业务申请编号
    name?: string; //类型名称
    sort?: number; //类型顺序
    details: details[]; //子类型
  };

  // 累计授信金额
  export type details = {
    id: number; //	主键
    name: string; // 产品类型名称
    sort: number; // 排序
    typeId: number; // 产品类型id
    status: number; //状态 0-未删除 1-删除
    createTime: string; //创建时间
    updateTime: string; // 修改时间;
  };
}

export default ProductType;
