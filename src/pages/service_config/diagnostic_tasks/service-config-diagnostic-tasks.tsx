import { PageContainer } from '@ant-design/pro-layout';
import './service-config-diagnostic-tasks.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState } from 'react';

import Online from './components/Online';
import Offline from './components/Offline';
const sc = scopedClasses('service-config-diagnostic-tasks');
export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  return (
    <PageContainer
      className={sc('container')}
      tabList={[
        {
          tab: '线上诊断',
          key: '1',
        },
        {
          tab: '线下诊断',
          key: '2',
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === '1' && <Online />}
      {activeKey === '2' && <Offline />}
    </PageContainer>
  );
};
