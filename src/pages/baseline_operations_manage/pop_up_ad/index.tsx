import {
  Button,
  message,
  Space,
  Popconfirm,
  Tooltip,
  Form,
  Row,
  Col,
  Select,
  Input,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type SolutionTypes from '@/types/solution';
import { PageContainer } from '@ant-design/pro-layout';
import SelfTable from '@/components/self_table';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less'
import type Common from '@/types/common';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../config/routes';
import {
  getPageList,
} from '@/services/page-creat-manage'
import dayjs from 'dayjs';

const sc = scopedClasses('pop-up-ad');

export default () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [searchForm] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getPageList({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      // antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '名称',
      dataIndex: 'tmpName',
      width: 150,
      render: (tmpName: string, record: any) => {
        return <span>{tmpName || '--'}</span>
      }
    },
    {
      title: '图片',
      dataIndex: 'tmpDesc',
      isEllipsis: true,
      width: 250,
    },
    {
      title: '触发机制',
      dataIndex: 'pv',
      render: (pv: string) => {
        return <span>{pv || '--'}</span>
      }
    },
    {
      title: '作用范围',
      dataIndex: 'uv',
      render: (uv: string) => {
        return <span>{uv || '--'}</span>
      }
    },
    {
      title: '开启时间段',
      dataIndex: 'state',
      width: 180,
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (updateTime: string) => {
        return (
          <>
            {moment(updateTime).format('YYYY-MM-DD HH:mm:ss')}
          </>
        )
      },
    },
    {
      title: '内容状态',
      dataIndex: 'state',
      width: 100,
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_: any, record: any) => {
        return <span onClick={handleDetail.bind(null)}>详情</span>
      },
    },
  ];

  const handleDetail = () => {
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_POPUP_AD_DETAIL}`)
  }

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    return search;
  };

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row>
            <Col span={6} offset={1}>
              <Form.Item name="state" label="名称">
                <Input placeholder='请输入' />
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <Form.Item name="state" label="内容状态">
                <Select
                  placeholder="请选择"
                  allowClear
                  options={[{label: '上架', value: 0}, {label: '下架', value: 1}]}
                />
              </Form.Item>
            </Col>
            <Col offset={1} span={5}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = getSearchQuery();
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
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

  useEffect(() => {
    getPage();
  }, [searchContent]);

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <Button
            type="primary"
            onClick={() => {
              window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_POPUP_AD_ADD}`);
            }}
          >
            +新增
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey="id"
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                onChange: getPage,
                total: pageInfo.totalCount,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total: number) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
              }
          }
        />
      </div>
    </PageContainer>
  )
}
