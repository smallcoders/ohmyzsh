import {
  Button,
  Input,
  Form,
  Popconfirm,
  Modal,
  message,
  Space,
  Tag,
  InputNumber,
  message as antdMessage,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import SelfTable from '@/components/self_table';
import type ProductType from '@/types/product-type';
import {
  getProductTypeList,
  updateTypeSort,
  updateType,
  delType,
  checkDelType,
} from '@/services/product-type';
import FormItem from 'antd/lib/form/FormItem';
import { SortDetail } from './components/sortDetail';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
const sc = scopedClasses('product-type');

export default () => {
  const [dataSource, setDataSource] = useState<ProductType.Content[]>([]);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState<ProductType.Content>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [sortForm] = Form.useForm();
  // 产品类型列表
  const productTypeList = async () => {
    try {
      const { code, result } = await getProductTypeList();
      if (code === 0) {
        setDataSource(result);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  useEffect(() => {
    productTypeList();
  }, []);

  const clearForm = () => {
    form.resetFields();
    setEditingItem({});
  };
  /**
   * @zh-CN 新增编辑
   */
  const addOrUpdata = async () => {
    const tooltipMessage = editingItem.id ? '编辑产品类型' : '新增产品类型';
    const values = await form.validateFields();
    const detail = values.details.map((item: any, index: number) => {
      return {
        ...item,
        sort: index + 1,
        typeId: editingItem.id ?? null,
      };
    });
    delete values.details;
    try {
      setAddOrUpdateLoading(true);
      const { code, message: resultMsg } = await (editingItem.id
        ? updateType({
            ...values,
            id: editingItem.id,
            detail,
          })
        : updateType({
            ...values,
            detail,
          }));
      if (code === 0) {
        setModalVisible(false);
        message.success(`${tooltipMessage}成功！`);
        productTypeList();
        clearForm();
      } else {
        message.error(`${tooltipMessage}失败，原因:{${resultMsg}}`);
      }
      setAddOrUpdateLoading(false);
    } catch (error) {
      setAddOrUpdateLoading(false);
    }
  };
  // 拖拽
  const moveDetail = (dragIndex: number, hoverIndex: number, name: string) => {
    const list = form.getFieldValue(name);
    const listClone = [...list];
    listClone.splice(hoverIndex, 0, listClone.splice(dragIndex, 1)[0]);
    form.setFieldsValue({
      [name]: listClone,
    });
  };
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '编辑服务标签' : '新增服务标签'}
        width="800px"
        visible={modalVisible}
        maskClosable={false}
        okButtonProps={{ loading: addOrUpdateLoading }}
        okText="保存"
        onOk={() => {
          addOrUpdata();
        }}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          className={sc('modal-form')}
          validateTrigger="onBlur"
        >
          <Form.Item
            name="name"
            label="产品类型"
            rules={[
              {
                required: true,
                message: '请输入产品类型',
              },
            ]}
            style={{ marginBottom: 40 }}
          >
            <Input placeholder="请输入" maxLength={35} />
          </Form.Item>
          <Form.Item label="产品子类型" required>
            <DndProvider backend={HTML5Backend}>
              <Form.List name="details" initialValue={[{}]}>
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map(({ key, name, ...restField }, index: number) => {
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <>
                            <SortDetail
                              ItemTypes="subTypeCode"
                              // eslint-disable-next-line react/no-array-index-key
                              index={index}
                              id={key}
                              moveDetail={(dragIndex, hoverIndex) =>
                                moveDetail(dragIndex, hoverIndex, 'details')
                              }
                              style={{
                                position: 'relative',
                              }}
                            >
                              <div className={sc('form-subType')}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'name']}
                                  rules={[
                                    {
                                      required: true,
                                      message: '请输入',
                                    },
                                  ]}
                                >
                                  <Input placeholder="请输入" maxLength={35} />
                                </Form.Item>
                              </div>
                              <img
                                src={require('@/assets/banking_loan/remove.png')}
                                alt=""
                                onClick={async () => {
                                  console.log(form.getFieldValue('details'));
                                  if (form.getFieldValue('details')[name].id !== null) {
                                    const { code, message: resultMsg } = await checkDelType(
                                      form.getFieldValue('details')[name].id,
                                    );
                                    if (code !== 0) return message.error(resultMsg);
                                  }
                                  if (fields.length === 1) return;
                                  remove(name);
                                }}
                                style={{
                                  width: 24,
                                  position: 'absolute',
                                  right: -80,
                                  top: 4,
                                  cursor: 'pointer',
                                }}
                              />
                            </SortDetail>
                          </>
                        );
                      })}
                      <Form.Item name="add">
                        <Button
                          onClick={() => {
                            if (fields && fields.length > 19) return;
                            add({ id: null, name: '', sort: null, typeId: null });
                          }}
                          className="add-type-btn"
                        >
                          + 子类型按钮
                        </Button>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
            </DndProvider>
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  /**
   * @zh-CN 产品删除
   */
  const remove = async (id: number) => {
    try {
      const { code, message: resultMsg } = await delType(id);
      if (code === 0) {
        message.success(`删除成功`);
        productTypeList();
      } else {
        message.error(`删除失败，原因:${resultMsg}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * @zh-CN 顺序调整
   */
  const changeSort = async (id: number, sort: number) => {
    try {
      const { code } = await updateTypeSort(id, sort);
      if (code === 0) {
        message.success(`修改成功！`);
        productTypeList();
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 120,
    },
    {
      title: '产品类型',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '产品子类型',
      dataIndex: 'details',
      isEllipsis: true,
      width: 600,
      render: (details: ProductType.details[]) => (
        <>
          {details.map((item) => {
            return (
              <Tag color="default" key={item.id}>
                {item.name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space>
            <Button
              size="small"
              type="link"
              onClick={() => {
                setEditingItem(record);
                setModalVisible(true);
                form.setFieldsValue({
                  name: record?.name,
                  details: record?.details,
                });
              }}
            >
              编辑
            </Button>

            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(record.id)}
            >
              <Button size="small" type="link">
                删除
              </Button>
            </Popconfirm>

            <Popconfirm
              key={record.id}
              overlayClassName="sort-popver"
              title={
                <>
                  <Form form={sortForm}>
                    <FormItem label="序号" name="sort" colon={false}>
                      <InputNumber min={1} defaultValue={record.sort} />
                    </FormItem>
                  </Form>
                </>
              }
              icon={false}
              onConfirm={() => {
                changeSort(record.id, sortForm.getFieldValue('sort'));
                sortForm.resetFields();
              }}
              onCancel={() => {
                sortForm.resetFields();
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button size="small" type="link">
                调整顺序
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer
      className={sc('container')}
      ghost
      header={{
        title: '产品类型',
        breadcrumb: {},
      }}
    >
      <div className={sc('container-table')}>
        <div className={sc('container-table-header')}>
          <div className="title">
            <Button
              type="primary"
              key="addNew"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新增产品类型
            </Button>
          </div>
        </div>
        <div className={sc('container-table-body')}>
          <SelfTable
            bordered
            columns={columns}
            scroll={{ x: 1400 }}
            dataSource={dataSource}
            rowKey={'id'}
            pagination={false}
          />
        </div>
      </div>
      {useModal()}
    </PageContainer>
  );
};
