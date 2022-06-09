namespace Common {
  // 审核状态
  export enum AuditStatus {
    /**
     * 审核中
     */
    AUDITING = 'AUDITING',
    /**
     * 审核通过
     */
    AUDIT_PASSED = 'AUDIT_PASSED',
    /**
     * 审核拒绝
     */
    AUDIT_REJECTED = 'AUDIT_REJECTED',
    /**
     * 审核提交
     */
    AUDIT_SUBMIT = 'AUDIT_SUBMIT',
  }

  export enum OrgType {
    /**
     * 企业
     */
    ENTERPRISE = 'ENTERPRISE',
    /**
     * 高校
     */
    COLLEGE = 'COLLEGE',
    /**
     * 科研机构
     */
    INSTITUTION = 'INSTITUTION',
    /**
     * 其他
     */
    OTHER = 'OTHER',
    /**
     * 医疗卫生
     */
    MEDICAL = 'MEDICAL',
  }

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
