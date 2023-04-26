import {
  Button,
  message,
  Space,
  Popconfirm,
  Tooltip,
  Form,
  Input,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type SolutionTypes from '@/types/solution';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less'
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../../config/routes';
import dayjs from 'dayjs';

const sc = scopedClasses('content-stream-ad-statistical-detail');

export default () => {



  return (
    <PageContainer className={sc('container')}>
      内容流广告-统计详情
    </PageContainer>
  )
}