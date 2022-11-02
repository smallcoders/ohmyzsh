import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import AppPushRecord from './app_push';
import AppConfig from './app_config';
import AppAudit from './app_audit';
import AppInterface from './app_interface';
import AppList from './app_list';
export default () => {
  const [activeKey, setActiveKey] = useState<string>('4');

  return (
    <PageContainer
      tabList={[
        // {
        //   tab: '应用审核',
        //   key: '0',
        // },
        // {
        //   tab: '应用配置',
        //   key: '1',
        // },
        // {
        //   tab: '推送记录',
        //   key: '2',
        // },
        {
          tab: '应用列表',
          key: '4',
        },
        {
          tab: '接口规范',
          key: '3',
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {/* {activeKey === '0' && <AppAudit />}
      {activeKey === '1' && <AppConfig />}
      {activeKey === '2' && <AppPushRecord />} */}
      {activeKey === '4' && <AppList />}
      {activeKey === '3' && <AppInterface />}
    </PageContainer>
  );
};
