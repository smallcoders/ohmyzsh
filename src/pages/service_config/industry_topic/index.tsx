import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, message, Space, Popconfirm, Table, Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Industry from './components/industry';
import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { getKeywords } from '@/services/achievements-manage';
const sc = scopedClasses('service-config-app-news');

export default () => {
  const [current, setCurrent] = useState<any>({});
  const [keywords, setKeywords] = useState<any[]>([]);

  const prepare = async () => {
    try {
      const res = await Promise.all([
        getKeywords(),
      ]);
      setKeywords(res[0].result || [])
      setCurrent(res[0]?.result?.[0] || {})
    } catch (error) {
      message.error('获取行业类型失败');
    }
  };
  useEffect(() => {
    prepare();
  }, []);

  return (
    <PageContainer className={sc('container')}>
      <Tabs activeKey={current?.id + ''} onChange={(e) => {
        setCurrent(keywords.find(p => p.id == e))
      }}>
        {keywords.map(p =>
          <TabPane style={{ display: 'none' }} tab={p.name} key={p.id + ''} />
        )}
      </Tabs>
      <Industry currentTab={current}></Industry>
    </PageContainer>
  );
};
