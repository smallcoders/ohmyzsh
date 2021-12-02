// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import { request } from 'umi';

/** 获取诊断任务详情 */
export async function getDiagnosticTasksPage(data?: { [key: string]: any }) {
  return request<DiagnosticTasks.ResultList>('/iiep-manage/diagnosis/page', {
    method: 'post',
    data,
  });
}

/**
 * 添加诊断任务
 */
export async function addDiagnosticTasks(data?: DiagnosticTasks.Content) {
  return request<Common.ResultCode>('/iiep-manage/diagnosis/save', {
    method: 'post',
    data,
  });
}

/**
 * 修改诊断任务
 */
export async function updateDiagnosticTasks(data?: DiagnosticTasks.Content) {
  return request<Common.ResultCode>('/iiep-manage/diagnosis/update', {
    method: 'put',
    data,
  });
}

/**
 * 获取企业列表（根据企业名称模糊查询）
 */
export async function searchOrgInfo(name: string) {
  return request<
    Common.ResultCode & {
      result: {
        id: string;
        orgName: string;
      }[];
    }
  >(`/iiep-manage/common/orgInfo/list?name=${name}`);
}

/**
 * 获取企业列表（根据企业名称模糊查询）
 */
export async function searchExpert(name: string) {
  return request<
    Common.ResultCode & {
      result: {
        id: string;
        expertName: string;
        expertPhone: string;
      }[];
    }
  >(`/iiep-manage/common/expert/list?name=${name}`);
}

/**
 * 删除诊断任务
 * */
export async function removeDiagnosisTasks(id: string) {
  return request<Common.ResultCode>(`/iiep-manage/diagnosis/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改状态
 */
export async function updateState(options?: { [key: string]: any }) {
  return request<Common.ResultCode>('/iiep-manage/newsInformation/updateState', {
    method: 'get',
    params: { ...(options || {}) },
  });
}

/**
 * 获取诊断任务详情
 * @param id 诊断任务id
 * @returns
 */
export async function getDiagnosisRecordById(id: string) {
  return request<
    Common.ResultCode & {
      result: {
        experts: DiagnosticTasks.Expert[];
        diagnosisVO: DiagnosticTasks.Content;
        diagnosisRecordDetailVOList: DiagnosticTasks.Record[];
        orgInfoVO: DiagnosticTasks.OrgInfo;
        conclusionVO: DiagnosticTasks.Conclusion;
      };
    }
  >(`/iiep-manage/diagnosis/record/${id}`);
}
