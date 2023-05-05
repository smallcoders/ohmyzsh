import { Button, message, Avatar, Space, Popconfirm, Form, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';

const sc = scopedClasses('content-stream-ad-detail');

export default () => {
  return (
    <PageContainer
      className={sc('container')}
      footer={[
        <Button size="large" onClick={() => history.goBack()}>
          返回
        </Button>,
      ]}
    >
      <div className={sc('container-body')}>
        <p className={sc('container-body-title')}>弹窗广告信息</p>
        <div className={sc('container-body-detail')}>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>标题：</div>
            <div className={sc('container-body-detail-item-value')}>某某互动活动</div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>图片：</div>
            <div className={sc('container-body-detail-item-value')}>某某互动活动</div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>站内链接配置：</div>
            <div className={sc('container-body-detail-item-value')}>
              https://z5x9psfaef.feishu.cn/docx/D2nRdUopioLiCCxcowhc8eGhntT
            </div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>版面：</div>
            <div className={sc('container-body-detail-item-value')}>某某互动活动</div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>位置：</div>
            <div className={sc('container-body-detail-item-value')}>某某互动活动</div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>作用范围：</div>
            <div className={sc('container-body-detail-item-value')}>某某互动活动</div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
