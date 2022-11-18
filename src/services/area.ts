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

// 全国性的区域树查询
export async function getWholeAreaTree({
  parentCode = '', // 父级code
  endLevel = 'TOWN', // PROVINCE :省、自治区、直辖市、特别行政区 TOWN :市 COUNTY :县、市辖区 STREET :乡镇、街道
}: {
  parentCode?: string;
  endLevel?: 'PROVINCE' | 'TOWN' | 'COUNTY' | 'STREET';
}) {
  return request('/antelope-common/common/district/districtTree', {
    method: 'GET',
    params: { parentCode, endLevel },
  }).then(({ result }) => result);
}

// 带有其他的安徽省地区
export async function getAhArea(
  parentCode = 340000,
) {
  return request('/antelope-manage/common/areaCode', {
    method: 'GET',
    // params: { parentCode },
  }).then(({ result }) => result);
}