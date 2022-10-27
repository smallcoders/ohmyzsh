namespace DockingManage {
    export type RecordList = {
        result: Content[];
    } & Common.ResultCode &
        Common.ResultPage;
    export const btnList = {
        1: {
            text: '认领',
            method: 'claim'
        },
        2: {
            text: "取消认领",
            method: 'cancelClaim'
        },
        3: {
            text: "需求细化",
            method: 'refine'
        },
        4: {
            text: "分发",
            method: 'distribute',
            render: true
        },
        5: {
            text: "撤回分发",
            method: 'cancelDistribute'
        },
        6: {
            text: "编辑细化内容",
            method: 'editRefine'
        },
        7: {
            text: "需求反馈",
            method: 'feedback'
        },
        8: {
            text: "编辑反馈",
            method: 'editFeedback'
        },
        9: {
            text: "指派",
            method: 'assign'
        },
        10: {
            text: "撤回指派",
            method: 'cancelAssign'
        },
        99: { text: "--" }
    }
    export const specifyType = {
        1: "数字化应用业务组",
        2: "工品采购业务组",
        3: "科产业务组",
        4: "羚羊金融业务组",
        5: "技术经理人",
        6: "待分发",
    }
    export const demandType = {
        1: "已认领",
        2: "已分发",
        3: "新发布",
        5: "已结束",
        6: "对接中",
        7: "已反馈",
        8: "已评价"
    }
    export type Content = {
        name?: string	//名称	
        startDate?: string	//需求时间-开始时间	
        endDate?: string	//需求时间-结束时间	
        contact?: string	//联系人	
        phone?: string	//联系方式	
        claimName?: string	//认领人名称	
        claimState?: number	//认领状态
        btnList?: number[]	//按钮列表
        appointOrgName?: string	//指派服务商名称	
        publishTime?: string	//发布时间	
        orgName?: string	//所属企业	
        specifyType?: number	//分发情况
    };

    export type searchContent = {
        name?: string	//需求名称	
        publishStartTime?: string	//发布时间	
        publishEndTime?: string	//发布时间	
        claimId?: number	//需求认领人id	
        orgName?: string	//所属企业名称	
        specifyType?: number	//分发状态。
        tabType?: number	//需要查询到的页面数据。0-需求认领 1-我的认领 2-需求跟进	
        claimState?: number	//需求状态-对接状态	
        appointOrgName?: string	//指派服务商名称
    }
}
export default DockingManage;