import {
  Button,
  Form,
  Row,
  Col,
  message,
  Input,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import '../index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import {
  getActivityList
} from '@/services/purchase';
import { routeName } from '../../../../../config/routes';
import { history } from 'umi';
import SelfTable from '@/components/self_table';
import type DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
const sc = scopedClasses('service-config-diagnostic-tasks');
export default () => {
  const [dataSource, setDataSource] = useState<DiagnosticTasks.OnlineRecord[]>([]);
  const [searchContent, setSearChContent] = useState<{
    endDate?: string;
  }>({});
  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  /**
   * 获取搜索记录
   * @param pageIndex
   * @param pageSize
   */
  const getDiagnosticTasks = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getActivityList({
        pageIndex,
        pageSize,
        ...searchContent,
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

  const [form] = Form.useForm();

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: DiagnosticTasks.OnlineRecord, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '活动编码',
      dataIndex: 'actNo',
      width: 200
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '活动时间',
      dataIndex: 'startTime',
      width: 200,
      render: (_: any, _record: any) => _record.startTime + '~' + _record.endTime
    },
    {
      title: '订单总数',
      dataIndex: 'orderSum',
      width: 200,
    },
    {
      title: '订单总金额',
      dataIndex: 'totalPrice',
      width: 200,
    },
    {
      title: '上架状态',
      dataIndex: 'addedStateCn',
      width: 200,
    },
    {
      title: '活动状态',
      dataIndex: 'actStateCn',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
    },
    {
      title: '操作',
      width: 120,
      dataIndex: 'option',
      render: (_: any, _record: any) => {
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); 
              window.open(`${routeName.SALES_STATISTICS_DETAIL}?id=${_record.id}`)
            }}
          >
            查看详情
          </a>
        );
      },
    },
  ];

  const userColumns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: DiagnosticTasks.OnlineRecord, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '搜索内容',
      dataIndex: 'content',
      width: 200,
    },
    {
      title: '搜索时间',
      dataIndex: 'searchTime',
      width: 200,
    }
  ];

  useEffect(() => {
    getDiagnosticTasks();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
          <Col span={6}>
              <Form.Item name="actNo" label="活动编码">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={4} offset={14}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const { ...rest } = search;   
                  setSearChContent(rest);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary2"
                onClick={() => {
                  searchForm.resetFields();
                  setSearChContent({});
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>活动列表(共{pageInfo.totalCount || 0}个)</span>
          <a
            key="primary3"
            className='export-btn'
            href={`/antelope-pay/mng/statistics/activity/download/activity/list?actNo=${searchContent.actNo || ''}`}
          >
            导出
          </a>
          {/* <Button type='primary' icon={<DownloadOutlined />}>导出</Button> */}
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey={'id'}
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
  );
};
