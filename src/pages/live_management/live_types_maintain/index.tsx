import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, Select, Row, Col, message, Space, Popconfirm, DatePicker, Radio } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import { history } from 'umi';
import { routeName } from '@/../config/routes';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import LiveTypesMaintain from '@/types/live-types-maintain.d';
import {
  addLiveType,
  getLiveTypesPage,
  removeAdminAccount,
  resetAdminAccount,
  updateLiveType,
} from '@/services/live-types-maintain';
import { getOrgTypeOptions } from '@/services/org-type-manage';
import UploadForm from '@/components/upload_form';
const sc = scopedClasses('user-config-admin-account-distributor');
export default () => {
  const { TextArea } = Input;
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<LiveTypesMaintain.Content[]>([]);
  const [editingItem, setEditingItem] = useState<LiveTypesMaintain.Content>({});
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
      const { result, totalCount, pageTotal, code } = await getLiveTypesPage({
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
    const tooltipMessage = editingItem.id ? '编辑类型' : '新增类型';
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        if (value.publishTime) {
          value.publishTime = moment(value.publishTime).format('YYYY-MM-DDTHH:mm:ss');
        }
        const addorUpdateRes = await (editingItem.id
          ? updateLiveType({
              ...value,
              id: editingItem.id,
            })
          : addLiveType({
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
      render: (_: any, _record: LiveTypesMaintain.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '类型名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      isEllipsis: true,
      width: 200,
      render: (_: boolean) => _ ? '启用' : '禁用',
    },
    {
      title: '创建人',
      dataIndex: 'creatorUserName',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 80
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: LiveTypesMaintain.Content) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                setEditingItem(record);
                setModalVisible(true);
                form.setFieldsValue({ name: record?.userName, typeIds: record?.id });
              }}
            >
              编辑
            </a>
            {!record.status ? (
              <Popconfirm
              title={`确定启用么？`}
              okText="确定"
              cancelText="取消"
              onConfirm={() => reset(record.id as string)}
              >
              <a href="#">启用</a>
            </Popconfirm>
            )
            :
            (
              <Popconfirm
              title={`确定停用么？`}
              okText="确定"
              cancelText="取消"
              onConfirm={() => reset(record.id as string)}
              >
              <a href="#">停用</a>
            </Popconfirm>
            )}
            {!record.status && (
              <Popconfirm
                title="确定删除么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id as string)}
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
    getPages();
  }, [searchContent]);

  useEffect(() => {
    getDictionary();
  }, []);

  const handleOk = async () => {
    addOrUpdate();
  };

  const handleCancel = () => {
    clearForm();
    setModalVisible(false);
  };
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '修改类型' : '新增类型'}
        width="400px"
        visible={createModalVisible}
        okButtonProps={{ loading: addOrUpdateLoading }}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="link"
            type="primary"
            onClick={handleOk}
          >
            保存
          </Button>,
        ]}
      >
        <Form {...formLayout} form={form} layout="horizontal">
          <Form.Item 
            name="name"
            label="类型名称"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}>
            <Input placeholder="请输入" maxLength={40} />
          </Form.Item>
          
          <Form.Item 
            name="status"
            label="状态">
            <Radio.Group>
              <Radio value={true}>启用</Radio>
              <Radio value={false}>禁用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>类型列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增类型
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
