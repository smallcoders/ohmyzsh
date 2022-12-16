import TabMenu from '@/components/TabMenu';
import { useState, useEffect } from 'react';
import { history } from 'umi';

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
    <TabMenu tabs={['M_SD_BBZB', 'M_SD_BBMXB', 'M_SD_BBZBB', 'M_SD_BBYBB']} activeState={activeKey} />
  );
};
