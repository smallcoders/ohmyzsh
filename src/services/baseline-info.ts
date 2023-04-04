import { request } from 'umi';

//政府信息配置-分页查询
export async function queryGovPage(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/organization/gov/page', {
    method: 'post',
    data,
  });
}

// 政府信息配置--导入模版
export async function getGovImportTemplate(params?: any) {
  return request<any>('/antelope-business/mng/organization/gov/getImportTemplateFile', {
    method: 'get',
    params,
  });
}

// 协会信息配置--导入模版
export async function getAllianceImportTemplate(params?: any) {
  return request<any>('/antelope-business/mng/organization/alliance/getImportTemplateFile', {
    method: 'get',
    params,
  });
}
// 政府信息配置-详情
export async function queryGovDetail(params?: any) {
  return request<any>('/antelope-business/mng/organization/gov/detail', {
    method: 'get',
    params,
  });
}

//政府信息配置-保存
export async function saveGov(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/organization/gov/save', {
    method: 'post',
    data,
  });
}

// 政府信息配置-删除政府信息
export async function delGov(params?: any) {
  return request<any>('/antelope-business/mng/organization/gov/del', {
    method: 'DELETE',
    params,
  });
}

// 政府信息配置-政府信息导出
export async function exportGov(data?: any) {
  return request<any>('/antelope-business/mng/organization/gov/export', {
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  });
}

// 政府信息配置-操作日志
export async function queryGovLogList(params?: any) {
  return request<any>('/antelope-business/mng/organization/gov/logList', {
    method: 'get',
    params,
  });
}

//协会信息配置-分页查询
export async function queryAlliancePage(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/organization/alliance/page', {
    method: 'post',
    data,
  });
}

// 协会信息配置--详情
export async function queryAllianceDetail(params?: any) {
  return request<any>('/antelope-business/mng/organization/alliance/detail', {
    method: 'get',
    params,
  });
}

//协会信息配置--保存
export async function saveAlliance(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/organization/alliance/save', {
    method: 'post',
    data,
  });
}

// 协会信息配置--配置-删除政府信息
export async function delAlliance(params?: any) {
  return request<any>('/antelope-business/mng/organization/alliance/del', {
    method: 'DELETE',
    params,
  });
}

// 协会信息配置--操作日志
export async function queryAllianceLogList(params?: any) {
  return request<any>('/antelope-business/mng/organization/alliance/logList', {
    method: 'get',
    params,
  });
}

// 根据组织id获取组织基本信息
export async function queryBaseInfoById(params?: any) {
  return request<any>('/antelope-business/organization/info/base/get', {
    method: 'get',
    params,
  });
}

//协会信息配置-所属产业
export async function queryIndustryTypes(params?: any) {
  return request<any>('/antelope-business/mng/organization/alliance/categoryFirstList', {
    method: 'get',
    params,
  });
}
