import { UploadOutlined } from '@ant-design/icons';
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
import '../index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import {
  getDiagnosisRecords,
  getXTYSkipUrl,
  addOrUpdateReportFile,
} from '@/services/diagnostic-tasks';
import moment from 'moment';
import { routeName } from '../../../../../config/routes';
import { history } from 'umi';
import SelfTable from '@/components/self_table';
import type DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import UploadFormFile from '@/components/upload_form/upload-form-file';
import { getAreaTree } from '@/services/area';
const sc = scopedClasses('service-config-diagnostic-tasks');
export default () => {
  const [dataSource, setDataSource] = useState<DiagnosticTasks.OnlineRecord[]>([]);
  const [searchContent, setSearChContent] = useState<{
    status?: DiagnosticTasks.Status; // 状态：0发布中、1待发布、2已下架
    orgName?: string;
    areaCode?: number;
    startTime?: string;
    endTime?: string;
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

  /**
   * 获取诊断任务
   * @param pageIndex
   * @param pageSize
   */
  const getDiagnosticTasks = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getDiagnosisRecords({
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

  const showDrawer = async (id: string) => {
    try {
      const { result } = await getXTYSkipUrl(id);
      console.log(result);
      // window.open(result);
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
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: DiagnosticTasks.OnlineRecord, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'org',
      isEllipsis: true,
      render: (org: { id: string; orgName: string }, record: DiagnosticTasks.OnlineRecord) => (
        <a href="#" onClick={() => showDrawer(record?.id)}>
          {org?.orgName || ''}
        </a>
      ),
      width: 300,
    },
    {
      title: '联系方式',
      dataIndex: 'area',
      ellipsis: true,
      render: (area: any) => area?.name || '/',
      width: 200,
    },
    {
      title: '搜索内容',
      dataIndex: 'score',
      width: 200,
    },
    {
      title: '搜索时间',
      dataIndex: 'lastDiagnosisTime',
      ellipsis: true,
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
              <Form.Item name="orgName" label="搜索内容">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="time" label="日期">
                <DatePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="orgName" label="用户名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={4} offset={2}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const { time, ...rest } = search;
                  if (time) {
                    rest.startTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    rest.endTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
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
              <Form.Item name="time" label="搜索日期">
                <DatePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={8} offset={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const { time, ...rest } = search;
                  if (time) {
                    rest.startTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    rest.endTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
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
          <span>记录列表(共{pageInfo.totalCount || 0}个)</span>
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
      <Drawer title="用户名" placement="right" onClose={onClose} visible={visible} size={drawerSize}>
        {useDrawerSearchNode()}
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
      </Drawer>
    </>
  );
};
