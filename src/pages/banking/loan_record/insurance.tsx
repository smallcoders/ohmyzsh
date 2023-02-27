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
import { history, useAccess } from 'umi';
import { regFenToYuan, regYuanToFen } from '@/utils/util';
import {
  getLoanRecordList,
  queryBankList,
  loanRecordExport,
  takeNotes, delBatchLoanRecord,
} from '@/services/banking-loan';

const sc = scopedClasses('loan-record-list');

export default () => {
  const [dataSource, setDataSource] = useState<BankingLoan.Content[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchForm] = Form.useForm();
  const name: string = 'INSURANCE';
  const loanType: number = 5;
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  const creditStatusTrans = {
    7: '待审核',
    9: '待对接',
    11: '承保中',
    12: '已归档',
  };
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
  const [bankList, setBankList] = useState<{ bank: string }[]>([]);
  const [isMore, setIsMore] = useState<boolean>(false);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  // const historys = useHistory();
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
      const data = await Promise.all([queryBankList({ type: 5 })]);
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
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 50,
      render: (_: any, _record: BankingLoan.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '业务申请编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: '120px',
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
      width: '100px',
    },
    {
      title: '业务状态',
      dataIndex: 'creditStatus',
      width: 80,
      render: (_: string, record: BankingLoan.Content) => {
        return (
          <div className={`state${_}`}>
            {_ || '--'}
            {_.includes('失败') && (
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
      title: '承保金额(万元)',
      dataIndex: 'creditAmount',
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
        const type = 1;
        let step = 1;
        if (record.creditStatus?.includes('审核')) {
          step = 5;
        } else {
          step = 6;
        }
        return (
          <Space>
            <Button
              size="small"
              type="link"
              onClick={async () => {
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
            {!(
              record.creditStatus?.includes('承保中') || record.creditStatus?.includes('已归档')
            ) && (
              <>
                <Button
                  size="small"
                  type="link"
                  onClick={async () => {
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
              <Form.Item name="creditStatus" label="业务状态">
                <Select placeholder="请选择" allowClear showArrow mode="multiple">
                  {Object.entries(creditStatusTrans).map((p) => {
                    return (
                      <Select.Option key={p[0]} value={p[0]}>
                        {p[1]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            {/* <Col span={8}>
              <Form.Item name="orgName" label="企业名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col> */}

            {isMore && (
              <>
                <Col span={8}>
                  <Form.Item name="time" label="申请时间">
                    <DatePicker.RangePicker
                      style={{ width: '100%' }}
                      allowClear
                      disabledDate={(current) => current && current > moment().endOf('day')}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="productName" label="产品名称">
                    <Input placeholder="请输入" />
                  </Form.Item>
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
      const res = await loanRecordExport({ ...data, type: 5 });
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
        title: '保险业务',
        breadcrumb: {},
      }}
      className={sc('container')}
      ghost
    >
      {useSearchNode()}
      <div className={sc('container-table')}>
        <div className={sc('container-table-header')}>
          <div className="title insurance">
            <Dropdown overlay={menuProps}>
              <Button size="large">
                <Space>
                  导出
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            {
              access['P_FM_BXYW'] &&
              <Dropdown overlay={<Menu>
                <Menu.Item onClick={() => {
                  if (!selectedRowKeys.length) {
                    message.warning('请选择数据');
                    return;
                  }
                  delBatchLoanRecord(selectedRowKeys.join(',')).then((res) => {
                    if (res.code === 0){
                      const pageIndex = dataSource.length === selectedRowKeys.length && pageInfo.pageTotal === pageInfo.pageIndex ?
                        pageInfo.pageIndex - 1 > 0 ? pageInfo.pageIndex : 1 :  pageInfo.pageIndex
                      getPage(pageIndex)
                    } else {
                      message.warning(res.message)
                    }
                  })
                }}>
                  删除选中结果
                </Menu.Item>
              </Menu>}>
                <Button size="large">
                  批量删除
                  <DownOutlined />
                </Button>
              </Dropdown>
            }
          </div>
        </div>
        <div className={sc('container-table-body')}>
          <SelfTable
            bordered
            scroll={{ x: 1700 }}
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
