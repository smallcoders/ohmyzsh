// @ts-ignore
/* eslint-disable */
import AuthenticationInfo from '@/types/authentication-info';
import Common from '@/types/common';
import UserFeedback from '@/types/user-feedback';
import { request } from 'umi';

/** 数据管理列表 */
export async function getAuthenticationInfoPage(data?: { [key: string]: any }) {
  return request<AuthenticationInfo.RecordList>('/antelope-user/mng/dataManage/pageQuery', {
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
    `/antelope-manage/authentication/detail/enterprise?id=${id}`,
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
    `/antelope-manage/authentication/detail/institution?id=${id}`,
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
    `/antelope-manage/authentication/detail/expert?id=${id}`,
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
    `/antelope-manage/authentication/update/enterprise`,
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
    `/antelope-manage/authentication/update/institution`,
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
  return request<Common.ResultCode & { result: any }>(
    `/antelope-manage/authentication/update/expert`,
    {
      method: 'put',
      data,
    },
  );
}

/**
 * 查询可选的单位
 * @param name
 * @returns
 */
export async function getWorkUnit(name: string) {
  return request<Common.ResultCode & { result: any }>(
    `/antelope-manage/authentication/enterprise/queryWorkUnit4Register?workUnit=${name}`,
  );
}
