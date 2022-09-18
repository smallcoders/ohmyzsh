// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import DataColumn from '@/types/data-column';
import { request } from 'umi';

/** 获取列表 */
export async function getIndustryTopicData(industry: string) {
  return request<DataColumn.ResultList>(
    `/antelope-science/mng/industryData/list?industry=${industry}`,
  );
}

/**
 * 添加数据类型数据源列表
 */
export async function addIndustryTopic(data?: any) {
  return request<
    {
      result: any[];
    } & Common.ResultCode &
      Common.ResultPage
  >('/antelope-science/mng/industryData/page', {
    method: 'post',
    data,
  });
}
/**
 * 添加数据类型数据源列表 应用
 */
export async function addIndustryTopicForAppInfo(data?: any) {
  return request<
    {
      result: any[];
    } & Common.ResultCode &
      Common.ResultPage
  >('/antelope-science/mng/industryData/appPageData', {
    method: 'post',
    data,
  });
}

/**
 * 保存
 */
export async function saveIndustryTopic(data?: any) {
  return request<Common.ResultCode>('/antelope-science/mng/industryData/save', {
    method: 'post',
    data,
  });
}
