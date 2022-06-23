import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState } from 'react';

import Activity from './components/Activity';
import Goods from './components/Goods';
const sc = scopedClasses('service-config-diagnostic-tasks');
export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  return (
    <PageContainer
      className={sc('container')}
      tabList={[
        {
          tab: '活动数据',
          key: '1',
        },
        {
          tab: '商品数据',
          key: '2',
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === '1' && <Activity />}
      {activeKey === '2' && <Goods />}
    </PageContainer>
  );
};
