import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  message,
  Input,
  Radio,
  RadioChangeEvent,
  Table,
  Form,
  Modal,
  Select,
  InputNumber,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-banner.less';
import scopedClasses from '@/utils/scopedClasses';
import { addBanner, getBannerPage } from '@/services/banner';
import Banner from '@/types/service-config-banner.d';
import Common from '@/types/common';
import UploadForm from '../add_resource/upload-form';
const sc = scopedClasses('service-config-banner');

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

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({ pageIndex: 1, pageSize: 20 }); // , setPageInfo

  const [dataSource, setDataSource] = useState<Banner.Content[]>([]);
  const [editingItem, setEditingItem] = useState<Banner.Content>({});
  /**
   * todo: 这里是控制弹出的modal 确定按钮是否正在loading 和 hide 有所重复。
   */
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);

  const getBanners = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    const { result, totalCount, pageTotal, code } = await getBannerPage({ pageIndex, pageSize });
    if (code === 0) {
      setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
      setDataSource(result);
    } else {
      message.error(`请求分页数据失败`);
    }
  };

  useEffect(() => {
    getBanners();
  }, [pageInfo]);

  const clearForm = () => {
    form.resetFields();
    if (editingItem.photo || editingItem.id) setEditingItem({});
  };

  /**
   * @zh-CN 添加banner
   * @param fields
   */
  const handleAdd = async () => {
    form
      .validateFields()
      .then(async (value) => {
        const tooltipMessage = editingItem.id ? '修改' : '添加';
        const hide = message.loading(`正在${tooltipMessage}`);
        setAddOrUpdateLoading(true);
        const addorUpdateRes = await addBanner({ ...value });
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          hide();
          message.success(`${tooltipMessage}成功`);
          getBannerPage();
          clearForm();
        } else {
          hide();
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: 'banner',
      dataIndex: 'picture',
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
    {
      title: '发布人',
      dataIndex: 'publishUserName',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: () => [
        <a key="config">编辑</a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          删除
        </a>,
      ],
    },
  ];

  /**
   * 切换 app、小程序、pc
   * @returns React.ReactNode
   */
  const selectButton = (): React.ReactNode => {
    const handleEdgeChange = (e: RadioChangeEvent) => {
      setEdge(e.target.value);
    };
    return (
      <Radio.Group value={edge} onChange={handleEdgeChange}>
        <Radio.Button value={Banner.Edge.PC}>PC</Radio.Button>
        <Radio.Button disabled value={Banner.Edge.APPLET}>
          小程序
        </Radio.Button>
        <Radio.Button disabled value={Banner.Edge.APP}>
          App
        </Radio.Button>
      </Radio.Group>
    );
  };

  const getModal = () => {
    return (
      <Modal
        title={'新增banner'}
        width="400px"
        visible={createModalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={async (value) => {
          await handleAdd(value as API.RuleListItem);
          // if (success) {
          //   handleModalVisible(false);
          //   if (actionRef.current) {
          //     actionRef.current.reload();
          //   }
          // }
        }}
      >
        <Form {...formLayout} form={form} layout="horizontal">
          <Form.Item
            name="photo"
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
              showUploadList={false}
            />
          </Form.Item>
          <Form.Item
            name="belong"
            label="所属产品"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Select placeholder="请选择">
              <Select.Option value={Banner.Edge.PC}>PC</Select.Option>
              <Select.Option value={Banner.Edge.APPLET}>小程序</Select.Option>
              <Select.Option value={Banner.Edge.APP}>App</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="sort" label="展示顺序">
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
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
      {edge === Banner.Edge.PC && (
        <>
          <div className={sc('container-header')}>
            {selectButton()}
            <Button
              type="primary"
              key="primary"
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
        </>
      )}

      {getModal()}
    </PageContainer>
  );
};

export default TableList;
