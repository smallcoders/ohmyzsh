import { PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect,ProFormCascader, ProFormSwitch, ProFormDigit } from '@ant-design/pro-form';
import {
  getCities,
  queryChannelBusiness,
  queryOrgList,
  AddChannelBusiness,
  UpdateChannelBusiness
} from '@/services/business-pool'
import { Access, useAccess } from 'umi'
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
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const access: any = useAccess()
  const [isUse, setIsUse] = useState(false)

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
  const handleSave = async (isAdd: boolean, fields: BusinessPool.SaveAccountRequest, isCustom?: boolean, msg?: string) => {
    try {
      const result: Common.ResultCode = isAdd
        ? await AddChannelBusiness(fields)
        : await UpdateChannelBusiness(fields);
      if (result.code === 0) {
        message.success( isCustom ? msg : isAdd ? '操作成功' : '保存成功');
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
      message.error('操作失败');
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
      render: (_, record) => <span onClick={() =>{
        if (access.PQ_QD_DR) {
          setUpdateModalVisible(true)
          setCurrentRow(record)
        }
      }}  className={record.status === 1 ? 'text cursor' : 'normal cursor'}>{_}</span>
    },
    {
      title: '渠道商人数',
      dataIndex: 'channelBusinessNum',
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
      dataIndex: 'serviceNames',
      ellipsis: true,
      width: 350,
      hideInSearch: true,
      render: (_, record) => <span className={record.status === 1 ? 'text' : ''}>{_}</span>
    },
    {
      title: '承接区域',
      dataIndex: 'serviceArea',
      width: 350,
      ellipsis: true,
      valueType: 'cascader',
      hideInTable: true,
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
      width: 120,
      fixed: 'right',
      render: (_, record) => [
        <Access key="4" accessible={access.PU_QD_DR}>
          <Button
            key="2"
            size="small"
            type="link"
            onClick={() => {
              setCurrentRow(record);
              setIsEdit(true)
              setUpdateModalVisible(true);
            }}
          >
            编辑
          </Button>
        </Access>,
        <Access key="5" accessible={access.PU_QD_DR}>
        { record.status === 0 ?
            <Popconfirm
              key="3"
              title="禁用后，渠道商将无法接收新商机，已分发商机将自动释放，是否确认禁用？"
              okText="确定"
              cancelText="取消"
              placement="bottomRight"
              onConfirm={() => handleSave(false, {
                id: record.id,
                status: 1
              }, true, '已禁用')}
            >
              <Button size="small" type="link">
                禁用
              </Button>
            </Popconfirm> :
            <Popconfirm
              key="3"
              title="启用后，渠道商将接收新商机，是否确认启用？"
              okText="确定"
              cancelText="取消"
              placement="bottomRight"
              onConfirm={() => handleSave(false, {
                id: record.id,
                status: 0
              }, true, '已启用')}
            >
              <Button size="small" type="link">
                启用
              </Button>

            </Popconfirm>
          }
        </Access>
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
          modalProps={{
            destroyOnClose: true
          }}
          onFinish={async (value) => {
            const { serviceArea, channelName, maxTaskSize } = value
            const [serviceName, serviceCode] = handleArea(serviceArea, provinceData)
            const {  adminPhone, scale, adminName, id  } = channelName
            await handleSave(true, { serviceName, serviceArea: serviceCode, maxTaskSize, channelName: channelName.orgName, contactPhone: adminPhone, adminName,channelBusinessNum: scale, orgId: id } as BusinessPool.SaveAccountRequest)
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
              labelInValue: true,
              onChange(val, option) {
                console.log('val =>', val)
                console.log('option =>', option)
              }
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
            min={1}
            max={1000}
            initialValue={50}
            fieldProps={{
              precision: 0
            }}
            width="lg"
            name="maxTaskSize"
            label="商机承载量"
          />
        </ModalForm>
    );
  };

  useEffect(() => {
    setIsUse((currentRow?.status || 0) === 0)
  }, [currentRow])

  const renderUpdateModal = () => {
    console.log('currentRow =>', currentRow)
    const serviceName = currentRow?.serviceName?.split(',').map((ele: any) => ele.split('/'))
    const [serviceArea] = handleName(serviceName, provinceData)
    const initVal = Object.assign({}, currentRow, {
      status: (currentRow?.status || 0) === 0,
      serviceArea,
      serviceName: currentRow?.serviceName?.split(',').join('；')
    })
    console.log('initVal =>', initVal)
    return (
        <ModalForm
          title={ isEdit ? '编辑渠道商' : '渠道商详情'}
          width="600px"
          layout="horizontal"
          labelCol={{ span: 6 }}
          visible={updateModalVisible}
          modalProps={{
            destroyOnClose: true,
            okText: '保存',
            bodyStyle: {
              maxHeight: '500px',
              overflow: 'auto'
            },
          }}
          submitter={{
            render: (props, defaultDom) => {
              return [
                !isEdit ?
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', justifyItems: 'center'}}>
                  <Access key="4" accessible={access.PU_QD_DR}><Button type="link" onClick={() => setIsEdit(true)}>编辑渠道商</Button></Access>
                  <Button
                    type="primary"
                    key="ok"
                    onClick={() => {
                      setUpdateModalVisible(false)
                    }}
                    style={{marginLeft: 'auto'}}
                  >
                    关闭
                  </Button>
                </div>
                : defaultDom
              ];
            },
          }}
          onVisibleChange={(bool) => {
            if (!bool) {
              setIsEdit(false)
            }
            setUpdateModalVisible(bool)
          }}
          initialValues={initVal}
          onFinish={async (value) => {
              const { serviceArea: c } = value
              const [serviceNameTemp, serviceCode] = handleArea(c, provinceData)
              const params = {
                ...value,
                serviceName: serviceNameTemp,
                serviceArea: serviceCode,
                status: value.status ? 0 : 1,
                id: currentRow?.id
              }
              console.log('params =>', params)
              await handleSave(false, params as BusinessPool.SaveAccountRequest)
              setIsEdit(false)
            }
          }
        >
          <ProFormSelect
            rules={[{ required: true }]}
            width="lg"
            name="channelName"
            label="渠道商名称"
            debounceTime={300}
            options={[]}
            showSearch

            fieldProps={{
              fieldNames: {
                label: 'orgName',
                value: 'id'
              },
              labelInValue: true
            }}
            readonly
          />
          {!isEdit ?
            <ProFormText width="lg" name="serviceName" label="承接商机的区域" readonly />
          : <ProFormCascader
            rules={[{ required: true }]}
            width="lg"
            name="serviceArea"
            label="承接区域"
            fieldProps={{
              displayRender: (label, options) => {
                // @ts-ignore
                const [v1, v2] = options
                return `${v1.name}/${v2.name}`
              },
              placeholder: '请选择区域',
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
          }
          <ProFormDigit
            rules={[{ required: true }]}
            min={0}
            max={1000}
            initialValue={50}
            fieldProps={{
              precision: 0
            }}
            width="lg"
            name="maxTaskSize"
            label="商机承载量"
            readonly={!isEdit}
          />
          <ProFormText width="lg" name="channelBusinessNum" label="渠道商人数" readonly />
          <ProFormText width="lg" name="adminName" label="管理员姓名" readonly />
          <ProFormText width="lg" name="contactPhone" label="联系方式" readonly />
          <ProFormText width="lg" name="createTime" label="加入时间" readonly />
          <ProFormSwitch width="lg" checkedChildren="已启用" unCheckedChildren="已禁用" name="status" label="服务状态" disabled={!isEdit} fieldProps={{
            onChange(val: boolean){
              setIsUse(val)
            }
          }} />
          {isUse && <div style={{color: 'orange', marginLeft: '140px', marginTop: '-1.5em'}}><ExclamationCircleFilled style={{marginRight: '6px'}}  />禁用后，渠道商将无法接收新商机，已分发商机将自动释放</div>}
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
          labelWidth: 65,
          collapseRender: () => false,
          className: 'search-content'
        }}
        scroll={{ x: 1500 }}
        toolBarRender={() => [
          <Access key="4" accessible={access.PU_QD_DR}><Button type="primary" key="createAccount" onClick={() => setCreateModalVisible(true)}>
            <PlusOutlined /> 新建渠道商
          </Button>
          </Access>
        ]}

        request={async (pagination) => {
          const { serviceArea } = pagination
          const [serviceName, serviceCode] = handleArea(serviceArea, provinceData)
          const params = {
            pageIndex: pagination.current,
            serviceName,
            ...pagination,
            keywords: pagination.keywords?.trim(),
            serviceArea: serviceCode,
          }
          // @ts-ignore
          delete params.current
          console.log('params =>', params)
          const { result, code } = await queryChannelBusiness(params);
          if (code !== 0) return
          paginationRef.current = pagination;
          const { record } = result
          record?.records.forEach((ele: any) => {
            ele.serviceNames = ele.serviceName?.split(',').join('；')
          })
          return {
            data: record.records,
            success: true,
            total: record.total
          }
        }}
        columns={ columns }
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10,  showTotal: (total, range) => `共${total}条记录 第${Math.floor(range[0]/10) + 1}/${Math.ceil(total/10)}页` }}
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

function handleName(serviceArea: any, provinceData: any) {
  const serviceAreaTemp = serviceArea?.map?.((ele: any) => {
    const [v1, v2] = ele
    const city = provinceData.filter((item: any) => item.name === v1)[0] || {}
    const area = city?.nodes?.filter((item: any) => item.name === v2)[0] || {}
    return [city, area]
  })
  const serviceCode = serviceAreaTemp?.map((ele: any) => {
    const [v1, v2] = ele
    return [v1.code, v2.code]
  })

  return [serviceCode]
}

export default AccountTable;
