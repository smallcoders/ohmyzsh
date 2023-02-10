import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { history } from 'umi';
import BankingLoan from '@/types/banking-loan.d';
import ApplicationInfo from './components/application_info';
import AuthorizationInfo from './components/authorization_info';
import AuditInfo from './components/insurance_info/audit_info';
import DockingInfo from './components/insurance_info/docking_info';
import LoanInfo from './components/loan_info';
import RepaymentInfo from './components/repayment_info';
import scopedClasses from '@/utils/scopedClasses';
import useSize from './components/useSize';
import './detail.less';
const sc = scopedClasses('loan-record-detail');
export default () => {
  const [activeKey, setActiveKey] = useState<string>('');
  const [tabList, setTabList] = useState<any>([]);
  const [Left, setLeft] = useState<any>([]);
  const { type, step, isDetail, id, loanType, name } = history.location.query as any;
  const AuthorizationRef = useRef(null) as React.MutableRefObject<any>;
  const AuditRef = useRef(null) as React.MutableRefObject<any>;
  const DockingRef = useRef(null) as React.MutableRefObject<any>;
  const pageRef = useRef(null);
  // const [isDetail, setIsDetail] = useState<boolean>(false);
  const tabLists = [
    {
      tab: '申请信息',
      key: '1',
      loanTypeInclude: ['1', '3', '5'],
    },
    {
      tab: '授信信息',
      key: '2',
      loanTypeInclude: ['1', '3'],
    },
    {
      tab: '放款信息',
      key: '3',
      loanTypeInclude: ['1', '3'],
    },
    {
      tab: '还款信息',
      key: '4',
      loanTypeInclude: ['1', '3'],
    },
    {
      tab: '审核信息',
      key: '5',
      loanTypeInclude: ['5'],
    },
    {
      tab: '对接信息',
      key: '6',
      loanTypeInclude: ['5'],
    },
  ];
  const prepare = (ste: string) => {
    const maxstep = Math.max(step, Number(ste)).toString();
    if (Number(type) === 1) {
      setTabList(
        tabLists.filter((item) => item.key <= maxstep && item.loanTypeInclude.includes(loanType)),
      );
    } else {
      setTabList(
        tabLists.filter(
          (item) =>
            item.key !== '4' && item.key <= maxstep && item.loanTypeInclude.includes(loanType),
        ),
      );
    }
    setActiveKey(ste || '1');
  };
  useEffect(() => {
    prepare(step);
  }, []);
  const { left } = useSize(pageRef);
  useLayoutEffect(() => {
    setLeft(left);
    console.log('pageRef', left);
  }, [left]);
  const toTab = (tostep: string) => {
    prepare(tostep);
  };
  return (
    <>
      <div className={sc('page-bak')} ref={pageRef} />
      <PageContainer
        ghost
        className={sc('page')}
        tabList={tabList}
        tabActiveKey={activeKey}
        onTabChange={async (key: string) => {
          if (activeKey === '2' && AuthorizationRef.current.formIsChange) {
            AuthorizationRef.current.cancelEdit(() => {
              setActiveKey(key);
            });
          } else if (activeKey === '5' && AuditRef.current.formIsChange) {
            AuditRef.current.cancelEdit(() => {
              setActiveKey(key);
            });
          } else if (activeKey === '6' && DockingRef.current.formIsChange) {
            DockingRef.current.cancelEdit(() => {
              setActiveKey(key);
            });
          } else {
            setActiveKey(key);
          }
        }}
      >
        {activeKey === '1' && <ApplicationInfo id={id} left={Left} loanType={loanType} />}
        {activeKey === '2' && (
          <AuthorizationInfo
            ref={AuthorizationRef}
            type={Number(type)}
            isDetail={isDetail}
            step={step}
            id={id}
            left={Left}
            toTab={toTab}
            loanType={loanType}
            name={name}
          />
        )}
        {activeKey === '5' && (
          <AuditInfo
            ref={AuditRef}
            isDetail={isDetail}
            step={step}
            id={id}
            left={Left}
            toTab={toTab}
            loanType={loanType}
          />
        )}
        {activeKey === '6' && (
          <DockingInfo
            ref={DockingRef}
            isDetail={isDetail}
            type={Number(type)}
            step={step}
            id={id}
            left={Left}
            toTab={toTab}
            loanType={loanType}
          />
        )}
        {activeKey === '3' && (
          <LoanInfo
            isDetail={isDetail}
            type={Number(type)}
            step={step}
            id={id}
            left={Left}
            toTab={toTab}
            loanType={loanType}
            name={name}
          />
        )}
        {activeKey === '4' && (
          <RepaymentInfo isDetail={isDetail} type={Number(type)} id={id} step={step} left={Left} />
        )}
      </PageContainer>
    </>
  );
};
