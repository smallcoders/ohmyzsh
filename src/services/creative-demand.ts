// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 获取创新需求列表
 * @param data
 * @returns
 */
export async function getCreativePage(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/creative/demand/page', {
    method: 'post',
    data,
  });
}

/**
 * 查询关键词
 */
export async function getKeywords() {
  return request<any>(`/antelope-science/mng/common/dictionaryEnum?label=ORG_INDUSTRY`);
}

/**
 * 查询应用行业
 */
export async function getCreativeTypes() {
  return request<any>('/antelope-science/mng/common/dictionary?label=CREATIVE_TYPE');
}

/**
 * 关键词编辑
 */
 export async function updateKeyword(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/creative/demand/update/keyword', {
    method: 'put',
    data,
  });
}

/**
 * 已解决
 */
 export async function updateConversion(id: string) {
  return request<any>(`/antelope-science/mng/creative/demand/update/resolved?id=${id}`, {
    method: 'get'
  });
}

/**
 * 查询成果详情
 */
export async function getDemandDetail(id: string) {
  return request<any>(`/antelope-science/mng/creative/demand/detail?id=${id}`);
}


