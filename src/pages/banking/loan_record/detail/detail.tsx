import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import BankingLoan from '@/types/banking-loan.d';
import ApplicationInfo from './components/application_info';
import AuthorizationInfo from './components/authorization_info';
import LoanInfo from './components/loan_info';
import RepaymentInfo from './components/repayment_info';
export default () => {
  const [activeKey, setActiveKey] = useState<string>('');
  const [tabList, setTabList] = useState<any>([]);
  const { type, step, isDetail, id } = history.location.query as any;
  const [steps, setSteps] = useState<string>(step);
  // const [isDetail, setIsDetail] = useState<boolean>(false);
  const tabLists = [
    {
      tab: '申请信息',
      key: '1',
    },
    {
      tab: '授权信息',
      key: '2',
    },
    {
      tab: '放款信息',
      key: '3',
    },
    {
      tab: '还款信息',
      key: '4',
    },
  ];
  const prepare = () => {
    if (Number(type) === 1) {
      setTabList(tabLists.filter((item) => item.key <= steps));
    } else {
      setTabList(tabLists.filter((item) => item.key !== '4' && item.key <= steps));
    }
    setActiveKey(steps || '1');
  };
  const unlisten = () => {
    console.log('unlisten');
    history.listen(() => {
      const query = history.location.query as any;
      console.log('unlisten-query', query);
      setSteps(query.step);
      prepare();
    });
  };
  unlisten();
  useEffect(() => {
    prepare();
  }, []);

  return (
    <PageContainer
      tabList={tabList}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === '1' && <ApplicationInfo id={id} />}
      {activeKey === '2' && (
        <AuthorizationInfo isDetail={isDetail} type={Number(type)} step={steps} id={id} />
      )}
      {activeKey === '3' && (
        <LoanInfo isDetail={isDetail} type={Number(type)} step={steps} id={id} />
      )}
      {activeKey === '4' && (
        <RepaymentInfo isDetail={isDetail} type={Number(type)} id={id} step={steps} />
      )}
    </PageContainer>
  );
};
