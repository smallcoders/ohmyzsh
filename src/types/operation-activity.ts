import type Common from './common';

namespace Activity {
  export enum Edge {
    CHANNEL = 0, // 渠道值
    SCENE = 1, //场景值
    H5=2,//H5链接
    WECHAT=3,//小程序码
    SHARE=4,//分享码
  }

  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }

  export type Content = {
    id?: string;
    sort?: string;
    index?: string;//序号
    name?: number;//名称
    description?: string;//描述
    createTime?: string;//创建时间
    started?: boolean;//是否启用
    activeName?: string;//活动名称
    activityTime?: string;//活动时间
    channelName?: string;//渠道值
    sceneName?: string;//场景值
    shardCodeMaster?: string;//码主人
    activeStatus?: string;//状态
    url?: string;
    randomId?: string;
    dataStatistics?: string;//数据统计
    action?: any;//操作
    time?: any;
    operation?: any;//曹自拍
    operatorName?: any;//操作人
    updateTime?: any;//更新时间
    activeImageId?: any;
    buttonText?: any;
    targetLink?: any;
  };
}
export default Activity;
