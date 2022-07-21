// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import LiveTypesMaintain from '@/types/live-types-maintain.d';
import { request } from 'umi';

// ----------------------直播意向采集----------------------------
/**
 * 分页查询
 * @param params
 */
 export async function getIntentionList(data: {
  current?: number;
  pageSize?: number;
}) {
  return request('/antelope-manage/intentionInfo/page', {
    method: 'POST',
    data: { ...data, pageIndex: data.current },
  }).then((json) => {
    return ({
      success: json.code === 0,
      total: json.totalCount,
      data: json.result,
    })
  });
 }

 /**
  * 标记已联系
  * params.id 意向id
  */
export async function intentionSign(id: string) {
  return request('/antelope-manage/intentionInfo/sign', {
    method: 'POST',
    data: { id },
  });
}

/** 
 * ------直播类型维护------
*/ 
export async function getLiveTypesPage(data?: { [key: string]: any }) { // 直播类型列表
  return request<LiveTypesMaintain.RecordList>(`/antelope-manage/type/queryTypePage`, {
    method: 'post',
    data,
  });
}
export async function addLiveType(data?: { [key: string]: any }) { // 新增直播类型
  return request<LiveTypesMaintain.RecordList>(`/antelope-manage/type/save`, {
    method: 'post',
    data,
  });
}
export async function updateLiveType(data?: { [key: string]: any }) { // 编辑直播类型
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/type/update`, {
    method: 'post',
    data,
  });
}
export async function removeLiveType(id: string) { // 删除直播类型
  return request<Common.ResultCode>(`/antelope-manage/type/delete/${id}`, {
    method: 'DELETE',
  });
}

/** 
 * ------羚羊直播管理------
*/ 
export async function queryLiveVideoPage(data?: { [key: string]: any }) { // 视频直播列表
  return request<LiveTypesMaintain.RecordList>(`/antelope-manage/live/queryLiveVideoPage`, {
    method: 'post',
    data,
  });
}
export async function getVideoDetail(id: string) { // 直播详情
  return request(`/antelope-manage/live/getOne/${id}`, {
    method: 'GET'
  });
}
export async function addLive(data?: { [key: string]: any }) { // 新增直播
  return request<LiveTypesMaintain.RecordList>(`/antelope-manage/live/save`, {
    method: 'post',
    data,
  });
}
export async function updateLive(data?: { [key: string]: any }) { // 编辑直播
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/live/update`, {
    method: 'post',
    data,
  });
}
export async function updateLiveStatus(data?: { [key: string]: any }) { // 直播状态修改：下架/置顶
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/live/updateStatus`, {
    method: 'post',
    data,
  });
}
export async function removeLive(id: string) { // 删除直播类型
  return request<Common.ResultCode>(`/antelope-manage/live/delete/${id}`, {
    method: 'DELETE',
  });
}

/** 
 * ------精彩视频管理------
*/ 
export async function queryVideoPage(data?: { [key: string]: any }) { // 视频直播列表
  return request<LiveTypesMaintain.RecordList>(`/antelope-manage/video/queryVideoPage`, {
    method: 'post',
    data,
  });
}
export async function getDetail(id: string) { // 视频详情
  return request(`/antelope-manage/video/getOne/${id}`, {
    method: 'GET'
  });
}
export async function addVideo(data?: { [key: string]: any }) { // 新增视频
  return request<LiveTypesMaintain.RecordList>(`/antelope-manage/video/save`, {
    method: 'post',
    data,
  });
}
export async function updateVideo(data?: { [key: string]: any }) { // 编辑视频
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/video/update`, {
    method: 'post',
    data,
  });
}
export async function removeVideo(id: string) { // 删除视频
  return request<Common.ResultCode>(`/antelope-manage/video/delete/${id}`, {
    method: 'DELETE',
  });
}
export async function updateStatus(data?: { [key: string]: any }) { // 编辑视频
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/video/updateStatus`, {
    method: 'post',
    data,
  });
}


/** 
 * ------搜索记录管理------
*/ 
export async function getRecordPage(data?: { [key: string]: any }) { // 获取记录列表
  return request<DiagnosticTasks.ResultList>('/antelope-manage/operationRecord/pageRecord', {
    method: 'post',
    data,
  });
}
export async function getPersonalSearchRecords(data?: { [key: string]: any }) { // 获取个人搜索记录
  return request<DiagnosticTasks.ResultList>('/antelope-manage/operationRecord/pageUserRecord', {
    method: 'post',
    data,
  });
}
export async function getRecommendPage(data?: { [key: string]: any }) { // 获取推荐列表
  return request<DiagnosticTasks.ResultList>('/antelope-manage/searchCommend/pageRecommend', {
    method: 'post',
    data,
  });
}
export async function addRecommend(data?: DiagnosticTasks.Content) { // 上架推荐
  return request<Common.ResultCode>('/antelope-manage/searchCommend/addRecommend', {
    method: 'post',
    data,
  });
}
 export async function changeRecommendStatus(data?: DiagnosticTasks.Content) { // 下架/删除推荐
  return request<Common.ResultCode>('/antelope-manage/searchCommend/changeRecommendStatus', {
    method: 'post',
    data,
  });
}

