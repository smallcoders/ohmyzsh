import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import SelfTable from '@/components/self_table';
import type LogoutVerify from '@/types/user-config-logout-verify';
import type Common from '@/types/common';
import { history } from '@@/core/history';
import { queryGovDetail, queryGovLogList } from '@/services/baseline-info';

export default () => {
  const sc = scopedClasses('baseline-government-detail');
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 1,
    pageTotal: 0,
  });
  const [dataSource, setDataSource] = useState<any>([]);
  const [hotGovDetail, setHotGovDetail] = useState<any>({});
  const [hotGovLog, setHotGovLog] = useState<any>([]);
  const { organizationId } = history.location.query as any;
  //获取详情
  const getGovDetailById = () => {
    queryGovDetail({ organizationId }).then((res) => {
      if (res.code === 0) {
        setHotGovDetail(res?.result);
        setDataSource(res?.result.hotService);
      }
    });
  };

  useEffect(() => {
    getGovDetailById();
    queryGovLogList({ organizationId }).then((res) => {
      if (res.code === 0) {
        setHotGovLog(res?.result);
      }
    });
  }, []);

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '服务名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '服务h5地址',
      dataIndex: 'serviceUrl',
      width: 200,
    },
    {
      title: '权重',
      dataIndex: 'weight',
      width: 200,
    },
  ];

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
        <div className="topic-detail-title">政府服务部门信息</div>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">政府服务部门名称：</div>
          </Col>
          <Col span={16}>
            <span>{hotGovDetail?.name}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">服务部门简称：</div>
          </Col>
          <Col span={16}>
            <span>{hotGovDetail?.nameShort}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">id：</div>
          </Col>
          <Col span={16}>
            <span>{hotGovDetail?.govId}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">uuid：</div>
          </Col>
          <Col span={16}>
            <span>{hotGovDetail?.govUuid}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">级别：</div>
          </Col>
          <Col span={16}>
            <span>{hotGovDetail?.districtCodeType}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">所在区域：</div>
          </Col>
          <Col span={16}>
            <span>{hotGovDetail?.provinceCode}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">部门介绍：</div>
          </Col>
          <Col span={16}>
            <span>{hotGovDetail?.aboutUs}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">在线办理h5地址：</div>
          </Col>
          <Col span={16}>
            <span>{hotGovDetail?.serviceUrl}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">是否热门：</div>
          </Col>
          <Col span={16}>
            <span>{hotGovDetail?.hot ? '热门' : '否'}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">热门部门权重：</div>
          </Col>
          <Col span={16}>
            <span>{hotGovDetail?.weight}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className="info-label">热门服务：</div>
          </Col>
          <Col span={20}>
            <SelfTable
              bordered
              // scroll={{ x: 1480 }}
              columns={columns}
              dataSource={dataSource}
              pagination={null}
            />
          </Col>
        </Row>
      </div>
      <div className="topic-detail">
        <div className="topic-detail-title">操作日志</div>
        <div className="operation-log">
          {hotGovLog.map((item: any) => {
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
