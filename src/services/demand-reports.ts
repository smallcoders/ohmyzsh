import type Common from '@/types/common';
import type SummaryReportList from '@/types/summary-report';
import { request } from 'umi';

/**
 * 供需对接报表 - 总表
 */
export async function getDemandReportsTotalList() {
  return request<Common.ResultCode & { result: SummaryReportList.Content[] }>(
    '/antelope-manage/demand/report/overview', {
      method: 'GET'
    }
  );
}

/**
 * 供需对接报表 - 导出 - 总表
 */
export async function exportTotalTable() {
  return request<any>('/antelope-manage/demand/report/overview/export',{
    method: 'get',
    data: {},
    responseType: 'blob',
    getResponse: true,
  });
}

/**
 * 供需对接报表 - 明细表
 */
export async function getDetailList(data?: Record<string, any>) {
  return request<Common.ResultCode & { result: any }>(
    '/antelope-manage/demand/report/detail', {
      method: 'post',
      data,
    }
  );
}

/**
 * 供需对接报表 - 导出 - 明细表
 */
export async function exportDetailTable() {
  return request<any>('/antelope-manage/demand/report/detail/export',{
    method: 'post',
    data: {},
    responseType: 'blob',
    getResponse: true,
  });
}

/**
 * 供需对接报表 - 周报表
 */
export async function getDemandReportsWeaksList(params?: Record<string, any>) {
  return request<Common.ResultCode & { result: any }>('/antelope-manage/demand/report/weekly', {
    method: 'get',
    params,
  });
}

/**
 * 供需对接报表 - 月报表
 */
export async function getDemandReportsMonthList(params?: Record<string, any>) {
  return request<Common.ResultCode & { result: any }>('/antelope-manage/demand/report/monthly', {
    method: 'get',
    params,
  });
}
