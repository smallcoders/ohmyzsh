import { useState } from 'react';
import Common from '@/types/common.d';

const initialState = {
  pageInfo: {
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  },
  searchInfo: {
    name: '',
    content: '',
    startCreateTime: '',
    endCreateTime: '',
    tabEnum: null,
    status: null,
  },
};

const LeaveWordVerify = () => {
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>(initialState.pageInfo);

  const [searchInfo, setSearchInfo] = useState<any>(initialState.searchInfo); // 定义需要暂存的值

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
}

export default LeaveWordVerify

