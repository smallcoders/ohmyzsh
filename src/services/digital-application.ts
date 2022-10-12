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

/** 回显机构列表 */
export async function editOrgList(data: { ids?: any }) {
  return request<ApplicationManager.CompanyResultList>('/antelope-user/mng/dataManage/queryOrgList', {
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

// 编辑推送应用
export async function updatePushApplication(data?: { [key: string]: any }) {
  return request<ApplicationManager.ResultList>('/antelope-other/mng/api/manage/updateBag', {
    method: 'post',
    data,
  });
}

// 推送记录列表
export async function getPushRecordList(data?: { [key: string]: any }) {
  return request<ApplicationManager.DetailResultList>('/antelope-other/mng/api/manage/queryBagPage', {
    method: 'post',
    data,
  });
}

// 应用推送详情
export async function getPushDetail(params: { bagId: string }) {
  return request<ApplicationManager.DetailResult>('/antelope-other/mng/api/manage/getBagByBagId', {
    method: 'get',
    params,
  });
}

// 应用推送列表
export async function getApplicationPushList(data?: { [key: string]: any }) {
  return request<ApplicationManager.DetailResultList>('/antelope-other/mng/api/manage/queryChoiceAppPage', {
    method: 'post',
    data,
  });
}

// 应用审核列表
export async function getApplyInfoPage(data?: { [key: string]: any }) {
  return request<ApplicationManager.ResultList>('/antelope-other/mng/api/manage/queryApplyInfoPage', {
    method: 'post',
    data,
  });
}

// 应用审核处理
export async function handleApply(data?: { [key: string]: any }) {
  return request('/antelope-other/mng/api/manage/handleApply', {
    method: 'post',
    data,
  });
}

// 应用分类
export async function getApplicationTypeList() {
  return request('/antelope-other/app/getTypeList', {
    method: 'get'
  })
}

// 查询应用详情
export async function getApplicationInfo(params: { id: string }) {
  return request('/antelope-other/mng/api/manage/getAppInfo', {
    method: 'get',
    params
  })
}

// 获取接口配置
export async function getInterfaceConfig() {
  return request('/antelope-other/mng/api/manage/getInterfaceConfig', {
    method: 'get'
  })
}

// 新增接口配置
export async function addInterfaceConfig(data: { id?: number, interfaceDescription?: string, interfaceNorm?: string }) {
  return request('/antelope-other/mng/api/manage/addInterfaceConfig', {
    method: 'post',
    data
  })
}

// 更新接口配置
export async function updateInterfaceConfig(data: { id?: number, interfaceDescription?: string, interfaceNorm?: string }) {
  return request('/antelope-other/mng/api/manage/updateInterfaceConfig', {
    method: 'post',
    data
  })
}

// 【羚羊开放平台】获取token
export async function getOpenInsideTokenV2(id: string) {
  return request(`/antelope-other/token/inside/getTokenV2/${id}`, {
    method: 'get'
  })
}




