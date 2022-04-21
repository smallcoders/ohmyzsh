/* eslint-disable */
import {
  Radio,
  Input,
  Table,
  Form,
  InputNumber,
  Typography,
  message,
  RadioChangeEvent,
} from 'antd';

import './service-config-data-column.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import DataColumn from '@/types/data-column.d';
import Home from './components/home';
import Introduce from './components/introduce';
import { PageContainer } from '@ant-design/pro-layout';

const sc = scopedClasses('service-config-data-column');

const DColumn: React.FC = () => {
  const [edge, setEdge] = useState<DataColumn.Type>(DataColumn.Type.INTRODUCE);

  const selectButton = (): React.ReactNode => {
    const handleEdgeChange = (e: RadioChangeEvent) => {
      setEdge(e.target.value);
    };
    return (
      <Radio.Group value={edge} onChange={handleEdgeChange}>
        <Radio.Button value={DataColumn.Type.HOME}>羚羊首页</Radio.Button>
        <Radio.Button value={DataColumn.Type.INTRODUCE}>科产介绍页</Radio.Button>
      </Radio.Group>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {selectButton()}
      {edge === DataColumn.Type.HOME && <Home />}
      {edge === DataColumn.Type.INTRODUCE && <Introduce />}
    </PageContainer>
  );
};

export default DColumn;
