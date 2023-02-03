import type Common from '@/types/common';
import type LogoutVerify from '@/types/user-config-logout-verify';
import { request } from 'umi';

// ----------------------活动管理----------------------------
/**
 * 分页查询
 * @param params
 */
export async function getActivityManageList(params: {
  current?: number;
  pageSize?: number;
  type?: number;
  [key: string]: any;
}) {
  return request('/antelope-pay/mng/activity/pageQuery', {
    method: 'POST',
    data: { 
      ...params, 
      pageIndex: params.current,
      startDate: params.updateTime ? params.updateTime[0] : '',
      endDate: params.updateTime ? params.updateTime[1] : ''
    },
    // headers: {
    //   'rpc-tag': 'jbxu5',
    // },
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
export async function getActivityProducts(options?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/activity/queryProduct', {
    method: 'get',
    params: { ...(options || {}) },
  });
}
/**
 * 新增活动查询可上架商品列表 （数字化）
 * @param params
 */
export async function getActivityAppProducts(options?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/activity/queryProductApp', {
    method: 'post',
    data: { ...(options || {}) },
    // headers: {
    //   'rpc-tag': 'jbxu5',
    // },
  });
}

/**
 * 设置价格时查看对应商品规格信息
 * @param params
 */
export async function getProductPriceList(id: string) {
  return request<LogoutVerify.ResultList>(`/antelope-pay/mng/product/queryPrice/${id}`, {
    method: 'get',
  });
}
/**
 * 新增活动
 * @param params
 */
export async function createActivity(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList & Common.ResultCode>('/antelope-pay/mng/activity/create', {
    method: 'post',
    data,
  });
}
/**
 * 编辑活动
 * @returns
 */
export async function updateActivity(data?: Record<string, any>) {
  return request<Common.ResultCode & { result: any }>(`/antelope-pay/mng/activity/update`, {
    method: 'put',
    data,
  });
}
/**
 * 更改活动状态及下架
 * @returns
 */
export async function changeActState(data?: Record<string, any>) {
  return request<Common.ResultCode & { result: any }>(`/antelope-pay/mng/activity/changeState`, {
    method: 'put',
    data,
  });
}
/**
 * 查看活动详情
 * @param params
 */
export async function getActivityDetail(id: string) {
  // 活动详情
  return request(`/antelope-pay/mng/activity/queryDetail?id=${id}`, {
    method: 'GET',
  });
}

// ----------------------发票管理----------------------------
/**
 * 分页查询
 * @param params
 */
export async function getBillPage(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/invoice/queryByParam', {
    method: 'post',
    data,
  });
}
/**
 * 导出发票
 * @param params
 */
export async function exportBillPage(data?: Record<string, any>) {
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
export async function getLabelPage(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/label/query', {
    method: 'post',
    data,
  });
}
/**
 * 标签新增/编辑/删除
 * @param params
 */
export async function updateLabel(data?: Record<string, any>) {
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
export async function getProviderPage(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/provider/search', {
    method: 'post',
    data,
  });
}
/**
 * 供应商-导出
 * @param params
 */
export async function exportProvider(providerName: string) {
  return request<LogoutVerify.ResultList>(
    `/antelope-pay/mng/provider/download?providerName=${providerName}`,
    {
      method: 'get',
    },
  );
}
/**
 * 供应商详情
 * @param params
 */
export async function getProviderDetails(options?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/provider/details', {
    method: 'get',
    params: { ...(options || {}) },
  });
}
/**
 * 新增供应商
 * @param params
 */
export async function addProvider(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/provider/add', {
    method: 'post',
    data,
  });
}
/**
 * 编辑供应商
 * @param params
 */
export async function updateProvider(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/provider/update', {
    method: 'post',
    data,
  });
}
/**
 * 删除供应商
 * @param params
 */
export async function removeProvider(id: string) {
  return request<Common.ResultCode>(`/antelope-pay/mng/provider/delete?id=${id}`, {
    method: 'DELETE',
  });
}
/**
 * 供应商类型-所有
 * @param params
 */
export async function getAllProviderTypes() {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/provider/type/all', {
    method: 'get',
  });
}

// ----------------------供应商类型----------------------------
/**
 * 分页查询
 * @param params
 */
export async function getProviderTypesPage(options?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/provider/type/search', {
    method: 'get',
    params: { ...(options || {}) },
  });
}
/**
 * 新增供应商类型
 * @param params
 */
export async function addProviderType(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/provider/type/add', {
    method: 'post',
    data,
  });
}
/**
 * 编辑供应商类型
 * @param params
 */
export async function updateProviderType(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/provider/type/update', {
    method: 'post',
    data,
  });
}
/**
 * 删除供应商类型
 * @param params
 */
export async function removeProviderType(id: string) {
  return request<Common.ResultCode>(`/antelope-pay/mng/provider/type/delete?id=${id}`, {
    method: 'DELETE',
  });
}

// ----------------------销售数据统计----------------------------
/**
 * 活动数据列表
 * @param params
 */
export async function getActivityList(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/statistics/activity/list', {
    method: 'post',
    data,
  });
}

/**
 * 活动详情
 * @param params
 */
export async function getActivityDetails(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>(
    '/antelope-pay/mng/statistics/activity/with/order/detail',
    {
      method: 'post',
      data,
    },
  );
}
/**
 * 商品数据列表
 * @param params
 */
export async function getProductList(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/statistics/product/list', {
    method: 'post',
    data,
  });
}

/**
 * 讯飞供应链流水总额统计
 */
 export async function getGMVTotal() {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/iflytek/flow/sum', {
    method: 'get',
  });
}

/**
 * 讯飞供应链流水列表
 * @param params
 */
export async function getGVMPage(data?: Record<string, any>) {
  return request<LogoutVerify.ResultList>('/antelope-pay/mng/iflytek/flow/page', {
    method: 'post',
    data,
  });
}

/**
 * 删除GMV
 * @param params
 */
 export async function removeGMVItem(id: string) {
  return request<Common.ResultCode>(`/antelope-pay/mng/iflytek/flow/delete?id=${id}`, {
    method: 'DELETE',
  });
}


