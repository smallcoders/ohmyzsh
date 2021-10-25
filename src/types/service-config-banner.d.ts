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
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
    pageViews?: number; //	浏览量
  };
}
export default Banner;
