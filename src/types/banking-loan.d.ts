import type Common from './common';

namespace BankingLoan {
  // 数据来源
  export enum DataSources {
    MANUALENTRY = 1, // 人工录入
    API = 0, // API获取
    MAILBOXRESOLUTION = 2, // 邮箱解析
  }
  // 授信状态
  export enum CreditStatus {
    PENDING_CREDIT = 6, // 待授信
    CREDIT_GRANTED = 2, // 已授信
    CREDIT_FAILURE = 3, // 授信失败
  }

  // 放款状态
  export enum LoadStatus {
    LOAN_GRANTED = '1', // 已放款
    LOAN_FAILURE = '2', // 放款失败
  }
  export const DataSourcesTrans = {
    [DataSources.MANUALENTRY]: '人工录入',
    [DataSources.API]: 'API获取',
    [DataSources.MAILBOXRESOLUTION]: '邮箱解析',
  };
  export const creditStatusTrans = {
    [CreditStatus.PENDING_CREDIT]: '待授信',
    [CreditStatus.CREDIT_GRANTED]: '已授信',
    [CreditStatus.CREDIT_FAILURE]: '授信失败',
  };

  export const LoadStatusTrans = {
    [LoadStatus.LOAN_GRANTED]: '已放款',
    [LoadStatus.LOAN_FAILURE]: '放款失败',
  };
  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }
  export type LoanContent = {
    id?: integer; // id
    loanStatus?: string; // 放款状态
    loanStatusReason?: string; // 失败原因
    loanNo?: string[]; // 借据编号
    loanTime?: string; // 实际借款日期
    loanMoney?: float; // 放款金额
    referenceAnnualInterestRate?: string; // 执行年利率
    fileIds?: any[];
  };
  // 审核状态列表
  export interface StatusResultList extends Common.ResultCode {
    result: StatusContent[];
  }
  export type StatusContent = {
    userName: string;
    verityStatus: number;
    createTime: string;
    verityStatusContent: string;
  };
  export interface ProductList extends Common.ResultCode {
    result: ProductListContent[];
  }

  export type ProductListContent = {
    productId?: string; // 贷款产品id
    productName?: string; // 贷款名称
  };

  export type Content = {
    id?: string; // 主键
    phone?: string; // 联系电话
    name?: string; // 联系人
    orgName?: string; // 企业名称
    amount?: string; //	申请金额
    createTime?: string; //	创建时间
    verityStatus?: number; //状态
    verityStatusContent?: string; //	运营平台处理状态说明
    productName?: string; //	贷款名称
    termContent?: string; //	拟融资期限
  };

  export type SearchContent = {
    orgName?: string; // 组织名称
    bank?: string; // 机构名称
    verityStatus?: integer; // 运营平台处理状态1、待平台处理 2、需求已确认 3、匹配金融机构产品服务中 4、已提供金融解决方案 5、暂无适宜的金融解决方案
    dateStart?: string; // 申请日期开始
    dateEnd?: string; // 申请日期结束
  };
}
export default BankingLoan;
