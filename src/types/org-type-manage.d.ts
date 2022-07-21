namespace OrgTypeManage {
  export type Content = {
    sort?: number;
    id?: string; // id
    name?: string; // 类型名称
    description?: string; // 描述
    creatorName?: string; // 创建人名称
    createTime?: string; // 创建时间
    isEdit?: boolean; // 能否编辑
    isDelete?: boolean; // 能否删除
  };
}
export default OrgTypeManage;
