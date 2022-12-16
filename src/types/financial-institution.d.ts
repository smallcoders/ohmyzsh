import type Common from './common';

namespace FinancialInstitution {
  export interface ResultList extends Common.ResultCode {
    result: BankTreeData;
  }
  type Banks = {
    id: number;
    parentId: number;
    name: string;
    sort: number;
  };
  type Bank = {
    id: number;
    parentId: number;
    name: string;
    sort: number;
    banks: Banks[];
  };
  export type BankTreeData = {
    id: number; // 节点id
    name: string; // 节点名称
    bank: Bank[];
  };
  export type BankUserInfoList = {
    id?: number | null;
    bankId?: number | null; //机构id
    name?: string; //姓名
    phone?: string; //手机号
    position?: number | null; //职位
  };
  export type BankInfo = {
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    map(arg0: (item: any) => void): unknown;
    id?: number | null;
    name?: string; //机构名字
    code?: string; //机构编码
    node?: number | null; //节点
    parentId?: number | null; //父id
    isCoopera?: number | null; //是否合作 0-否、1-是
    nature?: number | null; //机构性质
    bankNature?: number | null; //银行性质
    sort?: number | null; //排序
    officialLogoImage?: string | null | number; //官网展示logo
    productLogoImage?: string | null | number; //产品展示logo
    content?: string; //机构介绍
    bankUserInfoList?: BankUserInfoList[];
  };
  export interface ResultBankInfo extends Common.ResultCode {
    result: BankInfo;
  }

  export type AllBankOptions = {
    label: string;
    value: number;
  };

  export interface ResultsaveOrUpdate extends Common.ResultCode {
    result: [];
  }
  export type bankUserInfo = {
    name: string;
    phone: string;
    position: null | number;
    id: null | number;
    bankId: null | number;
  };
}

export default FinancialInstitution;
