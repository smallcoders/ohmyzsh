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
// import type LiveTypesMaintain from '@/types/live-types-maintain.d';
import {
  getProviderTypesPage,
  addProviderType,
  updateProviderType,
  removeProviderType,
} from '@/services/purchase';
import { getOrgTypeOptions } from '@/services/org-type-manage';
import type { Props } from './authorization_info';
const sc = scopedClasses('banking-loan-info');
export default ({ isDetail, type }: Props) => {
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<BankingLoan.LoanContent[]>([]);
  const [editIndex, setEditIndex] = useState<number>(0);
  const [columns, setColumns] = useState<any[]>([]);
  const [formIsChange, setFormIsChange] = useState<boolean>(false);

  const [options, setOptions] = useState<any>([]);
  const toCreditApply = () => {
    history.push(`${routeName.LOAN_RECORD_ENTER}?type=${type}&state=2`);
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
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });
  const { LoadStatusTrans, LoadStatus } = BankingLoan;
  const [form] = Form.useForm();
  const loanStatus = Form.useWatch('loanStatus', form);
  // const [searchForm] = Form.useForm();

  const getPages = async () => {
    try {
      const result = [{}, {}];
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

  const clearForm = () => {
    form.resetFields();
    setEditIndex(0);
  };

  // 新增/编辑 type false:保存并继续录入， true:保存
  const addOrUpdate = async (type: boolean) => {
    const tooltipMessage = editIndex ? '编辑信息' : '新增信息';
    form
      .validateFields()
      .then(async (value) => {
        if (value.loanTime) {
          value.loanTime = moment(value.loanTime).format('YYYY-MM-DD');
        }
        const data = [...dataSource];
        if (editIndex) {
          data.splice(editIndex - 1, 1, { ...value });
        } else {
          data.unshift({ ...value });
        }
        setDataSource(data);
        if (type) {
          setModalVisible(false);
        }
        clearForm();
        setFormIsChange(false);
        message.success(`${tooltipMessage}成功！`);
      })
      .catch(() => {});
  };
  const save = async () => {
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        if (value.loanTime) {
          value.loanTime = moment(value.loanTime).format('YYYY-MM-DD');
        }
        const addorUpdateRes = await (editIndex
          ? updateProviderType({
              ...value,
              id: editIndex,
            })
          : addProviderType({
              ...value,
            }));
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          if (!editIndex) {
            message.success('新增类型成功！');
          } else {
            message.success('编辑类型成功！');
          }
          getPages();
          clearForm();
        } else {
          // message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch(() => {
        setAddOrUpdateLoading(false);
      });
  };
  // 删除
  const remove = async (index: integer) => {
    try {
      // const removeRes = await removeProviderType(id);
      // if (removeRes.code === 0) {
      //   message.success(`删除成功`);
      //   getPages();
      // } else {
      //   message.error(`删除失败，原因:${removeRes.message}`);
      // }
      const data = [...dataSource];
      data.splice(index, 1);
      setDataSource(data);
      message.success(`删除成功`);
    } catch (error) {
      console.log(error);
    }
  };
  const otherColum = [
    {
      title: '提款申请编号',
      dataIndex: 'applyloanNo',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '提款申请时间',
      dataIndex: 'applyloanTime',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '提款金额(万元)',
      dataIndex: 'applyloanMoney',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
  ];
  const columnsOrg = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: BankingLoan.LoanContent, index: number) => index + 1,
    },
    {
      title: '放款状态',
      dataIndex: 'loanStatus',
      width: 100,
      render: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(LoadStatusTrans, _) ? LoadStatusTrans[_] : '--'}
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
      dataIndex: 'loanNo',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '实际放款日期',
      dataIndex: 'loanTime',
      width: 80,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '放款金额(万元)',
      dataIndex: 'loanMoney',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '执行年利率(%)',
      dataIndex: 'referenceAnnualInterestRate',
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
          type === BankingLoan.DataSources.MANUALENTRY ? (
            <Space size="middle">
              <a href={`/antelope-manage/common/download/${record?.id}`}>下载业务凭证</a>
            </Space>
          ) : (
            <Space size="middle">
              <a
                onClick={() => {
                  window.open(`${routeName.LOAN_RECORD_WITHDRAWANDLOAN}?id=${record?.id}`);
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
  const columDeal = () => {
    const column = [...columnsOrg];
    if (type == BankingLoan.DataSources.MANUALENTRY) {
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
        title={editIndex ? '编辑信息' : '新增信息'}
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
            name="loanStatus"
            label="放款状态"
            rules={[
              {
                required: true,
                message: '请选择放款状态',
              },
            ]}
          >
            <Radio.Group>
              <Radio value="1">已放款</Radio>
              <Radio value="2">放款失败</Radio>
            </Radio.Group>
          </Form.Item>
          {loanStatus === '2' ? (
            <Form.Item
              name="loanStatusReason"
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
                name="loanNo"
                label="借据编号"
                rules={[
                  {
                    required: true,
                    message: '请输入借据编号',
                  },
                ]}
              >
                <Input placeholder="请输入" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="loanTime"
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
                name="loanMoney"
                rules={[{ required: true, message: '请输入放款金额' }]}
              >
                <InputNumber
                  placeholder="请输入"
                  addonAfter="万元"
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                name="referenceAnnualInterestRate"
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

  return isDetail && !dataSource?.length ? (
    <div className="empty">
      <Empty description="暂无数据" />
      {type === BankingLoan.DataSources.MANUALENTRY && (
        <Button className="empty-button" type="primary" onClick={toCreditApply}>
          去录入放款信息
        </Button>
      )}
    </div>
  ) : (
    <>
      <div className={sc('container-table-header')}>
        <div>剩余可借金额：100.00万元</div>
        <div className="title">
          <div>放款信息</div>
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
          scroll={{ x: 1400 }}
          columns={columns}
          rowKey={'id'}
          dataSource={dataSource}
          pagination={false}
        />
      </div>
      {isDetail && (
        <div className={sc('container-table-footer')}>
          数据来源：{BankingLoan.DataSourcesTrans[type || '']}
        </div>
      )}
      {useModal()}
    </>
  );
};
