import {
  Button, 
  Space,
  message,
  Popconfirm,
  Modal,
  Form,
  Select,
  TreeSelect,
  Input,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { history, Link } from 'umi';
import { 
  getCityActivity, 
  deleteDityActivity,
  cityActivity,
  areaLabel,
} from '@/services/propaganda-config'
import type SolutionTypes from '@/types/solution';
import add_management from '../add_management';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const paginationRef = useRef<any>();
  const [total, setTotal] = useState<number>(0);
  // 新增、编辑模态框
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 保留当前Item的值
  const [editingItem, setEditingItem] = useState<any>({});
  const remove = async (id: string) => {
    try {
      const removeRes = await deleteDityActivity(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        actionRef.current?.reload(); // 让table// 刷新
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [form] = Form.useForm();


  const stateColumn = {
    'UN_START': '未开始',
    'TO_START': '即将开始',
    'STARTED': '进行中',
    'FINISHED': '已结束'
  }

  const columns: ProColumns<SolutionTypes.Solution>[] = [
    {
      title: '序号',
      hideInSearch: true,
      align: 'center',
      width: 50,
      renderText: (text: any, record: any, index: number) =>
        (paginationRef.current.current - 1) * paginationRef.current.pageSize + index + 1,
    },
    {
      title: '城市名称',
      dataIndex: 'areaName',
      hideInTable: true, // 需要添加筛选项
      valueType: 'textarea', // 筛选的类型
    },
    {
      title: '城市名称',
      dataIndex: 'areaName',
      width:100,
      align: 'center',
      hideInSearch: true,  // 隐藏筛选
      valueType: 'textarea', // 筛选的类型
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInTable: true,
      valueEnum: stateColumn, // 筛选的类型
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 100,
      align: 'center',
      hideInSearch: true, // 隐藏筛选
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateColumn, _) ? stateColumn[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '活动说明',
      dataIndex: 'remark',
      width: 400,
      hideInSearch: true, 
      align: 'center',
      renderText: (_: any, record: any) => record.remark,
    },
    {
      title: '操作',
      align: 'center',
      width: 300,
      hideInSearch: true, // 隐藏筛选
      render: (_: any, record: any) => {
        return (
          <Space>
            {
              record?.state !== 'FINISHED' &&
              <a
                href="#"
                onClick={() => {
                  setEditingItem(record);
                  setModalVisible(true);
                  form.setFieldsValue({ ...record});
                }}
              >
                编辑{' '}
              </a>
            }
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(record.id as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  const clearForm = () => {
    form.resetFields();
    setEditingItem({});
  };

  const addOrUpdata = () => {
    const tooltipMessage = editingItem.id ? '修改' : '添加';
    form
      .validateFields()
      .then(async (value)=>{
        actionRef.current?.reset()
        const res = editingItem.id 
          ? await cityActivity({ ...value, id: editingItem.id, areaCode: value.areaCode })
          : await cityActivity({...value, areaCode: value.areaCode})
        if (res.code === 0) {
          setModalVisible(false);
          message.success(`${tooltipMessage}成功`);
          actionRef.current?.reload()
          clearForm();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${res.message}}`);
        }
      })
      .catch(()=>{
        console.log('失败')
      })
  }

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [serviceTypes, setServiceType] = useState<any>([]);

  const _areaLabel = async () => {
    try {
      const res = await areaLabel()
      if (res?.code === 0) {
        let arr = []
        arr =res?.result?.map((item: any)=>{
          return {
            areaName: item.name,
            areaCode: item.code.toString()
          }
        }) || []
        setServiceType(arr)
      }
    } catch (error) {
      console.log('获取城市下拉error')
    }
  }
  useEffect(()=>{
    // 城市名称安徽省16地市
    // 下拉选项为安徽省16地市，列表中存在的城市活动状态为非已结束，则选项中不存在；如果为已结束或未维护的城市，则选项中存在
    _areaLabel()
  },[])

  const getModal = () => {
    return (
      <Modal
        title={editingItem.id ? '修改地市活动' : '新增地市活动'}
        width="400px"
        visible={modalVisible}
        maskClosable={false}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        onOk={async () => {
          await addOrUpdata();
        }}
      >
        <Form {...formLayout} form={form} layout="horizontal">
          <Form.Item
            name="areaCode"
            label="城市名称"
            required
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Select placeholder="请选择">
              {
                serviceTypes?.map((item: any)=>{
                  return (
                    <React.Fragment key={item?.areaName}>
                      <Select.Option value={item?.areaCode}>{item?.areaName}</Select.Option>
                    </React.Fragment>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="state"
            label="状态"
            required
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Select placeholder="请选择">
              <Select.Option value={'UN_START'}>未开始</Select.Option>
              <Select.Option value={'TO_START'}>即将开始</Select.Option>
              <Select.Option value={'STARTED'}>进行中</Select.Option>
              <Select.Option value={'FINISHED'}>已结束</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="活动说明">
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <PageContainer>
      <ProTable 
        headerTitle={`地市活动列表（共${total || 0}个）`}
        options={false}
        rowKey="id"
        actionRef={actionRef} // 用来自定义触发
        search={{
          span: 8,
          labelWidth: 100,
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        request={async (pagination) => {
          const result = await getCityActivity(pagination);
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
        toolBarRender={()=>[
          <Button 
            key="button" 
            icon={<PlusOutlined /> } 
            type="primary" 
            onClick={()=>{
              setModalVisible(true)
            }}
          >
            新增地市宣传页
          </Button>
          ]}
      />
      {getModal()}
    </PageContainer>
  )
}

export default TableList