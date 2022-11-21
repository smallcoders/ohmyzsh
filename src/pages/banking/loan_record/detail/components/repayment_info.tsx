import { getActivityManageList, changeActState } from '@/services/purchase';
import BankingLoan from '@/types/banking-loan.d';
import type DataCommodity from '@/types/data-commodity';
import type DataPromotions from '@/types/data-promotions';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { getBackMoneyDetail, addBackMoney, delBackMoney } from '@/services/banking-loan';
import type Common from '@/types/common';
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
import './repayment_info.less';
import { regFenToYuan, regYuanToFen } from '@/utils/util';
import patchDownloadFile from '@/utils/patch-download-file';
export default ({ isDetail, id }: Props) => {
  const history = useHistory();
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<BankingLoan.LoanContent[]>([]);
  const [record, setRecord] = useState<BankingLoan.LoanContent>(null);
  const [editId, setEditId] = useState<number>(0);
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);

  // const [pageIndex, setPageIndex] = useState<any>(1);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [form] = Form.useForm();
  const clearForm = () => {
    form.resetFields();
    setEditId(0);
  };
  const getPages = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, code, totalCount, pageTotal } = await getBackMoneyDetail({
        pageIndex,
        pageSize,
        creditId: id,
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

  const columnsOrg: ProColumns<BankingLoan.LoanContent>[] = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: BankingLoan.LoanContent, index: number) => index + 1,
    },
    {
      title: '借款编号',
      dataIndex: 'debitNo',
      width: 100,
      renderText: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '实际放款日期',
      dataIndex: 'borrowStartDate',
      width: 80,
      renderText: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '放款金额(万元)',
      dataIndex: 'takeMoney',
      width: 100,
      renderText: (_: number) => {
        return <div>{regFenToYuan(_)}</div>;
      },
    },
    {
      title: '执行年利率(%)',
      dataIndex: 'rate',
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
    const tooltipMessage = editId ? '编辑还款信息' : '新增还款信息';
    form
      .validateFields()
      .then(async (value) => {
        console.log('isSave', isSave);
        if (value.actualRepaymentDate) {
          value.actualRepaymentDate = moment(value.actualRepaymentDate).format('YYYY-MM-DD');
        }
        if (value.planRepaymentDate) {
          value.planRepaymentDate = moment(value.planRepaymentDate).format('YYYY-MM-DD');
        }
        if (value.workProve) {
          value.workProve = value.workProve.map((item: any) => item.uid).join(',');
        }
        if (value.backMoney) {
          value.backMoney = regYuanToFen(value.backMoney, 100);
        }
        const { code } = await (editId
          ? addBackMoney({
              ...value,
              applyId: record.id,
              id: editId,
            })
          : addBackMoney({
              ...value,
              applyId: record.id,
            }));
        if (code === 0) {
          if (isSave) {
            setModalVisible(false);
          }
          getPages();
          setExpandedRowKeys([...expandedRowKeys, record.id]);
          clearForm();
          setFormIsChange(false);
          message.success(`${tooltipMessage}成功！`);
        } else {
          message.error(`${tooltipMessage}失败！`);
        }
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
            name="planRepaymentDate"
            label="应还款日期"
            rules={[
              {
                required: true,
                message: '请选择应还款日期',
              },
            ]}
          >
            <DatePicker allowClear style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="actualRepaymentDate"
            label="实际还款日期"
            rules={[
              {
                required: true,
                message: '请选择实际还款日期"',
              },
            ]}
          >
            <DatePicker allowClear style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="放款金额"
            name="backMoney"
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
            name="workProve"
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

  // 删除
  const remove = async (recordId: number) => {
    try {
      const removeRes = await delBackMoney({ id: recordId });
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getPages();
      } else {
        message.error(`删除失败，原因:${removeRes.message}`);
      }
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
        title: '应还款日期',
        dataIndex: 'planRepaymentDate',
        valueType: 'textarea',
      },
      {
        title: '实际还款日期',
        dataIndex: 'actualRepaymentDate',
        valueType: 'textarea',
      },
      {
        title: '还款金额(元)',
        dataIndex: 'backMoney',
        renderText: (_) => regFenToYuan(_, 1),
      },
      {
        title: '操作',
        width: 120,
        fixed: 'right',
        render: (_: any, record: any, index: integer) => {
          return isDetail ? (
            <Space size="middle">
              <a
                onClick={() => {
                  patchDownloadFile(
                    record.workProves,
                    `还款信息凭证${moment().format('YYYYMMDD')}`,
                  );
                }}
              >
                下载业务凭证
              </a>
            </Space>
          ) : (
            <Space size="middle">
              <a
                onClick={() => {
                  setEditId(record.id);
                  setModalVisible(true);
                  form.setFieldsValue({
                    planRepaymentDate:
                      record?.planRepaymentDate && moment(record?.planRepaymentDate),
                    actualRepaymentDate:
                      record?.actualRepaymentDate && moment(record?.actualRepaymentDate),
                    backMoney: regFenToYuan(record?.backMoney, 1),
                    workProve: record?.workProves
                      ? record.workProves.map((p: any) => {
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
                onConfirm={() => remove(record.id)}
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
        rowKey="id"
        headerTitle={false}
        search={false}
        options={false}
        dataSource={record.backMoneyInfoVO}
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
              还款信息：<span className="tips">请录入每笔放款对应的还款信息</span>
            </p>
          </div>
        }
        scroll={{ x: 1200 }}
        options={false}
        rowKey="id"
        expandable={{
          expandedRowRender,
          expandedRowKeys,
          onExpandedRowsChange: (expandedRows) => {
            // const rowKey = expandedRows[0];
            // if (expandedRowKeys.includes(rowKey)) {
            //   setExpandedRowKeys(expandedRowKeys.filter((item: any) => item !== rowKey));
            // } else {
            //   if (rowKey) setExpandedRowKeys([...expandedRowKeys, rowKey]);
            // }
            console.log('expandedRows1', expandedRows, expandedRowKeys);
            setExpandedRowKeys([...expandedRows]);
            console.log('expandedRows2', expandedRows, expandedRowKeys);
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
        pagination={
          pageInfo.totalCount < 10
            ? false
            : {
                onChange: getPages,
                total: pageInfo.totalCount,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total: number) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
              }
        }
      />
      {useModal()}
    </>
  );
};
