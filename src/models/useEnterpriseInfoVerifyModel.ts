import { useState } from 'react';
import Common from '@/types/common.d';

const EnterpriseInfoVerifyModel = () => {
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const [orgName, setOrgName] = useState<string>('');

  const resetModel = () => {
    setPageInfo({
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      pageTotal: 0,
    });
    setOrgName('');
  };

  return {
    pageInfo,
    setPageInfo,
    orgName,
    setOrgName,
    resetModel,
  };
};

export default EnterpriseInfoVerifyModel;
