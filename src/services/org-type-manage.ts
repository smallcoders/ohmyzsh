// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import OrgTypeManage from '@/types/org-type-manage';
import { request } from 'umi';

/** 查询机构类型列表 */
export async function getOrgTypeList() {
  return request<Common.ResultCode & { result: OrgTypeManage.Content[] }>(
    '/antelope-manage/org/type/list',
  );
}

/**
 * 添加机构类型
 * @returns
 */
export async function addOrgType(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/org/type/add`, {
    method: 'post',
    data,
  });
}

/**
 * 编辑
 * @returns
 */
export async function updateOrgType(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/org/type/update`, {
    method: 'put',
    data,
  });
}

/**
 * 删除
 * */
export async function removeOrgType(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/org/type/delete?id=${id}`, {
    method: 'DELETE',
  });
}

/**
 * 排序
 * */
export async function sortOrgType(ids: string[]) {
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/org/type/sort`, {
    method: 'post',
    data: ids,
  });
}

/**
 * 查询机构类型选项
 * */
export async function getOrgTypeOptions() {
  return request<{ result: { id: string; name: string }[] }>('/antelope-manage/org/type/options');
}
