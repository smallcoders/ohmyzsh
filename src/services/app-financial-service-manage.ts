import { request } from 'umi';
import type AppFinancialMng from '@/types/app-financial-service-manage';

/**
 * 列表
 */
export async function getAuditInfoMngList() {
  return request<AppFinancialMng.ResultList>('/antelope-finance/app/mng/getAuditInfoMng', {
    method: 'get',
  });
}
/**
 * 新增修改审核信息
 */
export async function addOrUpdateAudit(data?: Record<string, any>) {
  return request<any>(`/antelope-finance/app/mng/addOrUpdateAudit`, {
    method: 'post',
    data,
  });
}

/**
 * 数据统计
 */
 export async function getLoanOrderCount() {
  return request<AppFinancialMng.ResultList>('/antelope-finance/loanOrder/mng/count', {
    method: 'get',
  });
}

/**
 * 金融订单列表 applyTimeStart applyTimeEnd
 */
 export async function getLoanOrderList(data?: Record<string, any>) {
  return request<any>(`/antelope-finance/loanOrder/mng/list`, {
    method: 'post',
    data,
  });
}

/**
 * 删除金融订单
 */
 export async function deleteLoanOrder(applyNo: string) {
  return request<AppFinancialMng.ResultList>(`/antelope-finance/loanOrder/mng/delete?applyNo=${applyNo}`, {
    method: 'get',
  });
}