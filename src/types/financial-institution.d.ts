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
    node: number; //节点
  };
  type Bank = {
    id: number;
    parentId: number;
    name: string;
    sort: number;
    banks: Banks[];
    node: number; //节点
  };
  export type BankTreeData = {
    id?: number; // 节点id
    name?: string; // 节点名称
    node?: number; //节点
    bank?: Bank[];
  };
  export type ModalFormInfo = {
    id?: number;
    parentId?: number;
    sort?: number;
    node: number; //节点
    bank?: Bank[];
    banks?: Banks[];
  };
  export type BankUserInfoList = {
    id?: number;
    bankId?: number; //机构id
    name?: string; //姓名
    phone?: string; //手机号
    position?: number; //职位
  };
  export type BankInfo = {
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    map(arg0: (item: any) => void): unknown;
    id?: number;
    name?: string; //机构名字
    code?: string; //机构编码
    node?: number; //节点
    parentId?: number; //父id
    isCoopera?: number; //是否合作 0-否、1-是
    nature?: number; //机构性质
    bankNature?: number; //银行性质
    sort?: number; //排序
    officialLogoImage?: string | number; //官网展示logo
    productLogoImage?: string | number; //产品展示logo
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
    name?: string;
    phone?: string;
    position?: null | number;
    id?: null | number;
    bankId?: null | number;
  };
  export type cooperateOrg = {
    id?: number;
    name?: string; //机构名字
    sort?: number; //排序
    index?: number;
  };
}

export default FinancialInstitution;
