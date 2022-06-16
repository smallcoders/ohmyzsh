// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

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



