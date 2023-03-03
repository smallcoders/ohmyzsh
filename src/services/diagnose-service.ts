import { request } from 'umi';
// ----------------------诊断服务包----------------------------
/**
 * 分页查询
 * @param params
 */
export async function getServiceQueryPage(data?: { [key: string]: any }) {
  return request('/antelope-diagnose/mng/service/queryPage', {
    method: 'POST',
    data,
  });
}

/**
 * 根据id查询诊断包详情
 * @param options
 */
export async function getServiceDetail(id: string) {
  return request(`/antelope-diagnose/mng/service/queryDetail?packageNo=${id}`, {
    method: 'GET',
  });
}
/**
 * 保存、编辑服务包内容
 * @param data
 */
export async function saveServicePackage(data?: { [key: string]: any }) {
  return request('/antelope-diagnose/mng/service/save/ServicePackage', {
    method: 'POST',
    data,
  });
}

// ----------------------诊断服务报表----------------------------
/**
 * 分页查询
 * @param params
 */
export async function getActivityManageList(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  return request('/antelope-diagnose/mng/hefei/diagnose/report/statistics', {
    method: 'POST',
    data: {
      pageSize: params.pageSize,
      pageIndex: params.current,
    },
  }).then((e: { code: number; totalCount: any; result: any }) => ({
    success: e.code === 0,
    total: e.totalCount,
    data: e.result,
  }));
}

/**
 * 诊断服务详情
 */

enum DiagnosisResultStatus {
  Undiagnosed, // 未诊断
  Diagnosed, //已诊断
}

export async function getDiagnosisServiceDetail(params: {
  packageNo: string;
  providerId: string;
  diagnosed?: DiagnosisResultStatus | null;
  pageSize: number;
  pageIndex: number;
}) {
  return request('/antelope-diagnose/mng/hefei/diagnose/service/detail', {
    method: 'POST',
    data: params,
  });
}

/**
 * 诊断服务结果
 */
export async function getDiagnosisResult(recordNo: string | undefined) {
  return request(`/antelope-diagnose/mng/hefei/diagnose/service/result?recordNo=${recordNo}`, {
    method: 'GET',
  });
}
