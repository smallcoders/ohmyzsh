import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import SelfTable from '@/components/self_table';
import type Common from '@/types/common';
import { getHotRecommendDetail } from '@/services/topic';
import { history } from '@@/core/history';

export default () => {
  const sc = scopedClasses('baseline-association-detail');
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 1,
    pageTotal: 0,
  });
  const [hotRecommendDetail, setHotRecommendDetail] = useState<any>({});
  const { recommendId } = history.location.query as any;
  //获取热门话题的详情
  const getHotRecommendDetailById = (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    getHotRecommendDetail({ id: recommendId, pageIndex, pageSize }).then((res) => {
      if (res.code === 0) {
        setHotRecommendDetail(res?.result || {});
        setPageInfo({
          pageIndex: res?.result.pageIndex,
          pageSize: res?.result.pageSize,
          totalCount: res?.result.contentCount,
          pageTotal: 0,
        });
      }
    });
  };
  useEffect(() => {
    getHotRecommendDetailById();
  }, []);

  return (
    <PageContainer
      className={sc('container')}
      footer={[
        <Button
          style={{ marginRight: '40px' }}
          onClick={() => {
            history.goBack();
          }}
        >
          返回
        </Button>,
      ]}
    >
      <div className="topic-detail">
        <div className="topic-detail-title">协会基础信息</div>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">协会名称：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.topic}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">所属产业：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.weight}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">协会级别：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">所在区域：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">协会介绍：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">官方logo：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">官方协会二维码：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">爱企查对应地址：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
      </div>
      <div className="topic-detail">
        <div className="topic-detail-title">联系信息</div>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">联系人：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">联系电话：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">联系地址：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
      </div>
      <div className="topic-detail">
        <div className="topic-detail-title">爱企查字段信息</div>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">字段名称：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">字段名称：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">字段名称：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
      </div>
      <div className="topic-detail">
        <div className="topic-detail-title">操作日志</div>
        <div className="operation-log">
          <div className="operation-log-item">
            <div className="item-userName">运营人员A</div>
            <div className="item-name">导入</div>
            <div className="item-time">2021-06-14 08:25</div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
