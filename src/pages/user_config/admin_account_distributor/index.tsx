import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, Select, Row, Col, message, Space, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import AdminAccountDistributor from '@/types/admin-account-distributor.d';
import {
  addAdminAccount,
  getAdminAccountPage,
  removeAdminAccount,
  resetAdminAccount,
  updateAdminAccount,
} from '@/services/admin-account-distributor';
import { getOrgTypeOptions } from '@/services/org-type-manage';
const sc = scopedClasses('user-config-admin-account-distributor');
export default () => {
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<AdminAccountDistributor.Content[]>([]);
  const [editingItem, setEditingItem] = useState<AdminAccountDistributor.Content>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
  }>({});

  const [options, setOptions] = useState<any>([]);

  const getDictionary = async () => {
    try {
      const res = await Promise.all([getOrgTypeOptions()]);
      console.log(res[0]);
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

  const [form] = Form.useForm();

  const getPages = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getAdminAccountPage({
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

  const clearForm = () => {
    form.resetFields();
    setEditingItem({});
  };

  const addOrUpdate = async () => {
    const tooltipMessage = editingItem.id ? '修改' : '添加';
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        if (value.publishTime) {
          value.publishTime = moment(value.publishTime).format('YYYY-MM-DDTHH:mm:ss');
        }
        const addorUpdateRes = await (editingItem.id
          ? updateAdminAccount({
              ...value,
              id: editingItem.id,
            })
          : addAdminAccount({
              ...value,
            }));
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          console.log(editingItem.id);
          if (!editingItem.id) {
            Modal.info({
              title: '新增管理员成功',
              content: ` 当前管理员密码初始密码为：ly@${moment().format('YYYYMMDD')}`,
            });
          }

          getPages();
          clearForm();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch(() => {
        setAddOrUpdateLoading(false);
      });
  };

  const remove = async (id: string) => {
    try {
      const removeRes = await removeAdminAccount(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getPages();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reset = async (id: string) => {
    try {
      const tooltipMessage = '重置密码';
      const updateStateResult = await resetAdminAccount(id);
      if (updateStateResult.code === 0) {
        message.success(`${tooltipMessage}成功`);
        getPages();
      } else {
        message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: AdminAccountDistributor.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      isEllipsis: true,
      width: 200,
    },

    {
      title: '查看范围',
      dataIndex: 'viewRange',
      isEllipsis: true,
      width: 280,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: AdminAccountDistributor.Content) => {
        return (
          <Space size="middle">
            {record.isEdit && (
              <a
                href="#"
                onClick={() => {
                  setEditingItem(record);
                  setModalVisible(true);
                  form.setFieldsValue({ name: record?.userName, typeIds: record?.viewRangeIds });
                }}
              >
                编辑
              </a>
            )}
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(record.id as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>

            <Popconfirm
              title={`确定重置该账号密码为ly@${moment().format('YYYYMMDD')}？`}
              okText="确定"
              cancelText="取消"
              onConfirm={() => reset(record.id as string)}
            >
              <a href="#">重置密码</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getPages();
  }, [searchContent]);

  useEffect(() => {
    getDictionary();
  }, []);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="useName" label="用户名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={4} offset={14}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
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

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '修改管理员' : '新增管理员'}
        width="400px"
        visible={createModalVisible}
        maskClosable={false}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        okButtonProps={{ loading: addOrUpdateLoading }}
        onOk={async () => {
          addOrUpdate();
        }}
      >
        <Form {...formLayout} form={form} layout="horizontal">
          <Form.Item
            rules={[
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error('必填'));
                  }
                  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5-]+$/.test(value)) {
                    return Promise.reject(
                      new Error('由数字、字母、中文、下划线或者中划线组成,长度40字符以内'),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            required
            name="name"
            label="用户名"
          >
            <Input placeholder="请输入" maxLength={40} />
          </Form.Item>
          <Form.Item
            name="typeIds"
            label="查看范围"
            rules={[
              {
                required: true,
                message: '必选',
              },
            ]}
          >
            <Select
              placeholder="请选择"
              allowClear
              showSearch={false}
              mode="multiple"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ height: 32 }} />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      background: '#fff',
                      padding: 5,
                      width: '100%',
                      borderTop: '1px solid #dbd9d9',
                    }}
                  >
                    <Space size={10}>
                      <input
                        type={'checkbox'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            form.setFieldsValue({ typeIds: options?.map((p) => p?.id) });
                          } else {
                            form.setFieldsValue({ typeIds: [] });
                          }
                        }}
                      />
                      全选
                    </Space>
                  </div>
                </>
              )}
            >
              {options?.map((item: any) => (
                <Select.Option key={item?.id} value={item?.id}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>账号列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增管理员
          </Button>
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
                  onChange: getPages,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
      {useModal()}
    </PageContainer>
  );
};
