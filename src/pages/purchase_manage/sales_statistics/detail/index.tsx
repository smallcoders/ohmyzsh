import { message, Image, Row, Col, Button } from 'antd';
import { history } from 'umi';
import { DownloadOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import SelfTable from '@/components/self_table';
import ProCard from '@ant-design/pro-card';
import ProDescriptions from '@ant-design/pro-descriptions';
import { getDetail, intentionPageQuery } from '@/services/solution';
import type DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import type SolutionTypes from '@/types/solution';
import scopedClasses from '@/utils/scopedClasses';
import type Common from '@/types/common';
import {
  getRecordPage
} from '@/services/search-record';
import './index.less';

const sc = scopedClasses('service-config-solution');

const SolutionDetail: React.FC = () => {
  const [dataSource, setDataSource] = useState<any>([]);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [solutionDetail, setSolutionDetail] = useState<SolutionTypes.SolutionDetail>();

  const getDiagnosticTasks = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getRecordPage({
        pageIndex,
        pageSize
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 查询默认密码
   */
  useEffect(() => {
    getDetail(history.location.query?.id).then((e) => {
      if (e.code !== 0) {
        message.error(e.message);
      } else {
        setSolutionDetail(e.result);
        setLoading(false);
      }
    });
    getDiagnosticTasks();
  }, []);

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '订单编号',
      dataIndex: 'operateUserName',
      valueType: 'textarea',
    },
    {
      title: '订单金额',
      dataIndex: 'operateUserName',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '订单状态',
      dataIndex: 'operateUserName',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '订单编号',
      dataIndex: 'operateUserName',
      valueType: 'textarea',
    },
    {
      title: '支付方式',
      dataIndex: 'operateUserName',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '收货人',
      dataIndex: 'operateUserName',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '收获地址',
      dataIndex: 'operateUserName',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '下单时间',
      dataIndex: 'searchTime',
      valueType: 'textarea',
    },
    {
      title: '订单备注',
      dataIndex: 'operateUserName',
      valueType: 'dateTimeRange',
    },
  ];

  return (
    <PageContainer loading={loading} className='activity-detail-container'>
      <>
      <div className='group-tit'>
        活动信息
        <Button type='primary' icon={<DownloadOutlined />}>导出</Button>
      </div>
      <div className='description'>
        <Row>
          <Col span={10} offset={2}>
            <div>
              <label>活动编码：</label>
              <span>{solutionDetail?.areas?.map((e) => e.name).join('、')}</span>
            </div>
            <div>
              <label>活动时间：</label>
              <span>{solutionDetail?.areas?.map((e) => e.name).join('、')}</span>
            </div>
            <div>
              <label>订单总金额：</label>
              <span>{solutionDetail?.areas?.map((e) => e.name).join('、')}</span>
            </div>
            <div>
              <label>活动状态：</label>
              <span>{solutionDetail?.areas?.map((e) => e.name).join('、')}</span>
            </div>
          </Col>
          <Col span={10}>
          <div>
              <label>活动名称：</label>
              <span>{solutionDetail?.areas?.map((e) => e.name).join('、')}</span>
            </div>
            <div>
              <label>订单总数：</label>
              <span>{solutionDetail?.areas?.map((e) => e.name).join('、')}</span>
            </div>
            <div>
              <label>上架状态：</label>
              <span>{solutionDetail?.areas?.map((e) => e.name).join('、')}</span>
            </div>
            <div>
              <label>创建时间：</label>
              <span>{solutionDetail?.areas?.map((e) => e.name).join('、')}</span>
            </div>
          </Col>
        </Row>
      </div>
      <div className='group-tit'>订单信息</div>
      <div className='container-table-body'>
        <SelfTable
          rowKey={'index'}
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getDiagnosticTasks,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>  
    </> 
    </PageContainer>
  );
};

export default SolutionDetail;
