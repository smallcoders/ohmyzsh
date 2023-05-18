import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';

const sc = scopedClasses('follow-up-detail');

export default () => {
  return (
    <PageContainer
      className={sc('container')}
    >
      <div className="content">
        <div className="top-content">
          <div className="top-left">
            <img src='' alt='' />
            <div className="follow-up-main-info">
              <div>
                <span className="time">4月20 16:20</span>
                <span>Admin</span>
              </div>
              <div className="location">定位:蚌塇高新反望江历路666号</div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
