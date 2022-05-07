// @ts-ignore
/* eslint-disable */
import CourseManage from '@/types/service-config-course-manage';
import { request } from 'umi';

/**
 * 下载
 */
export async function downloadFile(fileId: string) {
  return request<CourseManage.ResultList>(`/iiep-manage/common/download/${fileId}`, {
    method: 'get',
    responseType: 'blob',
  });
}

/**
 * 枚举字段查询
 * @param label
 * @returns
 */
export async function getEnumByName(label: string) {
  return request<CourseManage.ResultList>(`/iiep-manage/common/dictionaryEnum?label=${label}`, {
    method: 'get',
  });
}

/**
 * 字典查询
 * @param label
 * @returns
 */
export async function getDictionay(label: string) {
  return request<CourseManage.ResultList>(`/iiep/common/dictionary?label=${label}`, {
    method: 'get',
  });
}
