// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import Banner from '@/types/service-config-banner';
import { request } from 'umi';

/** 获取banner 列表 */
export async function getBannerPage(options?: { [key: string]: any }) {
  return request<Banner.ResultList>('/antelope-manage/banner', {
    method: 'GET',
    params: { ...(options || {}) },
  });
}

/**
 * 添加
 */
export async function addBanner(data?: Banner.Content) {
  return request<Common.ResultCode>('/antelope-manage/banner', {
    method: 'post',
    data,
  });
}

/**
 * 修改
 */
export async function updateBanner(data?: Banner.Content) {
  return request<Common.ResultCode>('/antelope-manage/banner', {
    method: 'put',
    data,
  });
}

/**
 * 删除
 * */
export async function removeBanner(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/banner/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改状态
 * @param options
 * @returns
 */
export async function updateState(data: { id: string; state: number }) {
  return request<Common.ResultCode>('/antelope-manage/banner/state', {
    method: 'put',
    data,
  });
}
