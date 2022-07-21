// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import News from '@/types/service-config-news';
import { request } from 'umi';

/** 获取当前的用户 GET /api/currentUser */
export async function getNewsPage(data?: { [key: string]: any }) {
  return request<News.ResultList>('/antelope-manage/newsInformation/page', {
    method: 'post',
    data,
  });
}

/**
 * 添加或者修改新闻资讯
 */
export async function addOrUpdateNews(data?: News.Content) {
  return request<Common.ResultCode>('/antelope-manage/newsInformation/save', {
    method: 'post',
    data,
  });
}

/**
 * 删除新闻资讯
 * */
export async function removeNews(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/newsInformation/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改状态
 */
export async function updateState(options?: { [key: string]: any }) {
  return request<Common.ResultCode>('/antelope-manage/newsInformation/updateState', {
    method: 'get',
    params: { ...(options || {}) },
  });
}
