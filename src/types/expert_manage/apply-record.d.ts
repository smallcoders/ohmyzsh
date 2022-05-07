import type Common from '../common';

namespace ApplyRecord {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; //	主键
    orgName?: string; //	企业/个人名称
    contactName?: string; //	联系人姓名
    contactPhone?: string; //	联系人电话
    expertName?: string; //	申请专家
    expertPhone?: string; //	申请专家手机号
    expertWorkUnit?: string; //	申请专家工作单位
    content?: string; //	申请内容
    createTime?: string; //	申请时间
    contacted?: boolean; //	联系状态 true已联系 false未联系
    operatorName?: string; //	操作人姓名
    operateTime?: string; //	操作时间
    remark?: string; //	备注
  };

  export type SearchBody = {
    orgName?: string; //企业/个人名称
    expertName?: string; //专家姓名
    startCreateTime?: string; // 申请/申请时间
    endCreateTime?: string; // 申请/申请时间
    contacted?: boolean; //联系状态 true已联系 false未联系
  };
}
export default ApplyRecord;
