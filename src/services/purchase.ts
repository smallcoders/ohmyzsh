import Common from '@/types/common';
import LogoutVerify from '@/types/user-config-logout-verify';
import { request } from 'umi';

// ----------------------活动管理----------------------------
/**
 * 分页查询
 * @param params
 */
export async function getActivityManageList(params: {
  current?: number;
  pageSize?: number;
}) {
  return request('/antelope-pay/mng/activity/pageQuery', {
    method: 'POST',
    data: { ...params, pageIndex: params.current },
  }).then((e: { code: number; totalCount: any; result: any }) => ({
    success: e.code === 0,
    total: e.totalCount,
    data: e.result,
  }));
}
/**
 * 新增活动查询可上架商品列表
 * @param params
 */
 export async function getActivityProducts(options?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/activity/queryProduct', {
    method: 'get',
    params: { ...(options || {}) },
  });
}
/**
 * 设置价格时查看对应商品规格信息
 * @param params
 */
 export async function getProductPriceList(id: string) {
  return request<LogoutVerify.ResultList>(`/antelope-pay/product/queryPrice/${id}`, {
    method: 'get'
  });
}
/**
 * 新增活动
 * @param params
 */
 export async function createActivity(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/activity/create', {
    method: 'post',
    data,
  });
}
/**
 * 编辑活动
 * @returns
 */
 export async function updateActivity(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-pay/mng/activity/update`, {
    method: 'put',
    data,
  });
}
/**
 * 更改活动状态及下架
 * @returns
 */
 export async function changeActState(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-pay/mng/activity/changeState`, {
    method: 'put',
    data,
  });
}
/**
 * 查看活动详情
 * @param params
 */
export async function getActivityDetail(id: string) { // 活动详情
  return request(`/antelope-pay/mng/activity/queryDetail?id=${id}`, {
    method: 'GET'
  });
}

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
/**
 * 导出发票
 * @param params
 */
 export async function exportBillPage(data?: { [key: string]: any }) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/invoice/export', {
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
 * 供应商-导出
 * @param params
 */
export async function exportProvider(providerName: string) {
  return request<LogoutVerify.ResultList>(`/antelope-pay/provider/download?providerName=${providerName}`, {
    method: 'get'
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
