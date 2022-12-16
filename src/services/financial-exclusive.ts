import type FinancialExclusive from '@/types/financial-exclusive';
import { request } from 'umi';

/** 查询专属客服信息 */
export async function getExcCustomer() {
  return request<FinancialExclusive.ExcCustomerInfo>('/antelope-finance/customer/mng/getExcCustomer', {
    method: 'post',
    headers: {
      // 'rpc-tag': 'jianwang44',
    },
  });
}

/** 新增编辑 */
export async function saveOrUpdateCustomer(data?: Record<string, any>) {
  return request<any>('/antelope-finance/customer/mng/addOrEditCustomer', {
    method: 'post',
    headers: {
      // 'rpc-tag': 'jianwang44',
    },
    data,
  });
}
