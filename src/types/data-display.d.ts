import Common from './common';

namespace DataDisplay {
  /**
   * 宣传统计
   * */
  export type PublishResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;
  export type Publish = {
    media?: string; // 媒体
    publishTime?: number; // 发布时间  yyyy-MM-dd
    title?: string; // 标题
    readNumber?: number; // 阅读量
    url?: string; // 外链链接
  };

  /**
   * 热门应用
   * */
  export type HotAppResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;
  export type HotApp = {
    name?: string; // 应用名称
    tryNumber?: number; // 试用量  yyyy-MM-dd
    collection?: number; // 收藏量
  };

  /**
   * 热门政策
   */
  export type PolicyResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;
  export type Policy = {
    areaName?: string; // 地区
    title?: string; // 政策标题
    readSum?: number; // 阅读量
    url?: string; // 外链
  };

  /**
   * 各地数据
   */
  export type CityData = {
    org: number; // 工业企业
    facilitator: number; // 服务商
    expert: number; // 专家
    needs: number; // 需求数量
    solutions: number; // 服务数量
  };
}
export default DataDisplay;
