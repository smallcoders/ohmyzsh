import { request } from 'umi';

/**
 * 分页查询
 * @param params
 */
export async function pageQuery(params: {
  current?: number;
  pageSize?: number;
  loginName?: string;
  name?: string;
  phone?: string;
}) {
  return request('/api/promotions/pageQuery', {
    method: 'GET',
    params: { ...params, pageIndex: params.current },
  });
}
