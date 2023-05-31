import { request } from 'umi';

/** 获取 列表 */
export async function getActiveData(data?: Record<string, any>) {
  return request('/antelope-finance/active/mng/page', {
    method: 'post',
    data,
  });
}

// 导出
export async function exportFile(data:any) {
  return request('/antelope-finance/active/mng/export', {
    method: 'post',
    data
  });
}



// 详情
export async function getDetail(scUserId: string | undefined) {
  return request(
    `/antelope-finance/active/mng/detail?scUserId=${scUserId}`,
    {
      method: 'get',
    },
  );
}
