import type Common from '@/types/common';
import type supplierManagement from '@/types/supplier-management';
import { request } from 'umi';

/** 获取 列表 */
export async function getSupplierPage(data?: Record<string, any>) {
  return request<supplierManagement.ResultList>('/antelope-finance/mng/supplier/page', {
    method: 'post',
    data,
  });
}

/**
 * 删除
 * @param params
 */
export async function removeSupplier(id: number) {
  return request<Common.ResultCode>(`/antelope-finance/mng/supplier/deleteSupplier?id=${id}`, {
    method: 'get',
  });
}

// 从供应链查询供应商信息
export async function queryGyl(data?: Record<string, any>) {
  return request<Common.ResultCode>('/antelope-finance/mng/supplier/queryGyl', {
    method: 'post',
    data,
  });
}

// 天眼查
export async function queryOrg(data?: Record<string, any>) {
  return request<Common.ResultCode>('/antelope-other/org/queryOrg', {
    method: 'post',
    data,
  });
}

// 新增/编辑
export async function saveOrUpdateSupplier(data?: Record<string, any>) {
  return request<supplierManagement.DrawerContent & Common.ResultCode>(
    '/antelope-finance/mng/supplier/saveOrUpdateSupplier',
    {
      method: 'post',
      data,
    },
  );
}

// 查询供应商详情
export async function detailSupplier(id: number) {
  return request<Common.ResultCode>(`/antelope-finance/mng/supplier/getSupplierDetail?id=${id}`, {
    method: 'get',
  });
}

// 获取模板文件
export async function getTemplateFile(fileType: string = 'gyl') {
  return request<Common.ResultCode>(
    `/antelope-finance/myLoan/getTemplateFile?fileType=${fileType}`,
    {
      method: 'get',
    },
  );
}
