import { FormOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { Table, Popconfirm, Space, Form, Input } from 'antd';
import React, { useRef, useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Modal, Button } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
import type { ColumnsType } from 'antd/es/table';
import { arrayMoveImmutable } from 'array-move';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
const sc = scopedClasses('material-library');
type Props = {
  cancelRename: () => void;
  visible: boolean;
};

const AddGroupModal = ({ cancelRename, visible }: Props) => {
  const [GroupForm] = Form.useForm();

  // 点击确定
  const handleOk = () => {};
  return (
    <confirm
      title=""
      visible={visible}
      wrapClassName={sc('edit-group-modal')}
      destroyOnClose
      centered
      onCancel={cancelRename}
      footer={[
        <Button key="submit" type="primary" onClick={handleOk}>
          完成
        </Button>,
      ]}
    >
      <h3 style={{ paddingLeft: 16 }}>拖拽分组进行排序</h3>
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
    </confirm>
  );
};

export default AddGroupModal;
