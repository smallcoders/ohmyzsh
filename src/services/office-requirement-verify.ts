// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import Common from '@/types/common';

/**
 * 企业需求审核审核列表
 * @param data
 * @returns
 */
export async function getOfficeRequirementVerifyList(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/demand/pageAudit', {
    method: 'post',
    data,
  });
}

/**
 * 企业需求审核详情
 */
export async function getOfficeRequirementVerifyDetail(id: string) {
  return request<any>(`/antelope-manage/demand/detail?id=${id}`);
}

/**
 * 需求管理列表
 * @param data
 * @returns
 */
 export async function getRequirementManagementList(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/demand/pageManage', {
    method: 'post',
    data,
  });
}

/**
 * 需求管理-需求类型编辑
 * @param data
 * @returns
 */
 export async function demandEditType(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/demand/editType', {
    method: 'post',
    data,
  });
}

/**
 * 需求管理-权重编辑
 * @param data
 * @returns
 */
 export async function demandEditSort(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/demand/editSort', {
    method: 'post',
    data,
  });
}

/**
 * 需求管理-对接状态编辑
 * @param data
 * @returns
 */
 export async function demandEditConnectState(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/demand/editConnectState', {
    method: 'post',
    data,
  });
}

/**
 * 需求管理-上架
 * @param data
 * @returns
 */
 export async function demandUpper(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/demand/upper', {
    method: 'post',
    data,
  });
}

/**
 * 需求管理-下架
 * @param data
 * @returns
 */
 export async function demandDown(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/demand/down', {
    method: 'post',
    data,
  });
}

/**
 * 对接记录列表
 * @param data
 * @returns
 */
 export async function getConnectRecord(id: string) {
  return request<any>(`/antelope-manage/demand/connectRecord/?demandId=${id}`, {
    method: 'get',
  });
}

/**
 * 对接记录列表-添加
 * @param data
 * @returns
 */
 export async function addConnectRecord(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/demand/connectRecord', {
    method: 'post',
    data,
  });
}

/**
 * 对接记录列表-删除
 * @param data
 * @returns
 */
 export async function deleteConnectRecord(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/demand/connectRecord?demandConnectId=${id}`, {
    method: 'DELETE'
  });
}



