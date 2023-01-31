import { request } from 'umi';
import type MaterialLibrary from '@/types/material-library';
import { any } from 'glamor';

/**
 * 列表
 */
export async function materialList(data?: Record<string, any>) {
  return request<MaterialLibrary.ResultList>(
    '/antelope-common/mng/common/material/queryByGroupsId',
    {
      method: 'post',
      data,
    },
  );
}
/**
 * 查询素材总数量
 */
export async function totalNumber() {
  return request<MaterialLibrary.TotalNumber>(`/antelope-common/mng/common/material/totalNumber`, {
    method: 'get',
  });
}

/**
 * 查询所有分组信息
 * @returns
 */
export async function listAll() {
  return request<MaterialLibrary.ListAll>('/antelope-common/mng/common/materialGroup/listAll', {
    method: 'get',
  });
}

/**
 * 新增分组
 * @returns
 */
export async function addMaterialGroup(data?: Record<string, any>) {
  return request<any>('/antelope-common/mng/common/materialGroup/add', {
    method: 'post',
    data,
  });
}

/**
 * 修改分组
 * @returns
 */
export async function editMaterialGroup(data?: Record<string, any>) {
  return request<any>('/antelope-common/mng/common/materialGroup/edit', {
    method: 'put',
    data,
  });
}
/**
 * 删除分组
 * @returns
 */
export async function removeMaterialGroup(groupId: number) {
  return request<any>(`/antelope-common/mng/common/materialGroup/remove?groupId=${groupId}`, {
    method: 'delete',
  });
}

/**
 * 批量删除
 * @returns
 */
export async function deleteBatch(data?: Record<string, any>) {
  return request<any>('/antelope-common/mng/common/material/deleteBatch', {
    method: 'post',
    data,
  });
}

/**
 * 素材移动分组
 * @returns
 */
export async function moveGroup(data?: Record<string, any>) {
  return request<any>('/antelope-common/mng/common/material/group', {
    method: 'post',
    data,
  });
}

/**
 * 重命名素材
 */
export async function renameMaterial(materialId: number, rename: string) {
  return request<any>(
    `/antelope-common/mng/common/material/rename?materialId=${materialId}&rename=${rename}`,
    {
      method: 'get',
    },
  );
}
