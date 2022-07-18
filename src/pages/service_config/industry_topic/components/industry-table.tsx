import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, message, Space, Popconfirm, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import '../index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
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

export default forwardRef((props: any, ref) => {

  const { editing, data } = props

  const [dataSource, setDataSource] = useState<OrgTypeManage.Content[]>([]);
  const [columns, setColumns] = useState<any[]>(
    [
      {
        title: '排序',
        dataIndex: 'id',
        width: 80,
        className: 'drag-visible',
        render: () => <DragHandle />,
      }, {
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
      }
    ]
  );

  useImperativeHandle(ref, () => ({
    data: dataSource,
  }));

  useEffect(() => {
    setDataSource(data || [])
  }, [data])


  const remove = async (id: string) => {
    try {
      const removeRes = await removeOrgType(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
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
      } else {
        message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    if (editing) {
      setColumns(p => {
        const column = [...p]
        column.unshift({
          title: '排序',
          dataIndex: 'id',
          width: 80,
          className: 'drag-visible',
          render: () => <DragHandle />,
        })
        column.push({
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
        })
        return column
      })
    } else {
      setColumns(p => {
        const column = [...p]
        column.shift()
        column.pop()

        return column
      })
    }
  }, [editing])

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el: any) => !!el,
      );
      console.log('Sorted items: ', newData);
      setDataSource(newData);
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
    ;
  }, []);

  return (
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
  );
})