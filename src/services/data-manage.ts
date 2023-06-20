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

/** 更新数据 */
export async function updateOverviewData(data?: { [key: string]: any }) {
  return request<any>('/antelope-report/mng/largeScreen/updateOverviewData', {
    method: 'post',
    data,
  });
}

/** 分页查询交易列表 */
export async function getTradeList(data?: { [key: string]: any }) {
  return request<any>('/antelope-report/mng/trade/pageQuery', {
    method: 'post',
    data,
  });
}

/** 通过ID批量删除 */
export async function deleteByIds(data?: { [key: string]: any }) {
  return request<any>('/antelope-report/mng/trade/deleteByIds', {
    method: 'post',
    data,
  });
}
