// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import DataColumn from '@/types/data-column';
import { request } from 'umi';

/** 获取列表 */
export async function getDataColumnPage() {
  return request<DataColumn.ResultList>('/iiep-manage/dataBar');
}

/**
 * 添加
 */
export async function addDataColumn(data?: DataColumn.Content[]) {
  return request<Common.ResultCode>('/iiep-manage/dataBar', {
    method: 'post',
    data,
  });
}

/**
 * 修改
 */
export async function updateDataColumn(data?: DataColumn.Content) {
  return request<Common.ResultCode>('/iiep-manage/dataBar', {
    method: 'put',
    data,
  });
}

/**
 * 删除
 * */
export async function removeDataColumn(id: string) {
  return request<Common.ResultCode>(`/iiep-manage/dataBar/${id}`, {
    method: 'DELETE',
  });
}

export async function getDataColumnIntroduce() {
  return request<DataColumn.IntroduceResultList>('/iiep-manage/createDataBar');
}

/**
 * 修改
 */
export async function updateDataColumnIntroduce(data?: DataColumn.IntroduceContent) {
  return request<Common.ResultCode>('/iiep-manage/createDataBar', {
    method: 'put',
    data,
  });
}
