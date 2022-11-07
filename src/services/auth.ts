import { request } from "umi";

//查询权限配置表单元数据
export async function getPermissionConfigForm() {
    return request(`/antelope-manage/mng/permission/getPermissionConfigForm`, {
        method: 'GET'
    });
}

export async function getPermissionById(id: string) {
    return request(`/antelope-manage/mng/permission/listPermissionsByRoleId?roleId=${id}`, {
        method: 'GET'
    });
}

export async function updatePermissions(data?: { [key: string]: any }) {
    return request<any>(`/antelope-manage/mng/permission/updatePermissions`, {
        method: 'post',
        data,
    });
}

