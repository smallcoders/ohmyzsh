import { PageContainer } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import Solution from './solution';
import Intention from './intention_message/index';
export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  return (
    <PageContainer
      tabList={[
        {
          tab: '解决方案',
          key: '1',
        },
        {
          tab: '意向消息',
          key: '2',
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === '1' && <Solution />}
      {activeKey === '2' && <Intention />}
    </PageContainer>
  );
};
