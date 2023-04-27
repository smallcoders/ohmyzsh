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

const staNumArr = [
  {
    title: '浏览总次数',
    num: 0,
  },
  {
    title: '被关闭总次数',
    num: 0,
  },
  {
    title: '曝光总量',
    num: 0,
  },
]

// 统计卡片
const StaCard = () => {
  return (
  <div className={sc('card')}>
    {staNumArr.map(((item) => {
      return (
        <div className="wrap" key={item.title}>
          <div className="title">{ item.title }</div>
          <div className="num">{ item.num }</div>
        </div>
      )
    }))}
  </div>
  )
}

export default () => {

  return (
    <PageContainer className={sc('container')}>
      <StaCard/>
    </PageContainer>
  )
}
