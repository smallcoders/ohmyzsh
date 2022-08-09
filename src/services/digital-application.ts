// @ts-ignore
/* eslint-disable */
import ApplicationManager from '@/types/service-config-digital-applictaion';
import { request } from 'umi';

/** 获取应用列表 */
export async function getApplicationList(data?: { [key: string]: any }) {
  return request<ApplicationManager.ResultList>('/antelope-other/mng/api/manage/queryAppPage', {
    method: 'post',
    data,
  });
}

/** 获取机构列表 */
export async function getOrgList(data: { pageIndex: number, pageSize: number, orgName?: string }) {
  return request<ApplicationManager.CompanyResultList>('/antelope-user/user/queryOrgList', {
    method: 'post',
    data
  });
}

// 创建应用
export async function addApplication(data?: { [key: string]: any }) {
  return request<ApplicationManager.ResultList>('/antelope-other/mng/api/manage/addApp', {
    method: 'post',
    data,
  });
}

// 更新应用
export async function updateApplication(data?: { [key: string]: any }) {
  return request<ApplicationManager.ResultList>('/antelope-other/mng/api/manage/updateApp', {
    method: 'post',
    data,
  });
}

// 删除应用
export async function deleteApplication(params: { apiId: number }) {
  return request<ApplicationManager.ResultList>('/antelope-other/mng/api/manage/deleteApp', {
    method: 'get',
    params,
  });
}

// 推送应用
export async function pushApplication(data?: { [key: string]: any }) {
  return request<ApplicationManager.ResultList>('/antelope-other/mng/api/manage/pushBag', {
    method: 'post',
    data,
  });
}


