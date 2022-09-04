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
  return request<Common.ResultCode>(`/antelope-diagnose/mng/diagnose`, {
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
