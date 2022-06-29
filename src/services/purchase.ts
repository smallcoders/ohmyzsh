import Common from '@/types/common';
import LogoutVerify from '@/types/user-config-logout-verify';
import { request } from 'umi';

// ----------------------发票管理----------------------------
/**
 * 分页查询
 * @param params
 */
 export async function getBillPage(data?: { [key: string]: any }) {
    return request<LogoutVerify.ResultList>('/antelope-pay/mng/invoice/queryByParam', {
      method: 'post',
      data,
    });
}

// ----------------------标签管理----------------------------
/**
 * 分页查询
 * @param params
 */
 export async function getLabelPage(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/label/query', {
    method: 'post',
    data,
  });
}
/**
 * 标签新增/编辑/删除
 * @param params
 */
 export async function updateLabel(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/label/save', {
    method: 'post',
    data,
  });
}

// ----------------------供应商管理----------------------------
/**
 * 分页查询
 * @param params
 */
export async function getProviderPage(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/provider/search', {
    method: 'post',
    data
  });
}
/**
 * 供应商详情
 * @param params
 */
export async function getProviderDetails(options?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/provider/details', {
    method: 'get',
    params: { ...(options || {}) },
  });
}
/**
 * 新增供应商
 * @param params
 */
 export async function addProvider(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/provider/add', {
    method: 'post',
    data
  });
}
/**
 * 编辑供应商
 * @param params
 */
 export async function updateProvider(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/provider/update', {
    method: 'post',
    data
  });
}
/**
 * 删除供应商
 * @param params
 */
export async function removeProvider(id: string) {
  return request<Common.ResultCode>(`/antelope-pay/provider/delete?id=${id}`, {
    method: 'DELETE',
  });
}
/**
 * 供应商类型-所有
 * @param params
 */
 export async function getAllProviderTypes() {
  return request<LogoutVerify.ResultList>('/antelope-pay/provider/type/all', {
    method: 'get'
  });
}

// ----------------------供应商类型----------------------------
/**
 * 分页查询
 * @param params
 */
 export async function getProviderTypesPage(options?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/provider/type/search', {
    method: 'get',
    params: { ...(options || {}) },
  });
}
/**
 * 新增供应商类型
 * @param params
 */
 export async function addProviderType(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/provider/type/add', {
    method: 'post',
    data
  });
}
/**
 * 编辑供应商类型
 * @param params
 */
 export async function updateProviderType(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/provider/type/update', {
    method: 'post',
    data
  });
}
/**
 * 删除供应商类型
 * @param params
 */
export async function removeProviderType(id: string) {
  return request<Common.ResultCode>(`/antelope-pay/provider/type/delete?id=${id}`, {
    method: 'DELETE',
  });
}

// ----------------------销售数据统计----------------------------
/**
 * 活动数据列表
 * @param params
 */
 export async function getActivityList(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/statistics/activity/list', {
    method: 'post',
    data
  });
}

/**
 * 活动详情
 * @param params
 */
 export async function getActivityDetails(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/statistics/activity/with/order/detail', {
    method: 'post',
    data
  });
}
/**
 * 商品数据列表
 * @param params
 */
 export async function getProductList(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/statistics/product/list', {
    method: 'post',
    data
  });
}
