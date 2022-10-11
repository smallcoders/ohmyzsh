// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import ExpertResource from '@/types/expert_manage/expert-resource';
import { request } from 'umi';

/** 获取咨询记录分页 */
export async function getExpertResourcePage(data?: { [key: string]: any }) {
  return request<ExpertResource.RecordList>('/antelope-manage/expert/showPage', {
    method: 'post',
    data,
  });
}

/** 获取咨询记录分页 */
export async function updateKeyword(data?: { [key: string]: any }) {
  return request<any>('/antelope-manage/expert/update/keyword', {
    method: 'put',
    data,
  });
}


/**
 * 专家详情
 * @param id
 * @param remark
 * @returns
 */
export async function getExpertDetail(id: string) {
  return request<Common.ResultCode & { result: ExpertResource.Detail }>(
    `/antelope-manage/expert/show?id=${id}`,
  );
}

/**
 * 置顶
 * @param id
 * @returns
 */
export async function showTop(id: string) {
  return request<Common.ResultCode & { result: any }>(`/antelope-manage/expert/showTop?id=${id}`);
}

// 专家-设置排序权重
export async function getExportSort(params:{
  id?: string,
  sort?: string
}) {
  return request<any>('/antelope-manage/expert/setSort',{
    method: 'get',
    params,
  })
}
