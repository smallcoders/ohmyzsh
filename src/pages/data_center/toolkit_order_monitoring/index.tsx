import React from 'react';

import './index.less';

import scopedClasses from '@/utils/scopedClasses';

const sc = scopedClasses('toolkit-order-monitoring');
const toolkitOrderMonitoring: React.FC = () => {
  return (
    <div className={sc()}>
      <iframe src='http://172.30.93.68:8080/shareDashboard/84de9b614633462d942106a9b018a9b0?type=NONE' />
    </div>
  );
};

export default toolkitOrderMonitoring;
