import { PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect, ProFormSwitch, ProFormDigit } from '@ant-design/pro-form';
import {
  pageQuery,
  addAccount,
  updateAccount,
  deleteAccount,
  resetPassword,
  getUapDefaultPwd,
} from '@/services/account';
import type BusinessPool from '@/types/business-pool';
import type Common from '@/types/common';
import { decryptWithAES } from '@/utils/crypto';
import style  from './index.less'

// 是否为管理员
const isAdmin = (type: string) => type === 'MANAGER_ADMIN';

const AccountTable: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<BusinessPool.TableFrom>();
  const actionRef = useRef<ActionType>();
  const defaultPwdRef = useRef<string>('');
  const paginationRef = useRef<any>();

  /**
   * 查询默认密码
   */
  useEffect(() => {
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
  const handleSave = async (isAdd: boolean, fields: BusinessPool.SaveAccountRequest) => {
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

  const columns: ProColumns<BusinessPool.TableFrom>[] = [
    {
      title: '序号',
      hideInSearch: true,
      fixed: 'left',
      width: 80,
      renderText: (text: any, record: any, index: number) =>
        (paginationRef.current.current - 1) * paginationRef.current.pageSize + index + 1,
    },
    {
      title: '渠道商名称',
      dataIndex: 'channelName',
      ellipsis: true,
      width: 250,
      hideInSearch: true,
      render: (_, record) => <span className={record.status === '0' ? 'text' : 'text'}>{_}</span>
    },
    {
      title: '渠道商人数',
      dataIndex: 'name',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '商机承载量',
      dataIndex: 'business',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '承接区域',
      dataIndex: 'serviceArea',
      width: 350,
      ellipsis: true,
      valueType: 'cascader',
      fieldProps: {
        placeholder: '请选择区域'
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'radioButton',
      fieldProps: {
        defaultValue: '',
        options: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: '1'
          },
          {
            label: '禁用',
            value: '0'
          }
        ]
      },
      hideInTable: true
    },
    {
      title: '关键字',
      dataIndex: 'keywords',
      valueType: 'textarea',
      fieldProps: {
        placeholder: '渠道商名称/管理员名称'
      },
      hideInTable: true
    },
    {
      title: '管理员名称',
      dataIndex: 'channelName',
      width: 250,
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
      width: 150,
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '加入时间',
      dataIndex: 'createTime',
      width: 250,
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      fixed: 'right',
      render: (_, record) => [
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
          title="禁用后，渠道商将无法接收新商机，是否确认禁用？"
          okText="确定"
          cancelText="取消"
          placement="bottomRight"
          onConfirm={() => handleModify(true, record.id)}
          disabled={isAdmin(record.type)}
        >
          <Button size="small" type="link" disabled={isAdmin(record.type)}>
            禁用
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  // 新增渠道商
  const renderAddModal = () => {
    return (
        <ModalForm
          title={'新建渠道商'}
          width="600px"
          layout="horizontal"
          labelCol={{ span: 6 }}
          visible={createModalVisible}
          onVisibleChange={setCreateModalVisible}
          onFinish={async (value) => await handleSave(true, value as BusinessPool.SaveAccountRequest)}
        >
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="lg"
            name="channelName"
            label="渠道商名称"
          />
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="lg"
            name="serviceArea"
            label="承接商机的区域"
          />
          <ProFormDigit
            min={0}
            max={1000}
            fieldProps={{
              precision: 0,
              defaultValue: 50
            }}
            width="lg"
            name="maxTaskSize"
            label="商机承载量"
          />
        </ModalForm>
    );
  };

  const renderUpdateModal = () => {
    const { id, loginName, name, phone, roles } = currentRow || {};
    return (
        <ModalForm
          title={'编辑渠道商'}
          width="500px"
          layout="horizontal"
          labelCol={{ span: 6 }}
          visible={updateModalVisible}
          onVisibleChange={setUpdateModalVisible}
          initialValues={{ loginName, name, roleIds: roles ? roles?.map((item: any) => item?.id) : [], phone }}
          onFinish={async (value) =>
            await handleSave(false, { ...value, id } as BusinessPool.SaveAccountRequest)
          }
        >
          <ProFormText width="lg" name="channelBusinessNum" label="渠道商人数" fieldProps={{ value: '50' }} readonly />
          <ProFormText width="lg" name="adminName" label="管理员姓名" fieldProps={{ value: '李木子' }} readonly />
          <ProFormText width="lg" name="contactPhone" label="联系方式" fieldProps={{ value: '18210001086' }} readonly />
          <ProFormText width="lg" name="loginName" label="加入时间" fieldProps={{ value: '230505 16:12' }} readonly />
          <ProFormSwitch width="lg" name="loginName" label="服务状态" fieldProps={{ defaultChecked: false}} disabled />
        </ModalForm>
    );
  };

  return (
    <PageContainer className={style.BusinessPool}>
      <ProTable
        headerTitle={'全部渠道商'}
        options={false}
        rowKey="id"
        actionRef={actionRef}
        search={{
          span: 6,
          labelWidth: 70,
          collapseRender: () => false,
        }}
        scroll={{ x: 1500 }}
        toolBarRender={() => [
          <Button type="primary" key="createAccount" onClick={() => setCreateModalVisible(true)}>
            <PlusOutlined /> 新建渠道商
          </Button>
        ]}
        request={async (pagination) => {
          const result = await pageQuery(pagination);
          paginationRef.current = pagination;
          return result;
        }}
        columns={ columns }
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
      {renderAddModal()}
      {renderUpdateModal()}
    </PageContainer>
  );
};

export default AccountTable;
