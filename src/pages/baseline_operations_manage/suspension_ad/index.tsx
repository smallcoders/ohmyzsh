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
import { routeName } from '../../../../config/routes';
import dayjs from 'dayjs';

const sc = scopedClasses('suspension-ad');

export default () => {


  const handleAdd = () => {
    // history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_ADD}`)
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD_ADD}`)
  }
  const handleDetail = () => {
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD_DETAIL}`)
  }

  return (
    <PageContainer className={sc('container')}>
      全局悬浮窗列表页
      <div>
        <Button onClick={handleAdd.bind(null)}>
          新增
        </Button>
      </div>
      <Button onClick={handleDetail.bind(null)}>
        详情
      </Button>
    </PageContainer>
  )
}