import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, message, Space, Popconfirm, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { arrayMoveImmutable } from 'array-move';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import OrgTypeManage from '@/types/org-type-manage';
import {
  addOrgType,
  getOrgTypeList,
  removeOrgType,
  sortOrgType,
  updateOrgType,
} from '@/services/org-type-manage';
const sc = scopedClasses('service-config-app-news');

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

export default () => {
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<OrgTypeManage.Content[]>([]);
  const [editingItem, setEditingItem] = useState<OrgTypeManage.Content>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [form] = Form.useForm();

  const getPages = async () => {
    try {
      const { result, code } = await getOrgTypeList();
      if (code === 0) {
        setDataSource(
          result.map((p, index) => {
            return { sort: index, ...p };
          }),
        );
      } else {
        message.error(`请求列表数据失败`);
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
        const addorUpdateRes = await (editingItem.id
          ? updateOrgType({
              ...value,
              id: editingItem.id,
            })
          : addOrgType({ ...value }));
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          message.success(`${tooltipMessage}成功`);
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
      const removeRes = await removeOrgType(id);
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

  const sort = async (ids: string[]) => {
    try {
      const tooltipMessage = '排序';
      const updateStateResult = await sortOrgType(ids);
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
      dataIndex: 'id',
      width: 80,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: '类型名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 180,
    },
    {
      title: '类型描述',
      dataIndex: 'description',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: 200,
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
      dataIndex: 'option',
      render: (_: any, record: OrgTypeManage.Content) => {
        return (
          <Space size="middle">
            {record.isEdit && (
              <a
                href="#"
                onClick={() => {
                  setEditingItem(record);
                  setModalVisible(true);
                  form.setFieldsValue({ ...record });
                }}
              >
                编辑{' '}
              </a>
            )}
            {!record.isDelete ? (
              <a
                href="#"
                onClick={() => {
                  Modal.info({
                    title: '提示',
                    content: '当前类型下有绑定的服务机构，请先解除绑定关系',
                  });
                }}
              >
                删除
              </a>
            ) : (
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

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      sort(newData.map((p) => p.id));
    }
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    const index = dataSource.findIndex((x) => x.sort === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  useEffect(() => {
    getPages();
  }, []);

  useEffect(() => {
    console.log('dataSource', dataSource);
  }, [dataSource]);

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '修改机构类型' : '新增机构类型'}
        width="400px"
        visible={createModalVisible}
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
              {
                validator: async (_, value) => {
                  if (
                    dataSource
                      ?.map((p) => {
                        if (p.id !== editingItem.id) {
                          return p.name;
                        }
                      })
                      .includes(value)
                  ) {
                    return Promise.reject(new Error('该机构类型已存在'));
                  }
                },
              },
            ]}
            name="name"
            label="类型名称"
            required
          >
            <Input placeholder="请输入" maxLength={10} />
          </Form.Item>
          <Form.Item name="description" label="类型描述">
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={100}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>机构类型列表(共{dataSource?.length || 0}个)</span>
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 添加机构类型
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <Table
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          rowKey="sort"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </div>
      {useModal()}
    </PageContainer>
  );
};
