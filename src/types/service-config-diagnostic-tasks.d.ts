import Common from './common';

namespace DiagnosticTasks {
  export type ResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; // 主键
    applicationNumber?: string; // 诊断编号
    name?: string; // 诊断名称
    orgName?: string; // 诊断企业
    experts?: Expert[]; // 诊断专家
    startDate?: string; //诊断开始时间   yyyy-MM-dd
    endDate?: string; // 诊断结束时间   yyyy-MM-dd
    state?: number; // 诊断状态 1待诊断 2诊断中 3已完成 4已延期
    remark?: string; // 描述
    originState?: number; // 源状态，用于判断已延期的诊断任务原来是待诊断还是诊断中，1待诊断 2诊断中 3已完成
  };

  export type Expert = {
    // 诊断专家
    expertName: string; // 名称
    expertPhotoPath: string; // 照片
    expertPhone: string; // 电话
    id: string;
  };

  export type Record = {
    // 诊断记录
    expertPhotoPath?: string; // 专家头像图片
    expertName?: string; // 专家姓名
    expertPhone?: string; // 专家电话
    submitTime?: string; // 提交时间
    address?: string; //位置
    content?: string; // 诊断内容
    photoPath?: string[]; // 诊断图片
  };

  export type OrgInfo = {
    // 企业信息
    orgName?: string; // 企业名称
    coverPath?: string; //企业图片
    contactName?: string; // 联系人
    phone?: string; // 手机号
  };

  export type Conclusion = {
    // 诊断结论
    submitTime?: string; // 提交时间
    expertName?: string; // 提交专家
    phone?: string; // 专家电话
    conclusion?: string; // 诊断结论
    files?: { format: string; name: string; path: string }[]; // 附件
  };
}
export default DiagnosticTasks;
