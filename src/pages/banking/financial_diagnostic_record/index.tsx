import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Space,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import { useHistory } from 'react-router-dom';
import SelfTable from '@/components/self_table';
import type DiagnosticRecord from '@/types/financial-diagnostic-record';
import {
  getDiagnoseRecordList,
} from '@/services/financial-diagnostic-record';
const sc = scopedClasses('financial-diagnostic-record');

export default () => {
  const history = useHistory();
  const [dataSource, setDataSource] = useState<DiagnosticRecord.Content[]>([]);
  const [searchForm] = Form.useForm();
  const [searchContent, setSearChContent] = useState<{
    orgName?: string; // 企业名称
    exclusiveService?: boolean; // 是否满足金融专属服务 true满足 false不满足
    exclusiveAmount?: number; // 金融专属额度
    linkCustomer?: boolean; // 是否对接客户 true是 false否
    applyNumMin?: number; //	产品申请数量起始
    applyNumMax?: number; //	产品申请数量结束
    type?: number; //	诊断类型 1快速 2精准
    dateStart?: string; // 金融诊断时间起始
    dateEnd?: string; // 金融诊断时间结束
  }>({});
  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getDiagnoseRecordList({
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

  useEffect(() => {
    getPage();
  }, [searchContent]);

  //贷款产品模糊搜索
  // const [options, setOptions] = useState([]);
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name="orgName"
                label="企业名称"
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 13 }}
                name="type"
                label="金融诊断类型"
              >
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={1}>快速诊断</Select.Option>
                  <Select.Option value={2}>精准诊断</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                name="time"
                label="金融诊断时间"
              >
                <DatePicker.RangePicker style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                name="hasDemand"
                label="发布融资需求"
              >
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={true}>是</Select.Option>
                  <Select.Option value={false}>否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 13 }}
                name="demandState"
                label="需求状态"
              >
                <Select options={[{label: '待跟进', value: 1},{label: '已反馈至金融机构', value: 2},{label: '已授信', value: 3},{label: '授信失败', value: 4}]} placeholder="请选择" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="picName" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="需求负责人">
                <Input
                  maxLength={35}
                  placeholder="请输入"
                />
              </Form.Item>
            </Col>
          </Row>
          <div className={sc('container-search-opereate')}>
            <Button
              style={{ marginRight: 16 }}
              type="primary"
              key="search"
              onClick={() => {
                const search = searchForm.getFieldsValue();
                if (search.time) {
                  search.dateStart = moment(search.time[0]).format('YYYY-MM-DD');
                  search.dateEnd = moment(search.time[1]).format('YYYY-MM-DD');
                }
                setSearChContent(search);
              }}
            >
              查询
            </Button>
            <Button
              style={{ marginRight: 0 }}
              type="primary"
              key="reset"
              onClick={() => {
                searchForm.resetFields();
                setSearChContent({});
              }}
            >
              重置
            </Button>
          </div>
        </Form>
      </div>
    );
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 60,
      render: (_: any, _record: DiagnosticRecord.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '金融诊断编号',
      dataIndex: 'diagnoseNum',
      width: 150,
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: '150px',
    },
    {
      title: '金融诊断类型',
      dataIndex: 'type',
      render: (type: number) => {
        return type === 1 ? '快速诊断' : '精准诊断';
      },
      width: 120,
    },
    {
      title: '拟融资金额(万元)',
      dataIndex: 'amount',
      width: 120,
      render: (amount: number) => {
        return amount ? (amount / 1000000).toFixed(2) : '--';
      },
    },
    {
      title: '拟融资期限(个月)',
      dataIndex: 'term',
      width: 120,
    },
    {
      title: '诊断时间',
      dataIndex: 'createTime',
      width: 140,
    },
    {
      title: '产品申请数量',
      dataIndex: 'applyNum',
      width: 120,
    },
    {
      title: '发布融资需求',
      dataIndex: 'hasDemand',
      width: 120,
      render: (hasDemand: boolean) => {
        return (hasDemand ? '是' : '否')
      }
    },
    {
      title: '需求状态',
      dataIndex: 'demandStateContent',
      width: 140,
      render: (demandStateContent: string, record: DiagnosticRecord.Content) => {
        return (record.hasDemand && demandStateContent ? demandStateContent : '--')
      }
    },
    {
      title: '需求负责人',
      dataIndex: 'picNames',
      width: 120,
      render: (picNames: string) => {
        return (picNames || '--')
      }
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'option',
      width: 180,
      render: (_: any, record: DiagnosticRecord.Content) => {
        return (
          <Space>
            <Button
              size="small"
              type="link"
              onClick={() => {
                history.push(`${routeName.FINANCIAL_DIAGNOSTIC_RECORD_DETAIL}?id=${record.id}`);
              }}
            >
              诊断详情
            </Button>
            {record.hasDemand ? (
              <Button
                size="small"
                type="link"
                onClick={async () => {
                  history.push(`${routeName.FINANCIAL_DIAGNOSTIC_RECORD_DEMAND}?id=${record.demandId}`);
                }}
              >
                需求反馈
              </Button>
            ) : (
              <></>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer
      className={sc('container')}
      ghost
      header={{
        title: '金融诊断记录',
        breadcrumb: {},
      }}
    >
      {useSearchNode()}
      <div className={sc('container-table')}>
        <div className={sc('container-table-body')}>
          <SelfTable
            bordered
            scroll={{ x: 1400 }}
            columns={columns}
            dataSource={dataSource}
            rowKey={'id'}
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
      </div>
    </PageContainer>
  );
};
