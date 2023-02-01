import { EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { Table, Popconfirm, Space, Form, Input, Tag, message, message as antdMessage } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Modal, Button } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
import {
  listAll,
  editMaterialGroup,
  removeMaterialGroup,
  moveMaterialGroup,
} from '@/services/material-library';
import type { ColumnsType } from 'antd/es/table';
import type MaterialLibrary from '@/types/material-library';
import { arrayMoveImmutable } from 'array-move';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
const sc = scopedClasses('material-library');
type Props = {
  handleCancel: () => void;
  getGroupList: () => void;
  visible: boolean;
  // data: MaterialLibrary.List[];
};
const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab' }} />);
const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));
// const data = [
//   {
//     id: 1,
//     groupName: '未分组',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//     index: 0,
//   },
//   {
//     id: 2,
//     groupName: '素材库分组2',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//     index: 1,
//   },
//   {
//     id: 3,
//     groupName: '素材库分组3',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//     index: 2,
//   },
//   {
//     id: 4,
//     groupName: '素材库分组4',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//     index: 3,
//   },
// ];
const EditGroupModal = ({ handleCancel, visible, getGroupList }: Props) => {
  const [editGroupForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<MaterialLibrary.List[]>([]);
  const getGroupListAll = async () => {
    try {
      const { result, code, message: resultMsg } = await listAll();
      if (code === 0) {
        result.shift();
        const data = result.map((item, index) => {
          item.index = index;
          return item;
        });
        console.log(data);
        setDataSource(data);
      } else {
        throw new Error(resultMsg);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  useEffect(() => {
    getGroupListAll();
  }, [visible]);

  // useEffect(() => {
  //   setDataSource(data);
  // }, [data]);
  // 编辑分组
  const editGroup = (id: number, groupName: string) => {
    editGroupForm
      .validateFields()
      .then(async () => {
        const { code } = await editMaterialGroup({ id, groupName });
        if (code === 0) {
          message.success('编辑分组成功！');
          getGroupListAll();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 删除分组
  const remove = async (groupId: number) => {
    try {
      const { code } = await removeMaterialGroup(groupId);
      if (code === 0) {
        message.success('删除分组成功！');
        getGroupListAll();
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  // 分组列表
  const columns = [
    {
      title: '分组',
      dataIndex: 'groupName',
      key: 'groupName',
      isEllipsis: true,
      // render: (text: string) => {
      //   if (text === '未分组') {
      //     return (
      //       <div>
      //         <span style={{ marginRight: 12 }}>{text}</span> <Tag color="blue">系统分组</Tag>
      //       </div>
      //     );
      //   } else {
      //     return text;
      //   }
      // },
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 120,
      render: (_: any, record: any) => {
        return (
          <>
            <Space size="middle">
              {/* 编辑 */}
              <Popconfirm
                key={record.id}
                placement="bottomRight"
                overlayClassName={sc('edit-group')}
                title={
                  <>
                    <Form form={editGroupForm} layout="vertical">
                      <FormItem
                        label="请输入分组名称"
                        name="groupName"
                        colon={false}
                        rules={[
                          {
                            validator(rule, value) {
                              if (!value) {
                                return Promise.reject('名称不能为空');
                              } else if (dataSource.some((item: any) => item.groupName === value)) {
                                return Promise.reject('该分组名称已存在');
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input showCount maxLength={8} defaultValue={record.groupName} />
                      </FormItem>
                    </Form>
                  </>
                }
                icon={false}
                onConfirm={() => {
                  editGroup(record.id, editGroupForm.getFieldValue('groupName'));
                }}
                onCancel={() => {
                  editGroupForm.resetFields();
                }}
                okText="确定"
                cancelText="取消"
              >
                <EditOutlined className="editIcon" />
              </Popconfirm>
              {/* 删除 */}
              <Popconfirm
                title={
                  <div>
                    <span style={{ color: '#1e232a', fontSize: 16, fontWeight: 700 }}>提示</span>
                    <br />
                    删除该分组，组内所有图片会移到未分组
                  </div>
                }
                placement="bottomRight"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  remove(record.id);
                }}
              >
                <DeleteOutlined className="delIcon" />
              </Popconfirm>
              {/* 拖拽 */}
              <DragHandle />
            </Space>
          </>
        );
      },
    },
  ];

  const onSortEnd = async ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const groupId = dataSource[oldIndex].id;
      const offset = newIndex - oldIndex;
      try {
        const { result, code, message: resultMsg } = await moveMaterialGroup(groupId, offset);
        if (code === 0) {
          console.log(result);
        } else {
          throw new Error(resultMsg);
        }
      } catch (error) {
        antdMessage.error(`请求失败，原因:{${error}}`);
      }
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el) => !!el,
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
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  // 点击完成
  const handleOk = () => {
    // 重新渲染分组
    getGroupList();
    handleCancel();
  };
  return (
    <>
      <Modal
        title="管理分组"
        visible={visible}
        wrapClassName={sc('edit-group-modal')}
        destroyOnClose
        centered
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            完成
          </Button>,
        ]}
      >
        <div className="title1">拖拽分组进行排序</div>
        <Table
          pagination={false}
          showHeader={false}
          dataSource={dataSource}
          columns={columns}
          rowKey="index"
          // scroll={{ y: 342 }}
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
