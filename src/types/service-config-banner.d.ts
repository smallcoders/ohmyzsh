import Common from './common';

namespace Banner {
  export enum Edge {
    PC = 0,
    APPLET = 1,
    APP = 2,
  }

  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }

  export type Content = {
    id?: string; // 主键
    sort?: string; // 排序
    title?: string; // 标题
    photoId?: string; // 图片id
    startTime?: string; // 开始时间
    endTime?: string; // 结束时间
    state?: number; // 状态 0 发布中  1 待发布 2 已下架
    publishUserName?: string; //	发布人
    belong?: number; //		所属单位 0 PC 1 小程序 2 APP
    link?: string; //	跳转链接
  };
}
export default Banner;
