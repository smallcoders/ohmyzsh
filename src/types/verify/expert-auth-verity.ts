import type Common from '../common';

namespace ExpertAuthVerify {
  export type RecordList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; // id
    expertName?: string; // 专家名称
    phone?: string; // 联系电话
    expertType?: string; // 专家类型
    area?: string;
    accountType?: string; // 组织类型  枚举备注: ENTERPRISE :企业 COLLEGE :高校 INSTITUTION :科研机构 OTHER :其他
    state?: string; // 状态
  };

  export type Detail = {
    personalPhotoId: string;
    personalPhoto: string; // 个人照片
    expertName: string; // 专家姓名
    areaName: string; // 区域名称 市
    expertType: string; // 专家类型 1数字化改造、2网络化改造、3上云用平台、4工控安全、5税收、6金融、7人才、8其他
    typeName: string; // 类型中文,分割
    industryList: string; // 产业方向
    workUnit: string; // 工作单位
    duty: string; // 职务
    email: string; // 邮箱
    areaCode: number; // 所属区域
    expertIntroduction: string; // 专家介绍
    workExperience: string; // 工作经验
    expertSkills: string; // 专家技能
    projectExperience: string; // 项目经验
    skilledField: string; // 擅长领域
    fileIds: string; // 相关附件,分割
    fileList: Common.FileInfo[]; // 附件
    // auditState: UserAuditStateEnum;
    auditId: string; // 审核Id
    auditList?: {
      id?: string; // id
      auditor?: string; // 审核人
      reason?: string; // 意见说明
      stateEnum?: string; // 审核状态
      // 枚举备注: AUDITING :审核中 AUDIT_PASSED :审核通过 AUDIT_REJECTED :审核拒绝
      auditTime?: string; // 审核时间
     }[]; // 审核信息
     businessLicense: string;//营业执照
     patternOrganization: string; //组织类型
     organizationName: string; //组织名称
     SocialCredit: string; //统一社会信用代码
     formedDate: string //成立时间
     scale: number //企业规模
     phone: string; // 联系电话
     detailedAddress: string; // 详细地址
     registeredCapital: string; // 注册资本
     organizeMeetings: string; // 组织简介
     organizingAbilitys: string; // 组织核心能力
     organizationLogo: string //组织logo
     natureOfunit: string,//单位性质
     legalPersonName: string,//法人姓名
     allProperty: number,//总资产
     lastYearMoney: number,//上年营收
     lastYearProfit: number,//上年利润
     qualityRating: string,//信用等级
     businessScope: string,//经营范围
  };
}

export default ExpertAuthVerify;
