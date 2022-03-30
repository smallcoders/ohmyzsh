import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import React, { useState } from 'react';
import AppResource from '../app_resource';
import ConsultRecord from '../consult_record';
export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  return (
    <PageContainer
      tabList={[
        {
          tab: '应用资源',
          key: '1',
        },
        {
          tab: '咨询记录',
          key: '2',
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === '1' && <AppResource />}
      {activeKey === '2' && <ConsultRecord />}
    </PageContainer>
  );
};
