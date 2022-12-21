import type FinancialInstitution from '@/types/financial-institution';
import { request } from 'umi';

/** 机构列表 */
export async function getBankTree() {
  return request<FinancialInstitution.ResultList>('/antelope-finance/mng/bank/queryBank', {
    method: 'get',
    // headers: {
    //   'rpc-tag': 'jianwang44',
    // },
  });
}

/** 机构详情 */
export async function getBankInfo(id: number) {
  return request<FinancialInstitution.ResultBankInfo>(
    `/antelope-finance/mng/bank/getBankById?id=${id}`,
    {
      method: 'get',
      // headers: {
      //   'rpc-tag': 'jianwang44',
      // },
    },
  );
}

/** 一级二级机构列表 */
export async function getQueryBank2() {
  return request<FinancialInstitution.ResultBankInfo>('/antelope-finance/mng/bank/queryBank2', {
    method: 'get',
    // headers: {
    //   'rpc-tag': 'jianwang44',
    // },
  });
}

/** 新增编辑 */
export async function saveOrUpdateInstitution(data?: Record<string, any>) {
  return request<FinancialInstitution.ResultsaveOrUpdate>('/antelope-finance/mng/bank/addBank', {
    method: 'post',
    // headers: {
    //   'rpc-tag': 'jianwang44',
    // },
    data,
  });
}

/**
 * 删除
 * @param params
 */
export async function removeBank(id: number) {
  return request<any>(`/antelope-finance/mng/bank/delBank?id=${id}`, {
    method: 'get',
  });
}

/**
 * 门户合作机构查询
 * @param params
 */
export async function queryCooperateOrg() {
  return request<any>(`/antelope-finance/mng/bank/queryCooperateOrg`, {
    method: 'get',
  });
}