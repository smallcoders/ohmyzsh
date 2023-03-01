import { PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import {
  pageQuery,
  addAccount,
  updateAccount,
  deleteAccount,
  resetPassword,
  getUapDefaultPwd,
  httpGetListRoles,
} from '@/services/account';
import type Account from '@/types/account';
import type Common from '@/types/common';
import { decryptWithAES } from '@/utils/crypto';
import { useModel } from 'umi';

// 是否为管理员
const isAdmin = (type: string) => type === 'MANAGER_ADMIN';

const AccountTable: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Account.Account>();
  const actionRef = useRef<ActionType>();
  const defaultPwdRef = useRef<string>('');
  const paginationRef = useRef<any>();
  const [listRoles, setListRoles] = useState<any>([]) // 查询所有角色
  const [useListRoles, setUseListRoles] = useState<any>([]) // 查询所有角色

  // 获取用户信息user
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [handle, setHandle] = useState<boolean>(false); // true展示， false隐藏。   默认隐藏
  useEffect(() => {
    const { type = '' } = currentUser || {}
    if (type && type === 'MANAGER_ADMIN') {
      setHandle(true)
    }
  }, [currentUser])

  /**
   * 查询所有角色
   */
  const getListRolesData = async (enable?: boolean) => {
    try {
      const res = await httpGetListRoles(enable)
      if (res?.code === 0) {
        const list = res?.result?.map((item: any) => {
          return {
            label: item?.name,
            value: item?.id,
          }
        })
        enable
          ? setUseListRoles(list || [])
          : setListRoles(list || [])
        return list
      } else {
        throw new Error("");
      }
    } catch (error) {
      message.error('获取所有角色失败，请重试')
    }
  }

  /**
   * 查询默认密码
   */
  useEffect(() => {
    // 查询所有角色
    getListRolesData(false)
    getListRolesData(true)
    getUapDefaultPwd().then((json) => {
      console.log(json);
      defaultPwdRef.current = decryptWithAES(json.result);
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
        const { reset, reload } = actionRef.current || {};
        if (isAdd) {
          if (reset) {
            reset();
          }
          setCreateModalVisible(false);
        } else {
          setUpdateModalVisible(false);
        }
        if (reload) {
          reload();
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
      title: '角色',
      dataIndex: 'roleId',
      valueType: 'select',
      renderText: (text: any, record: any) => record.roles && record.roles.length > 0 ? record.roles.map((p: any) => p.name) : '--',
      request: async () => getListRolesData(false)
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
  const columnsTwo: ProColumns<Account.Account>[] = [
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
      title: '角色',
      dataIndex: 'roleId',
      valueType: 'select',
      renderText: (text: any, record: any) => record.roles && record.roles.length > 0 ? record.roles.map((p: any) => p.name) : '--',
      request: async () => getListRolesData(false)
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
  ];

  const renderAddModal = () => {
    return (
      createModalVisible && (
        <ModalForm
          title={'新建账号'}
          width="400px"
          layout="horizontal"
          labelCol={{ span: 6 }}
          visible={createModalVisible}
          onVisibleChange={setCreateModalVisible}
          onFinish={async (value) => await handleSave(true, value as Account.SaveAccountRequest)}
        >
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="sm"
            name="name"
            label="姓名"
          />
          <ProFormSelect
            name="roleIds"
            label="所属角色"
            rules={[{ required: true, message: '请选择所属角色' }]}
            options={useListRoles}
            fieldProps={{
              mode: 'multiple',
            }}
            width="sm"
          />
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="sm"
            name="phone"
            label="联系方式"
          />
          <ProFormText
            rules={[
              { required: true },
              { type: 'string', max: 15 },
              { pattern: /^[A-Za-z0-9]+$/, message: '账号只允许是数字和字母' },
            ]}
            width="sm"
            name="loginName"
            label="账号"
          />
        </ModalForm>
      )
    );
  };

  const renderUpdateModal = () => {
    const { id, loginName, name, phone, roles } = currentRow || {};
    return (
      updateModalVisible && (
        <ModalForm
          title={'编辑账号'}
          width="400px"
          layout="horizontal"
          labelCol={{ span: 6 }}
          visible={updateModalVisible}
          onVisibleChange={setUpdateModalVisible}
          initialValues={{ loginName, name, roleIds: roles ? roles?.map((item: any) => item?.id) : [], phone }}
          onFinish={async (value) =>
            await handleSave(false, { ...value, id } as Account.SaveAccountRequest)
          }
        >
          <ProFormText width="sm" name="loginName" label="账号" readonly />
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="sm"
            name="name"
            label="姓名"
          />
          <ProFormSelect
            name="roleIds"
            label="所属角色"
            rules={[{ required: true, message: '请选择所属角色' }]}
            options={useListRoles}
            fieldProps={{
              mode: 'multiple',
            }}
            width="sm"
          />
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="sm"
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
          span: 4,
          labelWidth: 70,
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
          collapseRender: () => false,
        }}
        toolBarRender={() => [
          handle &&
          <Button type="primary" key="createAccount" onClick={() => setCreateModalVisible(true)}>
            <PlusOutlined /> 新建账号
          </Button>,
        ]}
        request={async (pagination) => {
          const result = await pageQuery(pagination);
          paginationRef.current = pagination;
          return result;
        }}
        columns={handle ? columns : columnsTwo}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
      {renderAddModal()}
      {renderUpdateModal()}
    </PageContainer>
  );
};

export default AccountTable;
