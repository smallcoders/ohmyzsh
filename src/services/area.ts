import { request } from 'umi';

/**
 * 查询地域字典树
 * 安徽省 340000
 * @param params
 */
export async function getAreaTree({
  areaCode = 340000,
  endLevel = 'CITY',
}: {
  areaCode?: number;
  endLevel?: 'PROVINCE' | 'CITY' | 'COUNTY';
}) {
  return request('/antelope-manage/area/getTree', {
    method: 'GET',
    params: { areaCode, endLevel },
  }).then(({ result }) => result);
}
