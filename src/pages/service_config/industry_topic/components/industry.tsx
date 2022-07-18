import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, message, Space, Popconfirm, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import '../index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useRef, useState } from 'react';
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
import IndustryTable from './industry-table';
const sc = scopedClasses('service-config-app-news');

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

export default (props: { currentTab: any; }) => {

  const { currentTab } = props
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<OrgTypeManage.Content[]>([]);
  const [editingItem, setEditingItem] = useState<OrgTypeManage.Content>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [form] = Form.useForm();
  const rootRef = useRef({})

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
  useEffect(() => {

  })

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

        console.log('redffff', rootRef)
        // const addorUpdateRes = await (editingItem.id
        //   ? updateOrgType({
        //     ...value,
        //     id: editingItem.id,
        //   })
        //   : addOrgType({ ...value }));
        // if (addorUpdateRes.code === 0) {
        //   setModalVisible(false);
        //   message.success(`${tooltipMessage}成功`);
        //   getPages();
        //   clearForm();
        // } else {
        //   message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        // }
        setAddOrUpdateLoading(false);
      })
      .catch(() => {
        setAddOrUpdateLoading(false);
      });
  };

  useEffect(() => {
    getPages();

  }, []);

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '修改机构类型' : '新增机构类型'}
        width="400px"
        visible={createModalVisible}
        maskClosable={false}
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
    <>
      <div className={sc('container-table-header')}>
        <div className="title">
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              editing ? addOrUpdate() : setEditing(true)
            }}
          >
            {editing ? '保存并发布' : '编辑'}
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        {[1, 2, 3, 4, 5, 6].map((p, index) => {
          return <>
            <span style={{marginTop: 20}}>{'产业需求'}</span>
            <IndustryTable ref={ref => rootRef.current[index] = ref} editing={editing} data={dataSource}></IndustryTable>
            {editing && <div
              style={
                dataSource.length < 8
                  ? { cursor: 'pointer' }
                  : { cursor: 'no-drop', backgroundColor: 'rgb(214,214,214)' }
              }
              // onClick={dataSource.length < 8 ? onAddRow : () => { }}
              className={sc('add-button')}
            >
              + 添加数据
            </div>}
          </>
        })}
      </div>
      {useModal()}
    </>
  );
};
