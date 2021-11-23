import { request } from 'umi';

/**
 * 查询字典树
 * @param label
 */
export async function getDictionaryTree(
  label: 'DEMAND_SOLUTION' | 'EXPERT' | 'POLICY' | 'MANAGEMENT',
) {
  return request('/iiep-manage/dictionary/getTree', {
    method: 'GET',
    params: { label },
  }).then(({ result }) => result);
}
