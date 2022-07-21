import type Common from '../common';

namespace ConsultRecord {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; //	主键
    orgName?: string; //	企业/个人名称
    contactName?: string; //	联系人姓名
    contactPhone?: string; //	联系人电话
    expertName?: string; //	咨询专家
    expertPhone?: string; //	咨询专家手机号
    expertWorkUnit?: string; //	咨询专家工作单位
    content?: string; //	咨询内容
    createTime?: string; //	咨询时间

    contacted?: boolean; //	联系状态 true已联系 false未联系
    operatorName?: string; //	操作人姓名
    operateTime?: string; //	操作时间
    remark?: string; //	备注
    editing?: boolean;
  };

  export type SearchBody = {
    orgName?: string; //企业/个人名称
    expertName?: string; //专家姓名
    startCreateTime?: string; // 咨询/申请时间
    endCreateTime?: string; // 咨询/申请时间
    contacted?: boolean; //联系状态 true已联系 false未联系
  };
}
export default ConsultRecord;
