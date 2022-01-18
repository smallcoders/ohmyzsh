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
