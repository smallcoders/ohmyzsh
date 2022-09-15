import type Common from './common';

namespace BankingService {
  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }

  export type Content = {
    id?: string; // 主键
    userId?: string; // 用户id
    phone?: string; // 联系电话
    name?: string; // 联系人
    orgName?: string; // 企业名称
    creditCode?: string; // 社会信用代码
    provinceCode?: number; // 企业所在地省
    cityCode?: string; //	企业所在地市
    countyCode?: number; //		企业所在地区
    amount?: string; //	申请金额
  };
}
export default BankingService;
