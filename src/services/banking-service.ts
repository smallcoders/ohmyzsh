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
 * 获取产品列表
 * @param data
 * @returns
 */
export async function getProductList(data?: { [key: string]: any }) {
  return request<BankingService.ProductList>('/antelope-finance/demand/queryProductList', {
    method: 'get',
    params: { ...(data || {}) },
  });
}
/**
 * 运营平台获取审核状态列表
 * @param data
 * @returns
 */
export async function getDemandRecordList(data?: { [key: string]: any }) {
  return request<BankingService.StatusResultList>('/antelope-finance/demand/mng/demandRecordList', {
    method: 'get',
    params: { ...(data || {}) },
  });
}
/**
 * 更新状态
 */
export async function updateVerityStatus(data: {
  id: string | undefined;
  verityStatus: number | undefined;
}) {
  return request<Common.ResultCode>('/antelope-finance/demand/mng/verityStatus', {
    method: 'post',
    data,
  });
}
/**
 * 运营平台获取省市
 * @param data
 * @returns
 */
export async function getDetailAddress(data: { code: string }) {
  return request<
    Common.ResultCode & {
      result: any;
    }
  >('/antelope-common/common/district/queryAllAddress', {
    method: 'get',
    params: { ...(data || {}) },
  });
}
