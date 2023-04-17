import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Form, Modal, Space, Popconfirm, Select, message } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { PlusOutlined } from '@ant-design/icons';
import { history, Access, useAccess, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type SolutionTypes from '@/types/solution';
import scopedClasses from '@/utils/scopedClasses';
import ProTable from '@ant-design/pro-table';
// 根据后端接口添加
import { deleteBid, getBidPage, onOffShelvesById } from '@/services/baseline';
import { httpServiceAccountMannagePage, httpServiceAccountManageSave, pageQuery, httpServiceAccountManageDel, httpAccountList } from '@/services/service-management'
import './index.less';
const sc = scopedClasses('service-number-setting');

// 状态
const stateColumn = {
  NOT_SUBMITTED: '暂存', // 暂存
  ON_SHELF: '上架中', // 上架中
  OFF_SHELF: '已下架', // 已下架
};
export default () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  // 编辑的id
  const [editId, setEditId] = useState<number | null>()
  // 编辑的选中值
  const [selectDefault, setSelectDefault] = useState<any>(null)
  // 模态框的状态
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('新增')
  const [form] = Form.useForm();
  // 表单 权限人员 label: 展示的姓名  value id
  const [optionsData, setOptionsData] = useState<any>([]);
  const access = useAccess();
  // 手动触发table 的 reload等操作
  const actionRef = useRef<ActionType>();
  // current pageSize
  const paginationRef = useRef<any>();
  const [total, setTotal] = useState<number>(0);

  const prepare = async () => {
    try {
      const res = await httpAccountList({
        // name: '',
        all: true
      })
      if (res?.code == 0) {
        console.log('权限人员',res)
        setOptionsData(res?.result?.map((item: any) => {
          return {
            label: item?.name,
            value: item.id
          }
        }))
      } else {
        throw new Error("");
      }
    } catch (error) {
      message.error('获取权限人员失败')
    }
  }
  useEffect(() => {
    prepare()
  },[])
  // 删除
  const remove = async (id: string) => {
    try {
      const removeRes = await httpServiceAccountManageDel(id)
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        // 根据pageSize
        if (total === 11) {
          actionRef.current?.reloadAndRest()
          return
        }
        actionRef.current?.reload(); // 让table// 刷新
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditBtn = (item: any) => {
    // 注意需要传id, 否则下拉框无法呈现选中状态
    const a = item.accountList && item.accountList?.map((value: any) => value.id)
    form.setFieldsValue({...item, accountIdList: a})
    setModalTitle('编辑')
    setModalVisible(true)
  };

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
      title: '服务号内部名',
      dataIndex: 'innerName',
      align: 'center',
      valueType: 'text', // 筛选的类别
    },
    {
      title: '权限账号',
      dataIndex: 'accountList',
      align: 'center',
      hideInSearch: true,
      renderText: (_: any, record: any) => {
        return (
          <div className={sc('permission')}>
            { _ && _?.map((item: any, index: any) => {
              return (
                <div className={sc('permission-item')} key={index}>
                  {item.name}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: '最新操作时间',
      dataIndex: 'updateTime',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '当前状态',
      dataIndex: 'state',
      align: 'center',
      width: 100,
      hideInSearch: true,
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateColumn, _) ? stateColumn[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '操作',
      hideInSearch: true, // 隐藏筛选
      align: 'center',
      width: 300,
      render: (_, record) => {
        return (
          <Space size="middle">
            {/* 需要调整的权限 */}
            <Access accessible={access['P_BLM_FWHGL']}>
              <Button
                key="2"
                size="small"
                type="link"
                onClick={() => {
                  setEditId(record.id)
                  handleEditBtn(record);
                }}
              >
                编辑
              </Button>
            </Access>
            <Access accessible={access['P_BLM_FWHGL']}>
              <Popconfirm
                title={
                  <div>
                    <div>删除数据</div>
                    <div>确定删除该服务号？</div>
                  </div>
                }
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id.toString())}
              >
                <a href="#">删除</a>
              </Popconfirm>
            </Access>
          </Space>
        );
      },
    },
  ];

  const clearForm = () => {
    form.resetFields();
    setEditId(null)
    setSelectDefault(null)
  };
  const onFinish = async () => {
    // 拿到form的表单值
    form.validateFields().then(async (value) => {
      try {
        const res = await httpServiceAccountManageSave({
          id: editId,
          ...value,
        })
        if (res?.code === 0) {
          setModalVisible(false)
          message.success(`${modalTitle}成功`);
          actionRef.current?.reload()
          clearForm();
        } else {
          throw new Error("");
        }
      } catch (error) {
        message.error(`${modalTitle}失败，原因:{${error}}`);
      }
    })
  };
  const handleChange = (value: any) => {
    console.log('多选', value);
  };

  const getModal = () => {
    return (
      <Modal
        title={modalTitle}
        visible={createModalVisible}
        width="500px"
        maskClosable={false}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        onOk={() => {
          onFinish();
        }}
      >
        <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            name="innerName"
            label="服务号内部名称"
            rules={[{ required: true, message: '请输入服务号内部名称' }]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item
            name="accountIdList"
            label="权限人员"
            rules={[{ required: true, message: '请填写App版本号' }]}
          >
            <Select
              allowClear
              showArrow={true}
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择"
              options={optionsData}
              onChange={handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const handleAddBtn = () => {
    setModalTitle('新增')
    setModalVisible(true)
  }

  return (
    <PageContainer className={sc('container')}>
      <ProTable
        headerTitle={`服务号设置管理列表（共${total}个）`}
        options={false} // 工具栏隐藏
        actionRef={actionRef} // 用来自定义触发
        rowKey="id"
        search={{
          span: 8,
          labelWidth: 100,
          defaultCollapsed: false, // 默认是否收起
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        request={async (pagination) => {
          // 查询，重置搜集的值
          console.log('pagination', pagination)
          const result = await httpServiceAccountMannagePage({
            ...pagination
          })
          console.log('结果',result)
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        toolBarRender={() => [
          <Access accessible={access['P_BLM_FWHGL']}>
            <Button
              key="button"
              icon={<PlusOutlined />}
              type="primary"
              // disabled={total >= 16}
              onClick={() => { handleAddBtn() }}
            >
              新增
            </Button>
          </Access>
        ]}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
      {/* 新增 / 编辑的模态框 */}
      {getModal()}
    </PageContainer>
  );
};
