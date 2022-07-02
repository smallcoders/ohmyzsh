// @ts-ignore
/* eslint-disable */
import type Common from '@/types/common';
import CourseManage from '@/types/service-config-course-manage';
import { request } from 'umi';

export const httpUploadWithDetail = (
  data: FormData,
  onUploadProgress?: (props: any) => void,
  cancelToken?: any,
) => {
  return request(`/antelope-manage/common/upload/record`, {
    method: 'post',
    data,
    onUploadProgress,
    cancelToken,
  });
};

/**
 * 下载
 */
export async function downloadFile(fileId: string) {
  return request<CourseManage.ResultList>(`/antelope-manage/common/download/${fileId}`, {
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
  return request<CourseManage.ResultList>(`/antelope-manage/common/dictionaryEnum?label=${label}`, {
    method: 'get',
  });
}

/**
 * 字典查询
 * @param label
 * @returns
 */
export async function getDictionay(label: string) {
  return request<CourseManage.ResultList>(`/antelope-manage/common/dictionary?label=${label}`, {
    method: 'get',
  });
}

/**
 * 字典树查询
 * @param label
 * @returns
 */
export async function getDictionayTree(label: string) {
  return request<CourseManage.ResultList>(`/antelope-manage/common/dictionaryTree?label=${label}`, {
    method: 'get',
  });
}

/**
 * 获取三级树形地区列表。省、市、区/县
 * @param label
 * @returns
 */
export async function listAllAreaCode() {
  return request<CourseManage.ResultList>(`/antelope-common/common/district/listAllAreaCode`, {
    method: 'get',
  });
}
/**
 * 上传附件
 * @param data FormData
 * @returns
 */
export async function uploadFile(data) {
  return request<Common.ResultCode & { result: { path: string } }>(
    `/antelope-manage/common/upload/record`,
    {
      method: 'POST',
      data,
    },
  );
}
