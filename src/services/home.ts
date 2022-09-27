import { request } from 'umi';

// 首页

// 查询业务咨询昨日新增数据
export function getAddedDataYesterday() {
  const key = 'rpc-tag'
  return request('/antelope-manage/home/addedDataYesterday',{
    method: 'GET',
    headers: {
      [key]: 'yushen'
    }
  })
}

// 查询平台关键数据统计
export function getStatistics() {
  const key = 'rpc-tag'
  return request('/antelope-manage/home/statistics',{
    method: 'GET',
    headers: {
      [key]: 'yushen'
    }
  })
}