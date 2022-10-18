import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import AppResource from '../app_resource';
import ConsultRecord from '../consult_record';
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
