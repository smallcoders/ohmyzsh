import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Table,
  Form,
  Modal,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Space,
  Popconfirm,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-news.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import { getNewsPage, addOrUpdateNews, removeNews, updateState } from '@/services/news';
import News from '@/types/service-config-news';
import moment from 'moment';
import UploadForm from '../add_resource/upload-form';
const sc = scopedClasses('service-config-app-news');
const stateObj = {
  0: '发布中',
  1: '待发布',
  2: '已下架',
};
export default () => {
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<News.Content[]>([]);
  const [editingItem, setEditingItem] = useState<News.Content>({});
  /**
   * todo: 这里是控制弹出的modal 确定按钮是否正在loading 和 hide 有所重复。
   */
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
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
  }); // , setPageInfo

  const [form] = Form.useForm();

  const getNews = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    const { result, totalCount, pageTotal, code } = await getNewsPage({
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
  };

  const onTableChange = (page: number, pageSize?: number | undefined) => {
    getNews(page, pageSize);
  };

  const clearForm = () => {
    form.resetFields();
    setEditingItem({});
  };

  const addOrUpdate = async () => {
    form
      .validateFields()
      .then(async (value) => {
        const tooltipMessage = editingItem.id ? '修改' : '添加';
        const hide = message.loading(`正在${tooltipMessage}`);
        setAddOrUpdateLoading(true);
        const addorUpdateRes = await addOrUpdateNews({
          ...value,
          publishTime: moment(value.publishTime).format('YYYY-MM-DDTHH:mm:ss'),
          id: editingItem.id,
          state: editingItem.state,
        });
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          hide();
          message.success(`${tooltipMessage}成功`);
          getNews();
          clearForm();
        } else {
          hide();
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  };

  const remove = async (id: string) => {
    const hide = message.loading(`正在删除`);
    const removeRes = await removeNews(id);
    if (removeRes.code === 0) {
      hide();
      message.success(`删除成功`);
      getNews();
    } else {
      hide();
      message.error(`删除失败，原因:{${removeRes.message}}`);
    }
  };

  const editState = async (id: string, updatedState: number) => {
    const tooltipMessage = updatedState === 0 ? '下架' : '上架';
    const hide = message.loading(`正在${tooltipMessage}`);
    const updateStateResult = await updateState({ id, action: updatedState });
    if (updateStateResult.code === 0) {
      hide();
      message.success(`${tooltipMessage}成功`);
      getNews();
    } else {
      hide();
      message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      render: (_item, _record, index) => pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      render: (_) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (_) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '状态码错误'}
          </div>
        );
      },
    },
    {
      title: '浏览量',
      dataIndex: 'pageViews',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record: News.Content) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                setEditingItem(record);
                setModalVisible(true);
                console.log('record->>', record);
                form.setFieldsValue({ ...record, publishTime: moment(record.publishTime) });
              }}
            >
              编辑{' '}
            </a>
            <a href={record.url} target="_blank">
              查看
            </a>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(record.id as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
            {record.state === 0 && (
              <a href="#" onClick={() => editState(record.id as string, 0)}>
                下架
              </a>
            )}
            {record.state === 1 && (
              <a href="#" onClick={() => editState(record.id as string, 1)}>
                上架
              </a>
            )}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getNews();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={5}>
              <Form.Item name="title" label="标题">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="state" label="状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>发布中</Select.Option>
                  <Select.Option value={1}>待发布</Select.Option>
                  <Select.Option value={2}>已下架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="publishTime" // beginPublishTime  endPublishTime
                label="发布时间"
              >
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.publishTime) {
                    search.beginPublishTime = moment(search.publishTime[0]).format(
                      'YYYY-MM-DDTHH:mm:ss',
                    );
                    search.endPublishTime = moment(search.publishTime[1]).format(
                      'YYYY-MM-DDTHH:mm:ss',
                    );
                  }
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

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '修改资讯' : '新增资讯'}
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
          <Form.Item name="coverId" label="上传封面">
            <UploadForm
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            name="title"
            label="资讯标题"
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="url"
            label="跳转链接"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="publishTime" label="发布时间">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            name="contents" // state 	状态0发布中1待发布2已下架
            label="咨询简介"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            {/* <span> 产品logo或展示效果图，用作应用卡片应用封面展示，建议尺寸
            270*180，大小在5M以下</span> */}
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
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>应用列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增资讯
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: onTableChange,
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
