import { PageContainer } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import Follow from './components/follow';
import ClaimMy from './components/claim-my';
import Claim from './components/claim';
import { Select } from 'antd';
import './index.less'
export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  return (
    <PageContainer

      tabList={[
        {
          tab: '需求认领',
          key: '1',
        },
        {
          tab: '我的认领',
          key: '2',
        },
        {
          tab: <>需求跟进-<Select defaultValue="数字化应用" className='parent-header' style={{ paddingLeft: 0, width: 160 }} bordered={false}>
            <Select.Option value="数字化应用">数字化应用</Select.Option>
            <Select.Option value="数字化应用业务组">数字化应用业务组</Select.Option>
            <Select.Option value="工品采购业务组">工品采购业务组</Select.Option>
          </Select></>,
          key: '3',
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === '1' && <Claim />}
      {activeKey === '2' && <ClaimMy />}
      {activeKey === '3' && <Follow />}
    </PageContainer>
  );
};
