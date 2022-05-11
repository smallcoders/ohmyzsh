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
    /**detailPdfId
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
  };

  export type Detail = Content & {
    /**
     * 支持试用，0否，1是
     */
    isSupportTry?: number;

    /**
     * 跳转链接
     */
    url?: string;
    /**
     * pdf 文件id 或者文件初始值(for antd)
     */
    detailPdfId?:
      | string
      | {
          uid: string;
          name: string;
          status: string;
          url: string;
        }[]
      | { response: { result: string } }[0];
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

  export type ConsultRecordList = {
    result: ConsultRecordContent[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type ConsultRecordContent = {
    id?: string; //咨询记录id
    orgName?: string; //企业名称
    contactName?: string; //联系人
    contactPhone?: string; //联系电话
    appName?: string; //应用名称
    content?: string; //应用需求
    submitTime?: string; //咨询时间
    isHandle?: boolean; //是否已联系
    handlerTime?: string; //处理时间
    handlerName?: string; //操作人名 例：暮温
    remark?: string; //备注
  };

  export type ConsultRecordSearchBody = {
    orgName?: string; //企业名称
    appName?: string; //应用名称
    startDate?: string; //开始时间
    endDate?: string; //结束时间
    isHandle?: boolean; //是否已联系
  };
}
export default AppResource;
