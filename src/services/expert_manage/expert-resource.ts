// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import ExpertResource from '@/types/expert_manage/expert-resource';
import { request } from 'umi';

/** 获取咨询记录分页 */
export async function getExpertResourcePage(data?: { [key: string]: any }) {
  return request<ExpertResource.RecordList>('/iiep-manage/expert/showPage', {
    method: 'post',
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
    `/iiep-manage/expert/show?id=${id}`,
  );
}

/**
 * 置顶
 * @param id
 * @returns
 */
export async function showTop(id: string) {
  return request<Common.ResultCode & { result: any }>(`/iiep-manage/expert/showTop?id=${id}`);
}
