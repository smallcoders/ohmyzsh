import type Common from './common';

namespace FinancialCustomersManage {
  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }
  export type Content = {
    id?: string; // 主键
    phone?: string; // 联系电话
    name?: string; // 企业
    creditCode?: string; //	统一社会信用代码
    legalPersonName?: string; //	法定代表人
    buildDate?: string; //成立时间
    registerAddress?: string; //	注册地址
  };

  export type SearchContent = {
    name?: string; // 企业名称
    provinceCode?: string; // 省区域
    cityCode?: string; // 市区域
    countyCode?: string; // 区县区域
    startTime?: string; // 成立日期开始
    endTime?: string; // 成立日期结束
    contacts?: string; //联系人
    phone?: string; // 电话
  };
}
export default FinancialCustomersManage;
