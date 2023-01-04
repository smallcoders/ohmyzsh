// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 获取创新需求列表
 * @param data
 * @returns
 */
export async function getCreativePage(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/creative/demand/page', {
    method: 'post',
    data,
  });
}

/**
 * 查询关键词
 */
export async function getKeywords() {
  return request<any>(`/antelope-science/mng/common/dictionaryEnum?label=ORG_INDUSTRY`);
}

/**
 * 查询应用行业
 */
export async function getCreativeTypes() {
  return request<any>('/antelope-science/mng/common/dictionary?label=CREATIVE_TYPE');
}

/**
 * 关键词编辑
 */
export async function updateKeyword(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/creative/demand/update/keyword', {
    method: 'put',
    data,
  });
}

/**
 * 已解决
 */
export async function updateConversion(id: string) {
  return request<any>(`/antelope-science/mng/creative/demand/update/resolved?id=${id}`, {
    method: 'get'
  });
}

/**
 * 查询成果详情
 */
export async function getDemandDetail(id: string) {
  return request<any>(`/antelope-science/mng/creative/demand/detail?id=${id}`);
}

// 设置排序权重
export function updateSort(params:{
  id?: string,
  sort?: string,
}) {
  return request<any>('/antelope-science/mng/creative/demand/update/sort',{
    method: 'get',
    params,
  })
}

/**
 * 认领需求
 * @param id 
 * @returns 
 */
 export async function claimDemand(id: string) {
  return request<any>(`/antelope-science/mng/demand/claim?demandId=${id}`);
}

/**
 * 取消认领需求
 * @param id 
 * @returns 
 */
export async function cancelClaimDemand(id: string) {
  return request<any>(`/antelope-science/mng/demand/claim/cancel?demandId=${id}`);
}

/**
 * 分发需求
 * @param id 
 * @param groupId 
 * @returns 
 */
export async function distributeDemand(id: string, groupId: string) {
  return request<any>(`/antelope-science/mng/demand/mine/distribute?demandId=${id}&groupId=${groupId}`);
}

/**
 * 取消分发需求
 * @param id 
 * @param groupId 
 * @returns 
 */
export async function cancelDistributeDemand(id: string) {
  return request<any>(`/antelope-science/mng/demand/mine/distribute/cancel?demandId=${id}`);
}

/**
 * 指派服务商
 * @param id 
 * @param orgId 
 * @param orgName 
 * @returns 
 */
export async function appoint(id: string, orgId: string, orgName: string) {
  return request<any>(`/antelope-science/mng/demand/follow/appoint?demandId=${id}&orgId=${orgId}&orgName=${orgName}`);
}

/**
 * 撤销指派服务商
 * @param id 
 * @param orgId 
 * @param orgName 
 * @returns 
 */
export async function cancelAppoint(id: string,) {
  return request<any>(`/antelope-science/mng/demand/follow/appoint/cancel?demandId=${id}`);
}

/**
 * 反馈内容提交
 * @param data
 * demandId	integer		需求id	
 * content	string		内容描述	
 * fileIds	string		附件ids，以英文逗号分隔
 * @returns
 */
export async function postFeedback(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/demand/follow/feedback', {
    method: 'post',
    data,
  });
}

/**
 * 数字化应用组细分
 * @param data 
 * @returns 
 */
export async function specifyApp(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/demand/mine/specify/app', {
    method: 'post',
    data,
  });
}

/**
 * 工品采购组细分
 * @param data 
 * @returns 
 */
export async function specifyPurchase(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/demand/mine/specify/purchase', {
    method: 'post',
    data,
  });
}

/**
 * 科产业务组细分
 * @param data 
 * @returns 
 */
export async function specifyScience(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/demand/mine/specify/science', {
    method: 'post',
    data,
  });
}

/**
 * 工品采购组细分
 * @param data 
 * @returns 
 */
export async function specifyFinance(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/demand/mine/specify/finance', {
    method: 'post',
    data,
  });
}

export async function getDemandPage(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/demand/pageManage/v2', {
    method: 'post',
    data,
  });
}

export async function getBizGroup() {
  return request<any>(`/antelope-science/mng/demand/biz/group`);
}

export async function getSpecifyInfo(demandId: string) {
  return request<any>(`/antelope-science/mng/demand/mine/specify/info?demandId=${demandId}`);
}

export async function getClaimUsers() {
  return request<any>(`/antelope-science/mng/demand/claim/all`);
}


export async function getFeedbackDetail(demandId: string) {
  return request<any>(`/antelope-science/mng/demand/follow/feedback/detail?demandId=${demandId}`, {
    method: 'post',
  });
}

export async function deleteFeedback(feedbackId: string) {
  return request<any>(`/antelope-science/mng/demand/follow/feedback?feedbackId=${feedbackId}`, {
    method: 'delete',
  });
}

//查询需求跟进阶段的需求认领人
export async function getClaimFollow(specifyType: string) {
  return request<any>(`/antelope-science/mng/demand/claim/follow?specifyType=${specifyType}`);
}

/**
 * 结束需求
 * @param data
 * @returns
 */
 export async function postDemandFinish(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/demand/finish', {
    method: 'post',
    data,
  });
}

