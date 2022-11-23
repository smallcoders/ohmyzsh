import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Form,
  Drawer,
  message,
  Space,
  Popconfirm,
  Radio,
  DatePicker,
  Modal,
  Row,
  Col,
  InputNumber,
  Tooltip,
  Empty,
} from 'antd';
const { confirm } = Modal;
import UploadFormFile from '@/components/upload_form/upload-form-file';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import BankingLoan from '@/types/banking-loan.d';
import './loan_info.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import { history } from 'umi';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { FooterToolbar } from '@ant-design/pro-components';
// import type LiveTypesMaintain from '@/types/live-types-maintain.d';
import { getTakeMoneyDetail, addOrUpdateTakeMoney, deleteTakeMoney } from '@/services/banking-loan';
import { getOrgTypeOptions } from '@/services/org-type-manage';
import { regFenToYuan, regYuanToFen } from '@/utils/util';
import patchDownloadFile from '@/utils/patch-download-file';
import type { Props } from './authorization_info';
const sc = scopedClasses('banking-loan-info');
export default ({ isDetail, type, id, step }: Props) => {
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<BankingLoan.LoanContent[]>([]);
  const [editId, setEditId] = useState<number>(0);
  const [editItem, setEditItem] = useState<BankingLoan.LoanContent>({});
  const [columns, setColumns] = useState<any[]>([]);
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [availAmounts, setAvailAmounts] = useState<number>(0);
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<any>([]);
  const toCreditApply = () => {
    history.push(`${routeName.LOAN_RECORD_ENTER}?id=${id}&type=${type}&step=${step}`);
  };
  const getDictionary = async () => {
    try {
      const res = await Promise.all([getOrgTypeOptions()]);
      setOptions(res[0]?.result || []);
    } catch (error) {
      message.error('服务器错误');
    }
  };
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const { LoadStatusTrans, LoadStatus } = BankingLoan;
  const [form] = Form.useForm();
  const loanStatus = Form.useWatch('busiStatus', form);
  // const [searchForm] = Form.useForm();

  const getPages = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, code } = await getTakeMoneyDetail({
        pageIndex,
        pageSize,
        creditId: id,
      });
      if (code === 0) {
        const { count, takeMoneyInfo, total, availAmount } = result;
        setPageInfo({ totalCount: count, pageTotal: total, pageIndex, pageSize });
        setDataSource(takeMoneyInfo);
        setAvailAmounts(Number(regFenToYuan(availAmount)));
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditItem({});
  };

  // 新增/编辑 flag false:保存并继续录入， true:保存
  const addOrUpdate = async (flag: boolean) => {
    const tooltipMessage = editItem.id ? '编辑信息' : '新增信息';
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        if (value.borrowStartDate) {
          value.borrowStartDate = moment(value.borrowStartDate).format('YYYY-MM-DD');
        }
        if (value.workProve) {
          value.workProve = value.workProve.map((item: any) => item.uid).join(',');
        }
        if (value.takeMoney) {
          value.takeMoney = regYuanToFen(value.takeMoney);
        }
        const addorUpdateRes = await (editItem?.id
          ? addOrUpdateTakeMoney({
              ...value,
              creditId: id,
              id: editItem?.id,
            })
          : addOrUpdateTakeMoney({
              ...value,
              creditId: id,
            }));
        if (addorUpdateRes.code === 0) {
          if (flag) {
            setModalVisible(false);
          }
          message.success(`${tooltipMessage}成功！`);
          clearForm();
          setFormIsChange(false);
          getPages();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch(() => {
        setAddOrUpdateLoading(false);
      });
  };
  // 删除
  const remove = async (recordId: number) => {
    try {
      const removeRes = await deleteTakeMoney({ id: recordId });
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
  const otherColum = [
    {
      title: '提款申请编号',
      dataIndex: 'loanBatchNo',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '提款申请时间',
      dataIndex: 'createTime',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '提款金额(万元)',
      dataIndex: 'takeMoney',
      width: 100,
      render: (_: string) => {
        return <div>{regFenToYuan(_)}</div>;
      },
    },
  ];
  const columnsOrg = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 50,
      render: (_: any, _record: BankingLoan.LoanContent, index: number) => index + 1,
    },
    {
      title: '放款状态',
      dataIndex: 'status',
      width: 100,
      render: (_: string) => {
        return (
          <div className={`state${_}`}>
            {_ || '--'}
            {LoadStatus.LOAN_FAILURE === _ && (
              <Tooltip placement="topLeft" title={'失败原因是因为失败乃成功之母'}>
                <div className={sc('show-reason')}>查看原因</div>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: '借款编号',
      dataIndex: 'debitNo',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '实际放款日期',
      dataIndex: 'borrowStartDate',
      width: 80,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '放款金额(万元)',
      dataIndex: 'takeMoney',
      width: 100,
      render: (_: number) => {
        return <div>{regFenToYuan(_)}</div>;
      },
    },
    {
      title: '执行年利率(%)',
      dataIndex: 'rate',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: BankingLoan.LoanContent, index: integer) => {
        return isDetail ? (
          type === 1 ? (
            <Space size="middle">
              <a
                onClick={() => {
                  patchDownloadFile(
                    record.workProves,
                    `放款信息凭证${moment().format('YYYYMMDD')}`,
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
                  history.push(`${routeName.LOAN_RECORD_WITHDRAWANDLOAN}?id=${record?.id}`);
                }}
              >
                详情
              </a>
            </Space>
          )
        ) : (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                setEditItem(record);
                setModalVisible(true);
                form.setFieldsValue({
                  busiStatus: record?.busiStatus,
                  refuseReason: record?.refuseReason,
                  debitNo: record?.debitNo,
                  borrowStartDate: record?.borrowStartDate && moment(record?.borrowStartDate),
                  takeMoney: Number(regFenToYuan(record?.takeMoney)),
                  rate: record?.rate,
                  workProve: record?.workProves
                    ? record.workProves.map((p) => {
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
  const columDeal = () => {
    const column = [...columnsOrg];
    if (type !== 1) {
      column.splice(1, 0, ...otherColum);
    }
    setColumns(column);
  };
  useEffect(() => {
    getPages();
    columDeal();
  }, []);

  useEffect(() => {
    getDictionary();
  }, []);

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
        title={editItem.id ? '编辑信息' : '新增信息'}
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
          initialValues={{ busiStatus: 3 }}
          onValuesChange={() => {
            setFormIsChange(true);
          }}
        >
          <Form.Item
            name="busiStatus"
            label="放款状态"
            rules={[
              {
                required: true,
                message: '请选择放款状态',
              },
            ]}
          >
            <Radio.Group>
              <Radio value={3}>已放款</Radio>
              <Radio value={4}>放款失败</Radio>
            </Radio.Group>
          </Form.Item>
          {loanStatus === 4 ? (
            <Form.Item
              name="refuseReason"
              label="失败原因"
              rules={[
                {
                  required: true,
                  message: '请输入失败原因',
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="请输入"
                style={{ width: '100%' }}
                showCount
                maxLength={300}
              />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="debitNo"
                label="借据编号"
                rules={[
                  {
                    required: true,
                    message: '请输入借据编号',
                  },
                  { type: 'string', max: 50 },
                ]}
              >
                <Input placeholder="请输入" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="borrowStartDate"
                label="实际借款日期"
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
                name="takeMoney"
                rules={[
                  { required: true, message: '请输入放款金额' },
                  {
                    type: 'number',
                    min: 0,
                    max:
                      availAmounts +
                      (editItem?.takeMoney ? Number(regFenToYuan(editItem?.takeMoney)) : 0),
                  },
                ]}
              >
                <InputNumber
                  placeholder="请输入"
                  addonAfter="万元"
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                name="rate"
                label="执行年利率"
                rules={[{ required: true, message: '请输入执行年利率' }]}
              >
                <InputNumber
                  placeholder="请输入"
                  precision={2}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </>
          )}
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

  return isDetail && !dataSource?.length ? (
    <div className="empty">
      <Empty description="暂无数据" />
      {type === 1 && (
        <Button className="empty-button" type="primary" onClick={toCreditApply}>
          去录入放款信息
        </Button>
      )}
    </div>
  ) : (
    <>
      <div className={sc('container-table-header')}>
        <div>剩余可借金额：{availAmounts}万元</div>
        <div className="title">
          <div>放款信息：{!isDetail && <span className="tips">请录入每次放款信息</span>}</div>
          {!isDetail && (
            <Button
              type="primary"
              key="addStyle"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新增信息
            </Button>
          )}
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: type === 1 ? 1000 : 1400 }}
          columns={columns}
          rowKey={'id'}
          dataSource={dataSource}
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
      </div>
      {isDetail && (
        <div className={sc('container-table-footer')}>
          数据来源：{BankingLoan.DataSourcesTrans[type || '']}
        </div>
      )}
      <FooterToolbar>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FooterToolbar>
      {useModal()}
    </>
  );
};
