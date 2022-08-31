import Common from './common';

namespace DiagnoseManage {
  export type ResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    // title?: string; // 问卷标题
    // problems?: [// 题目合集
      // {
        name?: string; //题目标题
        type?: string; //题目类型 单选-radio 多选-checkbox 单行文本-input 多行文本-textarea 级联选择-cascader
        isRequired?: number; //是否必答 是-1 否-2
        isKey?: number; //是否为关键题 是-1 否-2
        subTitle?: string; //副标题
        options?: [ // 单选/多选选项
          {
            label?: string; //选项文字
            allowInput?: number; //允许填空
            inputIsRequired?: number; //填空是否为必填
          }
        ];
        related?: {//关联题目
          relations?: [
            {
              dependIndex?: number; //依赖的题目索引值
              dependValue?: string[]; //依赖的选项数据集
              conditionType?: string; //依赖的类型 one-其中一个 all-全部选项
            }
          ];
          relatedRelation?: string; //关联关系 and-且 or-或
        };
        validate?: number; // 填空题内容校验：不校验-0/手机号-1/金融数据-2）
        maxLength?: number; // 填空最大字数
        assignedProvince?: number; // 指定省份
      // }
    // ]
  };

  export type Diagnose = {
    // title?: string; // 问卷标题
    // problems?: [// 题目合集
      // {
        name?: string; //诊断报告名称
        summary?: string; //诊断报告概述
        recommendations?: string; //诊断目标建议
        remind?: string; //特殊提醒
        defaultDiagnoseResult?: boolean; //默认诊断结果
        related?: {//关联题目
          relations?: [
            {
              dependIndex?: number; //依赖的题目索引值
              dependValue?: string[]; //依赖的选项数据集
              conditionType?: string; //依赖的类型 one-其中一个 all-全部选项
            }
          ];
          relatedRelation?: string; //关联关系 and-且 or-或
        };
        relatedServers?: string[]; //关联服务商
        relatedTechnicalManager?: {//关联技术经理人
          name?: string;//姓名
          phone?: string;//手机号
        }
      // }
    // ]
  };
}
export default DiagnoseManage;
