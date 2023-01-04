
namespace SummaryReportList {
  export type Content = {
    // 需求地区code
    demandAreaCode: number;
    // 需求地区
    demandArea: string;
    // 需求数
    demandNum: number;
    // 跟进次数
    followNum: number;
    // 未对接
    notConnectNum: number;
    // 新发布
    newDemandNum: number;
    // 已认领
    claimedNum: number;
    // 对接中
    connectingNum: number;
    // 已反馈
    feedbackNum: number;
    // 已评价
    evaluatedNum: number;
    // 已结束
    finishedNum: number;
  }
};

export default SummaryReportList;


