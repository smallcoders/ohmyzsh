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
import { Col, message, Row, Select, Typography } from 'antd';

import ENTERPRISE from '@/assets/operate_data/data_display/1.svg';
import SERVICE from '@/assets/operate_data/data_display/2.svg';
import PROFESSION from '@/assets/operate_data/data_display/3.svg';
import NEED_NUM from '@/assets/operate_data/data_display/4.svg';
import SERVICE_NUM from '@/assets/operate_data/data_display/5.svg';
import DataDisplay from '@/types/data-display';
import CommonTable from './components/CommonTable';
const sc = scopedClasses('operate-data-data-display');
export default () => {
  const [citys, setCitys] = useState<{ label: string; value: string }[]>([]);
  const [cityData, setCityData] = useState<DataDisplay.CityData>({
    org: 0,
    facilitator: 0,
    expert: 0,
    needs: 0,
    solutions: 0,
  });

  const getCityDatas = async (cityName = '') => {
    try {
      const { result } = await getCityData({ cityName: cityName });
      setCityData(result || []);
    } catch (error) {
      console.log('error', error);
      message.error('获取数据失败');
    }
  };

  const prepare = async () => {
    try {
      const { result = [] } = await getCitys();
      setCitys([
        { label: '全部', value: '' },
        ...result.map((item) => {
          return { label: item, value: item };
        }),
      ]);
      await getCityDatas();
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  const separate = () => <div style={{ width: '100%', height: 24 }} />;

  return (
    <PageContainer className={sc('container')}>
      <Row gutter={40}>
        <Col span={12}>
          <SelfCard
            title="各地数据"
            extra={
              <Select
                style={{ width: 200 }}
                defaultValue=""
                onChange={(e) => {
                  console.log(e);
                  getCityDatas(e as string);
                }}
              >
                {citys.map((item, index) => (
                  <Select.Option key={item.label + index} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            }
          >
            <Row style={{ padding: 16 }}>
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
                <div style={{ marginTop: 50 }} className={sc('container-data-display-item')}>
                  <img src={NEED_NUM} />
                  <div>
                    <span>需求数量（个）</span>
                    <span>{cityData.needs}</span>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginTop: 50 }} className={sc('container-data-display-item')}>
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
                width: '50%',
                render: (_: string, record: DataDisplay.Publish) => {
                  return (
                    <Typography.Paragraph
                      className={sc('container-data-display-table-url')}
                      onClick={() => {
                        window.open(record.url);
                      }}
                      ellipsis={{ rows: 1, tooltip: true }}
                    >
                      {_}
                    </Typography.Paragraph>
                  );
                },
              },
              {
                title: '时间',
                dataIndex: 'publishTime',
                width: '20%',
              },
              {
                title: '媒体',
                dataIndex: 'media',
                width: '20%',
              },
              {
                title: '阅读量',
                dataIndex: 'readNumber',
                width: '10%',
              },
            ]}
            rowKey={''}
            onChange={getPublishPage}
          />
        </Col>
        {separate()}
        <Col span={24}>
          <SelfCard title="培训地图">
            <img src={'/statement/map.png'} alt="图片损坏" width="100%" />
          </SelfCard>
        </Col>
        {separate()}
        <Col span={12}>
          <CommonTable<DataDisplay.HotApp>
            title={'热门应用'}
            columns={[
              {
                title: '应用名称',
                dataIndex: 'name',
                ellipsis: true,
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
                width: '70%',
                render: (_: string, record: DataDisplay.Policy) => {
                  return (
                    <Typography.Paragraph
                      className={sc('container-data-display-table-url')}
                      onClick={() => {
                        window.open(record.url);
                      }}
                      ellipsis={{ rows: 1, tooltip: true }}
                    >
                      {_}
                    </Typography.Paragraph>
                  );
                },
              },
              {
                title: '地区',
                dataIndex: 'areaName',
                width: '20%',
              },
              {
                title: '阅读量',
                dataIndex: 'readSum',
                width: '10%',
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
