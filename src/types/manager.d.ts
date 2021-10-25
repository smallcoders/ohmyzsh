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
}
export default Manager;
