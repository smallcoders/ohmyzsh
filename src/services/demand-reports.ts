import type Common from '@/types/common';
// import type OrgTypeManage from '@/types/org-type-manage';
import { request } from 'umi';

/**
 * 供需对接报表 - 总表
 */
export async function getDemandReportsTotalList(data?: Record<string, any>) {
  return request<Common.ResultCode & { result: any }>(
    '/antelope-manage/needTable/totalNumber', {
      method: 'post',
      data,
    }
  );
}

// 导出-服务管理-意向消息导出
export async function exportTotalTable() {
  return request<any>('/antelope-manage/intendMessage/export',{
    method: 'post',
    data: {},
    responseType: 'blob',
    getResponse: true,
  })
}


/**
 * 供需对接报表 - 明细表
 */
export async function getDetailList(data?: Record<string, any>) {
  return request<Common.ResultCode & { result: any }>(
    '/antelope-manage/needTable/detailTable', {
      method: 'post',
      data,
    }
  );
}
