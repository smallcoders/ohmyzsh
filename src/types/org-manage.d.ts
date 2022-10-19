namespace OrgManage {
    export type RecordList = {
        result: Content[];
      } & Common.ResultCode &
        Common.ResultPage;
    export enum OrgManageTypeEnum {
        DIGITIZATION = 'DIGITIZATION',
        PURCHASE = 'PURCHASE',
        SCIENCE = 'SCIENCE',
        FINANCE = 'FINANCE',
    }

    export const orgManageTypeJson = {
        [OrgManageTypeEnum.DIGITIZATION]: '数字化',
        [OrgManageTypeEnum.PURCHASE]: '工品采购服务商',
        [OrgManageTypeEnum.SCIENCE]: '科产服务商',
        [OrgManageTypeEnum.FINANCE]: '羚羊金融服务商',
    }
    export type Content = {
        id?: integer// id	
        orgName?: string// 组织名称	
        orgTypeName?: string// 组织类型	
        areaName?: string// 组织注册区域	
        orgSignName?: string// 标注情况 (中文名称组合)	
        orgSignEnumList?: OrgManageTypeEnum[]
    };

    export type searchContent = {
        orgName?: string
        orgTypeId?: string;
        areaCode?: string;
        orgSign?: string;
    }
}
export default OrgManage;