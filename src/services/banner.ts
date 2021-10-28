// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import Banner from '@/types/service-config-banner';
import { request } from 'umi';

/** 获取banner 列表 */
export async function getBannerPage(options?: { [key: string]: any }) {
  return request<{
    data: Banner.ResultList;
  }>('/iiep-manage/banner', {
    method: 'GET',
    params: { ...(options || {}) },
  });
}

/**
 * 添加
 */
export async function addBanner(data?: Banner.Content) {
  return request<Common.ResultCode>('/iiep-manage/banner', {
    method: 'post',
    data,
  });
}

/**
 * 修改
 */
export async function updateBanner(data?: Banner.Content) {
  return request<Common.ResultCode>('/iiep-manage/banner', {
    method: 'put',
    data,
  });
}

/**
 * 删除
 * */
export async function removeBanner(id: string) {
  return request<Common.ResultCode>(`/iiep-manage/banner/${id}`, {
    method: 'DELETE',
  });
}
