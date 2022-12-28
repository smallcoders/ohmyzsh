// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
// import Common from '@/types/common';

/**
 * 获取产品列表信息
 * @param data
 * @returns
 */
export async function getProductList(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/product/mng/query', {
    method: 'post',
    data,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
/**
 * 获取产品类型
 * @param params
 * @returns
 */
export async function getProductType(params?: { [key: string]: any }) {
  return request<any>('/antelope-finance/product/mng/queryType', {
    method: 'get',
    params,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
/**
 * 新增/编辑产品
 * @param data
 * @returns
 */
export async function addProduct(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/product/mng/addProduct', {
    method: 'post',
    data,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}

/**
 * 上下架产品（可批量操作）
 * @param params
 * @returns
 */
export async function updateStateByIds(params?: { [key: string]: any }) {
  return request<any>('/antelope-finance/product/mng/updateStateByIds', {
    method: 'get',
    params,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}

/**
 * 删除产品
 * @param params
 * @returns
 */
export async function delProduct(params?: { [key: string]: any }) {
  return request<any>('/antelope-finance/product/mng/delProduct', {
    method: 'get',
    params,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
/**
 * 获取贷款用途
 * @param data
 * @returns
 */
export async function queryPurpose(data?: { [key: string]: any }) {
  return request<any>('/antelope-finance/product/mng/queryPurpose', {
    method: 'get',
    data,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
/**
 * 新增贷款用途
 * @param params
 * @returns
 */
export async function addPurpose(params?: { [key: string]: any }) {
  return request<any>('/antelope-finance/product/mng/addPurpose', {
    method: 'get',
    params,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
/**
 * 删除贷款用途
 * @param params
 * @returns
 */
export async function delPurpose(params?: { [key: string]: any }) {
  return request<any>('/antelope-finance/product/mng/delPurpose', {
    method: 'get',
    params,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
/**
 * 获取金融机构
 * @returns
 */
export async function queryBank() {
  return request<any>('/antelope-finance/bank/mng/queryBank', {
    method: 'get',
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
/**
 * 获取产品详情信息
 * @param params
 * @returns
 */
export async function getProductInfo(params?: { [key: string]: any }) {
  return request<any>('/antelope-finance/product/mng/getProductInfo', {
    method: 'get',
    params,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
