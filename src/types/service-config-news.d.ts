namespace News {
  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }

  export type Content = {
    id?: string; // 主键
    coverId?: string; // 封面图片id
    coverPath?: string; // 封面图片访问路径
    title?: string; // 标题
    url?: string; //跳转链接
    publishTime?: string; // 发布时间
    contents?: string; //资讯简介
    state?: number; // 状态：0发布中、1待发布、2已下架
    pageViews?: number; //	浏览量
  };
}
export default News;
