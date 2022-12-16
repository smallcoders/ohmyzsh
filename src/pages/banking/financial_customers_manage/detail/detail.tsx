import { PageContainer } from '@ant-design/pro-layout';
import { getCustomersDetail } from '@/services/financial_customers_manage';
import { useEffect, useState } from 'react';
import { customToFixed } from '@/utils/util';
import { Button, message as antdMessage } from 'antd';
import ProCard from '@ant-design/pro-card';
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
    <PageContainer title={false}>
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
                  {detail?.legalPersonName || '--'}
                </div>
                <div className="item">
                  <label>实缴资本：</label>
                  {detail?.actualCapital ? `${detail?.actualCapital}` : '--'}
                </div>
                <div className="item">
                  <label>注册地址：</label>
                  {detail?.regAddress || '--'}
                </div>
              </div>
              <div>
                <div className="item">
                  <label>法人证件号码：</label>
                  {detail?.legalCard ? detail?.legalCard.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2') : '--'}
                </div>
                <div className="item">
                  <label>注册资本：</label>
                  {detail?.regCapital ? `${detail?.regCapital}` : '--'}
                </div>
                <div className="item" />
              </div>
              <div>
                <div className="item">
                  <label>成立时间：</label>
                  {detail?.formedDate ? detail?.formedDate.split(' ')[0] : '--'}
                </div>
                <div className="item">
                  <label>经营所在地：</label>
                  {detail?.busAddress || '--'}
                </div>
                <div className="item" />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="title">企业情况</div>
          <div className="flex-box">
            <div>
              <div className="item">
                <label>企业规模：</label>
                {detail?.scale ? `${detail?.scale}` : '--'}
              </div>
              <div className="item">
                <label>组织规模：</label>
                {detail?.orgSize ? orgSizeMap[detail?.orgSize] : '--'}
              </div>
              <div className="item">
                <label>经营成分：</label>
                {detail?.economyType ? economyTypeMap[detail?.economyType] : '--'}
              </div>
            </div>
            <div>
              <div className="item">
                <label>上年营收：</label>
                {typeof detail?.revenueLastYear === 'number'
                  ? `${customToFixed(`${detail?.revenueLastYear / 1000000}`)}万元`
                  : '--'}
              </div>
              <div className="item">
                <label>组织形式：</label>
                {detail?.orgForm ? orgFormMap[detail?.orgForm] : '--'}
              </div>
              <div className="item">
                <label>总资产：</label>
                {typeof detail?.totalAssets === 'number'
                  ? `${customToFixed(`${detail?.totalAssets / 1000000}`)}万元`
                  : '--'}
              </div>
            </div>
            <div>
              <div className="item">
                <label>上年利润：</label>
                {typeof detail?.profitLastYear === 'number'
                  ? `${customToFixed(`${detail?.profitLastYear / 1000000}`)}万元`
                  : '--'}
              </div>
              <div className="item">
                <label>法人资格：</label>
                {detail?.legalQualification
                  ? legalQualificationMap[detail?.legalQualification]
                  : '--'}
              </div>
              <div className="item">
                <label>所属行业：</label>
                {detail?.industry ? industryMap[detail?.industry] : '--'}
              </div>
            </div>
          </div>
          <div className="item special-item">
            <label>经营范围：</label>
            {detail?.busRange || '--'}
          </div>
        </div>
        <div className="card">
          <div className="title">标识管理</div>
          <div className="flex-box">
            <div className="item">
              <label>安徽十大新兴产业重点企业：</label>
              {detail.isKey === 0 ? '否' : detail.isKey === 1 ? '是' : '--'}
            </div>
            <div className="item">
              <label>科技型企业标识：</label>
              {detail?.scienceMark ? scienceMarkMap[detail?.scienceMark] : '--'}
            </div>
            <div className="item">
              <label>上市公司：</label>
              {detail.isListed === 0 ? '否' : detail.isListed === 1 ? '是' : '--'}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="title">联系方式</div>
          <div className="flex-box flex-start">
            <div className="item">
              <label>联系人：</label>
              {detail?.contacts || '--'}
            </div>
            <div className="item">
              <label>联系方式：</label>
              {detail?.phone || '--'}
            </div>
          </div>
        </div>
        <div className="card flex-start-card">
          <div className="title">主要结算银行</div>
          <div className="flex-box">
            <div className="item">
              <label>主要结算银行：</label>
              {detail?.banks
                ? detail.banks
                    .split(',')
                    .map((item: string) => {
                      return banksMap[item];
                    })
                    .join(',')
                : '--'}
            </div>
          </div>
        </div>
      </div>
      <ProCard layout="center">
        <Button onClick={() => history.goBack()}>返回</Button>
      </ProCard>
    </PageContainer>
  );
};
