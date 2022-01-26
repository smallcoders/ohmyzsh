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
      result: DiagnosticTasks.DiagnosisTaskDetail;
    }
  >(`/iiep-manage/diagnosis/detail/${id}`);
}

/**
 * 获取诊断机构
 */
export async function getDiagnosisInstitutions() {
  return request<Common.ResultCode & { result: [] }>('/iiep-manage/common/diagnosisInstitutions');
}

/**
 * 获取线上诊断记录
 */
export async function getDiagnosisRecords(data?: { [key: string]: any }) {
  return request<
    Common.ResultCode & Common.ResultPage & { result: DiagnosticTasks.OnlineRecord[] }
  >('/iiep-manage/onlineDiagnosis/pageQuery', {
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
  >(`/iiep-manage/onlineDiagnosis/getXTYSkipUrl?id=${id}`);
}

/**
 * 诊断记录关联诊断报告pdf文件
 */
export async function addOrUpdateReportFile(data?: { [key: string]: any }) {
  return request<Common.ResultCode & { result: DiagnosticTasks.OnlineRecord[] }>(
    '/iiep-manage/onlineDiagnosis/appendReportFile',
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
  return request<Common.ResultCode>(`/iiep-manage/onlineDiagnosis/deleteReportFile?id=${id}`, {
    method: 'delete',
  });
}
