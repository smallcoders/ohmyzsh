// @ts-ignore
/* eslint-disable */
import AppResource from '@/types/app-resource';
import Common from '@/types/common';
import { request } from 'umi';

/** 获取应用资源分页 */
export async function getAppSourcePage(
  data: Common.ResultPage & { label?: string; type?: string },
) {
  return request<AppResource.ResultList>('/iiep-manage/app/page', {
    method: 'post',
    data,
  });
}

/**
 * 添加或者修改应用资源
 */
export async function addOrUpdateAppSource(data?: AppResource.Content) {
  return request<Common.ResultCode>('/iiep-manage/app/save', {
    method: 'post',
    data,
  });
}

/**
 * 获取应用资源详情 通过id
 */
export async function getAppSourceById(id: string) {
  return request<Common.ResultCode & { result: AppResource.Detail }>(`/iiep-manage/app/${id}`);
}

/**
 * 应用下架
 * @param id
 */
export async function offShelf(id: string) {
  return request<Common.ResultCode>(`/iiep-manage/app/pull?id=${id}`);
}

/**
 * 置顶
 * @param id
 */
export async function topApp(id: string) {
  return request<Common.ResultCode>(`/iiep-manage/app/top?id=${id}`);
}

/**
 * 删除应用资源
 * */
export async function removeAppSource(id: string) {
  return request<Common.ResultCode>(`/iiep-manage/app/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取应用类型
 * */
export async function getAppTypes() {
  return request<Common.ResultCode & { result: { id: string; name: string }[] }>(
    '/iiep-manage/common/app/type',
  );
}

/**
 * 获取尖刀应用
 * */
export async function getTopApps() {
  return request<Common.ResultCode & { result: { id: string; name: string }[] }>(
    '/iiep-manage/common/app/topAppList',
  );
}

/**
 * 数据分析关键指标计数
 * @param id
 * @returns
 */
export async function getDataAnalyseIndexs(id: string) {
  return request<
    Common.ResultCode & { result: { clickCount: number; collectCount: number; tryCount: number } }
  >(`/iiep-manage/app/dataAnalyse/count?id=${id}`);
}

/**
 * 数据分析列表
 * @param id
 * @returns
 */
export async function getDataAnalysePage(
  data: AppResource.SearchBody & { pageIndex: number; pageSize: number | undefined },
) {
  return request<AppResource.DataAnalyseList>('/iiep-manage/app/dataAnalyse/page', {
    method: 'post',
    data,
  });
}

/** 获取咨询记录分页 */
export async function getConsultPage(data?: { [key: string]: any }) {
  return request<AppResource.ConsultRecordList>('/iiep-manage/app/consultation/page', {
    method: 'post',
    data,
  });
}

export async function markContracted(id: string) {
  return request<Common.ResultCode & { result: any }>(
    `/iiep-manage/app/consultation/handle?id=${id}`,
  );
}
