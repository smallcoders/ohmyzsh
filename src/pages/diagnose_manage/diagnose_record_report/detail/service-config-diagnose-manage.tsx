/* eslint-disable */
import { Radio, RadioChangeEvent, Row, Col } from 'antd';

import './service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import DataColumn from '@/types/data-column.d';
import Home from './components/home';
import Introduce from './components/introduce';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import { getDiagnoseDetail } from '@/services/diagnose-manage';

const sc = scopedClasses('service-config-diagnose-manage');

const DColumn: React.FC = () => {
  const { id } = history.location.query as { id: string };

  const [edge, setEdge] = useState<DataColumn.Type>(DataColumn.Type.HOME);
  const selectButton = (): React.ReactNode => {
    const handleEdgeChange = (e: RadioChangeEvent) => {
      setEdge(e.target.value);
    };
    return (
      <Radio.Group value={edge} onChange={handleEdgeChange}>
        <Radio.Button value={DataColumn.Type.HOME}>诊断结果</Radio.Button>
        <Radio.Button value={DataColumn.Type.INTRODUCE}>原始填报</Radio.Button>
      </Radio.Group>
    );
  };

  // const getDetail = async() => {
  //   let detailRes = await getDiagnoseDetail(id)
  //   console.log(detailRes);
  // }

  // useEffect(() => {
  //   getDetail()
  // }, [])

  return (
    <PageContainer className={sc('container')}>
      <div className='container-info'>
        <h3>喜洋洋</h3>
        <Row>
          <Col span={8}>
            <label>所属企业：</label>
            <span>羚羊工业互联网有限公司</span>
          </Col>
          <Col span={8}>
            <label>问卷名称：</label>
            <span>羊村生活质量调研v1.0</span>
          </Col>
          <Col span={8}>
            <label>诊断段：</label>
            <span>APP</span>
          </Col>
          <Col span={8} style={{marginTop: 8}}>
            <label>企业所在区域：</label>
            <span>安徽省/合肥市/蜀山区</span>
          </Col>
          <Col span={8} style={{marginTop: 8}}>
            <label>诊断时间：</label>
            <span>2021-06-13 13:32:12</span>
          </Col>
        </Row>
      </div>
      {selectButton()}
      {edge === DataColumn.Type.HOME && <Home />}
      {edge === DataColumn.Type.INTRODUCE && <Introduce />}
    </PageContainer>
  );
};

export default DColumn;
