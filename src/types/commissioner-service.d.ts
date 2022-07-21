import type Common from '../common';

namespace CommissionerService {
  export enum EvaluationType {
    NONE = 'NONE', // 未评价
    GOOD = 'GOOD', // 好评
    MIDDLE = 'MIDDLE', // 中评
    BAD = 'BAD', // 差评
  }

  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; //服务记录id
    expertId?: string; //专家id
    expertName?: string; //专家名称
    orgId?: string; //企业id
    orgName?: string; //企业名称
    createTime?: string; //打卡时间
    wordUrl?: string; //文档地址
    grade?: number; //评分
    gradeDescription?: string; //分数描述
    evaluation?: string; //评价
    evaluationTime?: string; //评价时间
    operateState?: string; //操作状态
  };

  export type SearchBody = {
    expertName?: string; //专家名称
    orgName?: string; //企业名称
    startCreateTime?: string; //开始打卡时间
    endCreateTime?: string; //结束打卡时间
    level?: string; //评价等级	 枚举备注: NONE :未评价 GOOD :好评 MIDDLE :中评 BAD :差评
    state?: boolean; //评价 false 未评价 true 已评价
  };
}
export default CommissionerService;
