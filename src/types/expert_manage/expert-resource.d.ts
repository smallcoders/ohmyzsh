import type Common from '../common';

namespace ExpertResource {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; //	专家主键Id
    expertName?: string; //	专家名称

    phone?: string; //	手机号
    typeNames?: string[]; //	专家类型
    areaName?: string; //	地区名称
    commissioner?: boolean;
    serviceTypeIds?: number[];
  };
  export type Detail = Content & {
    expertName?: string; //专家姓名
    duty?: string; //职务

    dutyHide?: integer; //职务隐藏状态 0显示 1隐藏
    phone?: string; //手机号
    phoneHide?: integer; //手机号隐藏状态 0显示 1隐藏
    email?: string; //邮箱
    emailHide?: integer; //邮箱隐藏状态 0显示 1隐藏
    workUnit?: string; //工作单位
    workUnitHide?: integer; //工作单位隐藏状态 0显示 1隐藏
    personalPhoto?: string; //个人照片
    workExp?: string; //工作经验
    projectExp?: string; //项目经验
    skilledField?: string; //擅长领域
    expertSkill?: string; //专家技能
    expertIntroduction?: string; //专家介绍
    typeNames?: string[]; //专家类型
    areaName?: string; //所属区域
    diagnosisRecordList?: string[]; //诊断记录 eg:xx年xx月xx日 为xxx企业完成线下诊断

    commissioner?: boolean; // 服务专员
    number?: number; // 服务专员编号
    score?: number; // 评分
    serviceTypeIds?: number[]; //	服务类型
    serviceTypeNames?: string[]; //	服务类型
    commissionerAuditId?: string; //	服务专员审核Id
  };
  export type SearchBody = {
    expertName?: string; //专家名称
    expertType?: string; //专家类型
    startPublishTime?: string; // 发布时间
    endPublishTime?: string; // 发布时间
  };
}
export default ExpertResource;
