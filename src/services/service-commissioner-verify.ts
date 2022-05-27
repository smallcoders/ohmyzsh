// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 服务专员审核列表
 * @param data
 * @returns
 */
export async function getCommissionerVerifyPage(data?: { [key: string]: any }) {
  return request<any>('/iiep-manage/commissioner/page', {
    method: 'post',
    data,
  });
}

/**
 * 服务专员标记
 * @param data
 * @returns
 */
export async function signCommissioner(data?: { [key: string]: any }) {
  return request<any>('/iiep-manage/commissioner/submit', {
    method: 'post',
    data,
  });
}

/**
 * 服务专员-服务记录
 * @param data
 * @returns
 */
export async function getCommissionerServicePageByUserId(data?: { [key: string]: any }) {
  return request<any>('/iiep-manage/commissioner/service/page', {
    method: 'post',
    data,
  });
}
