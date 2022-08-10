import { useState } from 'react';
import Common from '@/types/common.d';

export interface ExpertAuthVerifySearchInfo {
  expertName: string;
  expertType: string;
  area: string;
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
    area: '',
  },
};

const ExpertAuthVerifyModel = () => {
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>(initialState.pageInfo);
  const [searchInfo, setSearchInfo] = useState<ExpertAuthVerifySearchInfo>(initialState.searchInfo);

  return {
    pageInfo,
    setPageInfo,
    searchInfo,
    setSearchInfo,
  };
};

export default ExpertAuthVerifyModel;
