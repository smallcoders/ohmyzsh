import { PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect,ProFormCascader, ProFormSwitch, ProFormDigit } from '@ant-design/pro-form';
import {
  deleteAccount,
  resetPassword,
} from '@/services/account';
import {
  getCities,
  queryChannelBusiness,
  queryOrgList,
  AddChannelBusiness,
  UpdateChannelBusiness
} from '@/services/business-pool'
import type BusinessPool from '@/types/business-pool';
import type Common from '@/types/common';
import style  from './index.less'

const AccountTable: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<BusinessPool.TableFrom>();
  const [provinceData, setProvinceData ]= useState<any>()
  const actionRef = useRef<ActionType>();
  const paginationRef = useRef<any>();
  const [orgListOptions, setOrgListOptions] = useState([])
  const [fetching, setFetching] = useState(false);


  useEffect(() => {
    getCities(340000).then((res) => {
      console.log('res =>', res)
      if (res.code === 0) {
        setProvinceData(res.result)
      }
    })
  }, [])

  /**
   * 新增或修改
   * @param isAdd
   * @param fields
   */
  const handleSave = async (isAdd: boolean, fields: BusinessPool.SaveAccountRequest) => {
    try {
      const result: Common.ResultCode = isAdd
        ? await AddChannelBusiness(fields)
        : await UpdateChannelBusiness(fields);
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
      render: (_, record) => <span className={record.status === 1 ? 'text cursor' : 'normal cursor'}>{_}</span>
    },
    {
      title: '渠道商人数',
      dataIndex: 'name',
      width: 150,
      hideInSearch: true,
      render: (_, record) => <span className={record.status === 1 ? 'text' : ''}>{_}</span>
    },
    {
      title: '商机承载量',
      dataIndex: 'maxTaskSize',
      width: 150,
      hideInSearch: true,
      render: (_, record) => <span className={record.status === 1 ? 'text' : ''}>{_}</span>
    },
    {
      title: '承接区域',
      dataIndex: 'serviceArea',
      width: 350,
      ellipsis: true,
      render: (_, record) => <span className={record.status === 1 ? 'text' : ''}>{_}</span>,
      valueType: 'cascader',
      fieldProps: {
        placeholder: '请选择区域',
        displayRender: (label, options) => {
          // @ts-ignore
          const [v1, v2] = options
          return `${v1.name}/${v2.name}`
        },
        showCheckedStrategy: 'SHOW_CHILD',
        options: provinceData,
        multiple: true,
        maxTagCount: 'responsive',
        fieldNames: {
          children: 'nodes',
          label: 'name',
          value: 'code'
        },
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
            value: 0
          },
          {
            label: '禁用',
            value: 1
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
      dataIndex: 'adminName',
      width: 250,
      valueType: 'textarea',
      hideInSearch: true,
      render: (_, record) => <span className={record.status === 1 ? 'text' : ''}>{_}</span>
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
      width: 150,
      valueType: 'textarea',
      hideInSearch: true,
      render: (_, record) => <span className={record.status === 1 ? 'text' : ''}>{_}</span>
    },
    {
      title: '加入时间',
      dataIndex: 'createTime',
      width: 250,
      valueType: 'textarea',
      hideInSearch: true,
      render: (_, record) => <span className={record.status === 1 ? 'text' : ''}>{_}</span>
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
        >
          <Button size="small" type="link">
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
          onFinish={async (value) => {
            const { serviceArea, channelName, maxTaskSize } = value
            const [serviceName, serviceCode] = handleArea(serviceArea, provinceData)
            const { id, phone, scale, legalName  } = channelName
            await handleSave(true, {serviceName, serviceCode, maxTaskSize, contactPhone: phone, adminName: legalName,channelBusinessNum: scale, id  } as BusinessPool.SaveAccountRequest)
          }}
        >
          <ProFormSelect
            rules={[{ required: true }]}
            width="lg"
            name="channelName"
            label="渠道商名称"
            debounceTime={300}
            options={[]}
            showSearch
            request={async ({keyWords}) => await queryOrgList(keyWords).then((res) => {
              if (res.code !== 0) return []
              return res.result
            })}
            fieldProps={{
              fieldNames: {
                label: 'orgName',
                value: 'id'
              },
              labelInValue: true
            }}
          />
          <ProFormCascader
            rules={[{ required: true }]}
            width="lg"
            name="serviceArea"
            label="承接商机的区域"
            fieldProps={{
              placeholder: '请选择区域',
              displayRender: (label, options) => {
                // @ts-ignore
                const [v1, v2] = options
                return `${v1.name}/${v2.name}`
              },
              showCheckedStrategy: 'SHOW_CHILD',
              options: provinceData,
              multiple: true,
              maxTagCount: 'responsive',
              fieldNames: {
                children: 'nodes',
                label: 'name',
                value: 'code'
              }}
            }
          />
          <ProFormDigit
            rules={[{ required: true }]}
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
          const { serviceArea } = pagination
          const [serviceName, serviceCode] = handleArea(serviceArea, provinceData)
          const params = {
            pageIndex: pagination.current,
            serviceName,
            serviceCode,
            ...pagination,
            keywords: pagination.keywords?.trim(),
          }
          // @ts-ignore
          delete params.serviceArea
          delete params.current
          console.log('params =>', params)
          const { result, code } = await queryChannelBusiness(params);
          if (code !== 0) return
          paginationRef.current = pagination;
          const { record } = result
          return {
            data: record.records,
            success: true,
            total: record.total
          }
        }}
        columns={ columns }
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
      {renderAddModal()}
      {renderUpdateModal()}
    </PageContainer>
  );
};




function handleArea(serviceArea: any, provinceData: any) {
    const serviceAreaTemp = serviceArea?.map?.((ele: any) => {
    const [v1, v2] = ele
    const city = provinceData.filter((item: any) => item.code === v1)[0] || {}
    const area = city?.nodes?.filter((item: any) => item.code === v2)[0] || {}
    return [city, area]
  })
  const serviceName = serviceAreaTemp?.map((ele: any) => {
    const [v1, v2] = ele
    return [v1.name, v2.name].join('/')
  }).join()
  const serviceCode = serviceAreaTemp?.map((ele: any) => {
    return ele[1]?.code
  }).join()
  return [serviceName, serviceCode]
}

export default AccountTable;
