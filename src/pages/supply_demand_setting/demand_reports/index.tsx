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
    <div>
      <TabMenu tabs={['M_SD_BBZB', 'M_SD_BBMXB', 'M_SD_BBZBB', 'M_SD_BBYBB']} activeState={activeKey}></TabMenu>
      <div style={
        {
          position: 'absolute',
          top: 85,
          right: 5
        }
      }>
        数据更新时间：2022-09-12 23:00:00
      </div>
    </div>
  );
};
