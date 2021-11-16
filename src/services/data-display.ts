import Common from '@/types/common';
import DataDisplay from '@/types/data-display';
import { request } from 'umi';

/**
 * 城市名称下拉
 */
export async function getCitys() {
  return request<Common.ResultCode & { result: string[] }>('/iiep-manage/dataList/cityLabel');
}

/**
 * 获取宣传统计 列表
 */
export async function getPublishPage(pageInfo: { pageIndex: number; pageSize: number }) {
  return request<DataDisplay.PublishResultList>('/iiep-manage/dataList/drumbeating/page', {
    method: 'GET',
    params: { ...(pageInfo || {}) },
  });
}

/**
 * 获取热门应用列表 列表
 */
export async function getHotAppPage(pageInfo: { pageIndex: number; pageSize: number }) {
  return request<DataDisplay.HotAppResultList>('/iiep-manage/dataList/hotApp/page', {
    method: 'GET',
    params: { ...(pageInfo || {}) },
  });
}

/**
 * 获取热门政策 列表
 */
export async function getPolicyPage(pageInfo: { pageIndex: number; pageSize: number }) {
  return request<DataDisplay.PolicyResultList>('/iiep-manage/dataList/policyData', {
    method: 'GET',
    params: { ...(pageInfo || {}) },
  });
}

/**
 * 获取各地数据
 */
export async function getCityData(options: { cityName: string }) {
  return request<Common.ResultCode & { result: DataDisplay.CityData }>(
    '/iiep-manage/dataList/cityData',
    {
      method: 'GET',
      params: { ...(options || {}) },
    },
  );
}
