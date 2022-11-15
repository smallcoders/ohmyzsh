import { getActivityManageList, changeActState } from '@/services/purchase';
import BankingLoan from '@/types/banking-loan.d';
import type DataCommodity from '@/types/data-commodity';
import type DataPromotions from '@/types/data-promotions';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  Modal,
  Popconfirm,
  message,
  Space,
  Tooltip,
  Drawer,
  Form,
  InputNumber,
  DatePicker,
} from 'antd';
const { confirm } = Modal;
import { useRef, useState, useEffect } from 'react';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
const { LoadStatusTrans, LoadStatus } = BankingLoan;
import UploadFormFile from '@/components/upload_form/upload-form-file';
import type { Props } from './authorization_info';
import moment from 'moment';
export default ({ isDetail, type }: Props) => {
  const history = useHistory();
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<BankingLoan.LoanContent[]>([]);
  const [record, setRecord] = useState<BankingLoan.LoanContent>(null);
  const [editIndex, setEditIndex] = useState<number>(0);
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);

  const [pageIndex, setPageIndex] = useState<any>(1);

  const [form] = Form.useForm();
  const clearForm = () => {
    form.resetFields();
    setEditIndex(0);
  };
  const getPages = async () => {
    try {
      const result = [{ id: 1 }, { id: 2 }];
      setDataSource(result);
      // const { result, code } = await getProviderTypesPage({});
      // if (code === 0) {
      //   setDataSource(result);
      // } else {
      //   message.error(`请求分页数据失败`);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const columnsOrg: ProColumns<BankingLoan.LoanContent>[] = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: BankingLoan.LoanContent, index: number) => index + 1,
    },
    {
      title: '借款编号',
      dataIndex: 'loanNo',
      width: 100,
      renderText: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '实际放款日期',
      dataIndex: 'loanTime',
      width: 80,
      renderText: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '放款金额(万元)',
      dataIndex: 'loanMoney',
      width: 100,
      renderText: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '执行年利率(%)',
      dataIndex: 'referenceAnnualInterestRate',
      width: 100,
      renderText: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
  ];
  const columDeal = () => {
    const column = [...columnsOrg];
    if (!isDetail) {
      column.splice(1, 0, {
        title: '操作',
        hideInSearch: true,
        width: 75,
        fixed: 'right',
        render: (_, item: BankingLoan.LoanContent) => (
          <Space>
            <Button
              size="small"
              type="link"
              onClick={() => {
                setRecord(item);
                setModalVisible(true);
              }}
            >
              录入还款信息
            </Button>
          </Space>
        ),
      });
    }
    setColumns(column);
  };
  useEffect(() => {
    getPages();
    columDeal();
  }, []);

  // 新增/编辑 isSave false:保存并继续录入， true:保存
  const addOrUpdate = async (isSave: boolean) => {
    const tooltipMessage = editIndex ? '编辑还款信息' : '新增还款信息';
    form
      .validateFields()
      .then(async (value) => {
        console.log('isSave', isSave);
        if (value.loanTime) {
          value.loanTime = moment(value.loanTime).format('YYYY-MM-DD');
        }
        const table = { ...tableData };
        const data = table[record.id] ? [...table[record.id]] : [];
        if (editIndex) {
          data.splice(editIndex - 1, 1, { ...value });
        } else {
          data.unshift({ ...value });
        }
        table[record.id] = data;
        setTableData(table);
        console.log('isSave', isSave);
        if (isSave) {
          setModalVisible(false);
          setExpandedRowKeys([...expandedRowKeys, record.id]);
        }
        clearForm();
        setFormIsChange(false);
        message.success(`${tooltipMessage}成功！`);
      })
      .catch(() => {});
  };
  const beforeCloseDrawer = () => {
    if (formIsChange) {
      confirm({
        title: '确认关闭弹窗?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          clearForm();
          setModalVisible(false);
        },
      });
    } else {
      clearForm();
      setModalVisible(false);
    }
  };
  const useModal = (): React.ReactNode => {
    return (
      <Drawer
        title={'录入还款信息'}
        width={600}
        placement="right"
        onClose={beforeCloseDrawer}
        visible={createModalVisible}
        footer={
          <Space className="drawer-footer">
            <Button onClick={beforeCloseDrawer}>取消</Button>
            <Button onClick={() => addOrUpdate(false)}>保存并继续录入</Button>
            <Button onClick={() => addOrUpdate(true)} type="primary">
              保存
            </Button>
          </Space>
        }
      >
        <Form
          {...formLayout}
          form={form}
          layout="horizontal"
          labelWrap
          initialValues={{ loanStatus: '1' }}
          onValuesChange={() => {
            setFormIsChange(true);
          }}
        >
          <Form.Item
            name="repaymentTime"
            label="应还款日期"
            rules={[
              {
                required: true,
                message: '请选择实际借款日期',
              },
            ]}
          >
            <DatePicker allowClear style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="repaymentActureTime"
            label="实际还款日期"
            rules={[
              {
                required: true,
                message: '请选择实际借款日期',
              },
            ]}
          >
            <DatePicker allowClear style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="放款金额"
            name="loanMoney"
            rules={[{ required: true, message: '请输入放款金额' }]}
          >
            <InputNumber
              placeholder="请输入"
              addonAfter="元"
              precision={2}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="fileIds"
            label="业务凭证"
            rules={[{ required: true, message: '请上传业务凭证' }]}
            // extra="上传金融机构授信反馈，支持30M以内的图片、word、Excel或pdf文件"
          >
            <UploadFormFile
              multiple
              accept=".png,.jpg,.pdf,.xlsx,.xls,.doc,.zip"
              showUploadList={true}
              maxSize={30}
              maxCount={10}
            >
              <Button icon={<UploadOutlined />}>上传文件</Button>
              <div style={{ fontSize: '12px' }}>
                支持30M以内的图片、word、Excel、压缩包zip或pdf文件，最多不超过10个
              </div>
            </UploadFormFile>
          </Form.Item>
        </Form>
      </Drawer>
    );
  };

  // // 更改活动状态
  // const addOrUpdate = async (params: object) => {
  //   try {
  //     const removeRes = await changeActState({ ...params, type: 1 });
  //     if (removeRes.code === 0) {
  //       message.success(`操作成功`);
  //       if (actionRef.current) {
  //         actionRef.current.reload();
  //       }
  //     } else {
  //       message.error(`操作失败，原因:{${removeRes.message}}`);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const [loadingObj, setLoadingObj] = useState<any>({});

  const queryExpandedData = async (record: any, key: any) => {
    try {
      const table = { ...tableData };
      const loading = { ...loadingObj };
      const data: any = record.product || [];
      table[key] = data;
      loading[key] = false;
      setTableData(table);
      setLoadingObj(loading);
    } catch (err) {
      console.log(err);
    }
  };

  const onExpand = (expanded: any, record: any) => {
    const key = record?.id;
    if (tableData[key]?.length) return;
    const loading = { ...loadingObj };
    loading[key] = true;
    setLoadingObj(loading);
    queryExpandedData(record, key);
  };
  // 删除
  const remove = async (index: integer) => {
    try {
      const data = [...dataSource];
      data.splice(index, 1);
      setDataSource(data);
      message.success(`删除成功`);
    } catch (error) {
      console.log(error);
    }
  };
  const expandedRowRender = (record: any) => {
    const _columns: ProColumns<DataCommodity.Commodity>[] = [
      {
        title: '序号',
        hideInSearch: true,
        renderText: (_, __, index: number) => index + 1,
      },
      {
        title: '还款日期',
        dataIndex: 'time1',
        valueType: 'textarea',
      },
      {
        title: '实际还款日期',
        dataIndex: 'productName',
        valueType: 'textarea',
      },
      {
        title: '还款金额(元)',
        dataIndex: 'productModel',
        valueType: 'textarea',
      },
      {
        title: '操作',
        width: 120,
        fixed: 'right',
        render: (_: any, record: BankingLoan.LoanContent, index: integer) => {
          return isDetail ? (
            <Space size="middle">
              <a href={`/antelope-manage/common/download/${record?.id}`}>下载业务凭证</a>
            </Space>
          ) : (
            <Space size="middle">
              <a
                href="#"
                onClick={() => {
                  setEditIndex(index + 1);
                  setModalVisible(true);
                  form.setFieldsValue({
                    loanStatus: record?.loanStatus,
                    loanStatusReason: record?.loanStatusReason,
                    loanNo: record?.loanNo,
                    loanTime: record?.loanTime && moment(record?.loanTime),
                    loanMoney: record?.loanMoney,
                    referenceAnnualInterestRate: record?.referenceAnnualInterestRate,
                    fileIds: record?.fileIds
                      ? record.fileIds.map((p) => {
                          return {
                            uid: p.id,
                            name: p.name + '.' + p.format,
                            status: 'done',
                            url: p.path,
                          };
                        })
                      : [],
                  });
                }}
              >
                编辑
              </a>
              <Popconfirm
                title="确定删除么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(index)}
              >
                <a href="#">删除</a>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
    return (
      <ProTable
        columns={_columns}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={tableData[record.id]}
        pagination={false}
      />
    );
  };
  return (
    <>
      <ProTable
        headerTitle={
          <div>
            <p>
              还款信息：<span>请录入每笔放款对应的还款信息</span>
            </p>
          </div>
        }
        scroll={{ x: 1200 }}
        options={false}
        rowKey="id"
        expandable={{
          onExpand,
          expandedRowRender,
          expandedRowKeys,
          onExpandedRowsChange: (expandedRows) => {
            console.log('expandedRows', expandedRows);
            setExpandedRowKeys([...expandedRowKeys, ...expandedRows]);
          },
        }}
        search={false}
        actionRef={actionRef}
        dataSource={dataSource}
        // request={async (pagination) => {
        //   const { updateTime = [] } = pagination;
        //   const [startDate, endDate] = updateTime;
        //   delete pagination.updateTime;
        //   const result = await getActivityManageList({
        //     ...pagination,
        //     type: 1,
        //     startDate,
        //     endDate,
        //   });

        //   setPageIndex(pagination.current);
        //   setTotal(result.total);
        //   return result;
        // }}
        columns={columns}
        pagination={false}
      />
      {useModal()}
    </>
  );
};
