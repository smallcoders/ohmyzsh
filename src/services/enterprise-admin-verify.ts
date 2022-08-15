// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import EnterpriseAdminVerify from '@/types/enterprise-admin-verify.d';
import { request } from 'umi';

/**
 * 分页查询列表接口
 * @param data
 * @returns
 */
export async function getEnterpriseAdminVerifyPage(data?: { [key: string]: any }) {
  return request<EnterpriseAdminVerify.RecordList>('/antelope-manage/orgManagerRequest', {
    method: 'post',
    data,
  });
}

/**
 * 详情接口
 */
export async function getEnterpriseAdminVerifyDetail(id: string) {
  return request<Common.ResultCode & { result: any }>(
    `/antelope-manage/orgManagerRequest?id=${id}`,
  );
}

/**
 * 审核接口
 */
export async function handleAuditEnterpriseAdminVerify(data?: { [key: string]: any }) {
  return request<Common.ResultCode>('/antelope-manage/orgManagerRequest/check', {
    method: 'post',
    data,
  });
}





