import { Button, message, Avatar, Space, Popconfirm, Form, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { UserOutlined } from '@ant-design/icons';
import { routeName } from '../../../../../config/routes';

const sc = scopedClasses('suspension-ad-detail');

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
      全局悬浮窗广告详情页
    </PageContainer>
  )
}