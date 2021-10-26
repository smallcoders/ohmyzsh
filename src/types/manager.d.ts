namespace Manager {
  /**
   * 当前登录用户
   */
  export type CurrentUser = {
    loginName: string;
    name: string;
    phone: string;
  };

  export interface CurrentUserResult extends Common.ResultCode {
    result: CurrentUser;
  }

  export type Manager = {
    id: number;
    createTime: string;
    updateTime: string;
    loginName: string;
    name: string;
    phone: string;
    type: string;
    uapUserId: string;
    creator?: Manager;
  };

  export type SaveManagerRequest = {
    id?: number;
    loginName?: string;
    name: string;
    phone: string;
  };
}
export default Manager;
