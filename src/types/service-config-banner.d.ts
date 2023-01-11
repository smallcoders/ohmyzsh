import type Common from './common';

namespace Banner {
  export enum Edge {
    PC = 0, // 官网-首页
    FINANCIAL_SERVICE = 6, // 官网-金融
    APPLET = 1, // 小程序-首页
    APP = 2, // APP-首页
    APPLET_CREATIVE = 3, // 小程序-科产
    APP_CREATIVE = 4, // APP-科产
    PC_CITY = 5, // 官网-地市专题首页
    APP_FINANCIAL = 7, // APP-金融
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
