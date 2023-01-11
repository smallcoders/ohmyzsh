import type Common from './common';

namespace AppFinancialMng {
  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }
  // 获取审核信息（管理台）
  export type Content = {
    id?: number;
    userId?: number; //操作人id
    userName?: string; //操作人
    channel?: number; //渠道 1小米 2华为 3oppo 4vivo
    version?: string; //版本
    audit?: boolean; //是否审核中
    createTime?: string; //创建时间
    updateTime?: string; //修改时间
  };
}

export default AppFinancialMng;
