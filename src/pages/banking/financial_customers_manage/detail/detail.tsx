import { PageContainer } from '@ant-design/pro-layout';
import { getCustomersDetail } from '@/services/financial_customers_manage';
import { useEffect, useState } from 'react';
import { customToFixed } from '@/utils/util';
import { Button, Row, Col, message as antdMessage } from 'antd';
import { history } from 'umi';
import {
  orgFormMap,
  legalQualificationMap,
  economyTypeMap,
  orgSizeMap,
  industryMap,
  scienceMarkMap,
  banksMap,
  regStatusMap,
} from '../constants';

import './detail.less';
import { routeName } from '../../../../../config/routes';

export default () => {
  const { id } = history.location.query as { id: string | undefined };
  const [detail, setDetail] = useState<any>({});

  useEffect(() => {
    getCustomersDetail({ id }).then((res) => {
      const { code, message: resultMsg } = res || {};
      if (code === 0) {
        setDetail(res.result);
      } else {
        antdMessage.error(`请求失败，原因:{${resultMsg}}`);
      }
    });
  }, []);
  return (
    <PageContainer
      className="customer-detail-pages"
      ghost
      footer={[
        // eslint-disable-next-line react/jsx-key
        <Button size="large" onClick={() => history.goBack()}>
          返回
        </Button>,
        <Button size="large" type="primary" onClick={() => {
          history.push(`${routeName.FINANCIAL_CUSTOMERS_MANAGE_EDIT}?id=${id}`);
        }}>
          编辑
        </Button>
      ]}
    >
      <div className="customer-detail">
        <div className="top-content">
          <img src={`/antelope-manage/common/download/${detail?.logoImageId}`} alt="" />
          <div className="top-right">
            <div className="org-name">
              {detail?.name}
              <span className="org-status">
                {detail?.regStatus ? regStatusMap[detail.regStatus] : '--'}
              </span>
            </div>
            <div className="credit-code">{detail?.creditCode}</div>
            <div className="right-bottom-content">
              <div>
                <div className="item">
                  <label>法定代表人：</label>
                  <span>{detail?.legalPersonName || '--'}</span>
                </div>
                <div className="item">
                  <label>实缴资本：</label>
                  <span>{detail?.actualCapital ? `${detail?.actualCapital}` : '--'}</span>
                </div>
                <div className="item">
                  <label>注册地址：</label>
                  <span>{detail?.regAddress || '--'}</span>
                </div>
              </div>
              <div>
                <div className="item">
                  <label>法人证件号码：</label>
                  <span>{detail?.legalCard
                    ? detail?.legalCard.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2')
                    : '--'}</span>
                </div>
                <div className="item">
                  <label>注册资本：</label>
                  <span>{detail?.regCapital ? `${detail?.regCapital}` : '--'}</span>
                </div>
                <div className="item" />
              </div>
              <div>
                <div className="item">
                  <label>成立时间：</label>
                  <span>{detail?.formedDate ? detail?.formedDate.split(' ')[0] : '--'}</span>
                </div>
                <div className="item">
                  <label>经营所在地：</label>
                  <span>{detail?.busAddress || '--'}</span>
                </div>
                <div className="item" />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="title">企业情况</div>
          <div className="flex-box">
            <Row>
              <Col span={8} className="item">
                <label>企业规模：</label>
                <span>{detail?.scale ? `${detail?.scale}` : '--'}</span>
              </Col>
              <Col span={8} className="item">
                <label>组织规模：</label>
                <span>{detail?.orgSize ? orgSizeMap[detail?.orgSize] : '--'}</span>
              </Col>
              <Col span={8} className="item">
                <label>经营成分：</label>
                <span>{detail?.economyType ? economyTypeMap[detail?.economyType] : '--'}</span>
              </Col>

              <Col span={8} className="item">
                <label>上年营收：</label>
                <span>{typeof detail?.revenueLastYear === 'number'
                  ? `${customToFixed(`${detail?.revenueLastYear / 1000000}`)}万元`
                  : '--'}</span>
              </Col>
              <Col span={8} className="item">
                <label>组织形式：</label>
                <span>{detail?.orgForm ? orgFormMap[detail?.orgForm] : '--'}</span>
              </Col>
              <Col span={8} className="item">
                <label>总资产：</label>
                <span>{typeof detail?.totalAssets === 'number'
                  ? `${customToFixed(`${detail?.totalAssets / 1000000}`)}万元`
                  : '--'}</span>
              </Col>

              <Col span={8} className="item">
                <label>上年利润：</label>
                <span>{typeof detail?.profitLastYear === 'number'
                  ? `${customToFixed(`${detail?.profitLastYear / 1000000}`)}万元`
                  : '--'}</span>
              </Col>
              <Col span={8} className="item">
                <label>法人资格：</label>
                <span>{detail?.legalQualification
                  ? legalQualificationMap[detail?.legalQualification]
                  : '--'}</span>
              </Col>
              <Col span={8} className="item">
                <label>所属行业：</label>
                <span>{detail?.industry ? industryMap[detail?.industry] : '--'}</span>
              </Col>

              <Col span={24} className="item special-item">
                <label>经营范围：</label>
                <span>{detail?.busRange || '--'}</span>
              </Col>
            </Row>
          </div>
        </div>
        <div className="card">
          <div className="title">标识管理</div>
          <div className="flex-box">
            <Row>
              <Col span={8} className="item">
                <label style={{ width: 240 }}>安徽十大新兴产业重点企业：</label>
                {detail.isKey === 0 ? '否' : detail.isKey === 1 ? '是' : '--'}
              </Col>
              <Col span={8} className="item">
                <label>科技型企业标识：</label>
                {detail?.scienceMark ? scienceMarkMap[detail?.scienceMark] : '--'}
              </Col>
              <Col span={8} className="item">
                <label>上市公司：</label>
                {detail.isListed === 0 ? '否' : detail.isListed === 1 ? '是' : '--'}
              </Col>
            </Row>
          </div>
        </div>
        <div className="card">
          <div className="title">联系方式</div>
          <div className="flex-box">
            <Row>
              <Col span={8} className="item">
                <label>联系人：</label>
                {detail?.contacts || '--'}
              </Col>
              <Col span={8} className="item">
                <label>联系方式：</label>
                {detail?.phone || '--'}
              </Col>
            </Row>
          </div>
        </div>
        <div className="card flex-start-card">
          <div className="title">主要结算银行</div>
          <div className="flex-box">
            <Row>
              <Col span={8} className="item">
                <label>主要结算银行：</label>
                {detail?.banks
                  ? detail.banks
                      .split(',')
                      .map((item: string) => {
                        return banksMap[item];
                      })
                      .join(',')
                  : '--'}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
