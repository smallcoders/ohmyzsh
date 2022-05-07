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
  InputNumber,
  Modal,
  DatePicker,
} from 'antd';
import '../service-config-diagnostic-tasks.less';
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
    labelCol: { span: 5 },
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

  const open = async (id: string) => {
    try {
      const { result } = await getXTYSkipUrl(id);
      window.open(result);
    } catch (error) {
      message.error('服务器报错');
    }
  };

  const [form] = Form.useForm();

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: DiagnosticTasks.OnlineRecord, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '企业名称',
      dataIndex: 'org',
      isEllipsis: true,
      render: (org: { id: string; orgName: string }, record: DiagnosticTasks.OnlineRecord) => (
        <a href="#" onClick={() => open(record?.id)}>
          {org?.orgName || ''}
        </a>
      ),
      width: 300,
    },
    {
      title: '所属区域',
      dataIndex: 'area',
      ellipsis: true,
      render: (area: any) => area?.name || '/',
      width: 200,
    },
    {
      title: '诊断时间',
      dataIndex: 'lastDiagnosisTime',
      ellipsis: true,
      width: 200,
    },
    {
      title: '总体得分',
      dataIndex: 'score',
      width: 200,
    },
    {
      title: '总体结果',
      dataIndex: 'conclusion',
      ellipsis: true,
      width: 200,
    },
    // {
    //   title: '诊断报告',
    //   dataIndex: 'reportFile',
    //   width: 400,
    //   render: (reportFile: any, record: DiagnosticTasks.OnlineRecord) => {
    //     return (
    //       reportFile && (
    //         <div style={{ color: '#6680FF', display: 'flex', alignItems: 'center' }}>
    //           <PaperClipOutlined />
    //           <Button
    //             type="link"
    //             style={{ height: 'auto' }}
    //             onClick={() => {
    //               // openPDF(reportFile?.id, reportFile?.fileName)
    //               history.push(`${routeName.DIAGNOSTIC_TASKS_REPORT}?fileId=${reportFile?.id}`);
    //             }}
    //           >
    //             <div className={'file-name'}>
    //               {reportFile?.fileName}.{reportFile?.fileFormat}
    //             </div>
    //           </Button>
    //           <Popconfirm
    //             title="确定删除此报告么？"
    //             okText="确定"
    //             cancelText="取消"
    //             onConfirm={() => remove(record.id as string)}
    //           >
    //             <DeleteOutlined style={{ color: '#6680FF', fontSize: 16, cursor: 'pointer' }} />
    //           </Popconfirm>
    //         </div>
    //       )
    //     );
    //   },
    // },
    {
      title: '操作',
      dataIndex: 'option',
      width: 200,
      render: (_: any, record: DiagnosticTasks.OnlineRecord) => {
        return (
          /**
           * 待诊断可编辑
           * 待诊断时延期 可编辑
           */
          <Space size="middle">
            {/* <UploadForm
              accept=".pdf"
              showUploadList={false}
              onChange={async (reportFileId: any) => {
                try {
                  await addOrUpdateReportFile({
                    id: record.id,
                    reportFileId,
                  });
                  await getDiagnosticTasks();
                } catch (error) {
                  message.error('上传失败');
                }
              }}
            >
              <Button icon={<UploadOutlined />}>上传报告</Button>
            </UploadForm> onClick={() => pass(record)} */}
            <Button
              type="link"
              onClick={() => {
                const item = {
                  score: record.score,
                  conclusion: record.conclusion,
                  id: record.id,
                  reportFileId: record?.reportFile ? [record?.reportFile] : [],
                } as any;
                setEditingItem(item);
                setModalVisible(true);
                form.setFieldsValue({ ...item });
              }}
            >
              编辑
            </Button>
            {record?.reportFile?.id && (
              <Button
                type="link"
                style={{ height: 'auto' }}
                onClick={() => {
                  // openPDF(reportFile?.id, reportFile?.fileName)
                  history.push(
                    `${routeName.DIAGNOSTIC_TASKS_REPORT}?fileId=${record?.reportFile?.id}`,
                  );
                }}
              >
                查看报告
              </Button>
            )}
          </Space>
        );
      },
    },
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
            <Col span={8}>
              <Form.Item name="status" label="诊断报告">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'ON_DIAGNOSIS'}>未上传</Select.Option>
                  <Select.Option value={'DIAGNOSIS_FINISHED'}>已上传</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="orgName" label="企业名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="areaCode" label="所属区域">
                <Select placeholder="请选择" allowClear>
                  {areaOptions?.map((item: any) => (
                    <Select.Option key={item?.code} value={Number(item?.code)}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <div style={{ height: 20, width: '100%' }} />
            <Col span={8}>
              <Form.Item name="time" label="诊断时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={3} offset={13}>
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

  /**
   * 副作用清除
   */
  const clearForm = () => {
    form.resetFields();
    setEditingItem(undefined);
  };

  /**
   * 添加或者修改
   */
  const addOrUpdate = async () => {
    const tooltipMessage = '编辑';
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        const params = {
          ...value,
          reportFileId: value.reportFileId?.map((p: { id: string }) => p.id).join(','),
        };
        const addorUpdateRes = await addOrUpdateReportFile({
          ...params,
          id: editingItem?.id,
        });
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          message.success(`${tooltipMessage}成功`);
          getDiagnosticTasks();
          clearForm();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={'编辑任务'}
        width="600px"
        visible={modalVisible}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        destroyOnClose
        okButtonProps={{ loading: addOrUpdateLoading }}
        onOk={async () => {
          addOrUpdate();
        }}
      >
        <Form {...formLayout} form={form} layout="horizontal">
          <Form.Item
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            name="score"
            label="总体得分"
          >
            <InputNumber
              precision={2}
              placeholder="请输入"
              maxLength={99999999}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            name="conclusion"
            label="总体结果"
          >
            <Input.TextArea placeholder="请输入" maxLength={80} showCount />
          </Form.Item>
          <Form.Item
            name="reportFileId" // state 	状态0发布中1待发布2已下架
            label="上传报告"
          >
            <UploadFormFile accept=".pdf" showUploadList={true} maxCount={1}>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </UploadFormFile>

            {/* <Popconfirm
              title="确定删除此报告么？"
              okText="确定"
              cancelText="取消"
              // onConfirm={() => remove(record.id as string)}
            >
              <DeleteOutlined style={{ color: '#6680FF', fontSize: 16, cursor: 'pointer' }} />
            </Popconfirm> */}
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>诊断记录列表(共{pageInfo.totalCount || 0}个)</span>
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
      {useModal()}
    </>
  );
};
