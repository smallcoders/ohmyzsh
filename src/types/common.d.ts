namespace Common {
  export type ResultCode = {
    /**
     * 状态码
     */
    code?: number;
    /**
     * 信息
     */
    message?: string;
  };

  export type ResultPage = {
    /**
     * 一页的数量
     */
    pageSize: number;
    /**
     * 页标
     */
    pageIndex: number;
    /**
     * 总数
     */
    totalCount: number;
    /**
     * 总页数
     */
    pageTotal: number;
  };

  export type CommonFile = {
    id: string;
    fileName?: string; // 文件名
    fileFormat?: string; // 文件格式
  };
}
export default Common;
