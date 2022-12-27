/* eslint-disable */
import { Radio, RadioChangeEvent, Row, Col, message } from 'antd';

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
  const [detailData, setDetailData] = useState({});
  const [diagnoseRes, setDiagnoseRes] = useState({});//诊断结果数据
  const [questionAndAnswer, setQuestionAndAnswer] = useState<any>([]);// 原始填报数据

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

  const getDetail = async() => {
    let detailRes = await getDiagnoseDetail(id)
    const {code, result} = detailRes
    if(code === 0) {
      setDetailData(result)
      if(result.diagnoseRes) {
        setDiagnoseRes(result.diagnoseRes)
      }
      if(result.questionAndAnswer) {
        setQuestionAndAnswer(result.questionAndAnswer)
      }
    }else {
      message.error(`请求详情数据失败`);
    }
    console.log(detailRes);
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <PageContainer className={sc('container')}>
      <div className='container-info'>
        <h3>喜洋洋</h3>
        <Row>
          <Col span={8}>
            <label>所属企业：</label>
            <span>{detailData.orgName || '--'}</span>
          </Col>
          <Col span={8}>
            <label>问卷名称：</label>
            <span>{detailData.questionnaireName || '--'}</span>
          </Col>
          <Col span={8}>
            <label>诊断段：</label>
            <span>{detailData.source || '--'}</span>
          </Col>
          <Col span={8} style={{marginTop: 8}}>
            <label>企业所在区域：</label>
            <span>{detailData.orgRegion || '--'}</span>
          </Col>
          <Col span={8} style={{marginTop: 8}}>
            <label>诊断时间：</label>
            <span>{detailData.diagnoseTime || '--'}</span>
          </Col>
        </Row>
      </div>
      {selectButton()}
      {/* {JSON.stringify(diagnoseRes)} */}
      {edge === DataColumn.Type.HOME && <Home diagnoseRes={diagnoseRes} />}
      {edge === DataColumn.Type.INTRODUCE && <Introduce questionAndAnswer={questionAndAnswer} />}
    </PageContainer>
  );
};

export default DColumn;
