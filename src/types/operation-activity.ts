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
    key?: string;
    index?: string;//序号
    name?: number;//名称
    description?: string;//描述
    createTime?: string;//创建时间
    checked?: boolean;//是否启用
    activityName?: string;//活动名称
    activityTime?: string;//活动时间
    channelValue?: string;//渠道值
    sceneValue?: string;//场景值
    codeMaster?: string;//码主人
    status?: string;//状态
    dataStatistics?: string;//数据统计
  };
}
export default Activity;
