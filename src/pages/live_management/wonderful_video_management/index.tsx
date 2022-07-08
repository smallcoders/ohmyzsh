import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, Select, Row, Col, message, Space, Popconfirm, DatePicker, Upload, Tooltip, InputNumber, Image } from 'antd';
import type { UploadProps } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import CourseManage from '@/types/service-config-course-manage';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import { history } from 'umi';
import { routeName } from '@/../config/routes';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import WonderfulVideoManagement from '@/types/wonderful-video-management.d';
import {
  queryVideoPage,
  getLiveTypesPage,
  updateVideo,
  updateStatus,
  addVideo,
  removeVideo
} from '@/services/search-record';
import UploadForm from '@/components/upload_form';
const sc = scopedClasses('user-config-admin-account-distributor');
export default () => {
  const { TextArea } = Input;
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<WonderfulVideoManagement.Content[]>([]);
  const [editingItem, setEditingItem] = useState<any>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
  }>({});

  const [options, setOptions] = useState<any>([]);

  // 获取视频类型数据，字典接口缺失，暂用分页数据
  const getDictionary = async () => {
    try {
      const res = await Promise.all([getLiveTypesPage(
        {
          pageIndex: 1,
          pageSize: 100,
          status: 1
        }
      )]);
      console.log(res[0]);
      setOptions(res[0]?.result || []);
    } catch (error) {
      message.error('服务器错误');
    }
  };
  const formLayout = {
    labelCol: { span: 8 },
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
      const { result, totalCount, pageTotal, code } = await queryVideoPage({
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
  
  // 置顶状态修改
  const updateTopStatus = async (id: string, status: boolean) => {
    let params = {id, isTop: status};
    const tooltipMessage = status ? '置顶' : '取消置顶';
    const addorUpdateRes = await updateStatus(params);
    if (addorUpdateRes.code === 0) {
      setModalVisible(false);
      if (!editingItem.id) {
        message.success(`${tooltipMessage}成功！`);
      }
      getPages();
      clearForm();
    } else {
      message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
    }
  }
  // 下架/上架状态更新
  const updateOnlineStatus = async (id: string, status: boolean) => {
    let params = {id, lineStatus: status};
    const addorUpdateRes = await updateStatus(params);
    if (addorUpdateRes.code === 0) {
      setModalVisible(false);
      if (!editingItem.id) {
        message.success(`${status ? '上架' : '下架'}成功！`);
      }
      getPages();
      clearForm();
    } else {
      message.error(`${status ? '上架' : '下架'}失败，原因:{${addorUpdateRes.message}}`);
    }
  }
  // 新增/编辑
  const addOrUpdate = async (lineStatus: boolean) => {
    const tooltipMessage = editingItem.id ? '编辑' : '新增';
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        console.log(files, '--files');
        console.log({
          ...value,
          lineStatus: lineStatus,
          videoId: files[0].storeId
        });
        const addorUpdateRes = await (editingItem.id
          ? updateVideo({
              ...value,
              id: editingItem.id,
              videoId: files[0].storeId
            })
          : addVideo({ ...value, lineStatus: lineStatus, videoId: files[0].storeId }));
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

  const remove = async (id: string) => {
    try {
      const removeRes = await removeVideo(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getPages();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
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
      render: (_: any, _record: WonderfulVideoManagement.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '视频标题',
      dataIndex: 'title',
      isEllipsis: true,
      render: (_: string, _record: any) => (
        <a
          href="#!"
          onClick={() => {
            history.push(`${routeName.WONDERFUL_VIDEO_MANAGEMENT_DETAIL}?id=${_record.id}`);
          }}
        >
          {_}
        </a>
      ),
      width: 200,
    },
    {
      title: '封面',
      dataIndex: 'coverImagePath',
      isEllipsis: true,
      width: 120,
      render: (_: string, _record: any) => (
        <Image width={100} src={_} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'videoStatus',
      width: 180,
      render: (_: number, record: any) => {
        return (
          <div className={`state${_}`}>
            上架状态：{record.lineStatus ? '线上' : '线下'}<br></br>
            置顶状态：{record.isTop ? '是' : '否'}
          </div>
        );
      },
    },
    {
      title: '点击量',
      dataIndex: 'clickCount',
      width: 80
    },
    {
      title: '分享量',
      dataIndex: 'shareCount',
      width: 100,
      filterDropdown: (<div></div>),
      filterIcon: 
        <Tooltip placement="top" title="分享量=用户实际埋点数据+虚拟数据。括号中为虚拟数据">
          <QuestionCircleOutlined />
        </Tooltip>,
      render: (_: number, record: any) => {
        return(
          <span>{_+record.shareVirtualCount}<br></br>({record.shareVirtualCount}) </span>
        )
      }
    },
    {
      title: '点赞量',
      dataIndex: 'goodCount',
      width: 100,
      filterDropdown: (<div></div>),
      filterIcon: 
        <Tooltip placement="top" title="点赞量=用户实际埋点数据+虚拟数据。括号中为虚拟数据">
          <QuestionCircleOutlined />
        </Tooltip>,
      render: (_: number, record: any) => {
        return (
          <span>{_+record.goodVirtualCount}<br></br>({record.goodVirtualCount}) </span>
        )
      }
    },
    {
      title: '类型',
      dataIndex: 'typeNames',
      isEllipsis: true,
      width: 280,
    },
    {
      title: '发布人',
      dataIndex: 'releaseAccountName',
      width: 200,
      render: (_: string) => {
        return (
          _ || '--'
        )
      },
    },
    {
      title: '操作',
      width: 260,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => {
                setEditingItem({...record});
                setFiles([
                  {title: record.videoName+'.mp4', storeId: record.videoId}
                ]);
                setModalVisible(true);
                form.setFieldsValue({
                  ...record, 
                  videoId: [{uid: record.videoId, name: record.videoName+'.mp4', status: 'done',}],
                  typeIds: record.typeIds ? record.typeIds.split(',').map(Number) : []
                });
              }}
            >
              编辑
            </Button>
            { 
              record.lineStatus ? (
                <Popconfirm
                  title="确定下架么？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => updateOnlineStatus(record.id as string, false)}
                >
                  <a href="#">下架</a>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="确定上架么？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => updateOnlineStatus(record.id as string, true)}
                >
                  <a href="#">上架</a>
                </Popconfirm>
              )
            }
            {
              record.isTop ? (
                <Popconfirm
                  title={`确定取消置顶么？`}
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => updateTopStatus(record.id as string, false,)}
                >
                  <a href="#">取消置顶</a>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title={`确定置顶么？`}
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => updateTopStatus(record.id as string, true,)}
                >
                  <a href="#">置顶</a>
                </Popconfirm>
              )
            }
             
            { 
              !record.lineStatus && (
                <Popconfirm
                  title="确定删除么？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => remove(record.id as string)}
                >
                  <a href="#">删除</a>
                </Popconfirm>
              )
            }
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

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="title" label="视频名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="lineStatus" label="上架状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={true}>线上</Select.Option>
                  <Select.Option value={false}>线下</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="typeIds" label="类型">
                <Select placeholder="请选择" allowClear mode="multiple">
                  {options?.map((item: any) => (
                    <Select.Option key={item?.id} value={item?.id}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4} offset={2}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary2"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary3"
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
  const handleOk = async (lineStatus: boolean) => {
    addOrUpdate(lineStatus);
  };
  
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<CourseManage.File[]>([]);
  const normFile = (e: any) => {
    const lastName = e.file.name.split('.');
    if (lastName[lastName.length - 1] != 'mp4') {
      message.error(`请上传以mp4后缀名开头的文件`);
      return [];
    }
    const isLt800M = e.file.size / 1024 / 1024 < 800;
    if (Array.isArray(e)) {
      return e;
    }
    if (!isLt800M) {
      message.error('视频大小不得超过800M!');
      return []
    }
    return e?.fileList;
  };
  const props = {
    name: 'file',
    accept: ".mp4",
    maxCount: 1,
    maxSize: 800,
    action: '/antelope-manage/common/upload/record',
    onRemove: (file: UploadFile<any>) => {
      if (file.status === 'uploading' || file.status === 'error') {
        setUploadLoading(false);
      }
      const files_copy = [...files];
      const existIndex = files_copy.findIndex((p) => p.storeId === file?.response?.result);
      if (existIndex > -1) {
        files_copy.splice(existIndex, 1);
        setFiles(files_copy);
      }
    },
    onChange(info) {
      if (info.file.status === 'done') {
        const uploadResponse = info?.file?.response;
        if (uploadResponse?.code === 0 && uploadResponse.result) {
          const upLoadResult = info?.fileList.map((p) => {
            return {
              title: p.name,
              storeId: p.response?.result?.id
            };
          });
          setFiles(upLoadResult);
          setUploadLoading(false);
        } else {
          setUploadLoading(false);
          message.error(`上传失败，原因:{${uploadResponse.message}}`);
        }
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };
  
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '编辑视频' : '新增视频'}
        width="680px"
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        visible={createModalVisible}
        maskClosable={false}
        okButtonProps={{ loading: addOrUpdateLoading }}
        footer={[
          <Button key="back" onClick={() => {
            clearForm();
            setModalVisible(false);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" disabled={editingItem.id} onClick={() => {handleOk(true)}}>
            保存并上架
          </Button>,
          <Button
            key="link"
            type="primary"
            onClick={() => {handleOk(false)}}
          >
            保存
          </Button>
        ]}
      >
        <Form {...formLayout} form={form} layout="horizontal"
          initialValues={
            {
              shareVirtualCount: 0, 
              goodVirtualCount: 0
            }
          }>
          <Row>
            <Col span={16}>
              <Form.Item
                rules={[
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(new Error('必填'));
                      }
                      if (!/^[a-zA-Z0-9_\u4e00-\u9fa5-]+$/.test(value)) {
                        return Promise.reject(
                          new Error('由数字、字母、中文、下划线或者中划线组成,长度50字符以内'),
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                required
                name="title"
                label="视频标题"
              >
                <Input placeholder="请输入" maxLength={50} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Form.Item
                name="coverImageId"
                label="封面"
                rules={[
                  {
                    required: true,
                    message: '必填',
                  },
                ]}
              >
                <UploadForm
                  listType="picture-card"
                  className="avatar-uploader"
                  maxSize={5}
                  showUploadList={false}
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Form.Item
                name="videoId"
                label="视频"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: '必填',
                  },
                ]}
              >
                <Upload {...props}>
                  <Button type="primary">上传</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Form.Item
                name="typeIds"
                label="类型"
                rules={[
                  {
                    required: true,
                    message: '必选',
                  },
                  {
                    validator(rule, value) {
                      if(value.length>3){
                        return Promise.reject('最多选3个')
                      }
                      if(!value||value.length===0){
                        return Promise.reject('必填')
                      }else {
                        return Promise.resolve()
                      }
                    },
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  allowClear
                  mode="multiple"
                  showSearch={false}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div style={{ height: 32 }} />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          background: '#fff',
                          padding: 5,
                          width: '100%',
                          borderTop: '1px solid #dbd9d9',
                        }}
                      >
                        <Space size={10}>
                          <input
                            type={'checkbox'}
                            onChange={(e) => {
                              if (e.target.checked) {
                                form.setFieldsValue({ typeIds: options?.map((p: any) => p?.id) });
                              } else {
                                form.setFieldsValue({ typeIds: [] });
                              }
                            }}
                          />
                          全选
                        </Space>
                      </div>
                    </>
                  )}
                >
                  {options?.map((item: any) => (
                    <Select.Option key={item?.id} value={item?.id}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10} offset={2}>
              <Form.Item 
                name="shareVirtualCount" 
                label="虚拟分享量"
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item 
                name="goodVirtualCount"
                label="虚拟点赞量">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Form.Item 
                name="content"
                label="内容概况">
                <TextArea placeholder="请输入" maxLength={300} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>视频列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            type="primary"
            key="primary5"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增视频
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          rowKey="id"
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPages,
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
