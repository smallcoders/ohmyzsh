import { useState } from 'react';
import Common from '@/types/common.d';

export interface MessageSearchInfo {
  name: string;
  time?: string | null;
  status?: string | null // 留言状态
  tabEnum?: string | null // 所属板块
  startDateTime?: string | null // 开始时间
  endDateTime?: string | null // 结束时间
}

// 初始化状态
const initialState = {
  pageInfo: {
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  },
  searchInfo: {
    name: '',
    time: null,
    tabEnum: null,
    status: null,
    startDateTime: null,
    endDateTime: null
  },
}

const MessageManagement = () => {
  // 分页
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>(initialState.pageInfo);
  // searchInfo
  const [searchInfo, setSearchInfo] = useState<MessageSearchInfo>(initialState.searchInfo);

  // 重置
  const resetModel = () => {
    setPageInfo(initialState.pageInfo);
    setSearchInfo(initialState.searchInfo);
  }

  return {
    pageInfo,
    setPageInfo,
    searchInfo,
    setSearchInfo,
    resetModel,
  }
};

export default MessageManagement;