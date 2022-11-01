import scopedClasses from "@/utils/scopedClasses";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import type Common from "@/types/common";
import type { RadioChangeEvent,} from "antd";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Dropdown,
  Menu, Radio,
  Row,
  Select,
  Space, Table, Modal, Steps
} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {DownOutlined} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import Activity from "@/types/operation-activity";
import UploadForm from "@/components/upload_form";
import ProCard from "@ant-design/pro-card";

const { Step } = Steps;
const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];
const sc = scopedClasses('operation-activity-link-setting');
export default () => {
  //数据
  const [types, setTypes] = useState({});
  const [btnValue, setBtnValue] = useState({});
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Activity.Content>({});
  const [productId, setProductId] = useState<number | string>();
  const [current, setCurrent] = useState(0);
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
  }>({});
  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [edge, setEdge] = useState<Activity.Edge>(Activity.Edge.H5);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 1,
    pageTotal: 0,
  });
  const changeCurrent = useCallback((val: number) => {
    setCurrent((v) => v + val);
  }, []);

  //方法
  const clearForm = () => {
    form.resetFields();
    if (editingItem.name || editingItem.description) setEditingItem({});
  };
  const onFinish = (values: any) => {
    console.log('Success:', values);
    clearForm();
    setModalVisible(false);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // 复制链接
  const copyLink = () => {
    message.success('链接复制成功');
  };
  //复制二维码
  const downWechatCode = () =>{
    message.success('二维码下载成功');
  }
  //复制分享码
  const downShareCode = () =>{
    message.success('分享码下载成功');
  }
  //新增链接按钮
  function handleButtonClick() {
    if(edge==2){
      setTypes('新建H5链接')
    }
   else if(edge==3){
      setTypes('新建小程序码')
    }
   else if(edge==4){
      setTypes('新建分享码')
    }
    setModalVisible(true);
  }
  //新增链接按钮下拉
  const handleMenuClick=(e: any)=> {
    message.info('Click on menu item.');
    console.log('click', e);
  }


  // 结构
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="H5">
        H5链接
      </Menu.Item>
      <Menu.Item key="WECHAT">
        小程序码
      </Menu.Item>
      <Menu.Item key="SHARE">
        分享码
      </Menu.Item>
    </Menu>
  );
  const moreMenu = (
    <Menu>
      <Menu.Item>
        <a
          href="#"
          onClick={() => {
          }}
        >下架</a>
      </Menu.Item>
      <Menu.Item>
        <a
          href="#"
          onClick={() => {
          }}
        >删除</a>
      </Menu.Item>
    </Menu>
  );
  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="title" label="活动名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item name="time" label="活动时间">
              <DatePicker.RangePicker allowClear showTime />
            </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="channelId" label="渠道值">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'true'}>发布中</Select.Option>
                  <Select.Option value={'false'}>待发布</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="sceneId" label="场景值">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'true'}>发布中</Select.Option>
                  <Select.Option value={'false'}>待发布</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col offset={12} span={4}>
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

  const StepsForm0=()=>{
    return (
    <Form
      form={form}
      layout="horizontal"
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >

      <Form.Item
        label='活动名称'
        name="name"
        rules={[{ required: true, message: '请输入活动名称！' }]}
      >
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item
        label='活动时间'
        name="time"
        rules={[{ required: true, message: '请输入活动时间！' }]}
      >
        <DatePicker.RangePicker allowClear showTime />
      </Form.Item>

      <Form.Item name="channelId" label="渠道值"  rules={[{ required: true, message: '请输入渠道值！' }]}>
        <Select placeholder="请选择" allowClear>
          <Select.Option value={'true'}>发布中</Select.Option>
          <Select.Option value={'false'}>待发布</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="sceneId" label="场景值"  rules={[{ required: true, message: '请输入场景值！' }]}>
        <Select placeholder="请选择" allowClear>
          <Select.Option value={'true'}>发布中</Select.Option>
          <Select.Option value={'false'}>待发布</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label='跳转目标链接'
        name="name"
        rules={[{ required: true, message: '请输入跳转目标链接！' }]}
      >
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item
        label="上传banner"
        labelCol={{ span: 8 }}
        name="cityBannerId"
      >
        <UploadForm
          listType="picture-card"
          className="avatar-uploader"
          maxSize={1}
          showUploadList={false}
          accept=".bmp,.gif,.png,.jpeg,.jpg"
          tooltip={
            <span className={'tooltip'}>
                  议尺寸xx*xx，大小在1M以下，图片格式限制jpg、jpeg、png
                </span>
          }
        />
      </Form.Item>

      <Form.Item
        label='按钮文案'
        name="name"
        rules={[{ required: true, message: '请输入按钮文案！' }]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
    </Form>)
  }

  const FormContent = useMemo(() => {
    switch (current) {
      case 1:
        return (
          <StepsForm0 />
        );
      default:
        return (
          <StepsForm0 />
        );
    }
  }, [current]);

  const getModal = () => {
    return (
      <Modal
        title={types}
        width="600px"
        maskClosable={false}
        visible={createModalVisible}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        onOk={ onFinish}
        footer={(current==0&&[
          <Button key="back" onClick={() => {
            clearForm();
            setModalVisible(false);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={()=>{
            if(edge==2){
              setBtnValue('发布并复制分享链接')
            }
            else if(edge==3){
              setBtnValue('发布并复制二维码')
            }
            else if(edge==4){
              setBtnValue('发布并复制图片')
            }
            setCurrent(1)
          }}>
            下一步
          </Button>,
        ]) ||(current==1&&[
          <Button key="back" onClick={() => {
            clearForm();
            setCurrent(0)
          }}>
            上一步
          </Button>,
          <Button key="submit" type="primary" onClick={()=>{
            setCurrent(1)
          }}>
            {btnValue}
          </Button>,
        ])}
      >
        <ProCard direction="column" ghost gutter={[0, 8]}>
          <ProCard>
            <Steps current={current}>
              <Step title="配置信息" />
              <Step title="预览效果" />
            </Steps>
          </ProCard>
          <ProCard>{FormContent}</ProCard>
        </ProCard>

      </Modal>
    );
  };
  const columns: ColumnsType<Activity.Content> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
    },
    {
      title: '活动时间',
      dataIndex: 'activityTime',
      key: 'activityTime',
    },
    {
      title: '渠道值',
      dataIndex: 'channelValue',
      key: 'channelValue',
    },
    {
      title: '场景值',
      dataIndex: 'sceneValue',
      key: 'sceneValue',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '数据统计',
      dataIndex: 'dataStatistics',
      key: 'dataStatistics',
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      render: () => (
        <Space size="middle">
          <a
            href="#"
            onClick={copyLink}
          >复制链接</a>
          <a
            href="#"
            onClick={() => {
            }}
          >操作记录</a>
          <Dropdown overlay={moreMenu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];
  const columns1: ColumnsType<Activity.Content> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
    },
    {
      title: '活动时间',
      dataIndex: 'activityTime',
      key: 'activityTime',
    },
    {
      title: '渠道值',
      dataIndex: 'channelValue',
      key: 'channelValue',
    },
    {
      title: '场景值',
      dataIndex: 'sceneValue',
      key: 'sceneValue',
    },
    {
      title: '码主人',
      dataIndex: 'codeMaster',
      key: 'codeMaster',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '数据统计',
      dataIndex: 'dataStatistics',
      key: 'dataStatistics',
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      render: () => (
        <Space size="middle">
          <a
            href="#"
            onClick={copyLink}
          >复制链接</a>
          <a
            href="#"
            onClick={() => {
            }}
          >操作记录</a>
          <Dropdown overlay={moreMenu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];
  const selectButton = (): React.ReactNode => {
    const handleEdgeChange = (e: RadioChangeEvent) => {
      setEdge(e.target.value);
      console.log(e.target.value)
    };
    return (
      <Radio.Group value={edge} onChange={handleEdgeChange}>
        <Radio.Button value={Activity.Edge.H5}>H5链接</Radio.Button>
        <Radio.Button value={Activity.Edge.WECHAT}>小程序码</Radio.Button>
        <Radio.Button value={Activity.Edge.SHARE}>分享码</Radio.Button>
      </Radio.Group>
    );
  };
  const dataSource: Activity.Content[] = [
    {
      key: '1',
      index: 1,
      activityName: 'New York No. 1 Lake Park',
      activityTime: 'New York No. 1 Lake Park',
      channelValue: 'true',
      sceneValue:'2022-05-09  13:32:23',
      status:'43214',
      dataStatistics:'43214',
      codeMaster:'fdsa'
    },
    {
      key: '2',
      index: 2,
      activityName: 'New York No. 2Lake Park',
      activityTime: 'New York No. 2 Lake Park',
      channelValue: 'true',
      sceneValue:'2022-05-09  13:32:23',
      status:'43214',
      dataStatistics:'43214'
    },
    {
      key: '3',
      index: 3,
      activityName: 'New York No. 3 Lake Park',
      activityTime: 'New York No. 3 Lake Park',
      channelValue: 'true',
      sceneValue:'2022-05-09  13:32:23',
      status:'43214',
      dataStatistics:'43214'
    },
  ];


  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
        <div className={sc('container-header')}>
          {selectButton()}
          <Dropdown.Button
            type="primary"
            overlay={menu}
            onClick={handleButtonClick}
          >
            新增链接
          </Dropdown.Button>
        </div>
      {(edge === Activity.Edge.H5 || edge === Activity.Edge.WECHAT) &&
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          rowKey={'key'}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                total: pageInfo.totalCount,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
              }
          }
        />}
      {edge === Activity.Edge.SHARE&&
        <Table
          bordered
          columns={columns1}
          dataSource={dataSource}
          rowKey={'key'}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                total: pageInfo.totalCount,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
              }
          }
        />}
      {getModal()}
    </PageContainer>
  );
};
