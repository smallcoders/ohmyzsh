import { EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import {
  Table,
  Popconfirm,
  Space,
  Form,
  Input,
  message,
  message as antdMessage,
  Tag,
  Popover,
  Row,
  Col,
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Modal, Button } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
import {
  listAll,
  editMaterialGroup,
  removeMaterialGroup,
  moveMaterialGroup,
} from '@/services/material-library';
import type MaterialLibrary from '@/types/material-library';
import { arrayMoveImmutable } from 'array-move';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
const sc = scopedClasses('material-library');
type Props = {
  handleCancel: () => void;
  getGroupList: (boolean: boolean) => void;
  visible: boolean;
  groupsId: number | null;
  // data: MaterialLibrary.List[];
};
const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab' }} />);
const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} style={{ zIndex: 10000 }} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

const EditGroupModal = ({ handleCancel, visible, getGroupList, groupsId }: Props) => {
  const [editGroupForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<MaterialLibrary.List[]>([]);
  const [editGroupId, setEditGroupId] = useState(-2);
  const inputRef = useRef<any>(null);
  const getGroupListAll = async () => {
    try {
      const { result, code, message: resultMsg } = await listAll();
      if (code === 0) {
        result.shift();
        const data = result.map((item: any, index: number) => {
          item.index = index;
          return item;
        });
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
  const editGroup = async (id: number) => {
    const { groupName } = await editGroupForm.validateFields();
    try {
      const { code } = await editMaterialGroup({ id, groupName });
      if (code === 0) {
        message.success('编辑分组成功！');
        getGroupListAll();
        setEditGroupId(-2);
        editGroupForm.resetFields();
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
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
      className: 'groupColumns',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 120,
      className: 'groupColumns',
      render: (_: any, record: any) => {
        return (
          <>
            <Space size="middle">
              {/* 编辑 */}
              <Popover
                visible={editGroupId === record.id}
                key={record.id}
                placement="bottomRight"
                title={false}
                trigger="click"
                overlayClassName={sc('edit-group')}
                content={
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
                              } else if (
                                dataSource.some(
                                  (item: any) =>
                                    (item.groupName === value || '未分组' === value) &&
                                    record.groupName !== value 
                                )
                              ) {
                                return Promise.reject('该分组名称已存在');
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input ref={inputRef} showCount maxLength={8} />
                      </FormItem>
                      <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                          <Space>
                            <Button
                              size="small"
                              onClick={() => {
                                setEditGroupId(-2);
                                editGroupForm.resetFields();
                              }}
                            >
                              取消
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                editGroup(record.id);
                              }}
                              type="primary"
                            >
                              确定
                            </Button>
                          </Space>
                        </Col>
                      </Row>
                    </Form>
                  </>
                }
                onVisibleChange={(groupVisible) => {
                  if (groupVisible) {
                    setEditGroupId(record.id);
                  } else {
                    setEditGroupId(-2);
                    editGroupForm.resetFields();
                  }
                }}
              >
                <EditOutlined
                  className="editIcon"
                  onClick={async () => {
                    editGroupForm.setFieldsValue({ groupName: record.groupName });
                    await setEditGroupId(record.id);
                    console.log(inputRef.current);
                    inputRef.current!.focus({
                      cursor: 'all',
                    });
                  }}
                />
              </Popover>
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
    if (oldIndex === newIndex) return;
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
      axis="y"
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
    const boolean = dataSource.some((item) => {
      return item.id !== -1 && item.id === groupsId;
    });
    getGroupList(boolean);
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
        onCancel={() => {
          handleOk();
        }}
        maskClosable={false}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            完成
          </Button>,
        ]}
      >
        <div className="title1">拖拽分组进行排序</div>
        <div className="not-group">
          <span style={{ marginRight: 12 }}>未分组</span> <Tag color="blue">系统分组</Tag>
        </div>
        <Table
          pagination={false}
          showHeader={false}
          dataSource={dataSource}
          columns={columns}
          rowKey="index"
          scroll={{ y: 300 }}
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
