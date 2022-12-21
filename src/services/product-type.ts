import { request } from 'umi';
import type ProductType from '@/types/product-type';

/**
 * 列表
 */
export async function getProductTypeList() {
  return request<ProductType.ResultList>('/antelope-finance/product/mng/queryType', {
    method: 'get',
  });
}
/**
 * 更新产品类型顺序
 */
export async function updateTypeSort(id: number, sort: number) {
  return request<any>(`/antelope-finance/product/mng/updateTypeSort?id=${id}&sort=${sort}`, {
    method: 'get',
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
  });
}
/**
 * 删除产品类型
 * @param params
 */
export async function delType(id: number) {
  return request<any>(`/antelope-finance/product/mng/delType?id=${id}`, {
    method: 'get',
  });
}