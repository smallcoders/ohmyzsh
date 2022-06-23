import {
  Button,
  Form,
  Select,
  Row,
  Col,
  message,
  Space,
  Input,
  Drawer,
  InputNumber,
  Modal,
  DatePicker,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import '../index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import {
  getRecordPage,
  getPersonalSearchRecords,
  addOrUpdateReportFile,
} from '@/services/search-record';
import moment from 'moment';
import { routeName } from '../../../../../config/routes';
import { history } from 'umi';
import SelfTable from '@/components/self_table';
import type DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import UploadFormFile from '@/components/upload_form/upload-form-file';
import { getAreaTree } from '@/services/area';
import { stringify } from 'rc-field-form/es/useWatch';
const sc = scopedClasses('service-config-diagnostic-tasks');
export default () => {
  const [dataSource, setDataSource] = useState<DiagnosticTasks.OnlineRecord[]>([]);
  const [searchContent, setSearChContent] = useState<{
    status?: DiagnosticTasks.Status; // 状态：0发布中、1待发布、2已下架
    content?: string;
    areaCode?: number;
    startDate?: string;
    endDate?: string;
  }>({});
  const [editingItem, setEditingItem] = useState<DiagnosticTasks.OnlineRecord | undefined>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const [userPageInfo, setUserPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });
  const [userDataSource, setUserDataSource] = useState<DiagnosticTasks.OnlineRecord[]>([]);

  /**
   * 获取搜索记录
   * @param pageIndex
   * @param pageSize
   */
  const getDiagnosticTasks = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getRecordPage({
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

  const showDrawer = async (id: string, pageIndex: number = 1, pageSize = userPageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getPersonalSearchRecords({
        userId: id,
        pageIndex,
        pageSize,
        ...searchContent
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setUserDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
      setDrawerSize('large');
      setVisible(true);
    } catch (error) {
      message.error('服务器报错');
    }
  };

  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [drawerSize, setDrawerSize] = useState();

  const onClose = () => {
    setVisible(false);
  };

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
      dataIndex: 'operateUserName',
      width: 200
    },
    {
      title: '活动名称',
      dataIndex: 'phone',
      width: 200,
    },
    {
      title: '活动时间',
      dataIndex: 'searchTime',
      width: 200,
    },
    {
      title: '订单总数',
      dataIndex: 'content',
      width: 200,
    },
    {
      title: '订单总金额',
      dataIndex: 'content',
      width: 200,
    },
    {
      title: '上架状态',
      dataIndex: 'content',
      width: 200,
    },
    {
      title: '活动状态',
      dataIndex: 'content',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'content',
      width: 200,
    },
    {
      title: '操作',
      width: 120,
      dataIndex: 'option',
      render: (_: any) => {
        return (
          <a
            href="#"
            onClick={() => {
              history.push(`${routeName.SALES_STATISTICS_DETAIL}?id=1637113902630001`)
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
  const [areaOptions, setAreaOptions] = useState<any>([]);

  useEffect(() => {
    getAreaTree({}).then((data) => {
      setAreaOptions(data?.children || []);
    });
  }, []);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
          <Col span={6}>
              <Form.Item name="content" label="活动编码">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={4} offset={14}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const { date, ...rest } = search;
                  if (date) {
                    rest.startDate = moment(search.date[0]).format('YYYY-MM-DD');
                    rest.endDate = moment(search.date[1]).format('YYYY-MM-DD');
                  }
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

  const useDrawerSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={10} offset={1}>
              <Form.Item name="date" label="搜索日期">
                <DatePicker.RangePicker allowClear />
              </Form.Item>
            </Col>
            <Col span={8} offset={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const { date, ...rest } = search;
                  if (date) {
                    rest.startDate = moment(search.date[0]).format('YYYY-MM-DD');
                    rest.endDate = moment(search.date[1]).format('YYYY-MM-DD');
                  }
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
          <Button type='primary' icon={<DownloadOutlined />}>导出</Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
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
  );
};
