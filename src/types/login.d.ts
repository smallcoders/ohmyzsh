namespace Login {

  /**
   * 登录参数
   */
  export type LoginParam = {
    loginName: string
    password: string
  };

  /**
   * 登录结果
   */
  export type LoginResult = {
    success: boolean
    message: string
  };
}
export default Login;
