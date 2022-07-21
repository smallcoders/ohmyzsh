namespace Login {
  /**
   * 登录参数
   */
  export type LoginParam = {
    loginNameOrPhone?: string;
    password?: string;
    ticket: string;
    storeAccount: boolean;
  };
}
export default Login;
