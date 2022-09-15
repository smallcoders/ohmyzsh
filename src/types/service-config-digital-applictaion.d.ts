import Common from './common';

namespace ApplicationManager {
  export type ResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: number; // 主键
    appName?: string; // 标题
    content?: string
    logoImageId?: string
    LogoImageName?: string
    LogoImagePath?: string
    path?: any
    isDetail?: boolean // 是否是查看
    orgNames?:string;
    orgId?: string;
    userName?: string;
    handleReason?: string
    createTime?: string
    logoImagePath?: string
    updateTime?: string
    typeId?: number
    typeName?: string
    type?: number
    appType?: number
    exportIp?: string
    appHomeUrl?: string
    pcHomeUrl?: string
    descs?: string
    worth?: string
    scene?: string
    state?: number
    isDelete?: number
  };

  export type PushBag = {
    id?: string;
    orgId?: string;
    type?:number;
    orgIds?: number[];
    apiIds?: number[];
    pushTime?: string;
    startTime?: string;
    endTime?: string;
  }

  export type CompanyResultList = {
    result: Company[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Company = {
    id?: string;
    orgName?: string
  }

  export type RecordType = {
    key: string;
    title: string;
  }

  export type PushDetail = {
    id?: string;
    orgNames?:number;
    orgIds?: number[];
    appNames?: string,
    appName?: string;
    isChoose?: boolean;
    type?: number;
    createTime?: string;
    pushTime?: string;
    startTime?: string;
    endTime?: string;
    status?: number;
    app?: []
    org?: []
  }

  export type DetailResult = {
    result: PushDetail;
  } & Common.ResultCode &
    Common.ResultPage;

  export type DetailResultList = {
    result: PushDetail[];
  } & Common.ResultCode &
    Common.ResultPage;

  // 应用分类
  export type MarketOption = {
    id: number
    name: string
    [key: string]: any
  }

  // 应用分类
  export enum TypeEnum {
    H5 = 0,
    Web = 1,
    ALL = 3
  }

  // 应用开发方式 0:企业自主开发，1:委托服务商开发
  export enum DevelopmentEnum {
    Self = 0,
    Third = 1
  }

  // 应用类型文字描述
  export const TypeText: Record<TypeEnum, string> = {
    [TypeEnum.Web]: 'Web网页',
    [TypeEnum.H5]: 'H5微应用',
    [TypeEnum.ALL]: 'Web网页、H5微应用'
  }

  // 应用开发方式文字描述  0:企业自主开发，1:委托服务商开发
  export const DevelopmentText: Record<DevelopmentEnum, string> = {
    [DevelopmentEnum.Self]: '企业自研应用',
    [DevelopmentEnum.Third]: '委托服务商开发'
  }

}

export default ApplicationManager;
