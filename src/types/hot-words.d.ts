import type Common from './common';

namespace HotWords {
  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }

  // 审核状态列表
  export interface StatusResultList extends Common.ResultCode {
    result: StatusContent[];
  }
  export type StatusContent = {
    userName: string;
    verityStatus: number;
    createTime: string;
    verityStatusContent: string;
  };
  export interface ProductList extends Common.ResultCode {
    result: ProductListContent[];
  }

  export type ProductListContent = {
    productId?: string; // 贷款产品id
    productName?: string; // 贷款名称
  };

  export type Content = {
    id?: string; // 主键
    phone?: string; // 联系电话
    name?: string; // 联系人
    orgName?: string; // 企业名称
    amount?: string; //	申请金额
    createTime?: string; //	创建时间
    verityStatus?: number; //状态
    verityStatusContent?: string; //	运营平台处理状态说明
    productName?: string; //	贷款名称
    termContent?: string; //	拟融资期限
  };

  export type SearchContent = {
    orgName?: string; // 组织名称
    bank?: string; // 机构名称
    verityStatus?: integer; // 运营平台处理状态1、待平台处理 2、需求已确认 3、匹配金融机构产品服务中 4、已提供金融解决方案 5、暂无适宜的金融解决方案
    dateStart?: string; // 申请日期开始
    dateEnd?: string; // 申请日期结束
  };
}
export default HotWords;
