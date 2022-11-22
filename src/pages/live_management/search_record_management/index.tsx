// import { PageContainer } from '@ant-design/pro-layout';
// import './index.less';
// import scopedClasses from '@/utils/scopedClasses';
// import React, { useState } from 'react';

// import Record from './components/Record';
// import Recommend from './components/Recommend';
// const sc = scopedClasses('service-config-diagnostic-tasks');
import TabMenu from '@/components/TabMenu';
export default () => {
  // const [activeKey, setActiveKey] = useState<string>('1');

  return (
    <TabMenu tabs={['M_LM_SSTJ', 'M_LM_SSJL']} />
    // <PageContainer
    //   className={sc('container')}
    //   tabList={[
    //     {
    //       tab: '搜索记录',
    //       key: '1',
    //     },
    //     {
    //       tab: '搜索推荐',
    //       key: '2',
    //     },
    //   ]}
    //   tabActiveKey={activeKey}
    //   onTabChange={(key: string) => setActiveKey(key)}
    // >
    //   {activeKey === '1' && <Record />}
    //   {activeKey === '2' && <Recommend />}
    // </PageContainer>
  );
};
