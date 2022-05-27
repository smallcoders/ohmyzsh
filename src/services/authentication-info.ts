// @ts-ignore
/* eslint-disable */
import AuthenticationInfo from '@/types/authentication-info';
import Common from '@/types/common';
import UserFeedback from '@/types/user-feedback';
import { request } from 'umi';

/** 认证信息列表 */
export async function getAuthenticationInfoPage(data?: { [key: string]: any }) {
  return request<AuthenticationInfo.RecordList>('/iiep-manage/authentication/page', {
    method: 'post',
    data,
  });
}

/**
 * 查询工业企业详情
 * @param id
 * @param remark
 * @returns
 */
export async function getEnterpriseDetail(id: string) {
  return request<Common.ResultCode & { result: any }>(
    `/iiep-manage/authentication/detail/enterprise?id=${id}`,
  );
}

/**
 * 查询服务机构详情
 * @param id
 * @param remark
 * @returns
 */
export async function getInstitutionDetail(id: string) {
  return request<Common.ResultCode & { result: any }>(
    `/iiep-manage/authentication/detail/institution?id=${id}`,
  );
}

/**
 * 查询专家详情
 * @param id
 * @param remark
 * @returns
 */
export async function getExpertDetail(id: string) {
  return request<Common.ResultCode & { result: any }>(
    `/iiep-manage/authentication/detail/expert?id=${id}`,
  );
}

/**
 * 编辑工业企业
 * @param id
 * @param remark
 * @returns
 */
export async function updateEnterprise(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(
    `/iiep-manage/authentication/update/enterprise`,
    {
      method: 'put',
      data,
    },
  );
}

/**
 * 编辑服务机构
 * @param id
 * @param remark
 * @returns
 */
export async function updateInstitution(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(
    `/iiep-manage/authentication/update/institution`,
    {
      method: 'put',
      data,
    },
  );
}

/**
 * 编辑专家
 * @param id
 * @param remark
 * @returns
 */
export async function updateExpert(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: any }>(`/iiep-manage/authentication/update/expert`, {
    method: 'put',
    data,
  });
}
