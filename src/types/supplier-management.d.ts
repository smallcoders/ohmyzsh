import type Common from './common';
namespace supplierManagement {
  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }

  export type Content = {
    id?: integer; //主键
    name?: string; //供应商名称
    code?: string; //供应商编码
    creditCode?: string; //供应商统一社会信用代码
    estiblishTime?: string; //成立时间
    legalName?: string; //法定代表人姓名
    cardNo?: string; //法定代表人身份证号码
    city?: string; //所属城市
    startDate?: string; //合作时间
    applyFlag?: number; //是否可以申请e贷
  };

  export type SearchContent = {
    supplier?: string; // 供应商信息
    applyFlag?: number; // 允许申请供应链e贷
    hasCardNo?: number; // 是否有身份证
  };

  export type DrawerContent = {
    detail?: any;
    id?: number; // 供应商id
    name?: string; // 供应商名称
    code?: string; // 供应商编码
    creditCode?: string; // 供应商统一社会信用代码
    estiblishTime?: string; // 成立时间
    legalName?: string; // 法定代表人姓名
    cardNo?: string; // 法定代表人身份证号码
    city?: string; // 所属城市
    detailArea?: string; // 详细地址
    startDate?: string; // 合作时间
    applyFlag?: number; // 是否可以申请e贷 0 是 1否
    commitLetter?: string; // 承诺函 文件id，逗号隔开
  };
}
export default supplierManagement;
