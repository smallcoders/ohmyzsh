import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { history } from '@@/core/history';
import { queryAllianceDetail, queryAllianceLogList } from '@/services/baseline-info';

export default () => {
  const sc = scopedClasses('baseline-association-detail');

  const [associationLog, setAssociationLog] = useState<any>([]);
  const [AssociationDetail, setAssociationDetail] = useState<any>({});
  const { organizationId } = history.location.query as any;
  //获取详情
  //获取详情
  const getAssociationDetailById = () => {
    queryAllianceDetail({ organizationId }).then((res) => {
      if (res.code === 0) {
        setAssociationDetail(res?.result);
      }
    });
  };
  useEffect(() => {
    getAssociationDetailById();
    queryAllianceLogList({ organizationId }).then((res) => {
      if (res.code === 0) {
        setAssociationLog(res?.result);
      }
    });
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
            <span>{AssociationDetail?.name}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">所属产业：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.industryCategoryName}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">协会级别：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.districtCodeType}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">所在区域：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.provinceCode}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">协会介绍：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.aboutUs}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">官方logo：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.logoUrl}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">官方协会二维码：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">爱企查对应地址：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.aqcUrl}</span>
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
            <span>{AssociationDetail?.contactName}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">联系电话：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.contactPhone}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">联系地址：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.contactAddress}</span>
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
            <span>{AssociationDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">字段名称：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">字段名称：</div>
          </Col>
          <Col span={16}>
            <span>{AssociationDetail?.contentCount}</span>
          </Col>
        </Row>
      </div>
      <div className="topic-detail">
        <div className="topic-detail-title">操作日志</div>
        <div className="operation-log">
          {associationLog.map((item: any) => {
            return (
              <div className="operation-log-item">
                <div className="item-userName">{item.name}</div>
                <div className="item-name">{item.content}</div>
                <div className="item-time">{item.createTime}</div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};
