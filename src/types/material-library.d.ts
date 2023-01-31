import type Common from './common';

namespace MaterialLibrary {
  export interface ResultList extends Common.ResultCode, Common.ResultPage {
    result: Content[];
  }
  // 分页查询分组后的素材
  export type Content = {
    createTime?: string; //创建时间
    createUser?: string; //创建名称
    fileId?: number; //图片ID
    groupsId?: number; //分组ID
    id: number; //素材ID
    name?: string; //素材名称
    photoUrl?: string; //图片路径
    photoWidth?: number; //	图片宽度
    photoHeight?: number; //图片高度
  };

  //  查询素材总数量
  export interface TotalNumber extends Common.ResultCode {
    result: number;
  }
  //  查询分组信息
  export interface ListAll extends Common.ResultCode {
    result: List[];
  }
  export type List = {
    id: number; //主键
    groupName: string; //组名
    userId: number; //创建人id
    orgId: number; //创建组织id
    state: number; //0-失效,1-生效
    createTime: string; //创建时间
    updateTime: string; //修改时间
    materialCount: number; //分组下素材数量
  };
}

export default MaterialLibrary;
