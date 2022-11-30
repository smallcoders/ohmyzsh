// import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
// import Solution from './solution';
// import Intention from './intention_message/index';
import TabMenu from '@/components/TabMenu';
export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  const { type } = history.location.query as any;

  const prepare = async () => {
    if (type) {
      setActiveKey(type);
    }
  };

  useEffect(() => {
    prepare();
  }, []);


  return (
    <TabMenu tabs={['M_SD_FW', 'M_SD_FWXX']} activeState={activeKey} />
    // <PageContainer
    //   tabList={[
    //     {
    //       tab: '解决方案',
    //       key: '1',
    //     },
    //     {
    //       tab: '意向消息',
    //       key: '2',
    //     },
    //   ]}
    //   tabActiveKey={activeKey}
    //   onTabChange={(key: string) => setActiveKey(key)}
    // >
    //   {activeKey === '1' && <Solution />}
    //   {activeKey === '2' && <Intention />}
    // </PageContainer>
  );
};
