namespace Common {
  export interface ResultCode {
    /**
     * 状态码
     */
    code?: number;
    /**
     * 信息
     */
    message?: string;
  }

  export interface ResultPage {
    /**
     * 一页的数量
     */
    pageSize?: number;
    /**
     * 页标
     */
    pageIndex?: number;
    /**
     * 总数
     */
    totalCount?: number;
  }
}
export default Common;
