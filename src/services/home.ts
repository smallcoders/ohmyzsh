import { request } from 'umi';

// 首页

// 查询业务咨询昨日新增数据
export function getAddedDataYesterday() {
  return request('/antelope-manage/home/addedDataYesterday',{
    method: 'GET',
  })
}

// 查询平台关键数据统计
export function getStatistics() {
  return request('/antelope-manage/home/statistics',{
    method: 'GET',
  })
}