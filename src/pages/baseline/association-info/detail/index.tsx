import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { history } from '@@/core/history';
import {
  queryAllianceDetail,
  queryAllianceLogList,
  queryBaseInfoById,
} from '@/services/baseline-info';

export default () => {
  const sc = scopedClasses('baseline-association-detail');
  const [baseInfo, setBaseInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [associationLog, setAssociationLog] = useState<any>([]);
  const [AssociationDetail, setAssociationDetail] = useState<any>({});
  const { organizationId } = history.location.query as any;
  //获取详情
  //获取详情
  const getAssociationDetailById = () => {
    queryAllianceDetail({ organizationId })
      .then((res) => {
        if (res.code === 0) {
          setLoading(true);
          setAssociationDetail(res?.result);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getAssociationDetailById();
    queryAllianceLogList({ organizationId }).then((res) => {
      if (res.code === 0) {
        setAssociationLog(res?.result);
      }
    });
    queryBaseInfoById({ orgId: organizationId }).then((res) => {
      if (res.code === 0) {
        setBaseInfo(res?.result);
      }
    });
  }, []);

  return (
    <PageContainer
      className={sc('container')}
      loading={loading}
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
            <span>
              {AssociationDetail.districtCodeType == 0 && '未知'}
              {AssociationDetail.districtCodeType == 1 && '省级'}
              {AssociationDetail.districtCodeType == 2 && '市级'}
              {AssociationDetail.districtCodeType == 3 && '区县级'}
            </span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">所在区域：</div>
          </Col>
          <Col span={16}>
            <span>
              {AssociationDetail?.provinceName}
              {AssociationDetail?.cityName}
              {AssociationDetail?.countyName}
            </span>
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
            <img src={AssociationDetail?.logoUrl} />
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">官方协会二维码：</div>
          </Col>
          <Col span={16}>
            <img src={AssociationDetail?.qrcodeFileUrl} />
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
        {baseInfo?.baseInfo?.creditCode && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">统一信用代码：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.baseInfo?.creditCode}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.baseInfo?.legalName && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">法人：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.baseInfo?.legalName}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.baseInfo?.address && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">注册区域：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.baseInfo?.address}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.baseInfo?.businessScope && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">经营范围：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.baseInfo?.businessScope}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.baseInfo?.industryTxtList.length !== 0 && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">主营行业：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.baseInfo?.industryTxtList}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.baseInfo?.registeredCapital && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">注册资本：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.baseInfo?.registeredCapital}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.baseInfo?.entType && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">企业类型：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.baseInfo?.entType}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.extraInfo?.regCode && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">工商注册号：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.baseInfo?.regCode}</span>
            </Col>
          </Row>
        )}

        {baseInfo?.extraInfo?.orgNo && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">组织机构代码：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.extraInfo?.orgNo}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.extraInfo?.taxNo && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">纳税人识别号：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.extraInfo?.taxNo}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.extraInfo?.qualification && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">纳税人资质：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.extraInfo?.qualification}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.baseInfo?.openTime && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">营业期限：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.baseInfo?.openTime}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.extraInfo?.authorityTxt && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">登记机关：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.extraInfo?.authorityTxt}</span>
            </Col>
          </Row>
        )}
        {baseInfo?.baseInfo?.address && (
          <Row className={'title'}>
            <Col span={4}>
              <div className="info-label">注册地址：</div>
            </Col>
            <Col span={16}>
              <span>{baseInfo?.baseInfo?.address}</span>
            </Col>
          </Row>
        )}
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
