namespace BusinessPool {
  /**
   * 当前登录用户
   */
  export type CurrentUser = {
    loginName: string;
    name: string;
    phone: string;
    type: string;
    menuShowMap: { [key]: string };
    permissionCodes: string[]
  };

  export interface CurrentUserResult extends Common.ResultCode {
    result: CurrentUser;
  }

  export type TableFrom = {
    id: number;
    adminName: string;
    channelBusinessNum: number;
    maxTaskSize: number;
    serviceArea: string;
    adminName: string;
    contactPhone: string;
    createTime: string;
    status: number;
    keywords: string;
  };

  export type SaveAccountRequest = {
    channelName: string;
    maxTaskSize: number;
    channelBusinessNum: number;
    adminName: string;
    contactPhone: string;
    serviceName: string;
    serviceCode: string;
    id: number
  };
}
export default BusinessPool;
