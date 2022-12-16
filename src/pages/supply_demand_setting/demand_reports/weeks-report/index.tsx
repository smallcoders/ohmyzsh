import {
  Button,
  Form,
  Row,
  Col,
  message,
  Input,
} from 'antd';

import { DownloadOutlined } from "@ant-design/icons";

import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import { Access, useAccess } from 'umi';
import SelfTable from '@/components/self_table';
const sc = scopedClasses('tab-menu-demand-report-weeks');

export default () => {

  const [searchContent, setSearChContent] = useState<{
    time?: string;
  }>({});

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [dataSource, setDataSource] = useState<any[]>([]);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  // /**
  //  * 获取数据列表
  //  * @param pageIndex
  //  * @param pageSize
  //  */
  const getDataList = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      // 模拟走接口
      const totalCount = 1, pageTotal = 1
      const result: any = []
      setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
      setDataSource(result);
      // 这样走接口
      // const { result, totalCount, pageTotal, code } = await getActivityList({
      //   pageIndex,
      //   pageSize,
      //   ...searchContent,
      // });
      // if (code === 0) {
      //   setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
      //   setDataSource(result);
      // } else {
      //   message.error(`请求分页数据失败`);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '活动编码',
      dataIndex: 'actNo',
      width: 200
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
            }}
          >
            查看详情
          </a>
        );
      },
    },
  ];

  useEffect(() => {
    getDataList()
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

  const access = useAccess()

  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>活动列表(共{pageInfo.totalCount || 0}个)</span>
          <Access accessible={access['PX_PM_TJ_HD']}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
              }}
            >
              导出数据
            </Button>
          </Access>
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
                  onChange: getDataList,
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
