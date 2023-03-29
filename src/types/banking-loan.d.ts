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
    CONTRACT_TO_BE_SIGNED = 4, // 待签订合同
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
    [CreditStatus.CONTRACT_TO_BE_SIGNED]: '待签订合同',
  };
  export const creditStatusLeaseTrans = {
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
  // 授信信息
  export type CreditInfoContent = {
    busiStatus?: integer; // 业务办理状态 1处理中 2已授信 3拒绝授信
    refuseReason?: string; // 失败原因
    creditAmount?: number; // 授信额度
    startDate?: string; // 授信开始效期
    endDate?: string; // 授信结束效期
    fncApplyNo?: string; // 授信申请编号
    contractNo?: string; // 合同编号
    rate?: string; // 执行年利率
    workProves?: workProves[]; // 业务凭证(API获取或邮箱解析，该字段不展示)
    bisDataSource?: string; // 数据来源，0-API获取，1-人工录入
  };
  export type LoanContent = {
    id?: integer; // id
    busiStatus?: number; // 放款状态
    refuseReason?: string; // 失败原因
    debitNo?: string; // 借据编号
    borrowStartDate?: string; // 实际借款日期
    takeMoney?: float; // 放款金额
    rate?: string; // 执行年利率
    workProves?: workProves[];
    backMoney?: number; //还款金额
    backMoneyInfoVO?: any[];
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
  // 贷款列表
  export type Content = {
    id?: number; // 业务申请编号
    orgName?: string; // 企业名称
    amount?: number; // 申请金额
    name?: string; // 联系人
    phone?: string; //	联系电话
    productName?: string; //	产品名称
    productId?: number; //产品id
    creditStatus?: string; //	授信状态
    refuseReason?: string; //	授信拒绝原因
    creditAmount?: number; //	授信金额
    takeAmount?: number; // 已放款金
    createTime?: string; // 申请时间
    dataSource?: number; // 数据源,0-API获取，1-人工录入，2-邮箱解析
    notes?: string; //	备注
  };

  // 累计授信金额
  export type totalAmountContent = {
    creditTotal?: number; // 累计授信金额
    takeTotal?: number; // 累计放款金额
  };
  // 放款详情
  export type TakeMoneyContent = {
    availAmount?: number; // 剩余可借金额
    dataSource?: string; // 数据源
    takeMoneyInfo?: TakeMoneyInfoContent; // 放款信息
    current?: number; // 当前页码
    count?: number; //	总页数
    size?: number; //	页面容量
    total?: number; //总数据量
  };
  // 放款信息
  export type TakeMoneyInfoContent = {
    id?: number; // 主键
    loanBatchNo?: string; // 提款申请编号（有API接口展示）
    createTime?: string; // 提款申请时间（有API接口展示）
    status?: string; // 放款状态
    busiStatus?: number; //	放款状态-3放款成功 4放款失败
    debitNo?: string; //	借据编号
    borrowStartDate?: string; //实际放款日期
    takeMoney?: number; //	提款金额
    rate?: string; //	年利率(%)
    backMoney?: number; //	还款金额
    refuseReason?: number; // 失败原因
    workProves?: workProves[]; // 文件凭证
  };
  // 文件
  export type workProves = {
    id?: string; // 主键
    name?: string; // 文件名
    path?: string; // 文件地址
    format?: string; // 文件格式
    createTime?: string; // 创建时间
  };
  // 申请信息
  export type ApplicationInfoContent = {
    path?: string; // 图片地址
    orgName?: string; // 企业名称
    creditCode?: string; // 统一社会信用代码
    legalPersonName?: string; // 法人名称
    registerAddress?: string; //	注册地址
    manageAddress?: string; //	经营地址
    applyStatus?: string; //业务办理状态 1金融机构处理中 2金融机构已授信 3授信失败 4待签订合同 6待授信
    applyNo?: number; //	业务申请编号
    createTime?: string; //	申请时间
    effectiveDate?: string; //	保单拟生效日期
    isAccept?: string; // 是否承保过 1是 0否
    applyAmount?: number; // 申请金额（万元）
    deadLine?: string; //	拟融资期限1 短期（一年以内）；2 中期（一至三年）；3 长期（三年以上）
    name?: string; //	联系人
    phone?: string; //	联系电话
    productName?: string; // 产品名称
    financialOrg?: string; // 金融机构
    handleRecords?: handleRecords;
    address?: string; //单位地址
    urls?: string[]
  };
  export type handleRecords = {
    failReason?: string; // 失败原因
    createTime?: string; // 创建时间
    userName: string; // 用户名
    flowDesc?: string; // 状态
  };
}
export default BankingLoan;
