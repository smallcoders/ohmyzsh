import { PlusOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import {
  Button,
  message,
  Input,
  Radio,
  Table,
  Form,
  Modal,
  Select,
  InputNumber,
  Space,
  Popconfirm,
  Image,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-banner.less';
import scopedClasses from '@/utils/scopedClasses';
import {
  addBanner,
  getBannerPage,
  removeBanner,
  updateBanner,
  updateState,
} from '@/services/banner';
import Banner from '@/types/service-config-banner.d';
import type Common from '@/types/common';
import UploadForm from '@/components/upload_form';
const sc = scopedClasses('service-config-banner');

const stateObj = {
  0: '发布中',
  1: '待发布',
  2: '已下架',
};

const TableList: React.FC = () => {
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  /**
   * 新建窗口的弹窗
   *  */
  const [createModalVisible, setModalVisible] = useState<boolean>(false);

  const [edge, setEdge] = useState<Banner.Edge>(Banner.Edge.PC);

  const [form] = Form.useForm();

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const [dataSource, setDataSource] = useState<Banner.Content[]>([]);

  const [editingItem, setEditingItem] = useState<Banner.Content>({});

  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);

  const getBanners = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getBannerPage({
        pageIndex,
        pageSize,
        belong: edge,
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

  useEffect(() => {
    getBanners();
  }, [edge]);

  const clearForm = () => {
    form.resetFields();
    if (editingItem.photoId || editingItem.id) setEditingItem({});
  };

  /**
   * @zh-CN 添加/修改banner
   */
  const addOrUpdata = async () => {
    const tooltipMessage = editingItem.id ? '修改' : '添加';
    const hide = message.loading(`正在${tooltipMessage}`);
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        const addorUpdateRes = editingItem.id
          ? await updateBanner({ ...value, id: editingItem.id })
          : await addBanner({ ...value });
        hide();
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          message.success(`${tooltipMessage}成功`);
          getBanners();
          clearForm();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch((err) => {
        hide();
        // message.error('服务器错误');
        console.log(err);
      });
  };

  /**
   * 下架
   * @param id
   */
  const off = async (record: Banner.Content) => {
    try {
      const tooltipMessage = '下架';
      const updateStateResult = await updateState({ id: record.id as string, state: 2 });
      if (updateStateResult.code === 0) {
        message.success(`${tooltipMessage}成功`);
        await getBanners();
      } else {
        message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 删除
   * @param id
   */
  const remove = async (id: string) => {
    try {
      const removeRes = await removeBanner(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getBanners();
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
    },
    {
      title: 'banner',
      dataIndex: 'photoId',
      render: (photoId: string) => (
        <Image
          className={'banner-img'}
          src={`/antelope-manage/common/download/${photoId}`}
          alt="图片损坏"
        />
        // </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (_: number) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '发布人',
      dataIndex: 'publishUserName',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_: any, record: Banner.Content) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                setEditingItem(record);
                setModalVisible(true);
                form.setFieldsValue({ ...record });
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
            {record.state === 0 && (
              <Popconfirm
                title="确定下架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => off(record)}
              >
                <a href="#">下架</a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  /**
   * 切换 app、小程序、pc
   * @returns React.ReactNode
   */
  const selectButton = (): React.ReactNode => {
    const handleEdgeChange = (e: RadioChangeEvent) => {
      setEdge(e.target.value);
      // getBanners()
    };
    return (
      <Radio.Group value={edge} onChange={handleEdgeChange}>
        <Radio.Button value={Banner.Edge.PC}>官网-首页</Radio.Button>
        <Radio.Button value={Banner.Edge.FINANCIAL_SERVICE}>官网-金融</Radio.Button>
        <Radio.Button value={Banner.Edge.PC_CITY}>官网-地市专题主页</Radio.Button>
        <Radio.Button value={Banner.Edge.APPLET}>小程序-首页</Radio.Button>
        <Radio.Button value={Banner.Edge.APPLET_CREATIVE}>小程序-科产</Radio.Button>
        <Radio.Button value={Banner.Edge.APP}>APP-首页</Radio.Button>
        <Radio.Button value={Banner.Edge.APP_CREATIVE}>APP-科产</Radio.Button>
      </Radio.Group>
    );
  };

  const getModal = () => {
    return (
      <Modal
        title={editingItem.id ? '修改banner' : '新增banner'}
        width="400px"
        open={createModalVisible}
        maskClosable={false}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        onOk={async () => {
          await addOrUpdata();
        }}
      >
        <Form {...formLayout} form={form} layout="horizontal">
          <Form.Item
            name="photoId"
            label="上传banner"
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
              maxSize={1}
              showUploadList={false}
              accept=".bmp,.gif,.png,.jpeg,.jpg"
            />
          </Form.Item>
          <Form.Item
            name="belong"
            label="所属产品"
            // initialValue={Banner.Edge.PC}
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Select placeholder="请选择">
              <Select.Option value={Banner.Edge.PC}>官网-首页</Select.Option>
              <Select.Option value={Banner.Edge.FINANCIAL_SERVICE}>官网-金融</Select.Option>
              <Select.Option value={Banner.Edge.PC_CITY}>官网-地市专题主页</Select.Option>
              <Select.Option value={Banner.Edge.APPLET}>小程序-首页</Select.Option>
              <Select.Option value={Banner.Edge.APPLET_CREATIVE}>小程序-科产</Select.Option>
              <Select.Option value={Banner.Edge.APP}>APP-首页</Select.Option>
              <Select.Option value={Banner.Edge.APP_CREATIVE}>APP-科产</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="sort" label="展示顺序">
            <InputNumber min={1} max={100} step={1} precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="link" label="跳转链接">
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {/* {edge === Banner.Edge.PC && ( */}
      <>
        <div style={{ backgroundColor: '#fff', padding: 20 }}>
          <div className={sc('container-header')}>
            {selectButton()}
            <Button
              type="primary"
              key="newAdd"
              loading={addOrUpdateLoading}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新增
            </Button>
          </div>
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            rowKey={'id'}
            pagination={
              pageInfo.totalCount === 0
                ? false
                : {
                    onChange: getBanners,
                    total: pageInfo.totalCount,
                    current: pageInfo.pageIndex,
                    pageSize: pageInfo.pageSize,
                    showTotal: (total) =>
                      `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                  }
            }
          />
        </div>
      </>
      {/* )} */}

      {getModal()}
    </PageContainer>
  );
};

export default TableList;
