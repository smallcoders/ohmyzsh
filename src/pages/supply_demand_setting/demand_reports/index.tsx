import TabMenu from '@/components/TabMenu';
import { useState, useEffect} from 'react';
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
      <TabMenu
        tabs={['M_SD_ZB', 'M_SD_MXB', 'M_SD_ZBB', 'M_SD_YBB']}
        activeState={activeKey}
        setActiveKey={setActiveKey}
        sort
      />
    </div>
  );
};
