import { Button, message, Form, Modal, TreeSelect, Input,InputNumber } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { getDictionayTree } from '@/services/common';
import ProTable from '@ant-design/pro-table';
import { pageQuery, solutionEditType, getSolutionSort } from '@/services/solution';
import { getDictionay } from '@/services/common';
import { getAreaTree } from '@/services/area';
import type SolutionTypes from '@/types/solution';
import type { ProSchemaValueEnumObj } from '@ant-design/pro-utils';
import { routeName } from '@/../config/routes';
import { UploadOutlined } from '@ant-design/icons';
import { solutionExport } from '@/services/export';

/**
 * 渲染服务类型
 * @param types
 */
export const renderSolutionType = (types: SolutionTypes.TreeNode[] | undefined) => {
  if (!types || types.length === 0) {
    return '-';
  }
  const concatChildren = (children: { name: string }[]) => children.map((e) => e.name).join('、');
  return types
    .map((e) =>
      e.children && e.children.length > 0 ? `${e.name}（${concatChildren(e.children)}）` : e.name,
    )
    .join('、');
};

const SolutionTable: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const paginationRef = useRef<any>();
  const [typeOptions, setTypeOptions] = useState<any>({});
  const [areaOptions, setAreaOptions] = useState<ProSchemaValueEnumObj>({});
  const [total, setTotal] = useState<number>(0);
  const [weightVisible, setWeightVistble] = useState(false);
  const [currentId, setCurrentId] = useState<Number>(0);

  /**
   * 新建窗口的弹窗
   *  */
   const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
 
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState<any>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const clearForm = () => {
    form.resetFields();
    if (editingItem.photoId || editingItem.id) setEditingItem({});
  };

  const { TreeNode } = TreeSelect;
  const [treeNodeValue, setTreeNodeValue] = useState();
  const [serviceTypes, setServiceType] = useState<any>([]);

  const onChange = (newValue: any) => {
    console.log(newValue);
    setTreeNodeValue(newValue);
  };

  /**
   * 查询默认密码
   */
  useEffect(() => {
    // 查询服务类型选项
    getDictionay('NEW_ENTERPRISE_DICT').then((data) => {
      const options = {};
      data?.result.forEach(({ id, name }) => (options[id] = name));
      setTypeOptions(options);
    });

    // 获取服务类型树
    getDictionayTree('NEW_ENTERPRISE_DICT').then((data) => {
      setServiceType(data.result || []);
    });

    getAreaTree({}).then((data: { children: any[] }) => {
      const options = {};
      data.children.forEach(({ code, name }) => (options[code] = name));
      setAreaOptions(options);
    });
  }, []);

  /**
   * @zh-CN 服务类型编辑
   */
  const addOrUpdata = async () => {
    form
      .validateFields()
      .then(async (value) => {
        console.log(value, '...value');
        setAddOrUpdateLoading(true);
        try {
          const addorUpdateRes = await solutionEditType({ ...value, id: editingItem.id });
          if (addorUpdateRes.code === 0) {
            setModalVisible(false);
            message.success(`编辑成功`);
            actionRef.current?.reload();
            clearForm();
          } else {
            message.error(`编辑失败，原因:{${addorUpdateRes.message}}`);
          }
          setAddOrUpdateLoading(false);
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        // hide();
        // message.error('服务器错误');
        console.log(err);
      });
  };

  /**
   * 置顶处理
   * @param isTop
   * @param id
   */
  // const handleSetTop = async (isTop: boolean, id: number) => {
  //   const result = isTop ? await unsetTop(id) : await setTop(id);
  //   if (result.code !== 0) {
  //     message.error(result.message);
  //   } else {
  //     actionRef.current?.reload();
  //   }
  // };

  const [weightForm] = Form.useForm();
  const handleWeightOk = async () => {
    try {
      weightForm
      .validateFields()
      .then(async (value)=>{
        const res = await getSolutionSort({
          id: String(currentId),
          sort: value.sort
        })
        if (res?.code === 0) {
          message.success(`权重设置成功！`);
          setWeightVistble(false);
          weightForm.resetFields();
          actionRef.current?.reload();
        } else {
          message.error(`权重设置失败，原因:{${res?.message}}`);
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const weightModal = (): React.ReactNode => {
    return (
      <Modal
        title="请输入权重"
        width="780px"
        visible={weightVisible}
        onOk={handleWeightOk}
        onCancel={()=>{
          setWeightVistble(false)
        }}
      >
        <Form form={weightForm}>
          <Form.Item name="sort" rules={[{required: true,message: '必填',}]}>
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder='数字越大排名越靠前'                 
              min={1}
              step={0.001}
            />
          </Form.Item>
        </Form>
      </Modal>
    )
  }  

  const columns: ProColumns<SolutionTypes.Solution>[] = [
    {
      title: '序号',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '服务名称',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '服务类型',
      dataIndex: 'typeId',
      hideInTable: true,
      valueEnum: typeOptions,
    },
    {
      title: '服务类型',
      dataIndex: 'types',
      hideInSearch: true,
      width: 400,
      renderText: (text: any, record) => renderSolutionType(record.types),
    },
    {
      title: '所属服务机构',
      dataIndex: 'providerName',
      hideInTable: true,
      renderText: (text: any, record) => record.provider,
    },
    {
      title: '所属服务机构',
      dataIndex: 'provider',
      hideInSearch: true,
      renderText: (text: any, record) => record.provider?.name,
    },
    {
      title: '服务区域',
      dataIndex: 'areaCode',
      hideInTable: true,
      valueEnum: areaOptions,
    },
    {
      title: '服务区域',
      dataIndex: 'areas',
      hideInSearch: true,
      renderText: (text: any, record) => record.areas?.map((e) => e.name).join('、'),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTimeSpan',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '意向数量（次）',
      dataIndex: 'intentionCount',
      hideInSearch: true,
      valueType: 'textarea',
      render: (_, record) => (
        <Button
          size="small"
          type="link"
          onClick={() => history.push(`${routeName.SOLUTION_DETAIL}?id=${record.id}`)}
        >
          {record.intentionCount}
        </Button>
      ),
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_, record) => [
        <Button
          key="3"
          size="small"
          type="link"
          onClick={() => {
            setEditingItem(record);
            setModalVisible(true);
            form.setFieldsValue({ ...record,dealName: record.types?.map((e) => e.name).join('、') || ''});
          }}
        >
          服务类型编辑
        </Button>,
        <Button
          key="1"
          size="small"
          type="link"
          onClick={() => history.push(`${routeName.SOLUTION_DETAIL}?id=${record.id}`)}
        >
          详情
        </Button>,
        <Button type="link" onClick={() => {
          setWeightVistble(true);
          setCurrentId(record.id)
              // 重置 keyword: record.keyword  这里需要把权重选上
          weightForm.setFieldsValue({sort: record.sort || [],})
        }}>权重</Button>
      ],
    },
  ];

  const getModal = () => {
    return (
      <Modal
        title="服务类型编辑"
        width="400px"
        visible={createModalVisible}
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
          <Form.Item name="dealName" label="原类型">
            <Input placeholder="请输入" disabled/>
          </Form.Item>
          <Form.Item
            name="type"
            label="新类型"
            required
            rules={[
              {
                validator(rule, value) {
                  if(value.length>3){
                    return Promise.reject('最多选3个')
                  }
                  if(!value||value.length===0){
                    return Promise.reject('必填')
                  }else {
                    return Promise.resolve()
                  }
                },
              },
            ]}
          >
            <TreeSelect
                multiple
                style={{ width: '100%' }}
                value={treeNodeValue}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                allowClear
                treeData={serviceTypes}
                fieldNames={{ label: 'name', value: 'id', children: 'nodes' }}
                onChange={onChange}
              />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const [searchInfo, setSearchInfo] = useState<any>({})
  const exportList = () => {
    const { name, typeId, providerName, areaCode, publishTimeSpan } = searchInfo;
    solutionExport({
      name,
      typeId,
      providerName,
      areaCode,
      startPublishTime: publishTimeSpan ? publishTimeSpan[0] : undefined,
      endPublishTime: publishTimeSpan ? publishTimeSpan[1] : undefined,
    })
  }
  return (
    <>
      <ProTable
        headerTitle={`服务列表（共${total}个）`}
        toolBarRender={
          ()=>[
            <Button
              icon={<UploadOutlined />}
              onClick={exportList}
            >
              导出
            </Button>
          ]
        }
        options={false}
        rowKey="id"
        actionRef={actionRef}
        search={{
          span: 8,
          labelWidth: 100,
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        request={async (pagination) => {
          // 保存seatchInfo
          setSearchInfo(pagination)
          const result = await pageQuery(pagination);
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
      {getModal()}
      {weightModal()}
    </>
  );
};

export default SolutionTable;
