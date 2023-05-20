// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
/**
 * 新增渠道商配置接口
 * @param data
 * @returns
 */
export async function AddChannelBusiness(data?: { [key: string]: any }) {
  return request<any>('/antelope-channel/channelBusiness/add', {
    method: 'post',
    data,
  });
}

/**
 * 更新渠道商配置接口
 * @param data
 * @returns
 */
export async function UpdateChannelBusiness(data?: { [key: string]: any }) {
  return request<any>('/antelope-channel/channelBusiness/update', {
    method: 'post',
    data,
  });
}

/**
 * 渠道商池支持多条件查询接口
 * @param params
 * @returns
 */
export async function queryChannelBusiness(data?: { [key: string]: any }) {
  return request<any>('/antelope-channel/channelBusiness/query', {
    method: 'POST',
    data,
  });
}

/**
 * 获取城市
 * @param params
 * @returns
 */
export async function getCities(provinceId: any) {
  return request<any>(`/antelope-common/common/district/districtTree?parentCode=${provinceId}&endLevel=COUNTY`, {
    method: 'get',
  });
}

/**
 * 模糊查询企业列表
 * @param params
 * @returns
 */
export async function queryOrgList(orgName: string) {
  return request<any>(`/antelope-user/org/fuzzy/orgList`, {
    method: 'get',
    params: {
      pageIndex: 1,
      pageSize: 1000,
      orgName
    }
  });
}
