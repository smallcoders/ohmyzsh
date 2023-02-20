import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  Modal,
  message,
  Space,
  Dropdown,
  Menu,
  Tooltip,
} from 'antd';
import { CaretDownOutlined, CaretUpOutlined, DownOutlined } from '@ant-design/icons';
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
import { history } from 'umi';
import { regFenToYuan, regYuanToFen } from '@/utils/util';
import {
  getLoanRecordList,
  getTotalAmount,
  queryBankList,
  loanRecordExport,
  takeNotes,
  getTakeMoneyDetail,
} from '@/services/banking-loan';

const sc = scopedClasses('loan-record-list');
const { DataSourcesTrans, creditStatusTrans, creditStatusLeaseTrans } = BankingLoan;

export default ({ loanType, name }: { loanType: number; name: string }) => {
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
    labelCol: { xs: { span: 8 }, xxs: { span: 6 } },
    wrapperCol: { xs: { span: 16 }, xxs: { span: 18 } },
  };

  /**
   * 新建窗口的弹窗
   *  */
  const [form] = Form.useForm();
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<BankingLoan.Content>({});
  const clearForm = () => {
    form.resetFields();
    if (editingItem.id) setEditingItem({});
  };
  const [totalAmount, setTotalAmount] = useState<BankingLoan.totalAmountContent>({});
  const [bankList, setBankList] = useState<{ bank: string }[]>([]);
  const [isMore, setIsMore] = useState<boolean>(false);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  useEffect(() => {
    console.log('unlisten');
    const unlisten = history.listen((historyLocation, action) => {
      console.log('listen', historyLocation, action);
    });
    return () => {
      unlisten();
    };
  }, []);

  const prepare = async () => {
    console.log(history.action);
    try {
      const data = await Promise.all([queryBankList({ type: loanType })]);
      setBankList(data?.[0]?.result || []);
    } catch (error) {
      message.error('数据初始化错误');
    }
  };
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
    prepare();
  }, []);
  const getPage = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getLoanRecordList({
        pageIndex,
        pageSize,
        ...searchContent,
        type: loanType,
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
        className={sc('model-mark')}
        title="备注"
        width="650px"
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
                labelCol={{ span: 8 }}
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
                wrapperCol={{ span: 17 }}
                label="企业名称"
              >
                {/* <Input disabled /> */}
                <div>{editingItem.orgName}</div>
              </Form.Item>
            </Col>
          </Row>
          <div className="tips">备注：最长可输入1500字，必填</div>
          <Form.Item
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            name="text"
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
        type: loanType,
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
              (item: BankingLoan.TakeMoneyInfoContent) => item.status == '已放款',
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
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 40,
      render: (_: any, _record: BankingLoan.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '业务申请编号',
      dataIndex: 'id',
      width: 90,
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: '120px',
    },
    {
      title: '申请金额(万元)',
      dataIndex: 'amount',
      width: 80,
      render: (_: number) => regFenToYuan(_),
    },
    {
      title: '联系人',
      dataIndex: 'name',
      width: 80,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      width: 80,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      isEllipsis: true,
      width: '80px',
    },
    {
      title: '授信状态',
      dataIndex: 'creditStatus',
      width: 80,
      render: (_: string, record: BankingLoan.Content) => {
        return (
          <div className={`state${_}`}>
            {_ || '--'}
            {_ === '授信失败' && (
              <Tooltip
                placement="topLeft"
                color="#fff"
                title={
                  <div
                    style={{
                      color: '#8290A6',
                      fontSize: '14px',
                      lineHeight: '22px',
                      padding: '10px 8px',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 700,
                        color: '#556377',
                      }}
                    >
                      失败原因
                    </p>
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
      title: '授信金额(万元)',
      dataIndex: 'creditAmount',
      render: (_: number) => regFenToYuan(_),
      width: 80,
    },
    {
      title: '已放款金额(万元)',
      dataIndex: 'takeAmount',
      render: (_: number) => regFenToYuan(_),
      width: 80,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      width: 100,
      render: (_: string) => _ || '--',
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: BankingLoan.Content) => {
        const isApiType =
          record.productId === 1662285468000019 || record.productId === 1662285468000031;
        const type = isApiType ? 0 : 1;
        return (
          <Space>
            <Button
              size="small"
              type="link"
              onClick={async () => {
                const step = await getStep(record, type);
                setParams();
                history.push(
                  `${routeName[name + '_RECORD_DETAIL']}?id=${
                    record.id
                  }&isDetail=1&type=${type}&step=${step}&loanType=${loanType}&name=${name}`,
                );
              }}
            >
              详情
            </Button>
            {!isApiType && (
              <>
                <Button
                  size="small"
                  type="link"
                  onClick={async () => {
                    const step = await getStep(record, type);
                    setParams();
                    history.push(
                      `${routeName[name + '_RECORD_ENTER']}?id=${
                        record.id
                      }&type=${type}&step=${step}&loanType=${loanType}&name=${name}`,
                    );
                  }}
                >
                  信息录入
                </Button>
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    setEditingItem(record);
                    setModalVisible(true);
                    form.setFieldsValue({
                      ...record,
                      text: record.notes,
                    });
                  }}
                >
                  备注
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getPage();
    getTotal();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="applyNo" label="业务申请编号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="orgName" label="企业名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="申请时间">
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  allowClear
                  disabledDate={(current) => current && current > moment().endOf('day')}
                />
              </Form.Item>
            </Col>
            {isMore && (
              <>
                <Col span={8}>
                  <Form.Item name="dataSource" label="数据来源">
                    <Select placeholder="请选择" allowClear>
                      {Object.entries(DataSourcesTrans).map((p) => {
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
                  <Form.Item name="bank" label="金融机构">
                    <Select placeholder="请选择" allowClear>
                      {bankList?.map((item: { bank: string }) => (
                        <Select.Option key={item.bank} value={item.bank}>
                          {item.bank}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="creditStatus" label="授信状态">
                    <Select placeholder="请选择" allowClear showArrow mode="multiple">
                      {Object.entries(
                        loanType === 3 ? creditStatusLeaseTrans : creditStatusTrans,
                      ).map((p) => {
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
                  <Form.Item name="productName" label="产品名称">
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  {/* <Form.Item name="takeMoneyMin" label="放款金额"> */}
                  <ProFormDigitRange
                    label="放款金额"
                    separator="-"
                    separatorWidth={30}
                    name="takeMoney"
                    fieldProps={{
                      min: 0,
                      precision: 2,
                    }}
                    addonAfter={<div style={{ width: '30px', whiteSpace: 'nowrap' }}>万元</div>}
                  />
                </Col>
                <Col span={8}>
                  <ProFormDigitRange
                    label="授信金额"
                    separator="-"
                    fieldProps={{
                      min: 0,
                      precision: 2,
                    }}
                    separatorWidth={30}
                    name="creditAmount"
                    addonAfter={<div style={{ width: '30px', whiteSpace: 'nowrap' }}>万元</div>}
                  />
                </Col>
              </>
            )}
          </Row>
        </Form>
        <div className={sc('container-search-opereate')}>
          <div>
            <Button
              style={{ marginRight: 10 }}
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
                if (search.time) {
                  search.applyTimeStart = moment(search.time[0]).format('YYYY-MM-DD');
                  search.applyTimeEnd = moment(search.time[1]).format('YYYY-MM-DD');
                }
                if (search.takeMoney) {
                  search.takeMoneyMin = search.takeMoney[0]
                    ? regYuanToFen(search.takeMoney[0])
                    : null;
                  search.takeMoneyMax = search.takeMoney[1]
                    ? regYuanToFen(search.takeMoney[1])
                    : null;
                }
                if (search.creditAmount) {
                  search.creditAmountMin = search.creditAmount[0]
                    ? regYuanToFen(search.creditAmount[0])
                    : null;
                  search.creditAmountMax = search.creditAmount[1]
                    ? regYuanToFen(search.creditAmount[1])
                    : null;
                }
                console.log('search', search);
                setSearChContent(search);
              }}
            >
              查询
            </Button>
            <Button
              style={{ marginRight: 0 }}
              key="reset"
              onClick={() => {
                searchForm.resetFields();
                setSearChContent({});
              }}
            >
              重置
            </Button>
          </div>

          <Button
            style={{ marginRight: 0 }}
            type="link"
            onClick={() => {
              setIsMore(!isMore);
            }}
          >
            {isMore ? '收起' : '展开'}
            {isMore ? <CaretUpOutlined /> : <CaretDownOutlined />}
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
      const res = await loanRecordExport({ ...data, type: loanType });
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
  const menuProps = (
    <Menu>
      <Menu.Item icon={<UploadOutlined />} onClick={() => exportList(false)}>
        导出筛选结果
      </Menu.Item>
      <Menu.Item icon={<UploadOutlined />} onClick={() => exportList(true)}>
        导出选中数据
      </Menu.Item>
    </Menu>
  );

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  return (
    <PageContainer
      header={{
        title: loanType === 1 ? '贷款业务' : '租赁业务',
        breadcrumb: {},
      }}
      className={sc('container')}
      ghost
    >
      {useSearchNode()}
      <div className={sc('container-table')}>
        <div className={sc('container-table-header')}>
          <div className="title">
            <div className="button-box">
              <Dropdown overlay={menuProps}>
                <Button size="large">
                  导出
                  <DownOutlined />
                </Button>
              </Dropdown>
              <Dropdown overlay={<Menu>
                <Menu.Item onClick={() => {
                  if (!selectedRowKeys.length) {
                    message.warning('请选择数据');
                    return;
                  }
                }}>
                  删除选中结果
                </Menu.Item>
              </Menu>}>
                <Button size="large">
                  批量删除
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <div className="tips">
              <span style={{ marginRight: 20 }}>
                累计授信金额：{regFenToYuan(totalAmount.creditTotal)}万元
              </span>
              <span>累计放款金额：{regFenToYuan(totalAmount.takeTotal)}万元</span>
            </div>
          </div>
        </div>
        <div className={sc('container-table-body')}>
          <SelfTable
            bordered
            scroll={{ x: 1900 }}
            columns={columns}
            dataSource={dataSource}
            rowKey={'id'}
            rowSelection={{
              fixed: true,
              selectedRowKeys,
              onChange: onSelectChange,
            }}
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
