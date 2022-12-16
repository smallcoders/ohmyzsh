import { request } from 'umi';
/**
 * 列表
 */
export async function getProductTypeList() {
  return request('/antelope-pay/product/mng/queryType', {
    method: 'get',
  });
}
