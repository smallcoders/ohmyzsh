import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  Popconfirm,
  DatePicker,
  Modal,
  message,
  Space,
  Dropdown,
  Menu,
  Switch,
  Tooltip,
} from 'antd';
import { PlusOutlined, CaretUpOutlined, DownOutlined } from '@ant-design/icons';
import type { TableRowSelection } from 'antd/es/table/interface';
import { PageContainer } from '@ant-design/pro-layout';
import { ProFormDigitRange } from '@ant-design/pro-components';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { UploadOutlined } from '@ant-design/icons';
import FormEdit from '@/components/FormEdit';
import BankingLoan from '@/types/banking-loan.d';
import { history, useHistory } from 'umi';
import { regFenToYuan, regYuanToFen } from '@/utils/util';
import {
  getLoanRecordList,
  getTotalAmount,
  queryBankList,
  loanRecordExport,
  takeNotes,
  getTakeMoneyDetail,
} from '@/services/banking-loan';
import { statusMap, productTypeMap, guaranteeMethodMap } from './constants';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
const sc = scopedClasses('product-management');
const { DataSourcesTrans, creditStatusTrans } = BankingLoan;

export default () => {
  const [dataSource, setDataSource] = useState<BankingLoan.Content[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchForm] = Form.useForm();
  const [searchContent, setSearChContent] = useState<{
    applyNo?: string; // 业务申请编号
    orgName?: string; // 企业名称
    applyTimeStart?: string; // 申请开始时间 yyyy-MM-dd
    applyTimeEnd?: string; // 申请截至时间 yyyy-MM-dd
    dataSource?: number; // 数据来源，0-人工录入，1-API获取，2-邮箱解析
    bank?: string; // 金融机构
    creditStatus?: number[]; // 授信状态，2-已授信 3-授信失败 6-待授信
    productName?: string; // 产品名称
    takeMoneyMin?: number; // 放款金额最小值
    takeMoneyMax?: number; // 放款金额最大值
    creditAmountMin?: number; // 授信金额最小值
    creditAmountMax?: number; // 授信金额最大值
  }>({});

  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };

  /**
   * 新建窗口的弹窗
   *  */
  // const dialogFormLayout = {
  //   labelCol: { span: 3 },
  //   wrapperCol: { span: 18 },
  // };
  const [form] = Form.useForm();
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<BankingLoan.Content>({});
  const clearForm = () => {
    form.resetFields();
    if (editingItem.id) setEditingItem({});
  };
  const [totalAmount, setTotalAmount] = useState<BankingLoan.totalAmountContent>({});
  const [tableParams, setTableParams] = useState<{ sortField?: string; sortOrder?: string }>({});
  // const [bankList, setBankList] = useState<{ bank: string }[]>([]);
  // const [isMore, setIsMore] = useState<boolean>(false);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  // 参数存储
  const setParams = () => {
    localStorage.setItem('load_record_params', JSON.stringify(searchContent));
  };
  // 返回参数回填
  const backParamSet = () => {
    if (history.action === 'POP') {
      const SearChContentJson: any = localStorage.getItem('load_record_params');
      if (!SearChContentJson) return;
      const SearChContentJsonParse: any = JSON.parse(SearChContentJson);
      const {
        applyTimeStart,
        applyTimeEnd,
        takeMoneyMin,
        takeMoneyMax,
        creditAmountMin,
        creditAmountMax,
        ...rest
      } = SearChContentJsonParse;
      searchForm.setFieldsValue({
        ...rest,
        time:
          applyTimeStart && applyTimeEnd ? [moment(applyTimeStart), moment(applyTimeEnd)] : null,
      });
      setSearChContent(SearChContentJsonParse);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      backParamSet();
    }, 1000);
  }, []);
  const getPage = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getLoanRecordList({
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
  /**
   * @zh-CN 需求类型编辑
   */
  const addOrUpdata = () => {
    form
      .validateFields()
      .then(async (value) => {
        try {
          const addorUpdateRes = await takeNotes({ ...value, id: editingItem.id });
          if (addorUpdateRes.code === 0) {
            setModalVisible(false);
            message.success(`备注保存成功！`);
            getPage();
            clearForm();
          } else {
            message.error(`备注保存失败，原因:{${addorUpdateRes.message}}`);
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getModal = () => {
    return (
      <Modal
        title="备注"
        width="720px"
        maskClosable={false}
        visible={createModalVisible}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        onOk={async () => {
          await addOrUpdata();
        }}
      >
        <Form form={form}>
          <Row>
            <Col span="12">
              <Form.Item
                name="dealName"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 12 }}
                label="业务申请编号"
              >
                <div>{editingItem.id}</div>
                {/* <Input disabled /> */}
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item
                name="dealName1"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 18 }}
                label="企业名称"
              >
                {/* <Input disabled /> */}
                <div>{editingItem.orgName}</div>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 18 }}
            name="text"
            label="备注"
            rules={[{ required: true }]}
          >
            <FormEdit />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const getTotal = async () => {
    try {
      const { result, code } = await getTotalAmount({
        ...searchContent,
      });
      if (code === 0) {
        setTotalAmount(result);
      } else {
        message.error(`请求统计数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getStep = async (p: BankingLoan.Content, type: number): Promise<any> => {
    const { id, creditStatus } = p;
    if (creditStatus === '已授信') {
      // 供应链e贷产品没有还款信息
      if (!type) {
        return 3;
      }
      try {
        const { result, code } = await getTakeMoneyDetail({
          pageIndex: 1,
          pageSize: 10,
          creditId: id,
        });
        if (code === 0) {
          if (
            result?.takeMoneyInfo?.some(
              (item: BankingLoan.TakeMoneyInfoContent) => item.status == '放款成功',
            )
          ) {
            return 4;
          } else {
            return 3;
          }
        } else {
          message.error(`放款判断失败`);
        }
      } catch (error) {
        console.log(error);
        return 0;
      }
    } else {
      return 2;
    }
  };
  const remove = (id: any) => {
    console.log(id);
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 50,
      render: (_: any, _record: BankingLoan.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '产品名称',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '被申请次数',
      dataIndex: 'amount',
      sorter: true,
      width: 100,
      render: (_: number) => regFenToYuan(_),
    },
    {
      title: '面向对象',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '产品类型',
      dataIndex: 'phone',
      width: 100,
    },
    {
      title: '担保方式',
      dataIndex: 'productName',
      width: 150,
    },
    {
      title: '发布状态',
      dataIndex: 'creditStatus',
      width: 100,
      render: (_: string, record: BankingLoan.Content) => {
        return (
          <div className={`state${_}`}>
            {_ || '--'}
            {_ === '授信失败' && (
              <Tooltip
                placement="topLeft"
                title={
                  <div>
                    <p>失败原因</p>
                    <div>{record.refuseReason}</div>
                  </div>
                }
              >
                <div className={sc('show-reason')}>查看原因</div>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: '显示热门',
      dataIndex: 'creditAmount',
      render: (_: number, record: any) => {
        return (
          <Popconfirm
            title="确定上架么？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => remove(record.id)}
          >
            <Switch disabled={false} checked={false} />
          </Popconfirm>
        );
      },
      width: 100,
    },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: BankingLoan.Content) => {
        const isApiType = record.productId === 1662285468000019;
        const type = isApiType ? 0 : 1;
        return (
          <Space>
            {!isApiType ? (
              <Popconfirm
                title="确定下架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id)}
              >
                <a href="#">下架</a>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="确定上架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id)}
              >
                <a href="#">上架</a>
              </Popconfirm>
            )}
            <Button
              size="small"
              type="link"
              onClick={async () => {
                const step = await getStep(record, type);
                setParams();
                history.push(
                  `${routeName.LOAN_RECORD_DETAIL}?id=${record.id}&isDetail=1&type=${type}&step=${step}`,
                );
              }}
            >
              编辑
            </Button>
            <Button
              size="small"
              type="link"
              onClick={async () => {
                const step = await getStep(record, type);
                setParams();
                history.push(
                  `${routeName.LOAN_RECORD_DETAIL}?id=${record.id}&isDetail=1&type=${type}&step=${step}`,
                );
              }}
            >
              详情
            </Button>
            {!isApiType && (
              <Popconfirm
                title="确定删除么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id)}
              >
                <a href="#">删除</a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getPage();
    getTotal();
  }, [searchContent, tableParams]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="applyNo" label="产品名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dataSource" label="发布状态">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(statusMap).map((p) => {
                    return (
                      <Select.Option key={p[0]} value={p[0]}>
                        {p[1]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="bank" label="产品类型">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(productTypeMap).map((p) => {
                    return (
                      <Select.Option key={p[0]} value={p[0]}>
                        {p[1]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="creditStatus" label="担保方式">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(guaranteeMethodMap).map((p) => {
                    return (
                      <Select.Option key={p[0]} value={p[0]}>
                        {p[1]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={sc('container-search-opereate')}>
          <Button
            style={{ marginRight: 16 }}
            type="primary"
            key="search"
            onClick={() => {
              setPageInfo({
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0,
                pageTotal: 0,
              });
              const search = searchForm.getFieldsValue();
              console.log('search', search);
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
      </div>
    );
  };

  const exportList = async (selected: boolean) => {
    if (selected && !selectedRowKeys.length) {
      message.warning('请选择数据');
      return;
    }
    try {
      let data = {};
      if (selected) {
        data = { ids: [...selectedRowKeys] };
      } else {
        data = { ...searchContent };
      }
      const res = await loanRecordExport(data);
      const content = res?.data;
      const blob = new Blob([content], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      const fileName = '贷款记录.xlsx';
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        message.success(`导出成功`);
      }, 1000);
    } catch (error) {
      console.log(error);
      message.error(`导出失败`);
    }
  };
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<any>,
  ) => {
    console.log(pagination, filters, sorter);
    setTableParams({ ...sorter });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  return (
    <PageContainer
      className={sc('container')}
      ghost
      header={{
        title: '产品管理',
        breadcrumb: {},
      }}
    >
      {useSearchNode()}
      <div className={sc('container-table')}>
        <div className={sc('container-table-header')}>
          <div className="title">
            <Button
              type="primary"
              key="addNew"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新增产品
            </Button>
            <Button>下架</Button>
          </div>
        </div>
        <div className={sc('container-table-body')}>
          <SelfTable
            bordered
            scroll={{ x: 2280 }}
            columns={columns}
            dataSource={dataSource}
            rowKey={'id'}
            rowSelection={{
              fixed: true,
              selectedRowKeys,
              getCheckboxProps: (record: any) => {
                return {
                  disabled: record.name === 'Disabled User', // Column configuration not to be checked
                  name: record.name,
                };
              },
              onChange: onSelectChange,
            }}
            onChange={handleTableChange}
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
      {getModal()}
    </PageContainer>
  );
};
