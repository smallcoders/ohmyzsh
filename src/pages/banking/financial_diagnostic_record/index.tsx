import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Modal,
  message,
  Space,
  Radio,
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
  getLoanProList,
  addCustomerDemand,
  queryCustomerDemand,
} from '@/services/financial-diagnostic-record';
import { debounce } from 'lodash';
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
  const [form] = Form.useForm();
  const [remarksItem, setRemarksItem] = useState<DiagnosticRecord.Content>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [isLoanDemand, setIsLoanDemand] = useState(true);
  const [customerDemand, setCustomerDemand] = useState<DiagnosticRecord.CustomerDemand>({});
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
  const getCustomerDemand = async (id: number) => {
    try {
      const { code, result } = await queryCustomerDemand(id);
      if (code === 0 && result !== null) {
        setCustomerDemand(result);
        form.setFieldsValue({
          ...result,
          amount: result?.amount === null ? null : (result?.amount / 1000000).toFixed(2),
        });
        setIsLoanDemand(result.loanDemand);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPage();
  }, [searchContent]);

  //贷款产品模糊搜索
  const [options, setOptions] = useState([]);
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
                name="exclusiveService"
                label="满足金融专属服务"
              >
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={true}>是</Select.Option>
                  <Select.Option value={false}>否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                name="linkCustomer"
                label="是否对接客户"
              >
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={true}>是</Select.Option>
                  <Select.Option value={false}>否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="产品申请数量">
                <Input.Group compact>
                  <Form.Item name="applyNumMin" style={{ width: 'calc(50% - 15px)' }}>
                    <InputNumber min={1} placeholder="请输入" style={{ width: '100%' }} />
                  </Form.Item>
                  <Input
                    style={{
                      width: 30,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff',
                    }}
                    placeholder="~"
                    disabled
                  />
                  <Form.Item name="applyNumMax" style={{ width: 'calc(50% - 15px)' }}>
                    <InputNumber min={1} placeholder="请输入" style={{ width: '100%' }} />
                  </Form.Item>
                </Input.Group>
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
          </Row>
          <div className={sc('container-search-opereate')}>
            <Button
              style={{ marginRight: 16 }}
              type="primary"
              key="search"
              onClick={() => {
                const search = searchForm.getFieldsValue();
                console.log('search', search);
                if (search.time) {
                  search.dateStart = moment(search.time[0]).format('YYYY-MM-DD');
                  search.dateEnd = moment(search.time[1]).format('YYYY-MM-DD');
                }
                if (search.applyNum) {
                  search.applyNumMin = search.applyNum[0];
                  search.applyNumMax = search.applyNum[1];
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

  const handleSearch = debounce(async (value: string) => {
    try {
      const { result } = await getLoanProList({ productName: value });
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const options = result?.map((item: { productId: string; productName: string }) => {
        return {
          value: item.productId,
          label: item.productName,
        };
      });
      setOptions(options);
    } catch (error) {
      console.log(error);
    }
  }, 200);

  const selectProduct = async () => {
    try {
      const { result } = await getLoanProList({ productName: '' });
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const options = result?.map((item: { productId: string; productName: string }) => {
        return {
          value: item.productId,
          label: item.productName,
        };
      });
      setOptions(options);
    } catch (error) {
      console.log(error);
    }
  };
  const clearForm = () => {
    form.resetFields();
    setModalVisible(false);
    setIsLoanDemand(true);
  };
  // 备注确定
  const onFinsh = async () => {
    const values = await form.validateFields();
    console.log(values);
    console.log(remarksItem);
    try {
      setAddOrUpdateLoading(true);
      const { code, message: resultMsg } = await addCustomerDemand({
        ...values,
        amount: values.amount * 1000000,
        diagnoseId: remarksItem.id,
        id: Object.keys(customerDemand).length === 0 ? null : customerDemand.id,
      });
      if (code === 0) {
        message.success(`备注成功！`);
        getPage();
        clearForm();
      } else {
        message.error(`备注失败，原因:{${resultMsg}}`);
      }
      setAddOrUpdateLoading(false);
    } catch (error) {
      message.error(`备注失败，原因:{${error}}`);
    }
    setAddOrUpdateLoading(false);
  };
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title="备注"
        width="800px"
        visible={modalVisible}
        maskClosable={false}
        className={sc('container-modal')}
        okButtonProps={{ loading: addOrUpdateLoading }}
        okText="确定"
        onOk={() => {
          onFinsh();
        }}
        onCancel={() => {
          clearForm();
        }}
      >
        <Row className="modal-title">
          <Col span={10} offset={2}>
            <label>金融诊断编号：</label>
            {remarksItem.diagnoseNum}
          </Col>
          <Col span={10}>
            <label>企业名称：</label>
            {remarksItem.orgName}
          </Col>
        </Row>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          className={sc('modal-form')}
          validateTrigger="onBlur"
        >
          <Form.Item
            label="客户贷款需求"
            name="loanDemand"
            initialValue={true}
            rules={[{ required: true, message: '请选择' }]}
          >
            <Radio.Group
              onChange={(e) => {
                setIsLoanDemand(e.target.value);
              }}
            >
              <Radio value={true}>有贷款需求</Radio>
              <Radio value={false}>无贷款需求</Radio>
            </Radio.Group>
          </Form.Item>
          {isLoanDemand ? (
            <>
              <Form.Item
                name="amount"
                label="拟融资额度"
                rules={[{ required: true, message: '请填写拟融资额度' }]}
              >
                <InputNumber
                  precision={2}
                  max={999999.99}
                  min={0}
                  addonAfter="万元"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                name="term"
                label="拟融资期限"
                rules={[{ required: true, message: '请填写拟融资期限' }]}
              >
                <InputNumber min={1} precision={0} addonAfter="个月" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="purpose"
                label="融资用途"
                rules={[{ required: true, message: '请填写融资用途' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="recProduct" label="推荐金融产品">
                <Select
                  onSearch={handleSearch}
                  showSearch
                  allowClear
                  filterOption={false}
                  options={options}
                  placeholder="请选择"
                />
              </Form.Item>
            </>
          ) : (
            <></>
          )}
        </Form>
      </Modal>
    );
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: DiagnosticRecord.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '金融诊断编号',
      dataIndex: 'diagnoseNum',
      width: 120,
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 140,
    },
    {
      title: '满足金融专属服务',
      dataIndex: 'exclusiveService',
      render: (exclusiveService: boolean) => {
        return exclusiveService ? '是' : '否';
      },
      width: 160,
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
      width: 160,
      render: (amount: number) => {
        return amount ? (amount / 1000000).toFixed(2) : '--';
      },
    },
    {
      title: '拟融资期限(个月)',
      dataIndex: 'term',
      width: 160,
    },
    {
      title: '诊断时间',
      dataIndex: 'createTime',
      width: 160,
    },
    {
      title: '产品申请数量',
      dataIndex: 'applyNum',
      width: 120,
    },
    {
      title: '是否对接客户',
      dataIndex: 'linkCustomer',
      render: (linkCustomer: boolean) => {
        return linkCustomer ? '是' : '否';
      },
      width: 140,
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'option',
      width: 140,
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
            {record.exclusiveService && record.applyNum === 0 ? (
              <Button
                size="small"
                type="link"
                onClick={async () => {
                  await getCustomerDemand(record.id as number);
                  setRemarksItem(record);
                  selectProduct();
                  setModalVisible(true);
                }}
              >
                备注
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
      {useModal()}
    </PageContainer>
  );
};
