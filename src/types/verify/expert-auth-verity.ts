import type Common from '../common';

namespace ExpertAuthVerify {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    auditId?: string; // 审核Id 通过审核Id获取详情
    expertName?: string; // 专家名称
    phone?: string; // 联系电话
    typeNames?: string[]; // 专家类型
    cityName?: string;
    orgName?: string;
    auditState?: string; // 状态
    operationTime?: string;
  };

  export type Detail = {
    hide: boolean; //专家隐藏状态 true显示 false隐藏
    personalPhotoId: string;
    personalPhoto: string; // 个人照片
    expertName: string; // 专家姓名
    areaName: string; // 区域名称 市
    typeList: {
      id?: string;
      name?: string;
    }[]; //类型
    industryList: string[]; // 所属行业
    industryNameList: string[]; // 所属行业名称
    phone: string;
    workUnit: string; // 工作单位
    duty: string; // 职务
    email: string; // 邮箱
    expertIntroduction: string; // 专家介绍
    workExp: string; // 工作经验
    expertSkill: string; // 专家技能
    projectExp: string; // 项目经验
    skilledField: string; // 擅长领域
    fileIds: string; // 相关附件,分割
    fileList: Common.FileInfo[]; // 附件
    auditState: number; //认证状态 0尚未填报 1填报中 2审核中 3审核成功 4审核退回
    auditId: string; // 审核Id
    audited: boolean; //是否已审核 false未审核 true已审核
  };
}

export default ExpertAuthVerify;
