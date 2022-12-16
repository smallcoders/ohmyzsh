import { request } from 'umi';

// 科产-需求管理导出
export async function creativeDemandExport(data: {
  name?: string, // 需求名称
  industryTypeId?: string, // 需求所属行业
  state?: string, // 对接状态
  createTimeStart?: string,
  createTimeEnd?: string,
  areaCode?: string, // 区域
}) {
  return request<any>('/antelope-science/mng/creative/demand/export',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}

// 科产-成果导出
export async function creativeAchievementExport(data: {
  name?: string, // 成果名
  typeId?: string, // 应用行业id
  state?: string, // 对接状态
  dateTime?: string[], // 时间
}) {
  return request<any>('/antelope-science/mng/creative/achievement/export',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}

// 导出-服务管理-解决方案导出
export async function solutionExport(data: {
  name?: string, // 服务名称
  typeId?: string, // 服务类型
  providerName?: string, // 所属服务机构、服务商名称
  areaCode?: string, // 区域
  publishTimeSpan?: string[], // 时间
}) {
  return request<any>('/antelope-manage/solution/export',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}

// 导出-服务管理-意向消息导出
export async function intendMessageExport(data: {
  enterprise?: string, // 企业名称
  solution?: string, // 服务名称
  intendStartTime?: string, // 开始时间
  intendEndTime?: string, // 结束时间
  handlerState?: boolean, // 联系情况
}) {
  return request<any>('/antelope-manage/intendMessage/export',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}

// 专家资源导出
export async function expertExport(data: {
  expertName?: string, // 专家名称
  expertType?: string, // 专家类型
  areaCode?: number, // 区域
  commissioner?: boolean, // 服务专员
}) {
  return request<any>('/antelope-manage/expert/export/expert',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}

// 专家管理-咨询记录
export async function expertConsultationExport(data: {
  orgName?: string, // 企业、个人名称
  expertName?: string, // 专家名称
  startCreateTime?: string,
  endCreateTime?: string,
  contacted?: boolean, // 联系状态
}) {
  return request<any>('/antelope-manage/expert/export/consultation',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}

// 专家管理-申请记录
export async function expertApplyExport(data: {
  orgName?: string, // 企业、个人名称
  expertName?: string, // 专家名称
  startCreateTime?: string,
  endCreateTime?: string,
  contacted?: boolean, // 联系状态
}) {
  return request<any>('/antelope-manage/expert/export/apply',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}

// 企业需求导出
export async function demandExport(data: {
  name?: string, // 名称
  type?: number, // 类型
  publisherName?: string, // 发布人姓名
  publishStartTime?: string,
  publishEndTime?: string,
  operationState?: string, // 需求状态
  claimId?: number,
  claimState?: string,
  areaCode?: number,
}) {
  return request<any>('/antelope-manage/demand/export',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}

// 导出-线上诊断
export async function onlineDiagnosisExport(data: {
  status?: string, // 诊断状态
  orgName?: string, // 企业名称
  areaCode?: number, // 区域
  startTime?: string,
  endTime?: string,
}) {
  return request<any>('/antelope-manage/onlineDiagnosis/export',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}

// 用户导出
export async function exportUserList(data: {
  name?: string,
  phone?: string,
  createTimeStart?: string,
  createTimeEnd?: string,
  registerSource?: string, // 注册来源
  orgName?: string,
  userIdentity?: string,
  channelName?: string,
  sceneName?: string,
}) {
  return request<any>('/antelope-user/mng/user/exportUser',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}
