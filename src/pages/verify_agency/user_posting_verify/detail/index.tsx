import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message,
  Space,
  Modal,
  Tooltip,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less'
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../../config/routes'

const sc = scopedClasses('verify-user-posting-detail');

export default () => {

  return (
    <PageContainer 
      className={sc('container')}
      footer={[
        <Button style={{marginRight:'40px'}} onClick={() =>{
        history.goBack()}
        }>返回</Button>
      ]}
    >
      详情页面
    </PageContainer>
  )
}