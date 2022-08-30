import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';

import { Button } from 'antd';
import { history } from 'umi';

import { routeName } from '../../../../../config/routes';

import SelfTable from '@/components/self_table';
import type { ColumnsType } from 'antd/es/table';

const sc = scopedClasses('service-config-digital-app-detail');

export default () => {
  const [activeTab, setActiveTab] = useState<string>('待审核')

  const [auditingList, setAuditingList] = useState<[]>([]);
  const [auditSuccessList, setAuditSuccessList] = useState<[]>([]);
  const [auditFailList, setAuditFailList] = useState<[]>([]);

  const prepare = () => {
    getAuditingList()
    getAuditSuccessList()
    getAuditFailList()
  }

  function getAuditingList() {

  }

  function getAuditSuccessList() {
    
  }

  function getAuditFailList() {
    
  }

  useEffect(() => {
    prepare();
  }, [])

  return (
    <div
      className={sc('container')}
    >
      detail
    </div>
  )
}