import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  message,
  Input,
  Radio,
  RadioChangeEvent,
  Table,
  Form,
  Upload,
  Modal,
  Select,
  InputNumber,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { addRule } from '@/services/ant-design-pro/api';
import './service-config-banner.less';
import scopedClasses from '@/utils/scopedClasses';
import { getBanners } from '@/services/banner';
import Banner from '@/types/service-config-banner.d';
const sc = scopedClasses('service-config-banner');

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
// const handleRemove = async (selectedRows: API.RuleListItem[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     await removeRule({
//       key: selectedRows.map((row) => row.key),
//     });
//     hide();
//     message.success('Deleted successfully and will refresh soon');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Delete failed, please try again');
//     return false;
//   }
// };

const TableList: React.FC = () => {
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  /**
   * 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const [edge, setEdge] = useState<Banner.Edge>(Banner.Edge.PC);

  const [form] = Form.useForm();

  const [pageInfo] = useState<Common.ResultPage>({ pageIndex: 1, pageSize: 20 }); // , setPageInfo

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
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          下架
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          上架
        </a>,
      ],
    },
  ];

  const getBannerPage = async () => {
    const banners = await getBanners(pageInfo);
    console.log('banners', banners);
  };

  useEffect(() => {
    getBannerPage();
  }, [pageInfo]);

  /**
   * @zh-CN 添加banner
   * @param fields
   */
  const handleAdd = async (fields: API.RuleListItem) => {
    const hide = message.loading('正在添加');
    form.validateFields().then((value) => {
      console.log('value', value);
    });
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
  };

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
        onCancel={() => handleModalVisible(false)}
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
            valuePropName="fileList"
            // getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              // beforeUpload={beforeUpload}
              // onChange={this.handleChange}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
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
              onClick={() => {
                handleModalVisible(true);
              }}
            >
              <PlusOutlined /> 新增
            </Button>
          </div>
          <Table columns={columns} dataSource={[]} />
        </>
      )}

      {getModal()}
      {/* <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={selectButton()}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={rule}
        columns={columns}
      /> */}
    </PageContainer>
  );
};

export default TableList;
