import Common from './common';

namespace CourseManage {
  export type ResultList = {
    result: Content[];
  } & Common.ResultCode &
    Common.ResultPage;

  export type Content = {
    id?: string; // 主键
    title?: string; // 标题
    dictIds?: string[]; // 课程类别id
    dictName?: string; // 课程类别名称
    teacher?: string; // 主讲老师
    coverId?: string; //封面
    sort?: number; // 排序
    state?: boolean; // 发布状态 false 未发布 true 已发布
    topState?: boolean; // 制订状态 状态 false 不置顶  true 置顶

    chapterCount?: number; // 章节数量
    duration?: string; // 课程时长
    createTime?: string; // 创建时间
    updateTime?: string; // 更新时间
    studyCount?: number; // 学习数量
    collectionCount?: number; // 收藏数量
  };

  /**
   * 章节明细
   */
  export type Chapter = {
    // 诊断记录
    courseId?: string; // 课程id
    title?: string; // 标题
    description?: string; // 章节简介
    minTime?: number; // 最短学习时间
    sort?: number; //排序
    extras: File[];
  };
  export type File = {
    // 附件列表
    title: string; // 附件名称
    storeId: string; // 存储文件id
    isEditing?: boolean; // 是否正在编辑
    duration?: number; // 时长
  };
}
export default CourseManage;
