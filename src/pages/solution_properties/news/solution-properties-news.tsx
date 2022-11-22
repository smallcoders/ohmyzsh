import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Form,
  Modal,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Space,
  Checkbox,
  Popconfirm,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './solution-properties-news.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import { getNewsPage, addOrUpdateNews, removeNews, updateState } from '@/services/news';
import type News from '@/types/service-config-news';
import moment from 'moment';
import UploadForm from '@/components/upload_form';
import SelfTable from '@/components/self_table';
import { getEnumByName } from '@/services/common';
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import news from '@/types/solution-properties-news.d';
import { Access, useAccess } from 'umi';
const sc = scopedClasses('solution-properties-app-news');
const stateObj = {
  0: '发布中',
  1: '待发布',
  2: '已下架',
};
export default () => {
  const [activeElse, setActiveElse] = useState<any>(false)
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<news.Edge.HOME>(news.Edge.HOME);
  // 页面权限
  const permissions = {
    [news.Edge.HOME]: 'PQ_PC_XWZX', // 页面查询
  }

  useEffect(() => {
    for (const key in permissions) {
      const permission = permissions[key]
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any)
        break
      }
    }
  },[])

  const onChangeKeyWord = (checkedValues: CheckboxValueType[]) => {
    if (checkedValues.includes('OTHER')) {
      setActiveElse(true)
    } else {
      setActiveElse(false)
    }
  }
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<News.Content[]>([]);
  const [editingItem, setEditingItem] = useState<News.Content>({});
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
  });

  const [form] = Form.useForm();

  const getNews = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
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
          value.publishTime = moment(value.publishTime).format('yyyy-MM-DD HH:mm:ss');
          // value.publishTime = moment(value.publishTime).format('YYYY-MM-DDTHH:mm:ss');
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

  const [commonEnumList, setCommonEnumList] = useState<any>([])

  const getIndustryList = async () => {
    try {
      const res = await getEnumByName('ORG_INDUSTRY')
      if ( res?.code === 0 ) {
        setCommonEnumList(res?.result || [])
      } else {
        throw new Error()
      }
    } catch (error) {
      console.log('error')
    }
  }

  useEffect(() => {
    getIndustryList()
    getNews();
  }, [searchContent]);

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: News.Content, index: number) =>
        _record.state === 2 ? '' : pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '所属产业',
      dataIndex: 'industryShow',
      isEllipsis: true,
      render: (text: any, record: any) => record?.industryShow?.join('、') || '--',
      width: 300,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 200,
      render: (_: number) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '浏览量',
      dataIndex: 'pageViews',
      width: 80,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: News.Content) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return (
          <Access accessible={accessible}>
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
              <a href={record.url} target="_blank" rel="noreferrer">
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
                <Popconfirm
                  title="确定下架么？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => editState(record.id as string, 0)}
                >
                  <a href="#">下架</a>
                </Popconfirm>
              )}
              {record.state === 1 && (
                <Popconfirm
                  title="确定上架么？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => editState(record.id as string, 1)}
                >
                  <a href="#">上架</a>
                </Popconfirm>
              )}
            </Space>
          </Access>
        );
      },
    },
  ];
  
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
                key="reset"
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

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '修改资讯' : '新增资讯'}
        width="780px"
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
          <Form.Item name="coverId" label="上传封面">
            <UploadForm
              listType="picture-card"
              className="avatar-uploader"
              accept=".bmp,.gif,.png,.jpeg,.jpg"
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
          <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
            <Form.Item
              name="industry"
              label="所属产业"
              labelCol={{ span: 6}}
              wrapperCol={{ span: 16}}
              required
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value || value.length === 0) {
                      return Promise.reject(new Error('必选'))
                    }
                    if (value && value.length > 3) {
                      return Promise.reject(new Error('最多选3个所属产业'))
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Checkbox.Group
                options={
                  (commonEnumList|| []).map((p) => {
                    return {
                      label: p.name,
                      value: p.enumName,
                    }
                  }) || []
                }
                onChange={onChangeKeyWord}
              />
            </Form.Item>
            {activeElse && (
              <Form.Item
                name="industryOther"
                label=" "
                colon={false}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (!value || value.length === 0) {
                        return Promise.reject(new Error('请输入'))
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <Input
                  style={{ width: '300px' }}
                  placeholder="请输入"
                  autoComplete="off"
                  allowClear
                  maxLength={10}
                />
              </Form.Item>
            )}
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
            label="资讯简介"
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
          <span>资讯列表(共{pageInfo.totalCount || 0}个)</span>
          <Access accessible={access['P_PC_XWZX']}>
            <Button
              type="primary"
              key="addNew"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新增资讯
            </Button>
          </Access>
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
