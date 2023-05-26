import { request } from 'umi';

/**
 * 获取地区级联列表
 */
export async function getAreaCode(params?: any) {
  return request<any>('/antelope-common/common/area/areaCode/cascade', {
    method: 'get',
    params,
  });
}

export async function getBusinessList(data?: any) {
  return request<any>('/antelope-channel/mng/chance/list', {
    method: 'post',
    data,
  });
}

export async function saveBusiness(data?: any) {
  return request<any>('/antelope-channel/mng/chance/save', {
    method: 'post',
    data,
  });
}

// 获取企业列表
export async function getOrgList(params?: any) {
  return request<any>('/antelope-user/mng/org/fuzzy/orgList', {
    method: 'get',
    params,
  });
}

// 获取历史渠道商
export async function getHistoryChannel(params?: any) {
  return request<any>('/antelope-channel/mng/channel/query/history', {
    method: 'get',
    params,
  });
}

// 根据地域查询渠道商
export async function getChannelByArea(params?: any) {
  return request<any>('/antelope-channel/mng/channel/query/byArea', {
    method: 'get',
    params,
  });
}

// 根据名称查询渠道商
export async function getChannelByName(params?: any) {
  return request<any>('/antelope-channel/mng/channel/query/fuzzy', {
    method: 'get',
    params,
  });
}

// 商机审核
export async function auditChannel(data?: any) {
  return request<any>('/antelope-channel/mng/chance/audit', {
    method: 'post',
    data,
  });
}

// 商机分发
export async function dispathChannel(data?: any) {
  return request<any>('/antelope-channel/mng/chance/dispath', {
    method: 'post',
    data,
  });
}
// 跟进列表
export async function getAccessList(params?: any) {
  return request<any>('/antelope-channel/mng/chance/access/list', {
    method: 'get',
    params,
  });
}
// 跟进详情
export async function getAccessDetail(params?: any) {
  return request<any>('/antelope-channel/mng/chance/access/detail', {
    method: 'get',
    params,
  });
}

// 下载商机模版
export async function downloadBusinessTemplate() {
  return request<any>('/antelope-channel/mng/importAndExport/downloadBusinessTemplate', {
    method: 'get',
    responseType: 'blob',
    getResponse: true,
  });
}

