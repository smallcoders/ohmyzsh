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
import type OrgTypeManage from '@/types/org-type-manage';
import {
  addOrgType,
  getOrgTypeList,
  removeOrgType,
  sortOrgType,
  updateOrgType,
} from '@/services/org-type-manage';
const sc = scopedClasses('solution-properties-app-news');

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

export default forwardRef((props: any, ref) => {
  const { data, autoColumns, handleSameData } = props;

  const [dataSource, setDataSource] = useState<OrgTypeManage.Content[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  const onEdit = () => {
    setColumns((p) => {
      const column = [...p];
      column.unshift({
        title: '排序',
        dataIndex: 'detailId',
        width: 80,
        className: 'drag-visible',
        render: () => <DragHandle />,
      });
      column.push({
        title: '移除',
        width: 200,
        dataIndex: 'option',
        render: (_: any, record: OrgTypeManage.Content) => {
          return (
            <Space size="middle">
              <Button
                type="link"
                onClick={() => {
                  remove(record.detailId as string);
                }}
              >
                删除
              </Button>
            </Space>
          );
        },
      });
      return column;
    });
  };

  const cancelEdit = () => {
    setColumns((p) => {
      const column = [...p];
      column.shift();
      column.pop();
      return column;
    });
  };

  useImperativeHandle(ref, () => ({
    data: dataSource,
    onEdit: onEdit,
    cancelEdit: cancelEdit,
  }));

  useEffect(() => {
    setDataSource(data || []);
  }, [data]);

  useEffect(() => {
    setColumns([
      ...(autoColumns || []),
      {
        title: '点击量',
        dataIndex: 'clickRate',
      },
    ]);
  }, []);

  const remove = async (id: string) => {
    setDataSource((p) => {
      const rest = p.filter((p) => p.detailId !== id);
      console.log('rest', rest);
      handleSameData(rest);
      return rest;
    });
  };

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    console.log('oldIndex, newIndex ', oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el: any) => !!el,
      );
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
    const index = dataSource.findIndex((x) => x.detailId === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <Table
      pagination={false}
      dataSource={dataSource}
      columns={columns}
      rowKey="detailId"
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
  );
});
