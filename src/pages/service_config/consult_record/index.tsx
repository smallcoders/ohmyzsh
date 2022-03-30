import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
  Space,
} from 'antd';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { getConsultPage, markContracted } from '@/services/app-resource';
import type AppResource from '@/types/app-resource';
const sc = scopedClasses('user-config-logout-verify');

export default () => {
  const [dataSource, setDataSource] = useState<AppResource.ConsultRecordContent[]>([]);
  const [searchContent, setSearChContent] = useState<AppResource.ConsultRecordSearchBody>({});

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getConsultPage({
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

  const mark = async (record: any) => {
    const tooltipMessage = '标记已联系';
    try {
      const markResult = await markContracted(record.id);
      if (markResult.code === 0) {
        antdMessage.success(`${tooltipMessage}成功`);
        getPage();
      } else {
        throw new Error(markResult.message);
      }
    } catch (error) {
      antdMessage.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: AppResource.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
      width: 150,
      isEllipsis: true,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '应用需求',
      dataIndex: 'content',
      isEllipsis: true,
      width: 450,
    },
    {
      title: '咨询时间',
      dataIndex: 'submitTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '联系情况',
      width: 200,
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return !record.isHandle ? (
          <div style={{ textAlign: 'center' }}>
            <Space size={20}>
              <Button type="link" onClick={() => mark(record)}>
                标记已联系
              </Button>
            </Space>
          </div>
        ) : (
          <div style={{ display: 'grid', justifyItems: 'center' }}>
            <span>
              {record.handleTime ? moment(record.handleTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
            </span>
            <span>操作人：{record.handlerName}</span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="orgName" label="企业名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="appName" label="应用名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isHandle" label="联系情况">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={1}>待联系</Select.Option>
                  <Select.Option value={2}>已联系</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="time" label="咨询时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.startDate = moment(search.time[0]).format('YYYY-MM-DDTHH:mm:ss');
                    search.endDate = moment(search.time[1]).format('YYYY-MM-DDTHH:mm:ss');
                  }
                  if (search.isHandle) {
                    search.isHandle = !!(search.isHandle - 1);
                  }
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary"
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
          <span>咨询记录列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1480 }}
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
    </>
  );
};
