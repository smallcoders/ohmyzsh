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
  handleCancel: () => void;
  visible: boolean;
};

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab' }} />);
const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    index: 0,
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    index: 1,
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    index: 2,
  },
];
const EditGroupModal = ({ handleCancel, visible }: Props) => {
  const [editGroupForm] = Form.useForm();
  const [dataSource, setDataSource] = useState(data);

  // 编辑分组
  const editGroup = () => {};
  // 分组列表
  const columns = [
    {
      title: '分组',
      dataIndex: 'name',
      isEllipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 150,
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <Popconfirm
              placement="bottom"
              overlayClassName="edit-group"
              title={
                <>
                  <Form form={editGroupForm} layout="vertical" validateTrigger={['onBlur']}>
                    <FormItem
                      label="请输入分组名称"
                      name="111"
                      colon={false}
                      rules={[
                        {
                          validator(rule, value, callback) {
                            if (!value) {
                              return Promise.reject('名称不能为空');
                              // 判断value值是否在分组里存在
                              // } else if() {}
                              //  return Promise.reject('该分组名称已存在');
                            }
                          },
                        },
                      ]}
                    >
                      <Input showCount maxLength={8} defaultValue={record.name} />
                    </FormItem>
                  </Form>
                </>
              }
              icon={false}
              onConfirm={() => {
                // 点击确定编辑分组
                editGroup();
                editGroupForm.resetFields();
              }}
              onCancel={() => {
                editGroupForm.resetFields();
              }}
              okText="确定"
              cancelText="取消"
            >
              <FormOutlined />
            </Popconfirm>
            <DeleteOutlined />
            <DragHandle />
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
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  // 点击完成
  const handleOk = () => {};
  return (
    <>
      <Modal
        width={800}
        title="管理分组"
        visible={visible}
        wrapClassName={sc('edit-group-modal')}
        destroyOnClose
        centered
        onCancel={handleCancel}
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
      </Modal>
    </>
  );
};

export default EditGroupModal;
