/* eslint-disable */
import { Radio, RadioChangeEvent } from 'antd';

import './service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState } from 'react';
import DataColumn from '@/types/data-column.d';
import Home from './components/home';
import Introduce from './components/introduce';
import { PageContainer } from '@ant-design/pro-layout';

const sc = scopedClasses('service-config-diagnose-manage');

const DColumn: React.FC = () => {
  const [edge, setEdge] = useState<DataColumn.Type>(DataColumn.Type.HOME);

  const selectButton = (): React.ReactNode => {
    const handleEdgeChange = (e: RadioChangeEvent) => {
      setEdge(e.target.value);
    };
    return (
      <Radio.Group value={edge} onChange={handleEdgeChange}>
        <Radio.Button value={DataColumn.Type.HOME}>发布中</Radio.Button>
        <Radio.Button value={DataColumn.Type.INTRODUCE}>已下架</Radio.Button>
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
