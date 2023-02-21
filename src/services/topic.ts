// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 编辑热门推荐(话题名称,修改权重)
 */
export async function editHotRecommend(data?: any) {
  return request<any>('/antelope-industrial/mng/hotRecommends/editHotRecommend', {
    method: 'post',
    data,
    headers:{'rpc-tag':'local-dev'}
  });
}

/**
 * 添加
 */
export async function addHotRecommend(data?: any) {
  return request<any>('/antelope-industrial/mng/hotRecommends/addHotRecommend', {
    method: 'post',
    data,
    headers:{'rpc-tag':'local-dev'}
  });
}
/**
 * 分页查询热门推荐
 */
export async function queryHotRecommend(data?: any) {
  return request<any>('/antelope-industrial/mng/hotRecommends/queryPage', {
    method: 'post',
    data,
    headers:{'rpc-tag':'local-dev'}
  });
}

/**
 * 获取热门推荐详情
 */
export async function getHotRecommendDetail(data?: any) {
  return request<any>('/antelope-industrial/mng/hotRecommends/getHotRecommendDetail', {
    method: 'post',
    data,
    headers:{'rpc-tag':'local-dev'}
  });
}

/**
 * 删除热门推荐
 */
export async function deleteHotRecommend(id?: any) {
  return request<any>(`/antelope-industrial/mng/hotRecommends/deleteHotRecommend?id=${id}`, {
    method: 'DELETE',
    headers: {'rpc-tag': 'local-dev'}
  });
}

/**
 * 删除热门推荐和话题的关联关系
 */
export async function deleteRelation(id?: any) {
  return request<any>(`/antelope-industrial/mng/hotRecommends/deleteRelation?id=${id}`, {
    method: 'DELETE',
    headers:{'rpc-tag':'local-dev'}
  });
}

/**
 * 通过id数组查询文章列表
 */
export async function queryByIds(data?: any) {
  return request<any>('/antelope-industrial/mng/article/queryByIds', {
    method: 'post',
    data,
    headers:{'rpc-tag':'local-dev'}
  });
}
