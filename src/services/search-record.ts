// @ts-ignore
/* eslint-disable */
import Common from '@/types/common';
import DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import { request } from 'umi';

/** 获取诊断任务详情 */
export async function getDiagnosticTasksPage(data?: { [key: string]: any }) {
  return request<DiagnosticTasks.ResultList>('/antelope-manage/diagnosis/page', {
    method: 'post',
    data,
  });
}

/**
 * 添加诊断任务
 */
export async function addDiagnosticTasks(data?: DiagnosticTasks.Content) {
  return request<Common.ResultCode>('/antelope-manage/diagnosis/save', {
    method: 'post',
    data,
  });
}

/**
 * 修改诊断任务
 */
export async function updateDiagnosticTasks(data?: DiagnosticTasks.Content) {
  return request<Common.ResultCode>('/antelope-manage/diagnosis/update', {
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
  >(`/antelope-manage/common/orgInfo/list?name=${name}`);
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
  >(`/antelope-manage/common/expert/list?name=${name}`);
}

/**
 * 删除诊断任务
 * */
export async function removeDiagnosisTasks(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/diagnosis/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改状态
 */
export async function updateState(options?: { [key: string]: any }) {
  return request<Common.ResultCode>('/antelope-manage/newsInformation/updateState', {
    method: 'get',
    params: { ...(options || {}) },
  });
}

/**
 * 获取搜索
 * @param id 诊断任务id
 * @returns
 */
export async function getDiagnosisRecordById(id: string) {
  return request<
    Common.ResultCode & {
      result: DiagnosticTasks.DiagnosisTaskDetail;
    }
  >(`/antelope-manage/diagnosis/detail/${id}`);
}

/**
 * 获取诊断机构
 */
export async function getDiagnosisInstitutions() {
  return request<Common.ResultCode & { result: [] }>(
    '/antelope-manage/common/diagnosisInstitutions',
  );
}

/**
 * 获取搜索记录列表
 */
export async function getDiagnosisRecords(data?: { [key: string]: any }) {
  return request<
    Common.ResultCode & Common.ResultPage
  >('/antelope-live/web/operationRecord/pageRecord', {
    method: 'post',
    data,
  });
}

/**
 * 获取搜索记录-用户搜索记录
 */
 export async function getPersonalSearchRecords(data?: { [key: string]: any }) {
  return request<
    Common.ResultCode & Common.ResultPage
  >('/antelope-live/web/operationRecord/pageUserRecord', {
    method: 'post',
    data,
  });
}

/**
 * 获取信通院跳转链接
 * @param  id 企业id
 * @returns
 */
export async function getXTYSkipUrl(id: string) {
  return request<
    Common.ResultCode & {
      result: string;
    }
  >(`/antelope-manage/onlineDiagnosis/getXTYSkipUrl?id=${id}`);
}

/**
 * 诊断记录关联诊断报告pdf文件
 */
export async function addOrUpdateReportFile(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: DiagnosticTasks.OnlineRecord[] }>(
    '/antelope-manage/onlineDiagnosis/appendReportFile',
    {
      method: 'post',
      data,
    },
  );
}

/**
 * 删除诊断报告，诊断记录还原为诊断中状态
 */
export async function deleteReportFile(id: string) {
  return request<Common.ResultCode>(`/antelope-manage/onlineDiagnosis/deleteReportFile?id=${id}`, {
    method: 'delete',
  });
}
