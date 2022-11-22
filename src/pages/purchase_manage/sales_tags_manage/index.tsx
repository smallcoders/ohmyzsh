import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, message, Space, Popconfirm, Radio, Row, Col } from 'antd';
const { TextArea } = Input;
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { Access, useAccess } from 'umi';
import Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import LiveTypesMaintain from '@/types/live-types-maintain.d';
import { getLabelPage, updateLabel } from '@/services/purchase';
const sc = scopedClasses('user-config-admin-account-distributor');
export default () => {
  const { TextArea } = Input;
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<LiveTypesMaintain.Content[]>([]);
  const [editingItem, setEditingItem] = useState<LiveTypesMaintain.Content>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 促销标签
  }>({});

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const [form] = Form.useForm();

  const getPages = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getLabelPage({
        pageIndex,
        pageSize,
        ...searchContent,
        labelType: 0
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingItem({});
  };

  // 新增/编辑
  const addOrUpdate = async () => {
    const tooltipMessage = editingItem.id ? '编辑促销标签' : '新增促销标签';
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        if (value.publishTime) {
          value.publishTime = moment(value.publishTime).format('YYYY-MM-DDTHH:mm:ss');
        }
        const addorUpdateRes = await (editingItem.id
          ? updateLabel({
              ...value,
              id: editingItem.id,
              labelType: 0
            })
          : updateLabel({
              ...value,
              labelType: 0
            }));
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          message.success(`${tooltipMessage}成功！`);
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
  // 删除
  const remove = async (id: string) => {
    try {
      const removeRes = await updateLabel({id, state: 1, labelType: 0});
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getPages();
      } else {
        message.error(`删除失败，原因:${removeRes.message}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const access = useAccess()

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 30,
      render: (_: any, _record: LiveTypesMaintain.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '促销标签',
      dataIndex: 'label',
      isEllipsis: true,
      width: 70,
    },
    {
      title: '促销说明',
      dataIndex: 'labelContent',
      width: 200,
    },
    access['P_PM_CXBQ'] && {
      title: '操作',
      width: 50,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: LiveTypesMaintain.Content) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                setEditingItem(record);
                setModalVisible(true);
                form.setFieldsValue({ label: record?.label, labelContent: record?.labelContent });
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(record.id as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ].filter(p => p);

  useEffect(() => {
    getPages();
  }, [searchContent]);

  const handleOk = async () => {
    addOrUpdate();
  };

  const handleCancel = () => {
    clearForm();
    setModalVisible(false);
  };
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '编辑促销标签' : '新增促销标签'}
        width="600px"
        visible={createModalVisible}
        maskClosable={false}
        okButtonProps={{ loading: addOrUpdateLoading }}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="link"
            type="primary"
            onClick={handleOk}
          >
            确定
          </Button>,
        ]}
      >
        <Form 
          {...formLayout} 
          form={form} 
          layout="horizontal"
          labelWrap
        >
          <Form.Item 
            name="label"
            label="促销标签名称"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}>
            <Input placeholder="请输入" maxLength={10} />
          </Form.Item>
          <Form.Item 
            name="labelContent"
            label="内容"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}>
              <TextArea placeholder="请输入" rows={4} maxLength={200} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="label" label="促销标签">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col offset={8} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  setSearChContent({});
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>促销标签列表(共{pageInfo.totalCount || 0}个)</span>
          <Access accessible={access['P_PM_CXBQ']}>
            <Button
              type="primary"
              key="addTag"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新增标签
            </Button>
          </Access>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          rowKey={'id'}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPages,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
      {useModal()}
    </PageContainer>
  );
};
