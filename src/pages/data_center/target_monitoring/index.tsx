import React from 'react';

import './index.less';

import scopedClasses from '@/utils/scopedClasses';

const sc = scopedClasses('target-monitoring');
export default () => {
  return (
    <div className={sc()}>
      <iframe src='http://172.30.93.68:8080/shareDashboard/2f4b8aab53ed49e48c0239e31297fdad?type=NONE' />
    </div>
  );
};


