import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, message, Space, Popconfirm, Radio, Row, Col } from 'antd';
const { TextArea } = Input;
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import LiveTypesMaintain from '@/types/live-types-maintain.d';
import {
  addLiveType,
  getLiveTypesPage,
  updateLiveType,
  removeLiveType
} from '@/services/search-record';
import { getProviderPage } from '@/services/purchase';
import { getOrgTypeOptions } from '@/services/org-type-manage';
import { routeName } from '@/../config/routes';
const sc = scopedClasses('user-config-admin-account-distributor');
export default () => {
  const { TextArea } = Input;
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<LiveTypesMaintain.Content[]>([]);
  const [editingItem, setEditingItem] = useState<LiveTypesMaintain.Content>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 供应商名称
  }>({});

  const [options, setOptions] = useState<any>([]);

  const getDictionary = async () => {
    try {
      const res = await Promise.all([getOrgTypeOptions()]);
      setOptions(res[0]?.result || []);
    } catch (error) {
      message.error('服务器错误');
    }
  };
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
      const { result, totalCount, pageTotal, code } = await getProviderPage({
        pageIndex,
        pageSize,
        ...searchContent,
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
    const tooltipMessage = editingItem.id ? '编辑类型' : '新增类型';
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        if (value.publishTime) {
          value.publishTime = moment(value.publishTime).format('YYYY-MM-DDTHH:mm:ss');
        }
        const addorUpdateRes = await (editingItem.id
          ? updateLiveType({
              ...value,
              id: editingItem.id,
            })
          : addLiveType({
              ...value,
            }));
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          if (!editingItem.id) {
            message.success('新增类型成功！');
          }else {
            message.success('编辑类型成功！');
          }
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
      const removeRes = await removeLiveType(id);
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
  // 启用/停用
  const updateStatus = async (id: string, status) => {
    try {
      setAddOrUpdateLoading(true);
      const addorUpdateRes = await updateLiveType({
        status,
        id
      })
      if (addorUpdateRes.code === 0) {
        setModalVisible(false);
        message.success('操作成功！');
        getPages();
      } else {
        message.error(`操作失败，原因:${addorUpdateRes.message}`);
      }
      setAddOrUpdateLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: LiveTypesMaintain.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '供应商编号',
      dataIndex: 'name',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '供应商类型',
      dataIndex: 'name',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '联系人',
      dataIndex: 'name',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '联系人手机',
      dataIndex: 'name',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '座机号码',
      dataIndex: 'name',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '排序',
      dataIndex: 'name',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'creatorUserName',
      width: 200,
    },
    {
      title: '操作',
      width: 120,
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
                form.setFieldsValue({ name: record?.name, status: record?.status });
              }}
            >
              详情
            </a>
            <a
              href="#"
              onClick={() => {
                setEditingItem(record);
                setModalVisible(true);
                form.setFieldsValue({ name: record?.name, status: record?.status });
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
  ];

  useEffect(() => {
    getPages();
  }, [searchContent]);

  useEffect(() => {
    getDictionary();
  }, []);

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
        title={editingItem.id ? '编辑服务标签' : '新增服务标签'}
        width="600px"
        visible={createModalVisible}
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
            name="name"
            label="服务标签名称"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}>
            <Input placeholder="请输入" maxLength={10} />
          </Form.Item>
          <Form.Item 
            name="name"
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
              <Form.Item name="userName" label="供应商名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col offset={8} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary"
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
          <span>供应商列表(共{pageInfo.totalCount || 0}个)</span>
          <Space>
            <Button
              key="primary"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <DownloadOutlined /> 导出
            </Button>
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                // setModalVisible(true);
                history.push(`${routeName.PROVIDERS_MANAGE_ADD}`)
              }}
            >
              <PlusOutlined /> 新增供应商
            </Button>
          </Space>
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
