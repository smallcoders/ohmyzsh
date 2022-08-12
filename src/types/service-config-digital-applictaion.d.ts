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
}

export default ApplicationManager;
