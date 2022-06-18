// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import { request } from 'umi';

/** 获取记录列表 */
export async function getRecordPage(data?: { [key: string]: any }) {
  return request<DiagnosticTasks.ResultList>('/antelope-live/web/operationRecord/pageRecord', {
    method: 'post',
    data,
  });
}

// 获取个人搜索记录
export async function getPersonalSearchRecords(data?: { [key: string]: any }) {
  return request<DiagnosticTasks.ResultList>('/antelope-live/web/operationRecord/pageUserRecord', {
    method: 'post',
    data,
  });
}

/** 获取推荐列表 */
export async function getRecommendPage(data?: { [key: string]: any }) {
  return request<DiagnosticTasks.ResultList>('/antelope-live/web/searchreCommend/pageRecommend', {
    method: 'post',
    data,
  });
}

/**
 * 上架推荐
 */
export async function addRecommend(data?: DiagnosticTasks.Content) {
  return request<Common.ResultCode>('/antelope-live/web/searchreCommend/addRecommend', {
    method: 'post',
    data,
  });
}

/**
 * 下架/删除推荐
 * */
 export async function changeRecommendStatus(data?: DiagnosticTasks.Content) {
  return request<Common.ResultCode>('/antelope-live/web/searchreCommend/changeRecommendStatus', {
    method: 'post',
    data,
  });
}
