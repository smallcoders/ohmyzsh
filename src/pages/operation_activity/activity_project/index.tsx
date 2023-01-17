import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Access, history, useAccess } from 'umi';
import Spring from './spring';
import Intro from './intro';
import scopedClasses from '@/utils/scopedClasses';
const sc = scopedClasses('service_config_activity_project');

export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  const { type } = history.location.query as any;
  const access = useAccess()
  const prepare = async () => {
    if (type) {
      setActiveKey(type);
    }

  };

  const tabList = []
  if (access['M_OA_CJHD']) {
    tabList.push({
      tab: '春节活动',
      key: '1',
    })
  }
  if (access['M_OA_YQYL']) {
    tabList.push({
      tab: '邀请有礼',
      key: '2',
    })
  }

  useEffect(() => {
    prepare();
  }, []);
  return (
    <PageContainer
      tabList={tabList}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
      className={sc('container')}
    >
      {activeKey === '1' && <Spring />}
      {activeKey === '2' && <Intro />}
    </PageContainer>
  );
};
