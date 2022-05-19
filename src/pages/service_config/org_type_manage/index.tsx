import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, DatePicker, message, Space, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import { getNewsPage, addOrUpdateNews, removeNews, updateState } from '@/services/news';
import News from '@/types/service-config-news';
import moment from 'moment';
import UploadForm from '@/components/upload_form';
import SelfTable from '@/components/self_table';
const sc = scopedClasses('service-config-app-news');

export default () => {
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<News.Content[]>([]);
  const [editingItem, setEditingItem] = useState<News.Content>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);

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

  const getNews = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getNewsPage({
        pageIndex,
        pageSize,
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

  const addOrUpdate = async () => {
    const tooltipMessage = editingItem.id ? '修改' : '添加';
    const hide = message.loading(`正在${tooltipMessage}`);
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        if (value.publishTime) {
          value.publishTime = moment(value.publishTime).format('YYYY-MM-DDTHH:mm:ss');
        }
        const addorUpdateRes = await addOrUpdateNews({
          ...value,
          id: editingItem.id,
          state: editingItem.state,
        });
        hide();
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          message.success(`${tooltipMessage}成功`);
          getNews();
          clearForm();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch(() => {
        hide();
      });
  };

  const remove = async (id: string) => {
    try {
      const removeRes = await removeNews(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getNews();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editState = async (id: string, updatedState: number) => {
    try {
      const tooltipMessage = updatedState === 0 ? '下架' : '上架';
      const updateStateResult = await updateState({ id, action: updatedState });
      if (updateStateResult.code === 0) {
        message.success(`${tooltipMessage}成功`);
        getNews();
      } else {
        message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: News.Content, index: number) =>
        _record.state === 2 ? '' : pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '类型名称',
      dataIndex: 'title',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '类型描述',
      dataIndex: 'pageViews',
      width: 80,
    },
    {
      title: '创建人',
      dataIndex: 'state',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'publishTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'option',
      render: (_: any, record: News.Content) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                setEditingItem(record);
                setModalVisible(true);
                form.setFieldsValue({ ...record, publishTime: moment(record.publishTime) });
              }}
            >
              编辑{' '}
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
    getNews();
  }, []);

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '修改机构类型' : '新增机构类型'}
        width="400px"
        visible={createModalVisible}
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
                  if (dataSource?.map((p) => p.title).includes(value)) {
                    return Promise.reject(new Error('该机构类型已存在'));
                  }
                },
              },
            ]}
            name="title"
            label="类型名称"
            required
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="contents" label="类型描述">
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>机构类型列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 添加机构类型
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getNews,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: any) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
      {useModal()}
    </PageContainer>
  );
};
