import { DeleteOutlined, PaperClipOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Select, Row, Col, message, Space, Popconfirm } from 'antd';
import '../service-config-diagnostic-tasks.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import {
  getDiagnosisRecords,
  getXTYSkipUrl,
  addOrUpdateReportFile,
  deleteReportFile,
} from '@/services/diagnostic-tasks';
import moment from 'moment';
import { routeName } from '../../../../../config/routes';
import { history } from 'umi';
import SelfTable from '@/components/self_table';
import DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import UploadForm from '@/components/upload_form';
const sc = scopedClasses('service-config-diagnostic-tasks');
export default () => {
  const [dataSource, setDataSource] = useState<DiagnosticTasks.OnlineRecord[]>([]);
  const [searchContent, setSearChContent] = useState<{
    status?: DiagnosticTasks.Status; // 状态：0发布中、1待发布、2已下架
  }>({});

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

  const remove = async (id: string) => {
    try {
      await deleteReportFile(id);
      getDiagnosticTasks();
    } catch (error) {
      message.error('服务器报错');
    }
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
      title: '企业名称',
      dataIndex: 'org',
      isEllipsis: true,
      render: (org: { id: string; orgName: string }, record: DiagnosticTasks.OnlineRecord) => (
        <a href="#" onClick={() => open(record?.id)}>
          {org.orgName}
        </a>
      ),
      width: 300,
    },
    {
      title: '上次诊断时间',
      dataIndex: 'lastDiagnosisTime',
      width: 200,
    },
    {
      title: '点击诊断次数',
      dataIndex: 'diagnosisCount',
      width: 200,
    },
    {
      title: '诊断报告',
      dataIndex: 'reportFile',
      width: 400,
      render: (reportFile: any, record: DiagnosticTasks.OnlineRecord) => {
        return (
          reportFile && (
            <div style={{ color: '#6680FF' }}>
              <PaperClipOutlined />
              <a
                href="#"
                onClick={() => {
                  history.push(`${routeName.DIAGNOSTIC_TASKS_REPORT}?fileId=${reportFile?.id}`);
                }}
              >
                {reportFile?.fileName}.{reportFile?.fileFormat}
              </a>
              <Popconfirm
                title="确定删除此报告么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id as string)}
              >
                <DeleteOutlined
                  style={{ color: '#6680FF', fontSize: 16, cursor: 'pointer', marginLeft: 10 }}
                />
              </Popconfirm>
            </div>
          )
        );
      },
    },
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
            <UploadForm
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
            </UploadForm>
          </Space>
        );
      },
    },
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
            <Col span={8}>
              <Form.Item name="status" label="诊断报告">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'ON_DIAGNOSIS'}>诊断中</Select.Option>
                  <Select.Option value={'DIAGNOSIS_FINISHED'}>诊断完成</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.startDate = moment(search.time[0]).format('YYYY-MM-DD');
                    search.endDate = moment(search.time[1]).format('YYYY-MM-DD');
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
          <span>诊断记录列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
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
