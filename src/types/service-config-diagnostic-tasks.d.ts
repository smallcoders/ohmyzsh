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
    diagnosisInstitution?: {
      id?: string;
      name?: string;
      bag?: string;
    };
  };

  export type DiagnosisTaskDetail = {
    diagnoseBaseInfoVO: DiagnoseBaseInfoVO;
    diagnosisStageVOList: DiagnosisStage[];
  };

  /**
   * 诊断详情
   */
  export type DiagnoseBaseInfoVO = {
    projectLeaderName?: string; // 项目负责人姓名
    projectLeaderContact?: string; // 项目负责人联系方式
    technicians?: string[]; // 技术专家列表
    isCurrentCreator?: boolean; // 诊断任务是否为当前专家创建
    currentStage: number; // 当前处于哪个阶段
    diagnoseExpertVOList: DiagnosisExpert[]; // 诊断专家
    diagnoseOrgInfoVo: DiagnosisOrgInfo;
    diagnoseConclusionVO: DiagnosisConclusion;
    diagnosisInstitution: DiagnosisInstitution;
  } & DiagnosisContent;

  export enum DiagnosisStageEnum {
    /**
     * 启动会
     */
    START_UP_MEETING = 1,
    /**
     * 企业调研
     */
    Enterprise_SURVEY = 2,
    /**
     * 完善方案
     */
    PERFECT_SCHEME = 3,
    /**
     * 高层汇报
     */
    HIGH_LEVEL_REPORT = 4,
    /**
     * 成果交付
     */
    DELIVER = 5,
  }

  export type DiagnosisStage = {
    id?: string; // 诊断阶段id
    updateTime?: string; // 提交时间
    name?: string; // 诊断阶段主题名称
    startDate?: string; // 阶段开始时间
    endDate?: string; // 阶段结束时间
    participants: string[]; // 参与人员 姓名-单位-职务 ，拼接
    stageDescription?: string; // 阶段描述
    problemDescription?: string; // 问题描述
    submitFlag?: number; // 提交状态 0未提交 1已提交
    diagnosisRecords?: Record[]; // 诊断记录列表
    files: DiagnosisFile[]; //附件
    stage: number; // 阶段
  };

  /**
   * 主要是提交表单
   */
  export type DiagnosisStageInfo = {
    diagnosisId?: string; // 诊断id
    startDate?: string; // 阶段开始时间
    endDate?: string; // 阶段结束时间
    participants?: {
      // 参与人员 姓名-单位-职务
      name: string;
      unit: string;
      position: string;
    }[];
    stageDescription?: string; // 阶段描述
    problemDescription?: string; // 问题描述
    fileIds?: string; //附件
    stage: number; // 阶段number
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
  export type DiagnosisInstitution = {
    // 机构信息
    name?: string;
    id?: string;
    bag?: string;
    progress?: number;
    total?: number;
  };

  export enum Status {
    /**
     * 诊断中
     */
    ON_DIAGNOSIS = 'ON_DIAGNOSIS',
    /**
     * 诊断完成
     */
    DIAGNOSIS_FINISHED = 'ON_DIAGNOSIS',
  }

  export type OnlineRecord = {
    // 诊断记录
    id: string;
    lastDiagnosisTime?: string; // 上次点击诊断时间
    diagnosisCount?: number; // 诊断次数
    org?: {
      orgId: string;
      orgName: string; //企业名称
    };
    reportFile?: {
      //诊断报告
      id: string;
      fileName: string; // 文件名
      fileFormat: string; // 文件格式
    };
  };
}
export default DiagnosticTasks;
