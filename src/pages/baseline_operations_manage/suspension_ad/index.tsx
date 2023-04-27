import {
  Button,
  Form,
  Select,
  Row,
  Col,
  message as antdMessage,
  Modal,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import {
  getPageList,
} from '@/services/page-creat-manage'
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { routeName } from '../../../../config/routes';
const sc = scopedClasses('suspension-list');

interface record {
  tmpId: string;
  tmpName: string;
  tmpDesc: string;
  state: string | number,
  updateTime: string,
  tmpJson: string,
  tmpType: number,
}


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
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const handleDelete = (record: record) => {
    Modal.confirm({
      title: '删除数据',
      content: '删除该内容流广告后，系统将不再推荐该广告，确定删除？',
      okText: '删除',
      onOk: () => {
      },
    })
  }
  const handleUpOrDown = (record: record) => {
    Modal.confirm({
      title: '提示',
      content: record.state === 1 ? '确定将内容上架？' : '确定将内容下架？',
      okText: '下架',
      onOk: () => {
        antdMessage.success(`下架成功`);
      },
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'tmpName',
      width: 150,
      render: (tmpName: string, record: record) => {
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
      title: '版面',
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
      title: '点击次数',
      dataIndex: 'state',
      width: 100,
    },
    {
      title: '用户数',
      dataIndex: 'state',
      width: 100,
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
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_: any, record: any) => {
        return <span>--</span>
      },
    },
  ];

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    return search;
  };
  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row>
            <Col span={6} offset={1}>
              <Form.Item name="state" label="模板状态">
                <Select
                  placeholder="请选择"
                  allowClear
                  options={[{label: '产业圈', value: 0}, {label: '商脉', value: 1}, {lable: '我的', value: 2}]}
                />
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <Form.Item name="state" label="模板状态">
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

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <Button
            type="primary"
            onClick={() => {
              window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD_ADD}`);
            }}
          >
            +新建
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
  );
};
