// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import OrgTypeManage from '@/types/org-type-manage';
import { request } from 'umi';

/** 查询问卷列表 */
export async function getOrgTypeList(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: OrgTypeManage.Content[] }>(
    '/antelope-diagnose/mng/diagnose/queryByState', {
      method: 'post',
      data,
    }
  );
}

/**
 * 添加问卷
 * @returns
 */
export async function addOrgType(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-diagnose/mng/diagnose/save/config`, {
    method: 'post',
    data,
  });
}

/**
 * 问卷详情
 * @returns
 */
export async function diagnoseDetail(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-diagnose/mng/diagnose/detail`, {
    method: 'post',
    data,
  });
}

/**
 * 下架
 * */
export async function removeOrgType(data?: { [key: string]: any }) {
  return request<Common.ResultCode>(`/antelope-diagnose/mng/diagnose/change/status`, {
    method: 'post',
    data,
  });
}

/**
 * 排序
 * */
export async function sortOrgType(list: string[]) {
  return request<Common.ResultCode & { result: any }>(`/antelope-diagnose/mng/diagnose/change/sequence`, {
    method: 'post',
    data: list,
  });
}

// ----------------------诊断记录报表----------------------------
/**
 * 分页查询
 * @param params
 */
 export async function getRecordQueryPage(data?: { [key: string]: any }) {
  return request('/antelope-diagnose/mng/diagnose/report/records', {
    method: 'POST',
    data,
  });
}

/**
 * 导出
 * @param params
 */
export async function exportRecordQueryPage(data?: { [key: string]: any }) {
  return request<any>('/antelope-diagnose/mng/diagnose/report/records/export',{
    method: 'post',
    data,
    responseType: 'blob',
    getResponse: true,
  })
}

/**
 * 根据id查询诊断包详情
 * @param options
 */
 export async function getDiagnoseDetail(id: string) {
  return request(`/antelope-diagnose/mng/diagnose/record/detail/${id}`, {
    method: 'GET',
  });
}

// ----------------------诊断区域报表----------------------------
/**
 * 分页查询
 * @param params
 */
 export async function getReportAreaPage(data?: { [key: string]: any }) {
  return request('/antelope-diagnose/mng/diagnose/report/area', {
    method: 'POST',
    data,
  });
}