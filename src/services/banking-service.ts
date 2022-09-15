// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import BankingService from '@/types/banking-service';
import { request } from 'umi';

/** 获取 列表 */
export async function getBankingServicePage(data?: { [key: string]: any }) {
  return request<BankingService.ResultList>('/antelope-finance/demand/mng/page', {
    method: 'post',
    data,
  });
}

/**
 * 添加
 */
export async function addBanner(data?: BankingService.Content) {
  return request<Common.ResultCode>('/antelope-manage/banner', {
    method: 'post',
    data,
  });
}

/**
 * 修改
 */
export async function updateBanner(data?: BankingService.Content) {
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
