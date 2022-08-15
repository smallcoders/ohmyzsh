import { useState } from 'react';
import Common from '@/types/common.d';

export interface ExpertAuthVerifySearchInfo {
  expertName: string;
  expertType: string;
  cityCode: string;
}

const initialState = {
  pageInfo: {
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  },
  searchInfo: {
    expertName: '',
    expertType: '',
    cityCode: '',
  },
};

const ExpertAuthVerifyModel = () => {
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>(initialState.pageInfo);
  const [searchInfo, setSearchInfo] = useState<ExpertAuthVerifySearchInfo>(initialState.searchInfo);

  const resetModel = () => {
    setPageInfo(initialState.pageInfo);
    setSearchInfo(initialState.searchInfo);
  };

  return {
    pageInfo,
    setPageInfo,
    searchInfo,
    setSearchInfo,
    resetModel,
  };
};

export default ExpertAuthVerifyModel;
