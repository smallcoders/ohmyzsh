
import type Common from '../common';

namespace User {
    export type RecordList = {
        result: Content[];
    } & Common.ResultCode &
        Common.ResultPage;

    export enum PlatRole {
        ORG_MEMBER = 'ORG_MEMBER', //组织成员
        ORG_MANAGER = 'ORG_MANAGER', //企业管理员
        EXPERT = 'EXPERT', //专家
        INDIVIDUAL = 'INDIVIDUAL'//普通
    }

    export const PlatRoleJson = {
        ORG_MEMBER: '组织其他成员',
        ORG_MANAGER: '组织管理员',
        EXPERT: '已认证专家',
        INDIVIDUAL: '普通用户'
    }

    export type Content = {
        id: number	//用户id
        loginName: string	//登录名
        status: string	//用户状态
        name: string	//用户姓名
        phone: string	//手机号
        createTime: string	//注册时间
        registerSource: string	//注册来源
        userIdentities: string[]	//用户身份
        orgId: number	//企业id
        orgName: string	//企业名称
        expertId: number	//专家id
        expertName: string	//认证专家名
    };

    export type SearchBody = {
        id?: number	//用户id
        name?: string	//用户姓名
        phone?: string	//手机号
        createTimeStart?: string	//注册时间[开始]
        createTimeEnd?: string	//注册时间[结束]
        registerSource?: string	//注册来源
        orgName?: string	//企业名称
        userIdentity?: string
        activeChannelId?: string
        activeSceneId?: string
    };
}
export default User;

