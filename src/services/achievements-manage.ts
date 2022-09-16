// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 获取科技成果列表
 * @param data
 * @returns
 */
export async function getCreativePage(data?: { [key: string]: any }) {
  return request<any>('/antelope-science/mng/creative/achievement/page', {
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
  return request<any>('/antelope-science/mng/creative/achievement/update/keyword', {
    method: 'put',
    data,
  });
}

/**
 * 完成转化
 */
export async function updateConversion(id: string) {
  return request<any>(`/antelope-science/mng/creative/achievement/update/conversion?id=${id}`, {
    method: 'get',
  });
}

/**
 * 查询成果详情
 */
export async function getDemandDetail(id: string) {
  return request<any>(`/antelope-science/mng/creative/achievement/detail?id=${id}`);
}

/**
 * 获取科创需求列表
 * @param data
 * @returns
 */
export async function getDemandPage(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/creative/audit/page/demand', {
    method: 'post',
    data,
  });
}

// 用户列表查询
export async function getUserListBySearch(keyword: string, limit = 10) {
  return request<any>(`/antelope-manage/user/listBySearch?keyword=${keyword}&limit=${limit}`);
}

/**
 * 科产成果批量上传
 * @param data
 * @returns
 */
export async function postAchievementUpload(userId: string, fileId: string) {
  return request<any>(
    `/antelope-science/mng/creative/achievement/import?userId=${userId}&fileId=${fileId}`,
    {
      method: 'post',
    },
  );
}
