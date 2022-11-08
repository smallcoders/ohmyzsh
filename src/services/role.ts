import { request } from "umi";

export async function addRole(data?: { [key: string]: any }) {
    return request<any>(`/antelope-manage/mng/role/addRole`, {
        method: 'post',
        data,
    });
}

export async function updateRole(data?: { [key: string]: any }) {
    return request<any>(`/antelope-manage/mng/role/updateRole`, {
        method: 'post',
        data,
    });
}

/**
 * 获取所有角色
 * @returns 
 */
export async function getListRoles() {
    return request(`/antelope-manage/mng/role/listRoles`, {
        method: 'GET'
    });
}

export async function deleteRole(id: string) {
    return request(`/antelope-manage/mng/role/deleteRole?id=${id}`, {
        method: 'GET'
    });
}

export async function getRoleById(id: string) {
    return request(`/antelope-manage/mng/role/getRole?id=${id}`, {
        method: 'GET'
    });
}

export async function enableRole(data?: { [key: string]: any }) {
    return request<any>(`/antelope-manage/mng/role/enableRole`, {
        method: 'post',
        data,
    });
}

export async function getMembersByRoleId(id: string) {
    return request(`/antelope-manage/mng/role/listMembers?roleId=${id}`, {
        method: 'GET'
    });
}

export async function removeMember(data?: { [key: string]: any }) {
    return request<any>(`/antelope-manage/mng/role/removeMember`, {
        method: 'post',
        data,
    });
}

export async function getListMemberCandidates() {
    return request<any>(`/antelope-manage/mng/role/listMemberCandidates`, {
        method: 'GET',
    });
}

export async function updateMembers(data?: { [key: string]: any }) {
    return request<any>(`/antelope-manage/mng/role/updateMembers`, {
        method: 'post',
        data,
    });
}


