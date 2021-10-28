import Common from './common';

namespace AppResource {
  export type ResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    /**
     * 主键
     */
    id?: string;
    /**
     * 应用名称
     */
    name?: string;
    /**
     * 应用类型名称
     */
    typeName?: string;
    /**
     * 应用标签
     */
    label?: string;
    /**
     * 所属厂商
     */
    orgName?: string;
    /**
     * 尖刀应用，0否，1是
     */
    isTopApp?: number;
    /**
     * 跳往链接，0否，1是
     */
    isSkip?: number;
    /**
     * 状态，1发布中、0已下架
     */
    releaseStatus?: number;
    /**
     * 数据分析
     */
    dataAnalyseKeyQuotaVO?: {
      clickCount: number; //点击次数
      collectCount: number; //收藏次数
      tryCount: number; //试用次数
    };

    /**
     * 跳转链接
     */
    url?: string;
  };

  export type DataAnalyseList = {
    result: DataAnalyseContent[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type DataAnalyseContent = {
    /**
     * 企业名称
     */
    orgName?: string;
    /**
     * 联系人
     */
    contactName?: string;
    /**
     * 联系方式
     */
    contactNumber?: string;
    /**
     * 操作时间
     */
    operateTime?: string;
  };

  export type SearchBody = {
    appId: string;
    type: number; // 数据指标，0点击，1收藏，2试用申请
    orgName?: string; // 企业名称
    beginOperateTime?: string; // 尖刀应用，0否，1是
    endOperateTime?: string; //状态，1发布中、0已下架
  };
}
export default AppResource;
