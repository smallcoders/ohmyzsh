import { useState } from 'react';
import Common from '@/types/common.d';

const LeaveWordVerify = () => {
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const [orgName, setOrgName] = useState<string>(''); // 定义需要暂存的值

  const resetModel = () => {
    setPageInfo({
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      pageTotal: 0,
    });
    setOrgName(''); // 定义需要暂存的值
  }

  return {
    pageInfo,
    setPageInfo,
    orgName,
    setOrgName,
    resetModel,
  }
}

export default LeaveWordVerify

