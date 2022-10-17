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
  Popconfirm,
  Tooltip,
} from 'antd';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { EditTwoTone } from '@ant-design/icons';
import type IntendMessage from '@/types/intend-message';
import {
  getIntendMessagePage,
  markIntendMessageContracted,
  updateIntendMessageRemark,
} from '@/services/intend-message';
import { UploadOutlined } from '@ant-design/icons';
import { intendMessageExport } from '@/services/export';
const sc = scopedClasses('user-config-logout-verify');

export default () => {
  const [dataSource, setDataSource] = useState<IntendMessage.Content[]>([]);
  const [searchContent, setSearChContent] = useState<IntendMessage.SearchBody>({});
  const [remark, setRemark] = useState<string>('');

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
      const { result, totalCount, pageTotal, code, message } = await getIntendMessagePage({
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
      const markResult = await markIntendMessageContracted(record.id, remark);
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

  const updRemark = async (record: any) => {
    const tooltipMessage = '修改备注';
    try {
      const markResult = await updateIntendMessageRemark(record.id, remark);
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
      render: (_: any, _record: IntendMessage.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '企业名称',
      dataIndex: 'enterprise',
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
      title: '服务名称',
      dataIndex: 'solution',
      width: 150,
      render: (_: any) => {
        return (
          <Tooltip
            title={
              <div
                style={{
                  display: 'grid',
                  color: '#000',
                  padding: 10,
                }}
              >
                <span>联系电话：{_?.phone}</span>
                <span>所属企业：{_?.enterprise}</span>
              </div>
            }
            color={'#fff'}
          >
            <a>{_?.name}</a>
          </Tooltip>
        );
      },
    },
    {
      title: '意向内容',
      dataIndex: 'content',
      isEllipsis: true,
      width: 450,
    },
    {
      title: '意向时间',
      dataIndex: 'createTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '联系情况',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return !record.handlerState ? (
          <div style={{ textAlign: 'center' }}>
            <Space size={20}>
              <Popconfirm
                icon={null}
                title={
                  <>
                    <Input.TextArea
                      placeholder="可在此填写备注内容，备注非必填"
                      onChange={(e) => setRemark(e.target.value)}
                      value={remark}
                      showCount
                      maxLength={100}
                    />
                  </>
                }
                okText="确定"
                cancelText="取消"
                onConfirm={() => mark(record)}
              >
                <Button
                  type="link"
                  onClick={() => {
                    setRemark(record.remark || '');
                  }}
                >
                  标记已联系
                </Button>
              </Popconfirm>
            </Space>
          </div>
        ) : (
          <div style={{ display: 'grid', justifyItems: 'center' }}>
            <span>
              {record.handlerTime ? moment(record.handlerTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
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
              <Form.Item name="enterprise" label="企业名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="solution" label="服务名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="handlerState" label="联系情况">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={1}>待联系</Select.Option>
                  <Select.Option value={2}>已联系</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="time" label="意向时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.intendStartTime = moment(search.time[0]).format('YYYY-MM-DDTHH:mm:ss');
                    search.intendEndTime = moment(search.time[1]).format('YYYY-MM-DDTHH:mm:ss');
                  }
                  if (search.handlerState) {
                    search.handlerState = !!(search.handlerState - 1);
                  }
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

  const exportList = () => {
    console.log('searchInfo', searchContent)
    const { enterprise, solution, handlerState, intendEndTime, intendStartTime } = searchContent;
    intendMessageExport({
      enterprise,
      solution,
      handlerState,
      intendEndTime,
      intendStartTime,
    })
  }

  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>意向消息列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            icon={<UploadOutlined />}
            onClick={exportList}
          >
            导出
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1480 }}
          columns={columns}
          expandable={{
            expandedRowRender: (record: IntendMessage.Content) => (
              <p style={{ margin: 0 }}>
                备注：{record.remark}
                {record.editState && (
                  <Popconfirm
                    icon={null}
                    title={
                      <>
                        <Input.TextArea
                          placeholder="可在此填写备注内容，备注非必填"
                          onChange={(e) => setRemark(e.target.value)}
                          value={remark}
                          showCount
                          maxLength={100}
                        />
                      </>
                    }
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => updRemark(record)}
                  >
                    <EditTwoTone
                      onClick={() => {
                        setRemark(record.remark || '');
                      }}
                    />
                  </Popconfirm>
                )}
              </p>
            ),
            // rowExpandable: () => true,
            expandIcon: () => <></>,
            defaultExpandAllRows: true,
            expandedRowKeys: dataSource.map((p) => p.id),
          }}
          rowKey={'id'}
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
