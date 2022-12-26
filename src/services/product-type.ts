import { request } from 'umi';
import type ProductType from '@/types/product-type';

/**
 * 列表
 */
export async function getProductTypeList() {
  return request<ProductType.ResultList>('/antelope-finance/product/mng/queryType', {
    method: 'get',
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
/**
 * 更新产品类型顺序
 */
export async function updateTypeSort(id: number, sort: number) {
  return request<any>(`/antelope-finance/product/mng/updateTypeSort?id=${id}&sort=${sort}`, {
    method: 'get',
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
/**
 * 新增/编辑产品类型
 * @param params
 */
export async function updateType(data?: Record<string, any>) {
  return request<any>('/antelope-finance/product/mng/addType', {
    method: 'post',
    data,
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}
/**
 * 删除产品类型
 * @param params
 */
export async function delType(id: number) {
  return request<any>(`/antelope-finance/product/mng/delType?id=${id}`, {
    method: 'get',
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}

/**
 * 校验能否删除子产品类型
 * @param params
 */
export async function checkDelType(id: number) {
  return request<any>(`/antelope-finance/product/mng/checkDelTypeDetail?id=${id}`, {
    method: 'get',
    headers: {
      'rpc-tag': 'jbxu5',
    },
  });
}