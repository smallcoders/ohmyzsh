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

// 查询用户数据分析-左侧统计数据
export function getUserStatistice(param: string) {
  return request(`/antelope-user/home/analysis/user/statistics?statisticsEnum=${param}`,{
    method: 'GET',
  })
}

// 查询企业需求数据分析-左侧统计数据
export function getDemandStatistics() {
  return request(`/antelope-science/home/analysis/demand/statistics`,{
    method: 'GET',
  })
}

// 查询用户数据分析-折线图
export function getUserLineList({
  startDate = '',
  endDate = '',
}: {
  startDate: string;
  endDate: string;
}) {
  return request(`/antelope-user/home/analysis/user/line`,{
    method: 'GET',
    params: { startDate, endDate },
  })
}

// 查询组织数据分析-折线图
export function getAnalysisOrgList({
  startDate = '',
  endDate = '',
  areaCode = '',
}: {
  startDate: string;
  endDate: string;
  areaCode?: string;
}) {
  return request(`/antelope-user/home/analysis/org/line`,{
    method: 'GET',
    params: { startDate, endDate, areaCode },
  })
}

//查询组织数据分析-左侧统计数据
export function getOrgStatistics(param: string) {
  return request(`/antelope-user/home/analysis/org/statistics?statisticsEnum=${param}`, {
    method: 'GET',
  })
}

//查询企业需求数据分析-折线图
export function getAnalysisDemandList({
  startDate = '',
  endDate = '',
  areaCode = '',
}: {
  startDate: string;
  endDate: string;
  areaCode?: string;
}) {
  return request('/antelope-science/home/analysis/demand/line',{
    method: 'GET',
    params: { startDate, endDate, areaCode },
  })
}