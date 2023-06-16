// @ts-ignore
/* eslint-disable */
import AuthenticationInfo from '@/types/authentication-info';
import { request } from 'umi';

/** 数据管理列表 */
export async function getAuthenticationInfoPage(data?: { [key: string]: any }) {
  return request<AuthenticationInfo.RecordList>('/antelope-user/mng/dataManage/pageQuery', {
    method: 'post',
    data,
  });
}

/**
 * 查询所有配置数据
 */
export async function getListAllOverviewData(params?: any) {
  return request<any>('/antelope-report/mng/largeScreen/listAllOverviewData', {
    method: 'get',
    params,
  });
}


