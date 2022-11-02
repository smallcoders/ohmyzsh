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
  Popover,
  Space, Table, Modal, Steps, Popconfirm
} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {DownOutlined} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import './index.less';
import Activity from "@/types/operation-activity";
import UploadForm from "@/components/upload_form";
import ProCard from "@ant-design/pro-card";
import {
  postDeleteChannel, postDeleteScene,
  postQueryActivityByPage,
} from "@/services/opration-activity";
import moment from 'moment';

const { Step } = Steps;
const sc = scopedClasses('operation-activity-link-setting');
export default () => {
  //数据
  const [types, setTypes] = useState({});
  const [btnValue, setBtnValue] = useState({});
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Activity.Content>({});
  const [current, setCurrent] = useState(0);
  const [searchContent, setSearChContent] = useState<{
    activeName?: string; // 活动名称
    startTime?: string; // 活动时间
    endTime?: string; // 活动时间
    activeChannelId?: number; // 状态：0发布中、1待发布、2已下架
    activeSceneId?: number; // 状态：0发布中、1待发布、2已下架
  }>({});
  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [edge, setEdge] = useState<Activity.Edge>(Activity.Edge.H5);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 1,
    pageTotal: 0,
  });

  //方法
  /*
  * 获取分页数据
  * @param pageIndex
  * @param pageSize
  * @param activeType
  */
  const getOperationActivity = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      let activeType
      if(edge==2){
        activeType = 'H5'
      }else if(edge==3){
        activeType = 'APPLET'
      }else if(edge==4){
        activeType = 'SHARE_CODE'
      }
      const { result, totalCount, pageTotal, code } = await postQueryActivityByPage({
          pageIndex,
          pageSize,
        activeType,
        ...searchContent,
        })
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        // setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOperationActivity();
  }, [edge,searchContent]);

  const clearForm = () => {
    form.resetFields();
  };
  //删除渠道/场景值的按钮
  const remove = async () =>{

  }
  const next = async ()=>{
    form
      .validateFields()
      .then(async (value) => {
        const { time, ...rest } = value;
        if (time) {
          rest.startDate = moment(value.time[0]).format('YYYY-MM-DD');
          rest.endDate = moment(value.time[1]).format('YYYY-MM-DD');
        }
        if(edge==2){
          setBtnValue('发布并复制分享链接')
          setCurrent(1)

        }
        else if(edge==3){
          setBtnValue('发布并复制二维码')
          setCurrent(2)

        }
        else if(edge==4){
          setBtnValue('发布并复制图片')
          setCurrent(3)
        }
        clearForm();
        // const res =await postAddActivity(rest)
        // if (res.code === 0) {
        //   // setModalVisible(false);
        //   if(edge==2){
        //     setBtnValue('发布并复制分享链接')
        //   }
        //   else if(edge==3){
        //     setBtnValue('发布并复制二维码')
        //   }
        //   else if(edge==4){
        //     setBtnValue('发布并复制图片')
        //   }
        //   setCurrent(1)
        //   clearForm();
        // } else {
        //   message.error(res.message);
        // }
      })
      .catch((err)=>{
        console.log(err)
      })

  }
  const onFinish = (values: any) => {
    console.log('Success:', values);
    clearForm();
    setModalVisible(false);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  //编辑
  const editActivity = ()=>{
    setModalVisible(true);
  }
  // 复制链接
  const copyLink = () => {
    message.success('链接复制成功');
  };
  // 复制二维码
  const downWechatCode = () =>{
    message.success('二维码下载成功');
  }
  //复制分享码
  const downShareCode = () =>{
    message.success('分享码下载成功');
  }
  //新增链接按钮
  function handleButtonClick() {
    console.log(edge)
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
    setEdge(e.key);
    if(e.key=='H5'){
      setTypes('新建H5链接')
      setEdge(2)
    }
    else if(e.key=='WECHAT'){
      setTypes('新建小程序码')
      setEdge(3)
    }
    else if(e.key=='SHARE'){
      setTypes('新建分享码')
      setEdge(4)
    }
    setModalVisible(true);
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
            if(edge==2){
              setTypes('编辑H5链接')
            }
            else if(edge==3){
              setTypes('编辑小程序码')
            }
            else if(edge==4){
              setTypes('编辑分享码')
            }
            setModalVisible(true);
          }}
        >编辑</a>
      </Menu.Item>
      <Menu.Item>
        <Popconfirm
          title="下架后该链接将会失效，确认下架？？"
          okText="下架"
          cancelText="取消"
          onConfirm={() => remove()}
        >
        <a
          href="#"
          onClick={() => {
          }}
        >下架</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item>
        <Popconfirm
          title="删除后该链接将会失效，且不可恢复，确认删除？"
          okText="删除"
          cancelText="取消"
          onConfirm={() => remove()}
        >
          <a href="#">删除</a>
        </Popconfirm>
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
              <Form.Item name="activeName" label="活动名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item name="time" label="活动时间">
              <DatePicker.RangePicker allowClear />
            </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="activeChannelId" label="渠道值">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'true'}>发布中</Select.Option>
                  <Select.Option value={'false'}>待发布</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="activeSceneId" label="场景值">
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
                  const { time, ...rest } = search;
                  if (time) {
                    rest.startDate = moment(search.time[0]).format('YYYY-MM-DD');
                    rest.endDate = moment(search.time[1]).format('YYYY-MM-DD');
                  }
                  setSearChContent(rest);
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
  const content = (
    <div className={sc('operate-record')}>
      <div className={sc('operate-record-container')}>
        <div className={sc('operate-record-container-left')}>编辑链接</div>
        <div className={sc('operate-record-container-right')}>
          <div className={sc('operate-record-container-right-time')}>2022-06-14  12:32:23</div>
          <div className={sc('operate-record-container-right-name')}>操作人：顾小满</div>
        </div>
      </div>
      <div className={sc('operate-record-divider')}></div>
      <div className={sc('operate-record-container')}>
        <div className={sc('operate-record-container-left')}>创建链接</div>
        <div className={sc('operate-record-container-right')}>
          <div className={sc('operate-record-container-right-time')}>2022-06-14  12:32:23</div>
          <div className={sc('operate-record-container-right-name')}>操作人：顾小满</div>
        </div>
      </div>
      <div className={sc('operate-record-divider')}></div>
      <div className={sc('operate-record-container')}>
        <div className={sc('operate-record-container-left')}>下架链接</div>
        <div className={sc('operate-record-container-right')}>
          <div className={sc('operate-record-container-right-time')}>2022-06-14  12:32:23</div>
          <div className={sc('operate-record-container-right-name')}>操作人：顾小满</div>
        </div>
      </div>
    </div>
  );
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
          {edge == 2 &&
          <a
            href="#"
            onClick={copyLink}
          >复制链接</a>
          }
          {edge == 3 &&
            <a
              href="#"
              onClick={downWechatCode}
            >下载二维码</a>
          }
          {edge == 4 &&
            <a
              href="#"
              onClick={downShareCode}
            >下载分享码</a>
          }
          <Popover content={content} trigger="click">
            <a
              href="#"
              onClick={() => {
              }}
            >操作记录</a>
          </Popover>
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
      id: '1',
      key: '1',
      activityName: 'New York No. 1 Lake Park',
      activityTime: 'New York No. 1 Lake Park',
      channelValue: 'true',
      sceneValue:'2022-05-09  13:32:23',
      status:'43214',
      dataStatistics:'43214',
      codeMaster:'fdsa'
    },
    {
      id: '2',
      key: '2',
      activityName: 'china No. 2Lake Park',
      activityTime: 'New York No. 2 Lake Park',
      channelValue: 'true',
      sceneValue:'2022-05-09  13:32:23',
      status:'43214',
      dataStatistics:'43214'
    },
    {
      id: '3',
      key: '3',
      activityName: 'japanse No. 3 Lake Park',
      activityTime: 'New York No. 3 Lake Park',
      channelValue: 'true',
      sceneValue:'2022-05-09  13:32:23',
      status:'43214',
      dataStatistics:'43214'
    },
  ];
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
          name="activeName"
          rules={[{ required: true, message: '请输入活动名称！' }]}
        >
          <Input placeholder="请输入" maxLength={10}/>
        </Form.Item>

        <Form.Item
          label='活动时间'
          name="time"
          rules={[{ required: true, message: '请输入活动时间！' }]}
        >
          <DatePicker.RangePicker allowClear size={'large'}/>
        </Form.Item>

        <Form.Item name="activeChannelId" label="渠道值"  rules={[{ required: true, message: '请输入渠道值！' }]}>
          <Select placeholder="请选择" allowClear>
            <Select.Option value={'true'}>发布中</Select.Option>
            <Select.Option value={'false'}>待发布</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="activeSceneId" label="场景值"  rules={[{ required: true, message: '请输入场景值！' }]}>
          <Select placeholder="请选择" allowClear>
            <Select.Option value={'true'}>发布中</Select.Option>
            <Select.Option value={'false'}>待发布</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label='跳转目标链接'
          name="targetLink"
          rules={[{ required: true, message: '请输入跳转目标链接！' }]}
        >
          <Input placeholder="请输入" maxLength={2000}/>
        </Form.Item>

        {edge === 2 &&
          <Form.Item
            label="活动配图"
            labelCol={{span: 8}}
            name="activeImageId"
          >
            <UploadForm
              listType="picture-card"
              className="avatar-uploader"
              maxSize={1}
              showUploadList={false}
              accept=".bmp,.gif,.png,.jpeg,.jpg"
              tooltip={
                <span className={'tooltip'}>
                  建议尺寸1920*1080，大小在1M以下，图片格式限制jpg、jpeg、png
                </span>
              }
            />
          </Form.Item>}

        {edge === 2&&
          <Form.Item
            label='按钮文案'
            name="buttonText"
            rules={[{required: true, message: '请输入按钮文案！'}]}
          >
            <Input placeholder="请输入"/>
          </Form.Item>
        }

        {edge === 4 &&
          <Form.Item
            label='分享码主人'
            name="shareMaster"
            rules={[{ required: true, message: '请输入分享码主人！' }]}
          >
            <Input placeholder="请输入" maxLength={2000}/>
          </Form.Item>
        }
      </Form>)
  }
  const StepsForm1=()=>{
    return (
      <div>
        <h2>以下链接用于预览效果用，不计入数据统计</h2>
      </div>
    )
  }
  const StepsForm2=()=>{
    return (
      <div>
        <h2>以下小程序码用于预览效果用，不计入数据统计</h2>
      </div>
    )
  }
  const StepsForm3=()=>{
    return (
      <div>
        <h2>以下分享码用于预览效果用，不计入数据统计</h2>
      </div>
    )
  }
  const FormContent = useMemo(() => {
    switch (current) {
      case 1:
        return (
          <StepsForm1 />
        );
      case 2:
        return (
          <StepsForm2 />
        );
      case 3:
        return (
          <StepsForm3 />
        );
      default:
        return (
          <StepsForm0 />
        );
    }
  }, [current,edge]);
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
          <Button key="submit" type="primary" onClick={ async () => {
            await next();
          }}>
            下一步
          </Button>,
        ]) ||(current!==0&&[
          <Button key="back" onClick={() => {
            clearForm();
            setCurrent(0)
          }}>
            上一步
          </Button>,
          <Button key="submit" type="primary" onClick={()=>{
            if(edge==2){
              message.success('链接复制成功')
            }
            else if(edge==3){
              message.success('链接复制成功')
            }
            else if(edge==4){
              message.success('链接复制成功')
            }
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

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-header')}>
          {selectButton()}
          <div className={sc('container-header-select')}>
          <Dropdown.Button
            type="primary"
            overlay={menu}
            onClick={handleButtonClick}
          >
            新增
          </Dropdown.Button>
          </div>
        </div>
      <div className={sc('container-body')}>
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
              onChange:getOperationActivity,
                total: pageInfo.totalCount,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
              }
          }
        />}
      </div>
      {getModal()}
    </PageContainer>
  );
};
