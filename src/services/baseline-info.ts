import { request } from 'umi';

//政府信息配置-分页查询
export async function queryGovPage(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/organization/gov/page', {
    method: 'post',
    data,
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
export async function exportGov(params?: any) {
  return request<any>('/antelope-business/mng/organization/gov/export', {
    method: 'get',
    params,
    responseType: 'blob',
    getResponse: true,
  });
}

//政府信息配置-政府信息导入
export async function importGov(data?: Record<string, any>) {
  return request<any>('/antelope-business/mng/organization/gov/import', {
    method: 'post',
    data,
  });
}

// 政府信息配置-操作日志
export async function queryGovLogList(params?: any) {
  return request<any>('/antelope-business/mng/organization/gov/logList', {
    method: 'get',
    params,
  });
}
