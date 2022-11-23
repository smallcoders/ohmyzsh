import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
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
  const AuthorizationRef = useRef(null) as React.MutableRefObject<any>;
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
  const prepare = (ste: string) => {
    if (Number(type) === 1) {
      setTabList(tabLists.filter((item) => item.key <= step));
    } else {
      setTabList(tabLists.filter((item) => item.key !== '4' && item.key <= step));
    }
    setActiveKey(ste || '1');
  };
  useEffect(() => {
    prepare(step);
  }, []);
  const toTab = (tostep: string) => {
    prepare(tostep);
  };
  return (
    <PageContainer
      tabList={tabList}
      tabActiveKey={activeKey}
      onTabChange={async (key: string) => {
        if (activeKey === '2' && AuthorizationRef.current.formIsChange) {
          AuthorizationRef.current.cancelEdit(() => {
            setActiveKey(key);
          });
          // setActiveKey(key);
        } else {
          setActiveKey(key);
        }
      }}
    >
      {activeKey === '1' && <ApplicationInfo id={id} />}
      {activeKey === '2' && (
        <AuthorizationInfo
          ref={AuthorizationRef}
          isDetail={isDetail}
          type={Number(type)}
          step={step}
          id={id}
          toTab={toTab}
        />
      )}
      {activeKey === '3' && (
        <LoanInfo isDetail={isDetail} type={Number(type)} step={step} id={id} />
      )}
      {activeKey === '4' && (
        <RepaymentInfo isDetail={isDetail} type={Number(type)} id={id} step={step} />
      )}
    </PageContainer>
  );
};
