import { PageContainer } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import ExpertResource from './components/expert-resource';
import ConsultRecord from './components/consult-record';
import ApplyRecord from './components/apply-record';
export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  return (
    <PageContainer
      tabList={[
        {
          tab: '专家资源',
          key: '1',
        },
        {
          tab: '咨询记录',
          key: '2',
        },
        {
          tab: '申请记录',
          key: '3',
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === '1' && <ExpertResource />}
      {activeKey === '2' && <ConsultRecord />}
      {activeKey === '3' && <ApplyRecord />}
    </PageContainer>
  );
};
