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
import type ConsultRecord from '@/types/expert_manage/consult-record';
import {
  getConsultRecordPage,
  markConsultRecordContracted,
  updateConsultRecordRemark,
} from '@/services/expert_manage/consult-record';
const sc = scopedClasses('user-config-logout-verify');

export default () => {
  const [dataSource, setDataSource] = useState<ConsultRecord.Content[]>([]);
  const [searchContent, setSearChContent] = useState<ConsultRecord.SearchBody>({});
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
      const { result, totalCount, pageTotal, code, message } = await getConsultRecordPage({
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
      const markResult = await markConsultRecordContracted(record.id, remark);
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
    const tooltipMessage = '修改';
    try {
      const markResult = await updateConsultRecordRemark(record.id, remark);
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
      render: (_: any, _record: ConsultRecord.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'orgName',
      width: 150,
      isEllipsis: true,
    },
    {
      title: '所属企业',
      dataIndex: 'contactName',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '联系人',
      dataIndex: 'contactPhone',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '需求状态',
      dataIndex: 'contactPhone',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '分发情况',
      dataIndex: 'contactPhone',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return !record.contacted ? (
          <div style={{ textAlign: 'center' }}>
            <Space size={20}>
              <Button
                type="link"
                onClick={() => {
                  setRemark(record.remark || '');
                }}
              >
                需求细化
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setRemark(record.remark || '');
                }}
              >
                编辑细化内容
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setRemark(record.remark || '');
                }}
              >
                分发
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setRemark(record.remark || '');
                }}
              >
                撤回分发
              </Button>
            </Space>
          </div>
        ) : ('--');
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
              <Form.Item name="orgName" label="需求状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={1}>待联系</Select.Option>
                  <Select.Option value={2}>已联系</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="expertName" label="需求分发情况">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={1}>待联系</Select.Option>
                  <Select.Option value={2}>已联系</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col offset={4} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.startCreateTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.endCreateTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
                  }
                  if (search.contacted) {
                    search.contacted = !!(search.contacted - 1);
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

  return (
    <>
      {useSearchNode()}
      {/* <div className={sc('container-table-header')}>
        <div className="title">
          <span>咨询记录列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div> */}
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1280 }}
          columns={columns}
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
