// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import OrgManage from '@/types/org-manage';
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

/**
 * 查询组织详情
 * */
export async function getOrgDetail(orgId?: any) {
  return request<any>(`/antelope-user/mng/org/detail?orgId=${orgId}`, {
    method: 'get',
  });
}

/**
 * 获取组织分页
 * */
export async function getOrgManagePage(data?: any) {
  return request<OrgManage.RecordList>(`/antelope-user/mng/org/page`, {
    method: 'get',
    params: data,
  });
}

/**
 * 标记
 * */
export async function signOrgTag(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/antelope-user/mng/org/sign`, {
    method: 'put',
    data,
  });
}

/**
 * 查询组织成员信息（组织名称、管理员名称）
 * */
export async function getOrgManageInfo(orgId?: string) {
  return request<any>(`/antelope-user/mng/org/member/info?orgId=${orgId}`, {
    method: 'get',
  });
}

/**
 * 查询组织成员列表
 * */
export async function getOrgMemberPage(data: any) {
  return request<any>(`/antelope-user/mng/org/member/page`, {
    method: 'post',
    data,
  });
}

/**
 * 查询组织操作日志）
 * */
export async function getOrgOperationLog(orgId?: any) {
  return request<any>(`/antelope-user/mng/org/operation/log?orgId=${orgId}`, {
    method: 'get',
  });
}

/**
 * 审核
 * */
export async function putOrgAudit(data?: { [key: string]: any }) {
  return request<any>(`/antelope-user/mng/org/member/audit`, {
    method: 'put',
    data,
  });
}

/**
 * 查询管理员交接可选列表
 * */
export async function postChangeAdminList(data: any) {
  return request<any>(`/antelope-user/mng/org/changeAdminList`, {
    method: 'post',
    data,
  });
}

/**
 * 管理员交接
 * */
export async function putChangeAdmin(data:{orgId:any,userId:any}) {
  return request<Common.ResultCode & { result: any }>(`/antelope-user/mng/org/changeAdmin?orgId=${data.orgId}&userId=${data.userId}`, {
    method: 'put',
  });
}
