import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import AppPushRecord from './app_push_record';
import AppConfig from './app_config';
export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  return (
    <PageContainer
      tabList={[
        {
          tab: '应用配置',
          key: '1',
        },
        {
          tab: '推送记录',
          key: '2',
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === '1' && <AppConfig />}
      {activeKey === '2' && <AppPushRecord />}
    </PageContainer>
  );
};
