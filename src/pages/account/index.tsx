import { PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import {
  pageQuery,
  addAccount,
  updateAccount,
  deleteAccount,
  resetPassword,
  getUapDefaultPwd,
} from '@/services/account';
import type Account from '@/types/account';
import type Common from '@/types/common';

// 是否为管理员
const isAdmin = (type: string) => type === 'MANAGER_ADMIN';

const AccountTable: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Account.Account>();
  const actionRef = useRef<ActionType>();
  const defaultPwdRef = useRef<string>('');
  const paginationRef = useRef<any>();

  /**
   * 查询默认密码
   */
  useEffect(() => {
    getUapDefaultPwd().then((json) => {
      defaultPwdRef.current = json.result;
    });
  }, []);

  /**
   * 新增或修改
   * @param isAdd
   * @param fields
   */
  const handleSave = async (isAdd: boolean, fields: Account.SaveAccountRequest) => {
    try {
      const result: Common.ResultCode = isAdd
        ? await addAccount(fields)
        : await updateAccount(fields);
      if (result.code === 0) {
        message.success(`${isAdd ? '添加' : '修改'}账号成功`);
        setCreateModalVisible(false);
        setUpdateModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error(`${isAdd ? '添加' : '修改'}账号失败，请重试！`);
    }
  };

  /**
   * 删除或重置密码
   * @param isDelete
   * @param id
   */
  const handleModify = async (isDelete: boolean, id: number) => {
    try {
      const result: Common.ResultCode = isDelete
        ? await deleteAccount(id)
        : await resetPassword(id);
      if (result.code === 0) {
        message.success(`${isDelete ? '删除账号' : '重置密码'}成功`);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error(`${isDelete ? '删除账号' : '重置密码'}失败，请重试！`);
    }
  };

  const columns: ProColumns<Account.Account>[] = [
    {
      title: '序号',
      hideInSearch: true,
      renderText: (text: any, record: any, index: number) =>
        (paginationRef.current.current - 1) * paginationRef.current.pageSize + index + 1,
    },
    {
      title: '账号',
      dataIndex: 'loginName',
      valueType: 'textarea',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      valueType: 'textarea',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '创建人',
      hideInSearch: true,
      renderText: (text: any, record: any) => record.creator?.name,
    },
    {
      title: '账号类型',
      hideInSearch: true,
      renderText: (text: any, record: any) => (isAdmin(record.type) ? '运营管理员' : '运营'),
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_, record) => [
        <Popconfirm
          key="1"
          title={`确定重置该账号密码为 ${defaultPwdRef.current} ?`}
          okText="重置"
          cancelText="取消"
          placement="bottomRight"
          onConfirm={() => handleModify(false, record.id)}
          disabled={isAdmin(record.type)}
        >
          <Button size="small" type="link" disabled={isAdmin(record.type)}>
            重置密码
          </Button>
        </Popconfirm>,
        <Button
          key="2"
          size="small"
          type="link"
          disabled={isAdmin(record.type)}
          onClick={() => {
            setCurrentRow(record);
            setUpdateModalVisible(true);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="3"
          title="确定删除？"
          okText="删除"
          cancelText="取消"
          placement="bottomRight"
          onConfirm={() => handleModify(true, record.id)}
          disabled={isAdmin(record.type)}
        >
          <Button size="small" type="link" disabled={isAdmin(record.type)}>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const renderAddModal = () => {
    return (
      createModalVisible && (
        <ModalForm
          title={'新建账号'}
          width="400px"
          visible={createModalVisible}
          onVisibleChange={setCreateModalVisible}
          onFinish={async (value) => await handleSave(true, value as Account.SaveAccountRequest)}
        >
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="md"
            name="name"
            label="姓名"
          />
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="md"
            name="phone"
            label="联系方式"
          />
          <ProFormText
            rules={[
              { required: true },
              { type: 'string', max: 15 },
              { pattern: /^[A-Za-z0-9]+$/, message: '账号只允许是数字和字母' },
            ]}
            width="md"
            name="loginName"
            label="账号"
          />
        </ModalForm>
      )
    );
  };

  const renderUpdateModal = () => {
    const { id, loginName, name, phone } = currentRow || {};
    return (
      updateModalVisible && (
        <ModalForm
          title={'编辑账号'}
          width="400px"
          visible={updateModalVisible}
          onVisibleChange={setUpdateModalVisible}
          initialValues={{ loginName, name, phone }}
          onFinish={async (value) =>
            await handleSave(false, { ...value, id } as Account.SaveAccountRequest)
          }
        >
          <ProFormText
            rules={[{ required: true }]}
            width="md"
            name="loginName"
            label="账号"
            readonly
          />
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="md"
            name="name"
            label="姓名"
          />
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="md"
            name="phone"
            label="联系方式"
          />
        </ModalForm>
      )
    );
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle={'账号列表'}
        options={false}
        rowKey="id"
        actionRef={actionRef}
        search={{
          span: 6,
          labelWidth: 70,
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => setCreateModalVisible(true)}>
            <PlusOutlined /> 新建账号
          </Button>,
        ]}
        request={async (pagination) => {
          const result = await pageQuery(pagination);
          paginationRef.current = pagination;
          return result;
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
      {renderAddModal()}
      {renderUpdateModal()}
    </PageContainer>
  );
};

export default AccountTable;
