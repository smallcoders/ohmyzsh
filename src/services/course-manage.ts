// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import CourseManage from '@/types/service-config-course-manage';
import { request } from 'umi';

/** 获取课程列表 */
export async function getCoursePage(data?: { [key: string]: any }) {
  return request<CourseManage.ResultList>('/antelope-manage/course/list', {
    method: 'get',
    params: { ...(data || {}) },
  });
}

/**
 * 添加课程
 */
export async function addCourse(data?: CourseManage.Content) {
  return request<Common.ResultCode & { result: string }>('/antelope-manage/course', {
    method: 'post',
    data,
  });
}

/**
 * 修改课程
 */
export async function updateCourse(data?: CourseManage.Content) {
  return request<Common.ResultCode & { result: string }>('/antelope-manage/course', {
    method: 'put',
    data,
  });
}

/**
 * 添加课程
 */
export async function addChapters(data?: {
  courseId: string;
  chapters: CourseManage.Chapter[];
  state: boolean;
}) {
  return request<Common.ResultCode & { result: string }>('/antelope-manage/course/chapter', {
    method: 'post',
    data,
  });
}

/**
 * 删除课程
 * */
export async function removeCourse(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/course/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改课程状态
 * */
export async function updateCourseState(id: string, state: boolean) {
  return request<Common.ResultCode>(`/antelope-manage/course/state`, {
    method: 'put',
    data: {
      id,
      state,
    },
  });
}
/**
 * 获取课程类别
 */
export async function getCourseType() {
  return request<Common.ResultCode>(`/antelope-manage/common/dictionary/tree?label=${1}`);
}

/**
 * 获取搜索课程类别
 */
export async function getSearchCourseType() {
  return request<Common.ResultCode>(`/antelope-manage/common/dictionary/first?label=${1}`);
}

/**
 * 根据id 获取课程
 * @param id
 * @returns
 */
export async function getCourseById(id: string) {
  return request<Common.ResultCode & { result: CourseManage.Content }>(
    `/antelope-manage/course?id=${id}`,
  );
}

/**
 * 根据courseId 获取课程
 * @param courseId
 * @returns
 */
export async function getChaptersById(courseId: string) {
  return request<
    Common.ResultCode & { result: { chapters: CourseManage.Chapter[]; state: boolean | undefined } }
  >(`/antelope-manage/course/chapters?courseId=${courseId}`);
}

/**
 * 设置课程置顶
 * */
export async function setCourseTop(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/course/top`, {
    method: 'put',
    data: {
      id,
      topState: true,
    },
  });
}
