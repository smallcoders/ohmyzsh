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

  export type CommonEnum = {
    enumName: string;
    id: number;
    name: string;
  };

  // 检索条件类型
  export enum SearchItemControlEnum {
    INPUT = 'input',
    SELECT = 'select',
    TREE_SELECT = 'tree-select',
    CASCADER = 'cascader',
    DATE_MONTH = 'date-month',
    RANGE_PICKER = 'range-Picker',
  }

  export interface FieldNamesObj {
    label: string;
    value: string;
    children?: string;
  }
  export interface SearchItem {
    key: string;
    label: string;
    type: SearchItemControlEnum;
    options?: any[];
    treeData?: any[];
    fieldNames?: FieldNamesObj;
    initialValue?: any;
    placeholder?: string;
    allowClear?: boolean;
    disabledDate?: (currentDate) => boolean;
    loading?: boolean;
    showSearch?: boolean;
    onChange?: (v: string | any[]) => void;
    selectModeType?: multiple | tags | undefined;
  }

  export interface ActionItem {
    key: string;
    text: string;
    type: ButtonType;
  }

  // 文件详情
  export interface FileInfo {
    id: string;
    name: string;
    path: string;
    format: string;
    createTime?: string;
  }
}
export default Common;
