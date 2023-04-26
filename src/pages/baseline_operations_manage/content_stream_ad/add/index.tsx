import { Button, message, Avatar, Space, Popconfirm, Form, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { UserOutlined } from '@ant-design/icons';
import { routeName } from '../../../../../config/routes';

const sc = scopedClasses('content-stream-ad-add');

export default () => {

  return (
    <PageContainer
      className={sc('container')}
    >
      内容流广告新增页
    </PageContainer>
  )
}