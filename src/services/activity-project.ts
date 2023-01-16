// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import ActivityProject from '@/types/activity-project';
import { request } from 'umi';

/** 获取 列表 */
export async function getActivityProjectPage(data?: { [key: string]: any }) {
  return request<ActivityProject.ResultList>('/antelope-user/mng/AssistanceActivity/page', {
    method: 'get',
    params: data,
  });
}

/**
 * 更新标注
 */
export async function updateMark(data: { id: string | undefined; exchange: boolean }) {
  return request<Common.ResultCode>('/antelope-user/mng/AssistanceActivity/sign', {
    method: 'put',
    data,
  });
}

export async function getOverviewe() {
  return request<ActivityProject.ResultList>('/antelope-manage/activity/newYear/overview', {
    method: 'get'
  });
}

export async function getNewYearPage(data?: { [key: string]: any }) {
  return request<ActivityProject.ResultList>('/antelope-manage/activity/newYear/page', {
    method: 'post',
    data,
  });
}

export async function signNewYesar(data: { id: string | undefined; sign: boolean; remark: string | undefined; }) {
  return request<Common.ResultCode>('/antelope-manage/activity/newYear/sign', {
    method: 'put',
    data,
  });
}


export async function getNewYearAssistListe(id: string) {
  return request<ActivityProject.ResultList>(`/antelope-manage/activity/newYear/assist/list?id=${id}`, {
    method: 'get'
  });
}

export async function exportNewYearPage(data?: { [key: string]: any }) {
  return request<ActivityProject.ResultList>('/antelope-manage/activity/newYear/export', {
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  });
}

