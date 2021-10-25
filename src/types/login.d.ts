namespace Login {
  /**
   * 登录参数
   */
  export type LoginParam = {
    loginName: string;
    password: string;
    ticket: string;
    storeAccount: boolean;
  };
}
export default Login;
