import { PageContainer } from '@ant-design/pro-layout';
import './operate-data-data-display.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import {
  getCitys,
  getPublishPage,
  getHotAppPage,
  getPolicyPage,
  getCityData,
} from '@/services/data-display';
import SelfCard from '@/components/self-card';
import { Button, Col, message, Row, Select } from 'antd';

import ENTERPRISE from '@/assets/operate_data/data_display/1.svg';
import SERVICE from '@/assets/operate_data/data_display/2.svg';
import PROFESSION from '@/assets/operate_data/data_display/3.svg';
import NEED_NUM from '@/assets/operate_data/data_display/4.svg';
import SERVICE_NUM from '@/assets/operate_data/data_display/5.svg';
import DataDisplay from '@/types/data-display';
import CommonTable from './components/CommonTable';
import moment from 'moment';
const sc = scopedClasses('operate-data-data-display');
export default () => {
  const [citys, setCitys] = useState<string[]>([]);
  const [cityData, setCityData] = useState<DataDisplay.CityData>({
    org: 0,
    facilitator: 0,
    expert: 0,
    needs: 0,
    solutions: 0,
  });

  const prepare = async () => {
    try {
      const [citysRes, cityDatasRes] = await Promise.all([
        getCitys(),
        getCityData({ cityName: '' }),
      ]);
      setCitys(citysRes.result || []);
      setCityData(cityDatasRes.result || []);
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  return (
    <PageContainer className={sc('container')}>
      <Row gutter={20}>
        <Col span={12}>
          <SelfCard
            title="各地数据"
            extra={
              <Select
                style={{ width: 200 }}
                onChange={(e) => {
                  console.log(e);
                }}
              >
                {citys.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            }
          >
            <Row>
              <Col span={8}>
                <div className={sc('container-data-display-item')}>
                  <img src={ENTERPRISE} />
                  <div>
                    <span>工业企业（家）</span>
                    <span>{cityData.org}</span>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={sc('container-data-display-item')}>
                  <img src={SERVICE} />
                  <div>
                    <span>服务商（家）</span>
                    <span>{cityData.facilitator}</span>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={sc('container-data-display-item')}>
                  <img src={PROFESSION} />
                  <div>
                    <span>专家（位）</span>
                    <span>{cityData.expert}</span>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginTop: 24 }} className={sc('container-data-display-item')}>
                  <img src={NEED_NUM} />
                  <div>
                    <span>需求数量（个）</span>
                    <span>{cityData.needs}</span>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginTop: 24 }} className={sc('container-data-display-item')}>
                  <img src={SERVICE_NUM} />
                  <div>
                    <span>服务数量（个）</span>
                    <span>{cityData.solutions}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </SelfCard>
        </Col>
        <Col span={12}>
          <CommonTable<DataDisplay.Publish>
            title={'宣传统计'}
            columns={[
              {
                title: '标题',
                dataIndex: 'title',
                render: (_: string) => {
                  return <Button type="link">{_}</Button>;
                },
              },
              {
                title: '时间',
                dataIndex: 'publishTime',
                render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
              },
              {
                title: '媒体',
                dataIndex: 'media',
              },
              {
                title: '阅读量',
                dataIndex: 'readNumber',
              },
            ]}
            rowKey={''}
            onChange={getPublishPage}
          />
        </Col>
        <Col span={24}>
          <SelfCard title="培训地图">
            <img src={'/statement/map.png'} alt="图片损坏" width="100%" />
          </SelfCard>
        </Col>
        <Col span={12}>
          <CommonTable<DataDisplay.HotApp>
            title={'热门应用'}
            columns={[
              {
                title: '应用名称',
                dataIndex: 'name',
              },
              {
                title: '收藏量',
                dataIndex: 'collection',
              },
              {
                title: '试用量',
                dataIndex: 'tryNumber',
              },
            ]}
            rowKey={''}
            onChange={getHotAppPage}
          />
        </Col>
        <Col span={12}>
          <CommonTable<DataDisplay.Policy>
            title={'热门政策'}
            columns={[
              {
                title: '标题',
                dataIndex: 'title',
                render: (_: string, record: DataDisplay.Policy) => {
                  return (
                    <Button
                      type="link"
                      onClick={() => {
                        window.open(record.url, '_target');
                      }}
                    >
                      {_}
                    </Button>
                  );
                },
              },
              {
                title: '地区',
                dataIndex: 'areaName',
              },
              {
                title: '阅读量',
                dataIndex: 'readSum',
              },
            ]}
            rowKey={''}
            onChange={getPolicyPage}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};
