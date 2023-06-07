import React from 'react';

import './index.less';

import scopedClasses from '@/utils/scopedClasses';

const sc = scopedClasses('target-monitoring');
export default () => {
  return (
    <div className={sc()}>
      <iframe src='http://172.30.93.68:8080/shareDashboard/e5338021d1934751a2244a9945f71f88?type=NONE' />
    </div>
  );
};


