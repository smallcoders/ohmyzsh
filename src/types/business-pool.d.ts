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
    createTime: string;
    updateTime: string;
    loginName: string;
    name: string;
    status: string;
    phone: string;
    type: string;
    uapUserId: string;
    creator?: Account;
    roles?: number[];
  };

  export type SaveAccountRequest = {
    id?: number;
    loginName?: string;
    name: string;
    phone: string;
    roleIds?: number[];
  };
}
export default BusinessPool;
