import scopedClasses from "@/utils/scopedClasses";
import React, {useCallback, useEffect, useState} from "react";
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
  postQueryActivityByPage,
  getAllScene,
  getAllChannel,
  postDeleteActivity,
  postAddActivity, postDownActivity, postAppletCode
} from "@/services/opration-activity";
import moment from 'moment';

const { Step } = Steps;
const sc = scopedClasses('operation-activity-link-setting');
export default () => {
  //数据
  const [selectChannelList,setSelectChannel] = useState<Activity.Content[]>([])
  const [selectSceneList,setSelectScene] = useState<Activity.Content[]>([])
  const [activeStatusData, setActiveStatusData] = useState({});
  const [columnData, setColumnData] = useState({});
  const [removeData, setRemoveData] = useState({});
  const [dataSource, setDataSource] = useState<Activity.Content[]>([]);
  const [types, setTypes] = useState('');
  const [btnValue, setBtnValue] = useState({});
  const [url, setUrl] = useState('');
  const [randomId, setRandomId] = useState('');
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<Activity.Content[]>([]);
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
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
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
        activeType = 'SHARD_CODE'
      }
      const { result, code } = await postQueryActivityByPage({
          pageIndex,
          pageSize,
        activeType,
        ...searchContent,
        })
      const {total}=result
      if (code === 0) {
        setPageInfo({ total, pageIndex, pageSize  });
        setDataSource(result.list);
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

  //获取全部渠道值
  const getChannelList =async () =>{
    try {
      const res =await getAllChannel()
      if(res.code === 0){
        setSelectChannel(res.result)
      }
    }catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getChannelList();
  }, []);

  //获取全部场景值
  const getSceneList =async () =>{
    try {
      const res =await getAllScene()
      if(res.code === 0){
          setSelectScene(res.result)
      }
    }catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getSceneList();
  }, []);

  //获取活动的小程序码
  const getAppletCode =async (value: any) =>{
    try {
      const data= {
        endTime:value.endTime,
        path:value.targetLink
      }
      const res =await postAppletCode(data)
      if(res.code === 0){
        setUrl(res.result.url)
        setRandomId(res.result.randomId)
      }
    }catch (e) {
      console.log(e)
    }
  }


  const clearForm = () => {
    form.resetFields();
  };
  //下架
  const soldOut= async ()=>{
    try {
      const res = await postDownActivity(removeData)
      if (res.code === 0) {
        setModalVisible(false);
        message.success(`下架成功`);
        clearForm();
        await getOperationActivity();
      } else {
        message.error(`下架失败，原因:{${res.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //删除按钮
  const remove = async () =>{
    try {
      const res = await postDeleteActivity(removeData)
      if (res.code === 0) {
        setModalVisible(false);
        message.success(`删除成功`);
        clearForm();
        await getOperationActivity();
      } else {
        message.error(`删除失败，原因:{${res.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //下一步
  const next =  ()=>{
    form.validateFields().then(async (value)=>{
      console.log(value)
      if (value.time) {
        value.startTime = moment(value.time[0]).format('YYYY-MM-DD');
        value.endTime = moment(value.time[1]).format('YYYY-MM-DD');
      }
      if(edge==2){
        setBtnValue('发布并复制分享链接')
        value.activeType = 'H5'
        value.activeUrl='https://www.lingyangplat.com/antelope-activity-h5/antelope-download/index.html'
      }else if(edge==3){
        setBtnValue('发布并复制二维码')
        value.activeType = 'APPLET'
        await getAppletCode(value)
        value.url=url
        value.randomId=randomId
      }else if(edge==4){
        setBtnValue('发布并复制图片')
        value.activeType = 'SHARD_CODE'
      }
      setFormData(value)
      setCurrent(1)
    })
  }
  //完成
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
    form.setFieldsValue(columnData)
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
  }
  // 复制链接
  const copyLink = (e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    navigator &&
    navigator.clipboard &&
    navigator.clipboard.writeText(e.targetLink).then(() => {
      message.success('链接复制成功');
    });

  };
  const init = () => {
    // const image = new Image();
    // // 解决canvas跨域问题
    // image.setAttribute('crossOrigin', 'anonymous');
    // image.src = url;
    // // 利用图片加载，触发事件
    // image.onload = function () {
    //   try {
    //     const canvas = document.getElementsByTagName('canvas');
    //     const ctx = canvas[0].getContext('2d');
    //     ctx.drawImage(image, 200, 200);
    //     const imgUrl = canvas[0].toDataURL('image/png');
    //     setUrl(imgUrl);
    //   } catch {
    //     message.error('生成失败，请重试');
    //     props.onCancel();
    //   }
    // };
  };

  useEffect(() => {
    init();
  }, []);

  // 复制二维码
  const downWechatCode = () =>{
    message.success('二维码下载成功');
  }
  //复制分享码
  const downShareCode = () =>{
    message.success('分享码下载成功');
  }
  // 完成复制并提交
  const finishSubmit = async ()=>{
    if(edge==2){
      message.success('链接复制成功')
      const res =await postAddActivity(formData)
      if (res.code === 0) {
        await getOperationActivity();
      } else {
        message.error(res.message);
      }
    }
    else if(edge==3){
      message.success('链接复制成功')
      const microProgramQRCodeUrl=url
      const data= {...formData,microProgramQRCodeUrl,randomId}
      const res =await postAddActivity(data)
      if (res.code === 0) {
        await getOperationActivity();
      } else {
        message.error(res.message);
      }
    }
    else if(edge==4){
      message.success('链接复制成功')
    }
    clearForm();
    setModalVisible(false)
  }

  //新增链接按钮
  function handleButtonClick() {
    console.log(edge)
    setCurrent(0)
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
    setCurrent(0)
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

  //更多下拉
  const handleMoreMenuClick=(e: any)=> {
    console.log(e)
    const {startTime ,endTime} = e
    const result=e
    const time = [
      result.time=moment(startTime),
      result.time=moment(endTime),
    ]
    console.log(result)
    result.time=time
    console.log(result)
    setActiveStatusData(e.activeStatus)
    setRemoveData(e.id)
    setColumnData(result)
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
    <Menu >
      {activeStatusData=='DOWN'&&
      <Menu.Item key={'1'}>
        <a
          href="#"
          onClick={() => {
            editActivity()
          }}
        >编辑</a>
      </Menu.Item>}
      {activeStatusData=='UP'&&
      <Menu.Item key={'2'}>
        <Popconfirm
          title="下架后该链接将会失效，确认下架？？"
          okText="下架"
          cancelText="取消"
          onConfirm={ soldOut}
        >
        <a
          href="#"
          onClick={() => {
          }}
        >下架</a>
        </Popconfirm>
      </Menu.Item>}
      <Menu.Item key={'3'}>
        <Popconfirm
          title="删除后该链接将会失效，且不可恢复，确认删除？"
          okText="删除"
          cancelText="取消"
          onConfirm={remove}
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
                {selectChannelList.map((item ) => (
                  <Select.Option key={item.channelName} value={item.id}>
                    {item.channelName}
                  </Select.Option>
                ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="activeSceneId" label="场景值">
                <Select placeholder="请选择" allowClear>
                {selectSceneList.map((item ) => (
                  <Select.Option key={item.sceneName} value={item.id}>
                    {item.sceneName}
                  </Select.Option>
                ))}
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
                  console.log(time)
                  if (time) {
                    rest.startTime = moment(search.time[0]).format('YYYY-MM-DD');
                    rest.endTime = moment(search.time[1]).format('YYYY-MM-DD');
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
      <div className={sc('operate-record-divider')} />
      <div className={sc('operate-record-container')}>
        <div className={sc('operate-record-container-left')}>创建链接</div>
        <div className={sc('operate-record-container-right')}>
          <div className={sc('operate-record-container-right-time')}>2022-06-14  12:32:23</div>
          <div className={sc('operate-record-container-right-name')}>操作人：顾小满</div>
        </div>
      </div>
      <div className={sc('operate-record-divider')} />
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
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '活动名称',
      dataIndex: 'activeName',
      key: 'activeName',
    },
    {
      title: '活动时间',
      dataIndex: 'activityTime',
      key: 'activityTime',
      render: (_: any, _record: any) =>
        _record.startTime + '～' + _record.startTime,
    },
    {
      title: '渠道值',
      dataIndex: 'channelName',
      key: 'channelName',
    },
    {
      title: '场景值',
      dataIndex: 'sceneName',
      key: 'sceneName',
    },
    {
      title: '状态',
      dataIndex: 'activeStatus',
      key: 'activeStatus',
      render: (_: any, _record: any) =>
        _record.activeStatus=='UP'?'上架中':'已下架',
    },
    {
      title: '数据统计',
      dataIndex: 'dataStatistics',
      key: 'dataStatistics',
      render: (_: any, _record: any) =>
        <div>链接点击量：
          <span className={sc('statusName')}>  {_record.linkHitsQuantity }   </span>
            ，按钮点击量：
          <span className={sc('statusName')}> {_record.buttonHitsQuantity } </span>
        </div>,
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_record: any) => (
        <Space size="middle">
          {edge == 2 &&
          <a
            href="#"
            onClick={() => copyLink(_record as any)}
          >复制链接</a>
          }
          {edge == 3 &&
            <a
              type="primary"
              href={_record.microProgramQRCodeUrl}
              download={_record.microProgramQRCodeUrl}
            >
              下载二维码
            </a>
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
          <Dropdown overlay={moreMenu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={()=>{handleMoreMenuClick(_record as any)}}>
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
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '活动名称',
      dataIndex: 'activeName',
      key: 'activeName',
    },
    {
      title: '活动时间',
      dataIndex: 'activityTime',
      key: 'activityTime',
      render: (_: any, _record: any) =>
        _record.startTime + '～' + _record.startTime,
    },
    {
      title: '渠道值',
      dataIndex: 'channelName',
      key: 'channelName',
    },
    {
      title: '场景值',
      dataIndex: 'sceneName',
      key: 'sceneName',
    },
    {
      title: '码主人',
      dataIndex: 'shardCodeMaster',
      key: 'shardCodeMaster',
    },
    {
      title: '状态',
      dataIndex: 'activeStatus',
      key: 'activeStatus',
      render: (_: any, _record: any) =>
        _record.activeStatus=='UP'?'上架中':'已下架',
    },
    {
      title: '数据统计',
      dataIndex: 'dataStatistics',
      key: 'dataStatistics',
      render: (_: any, _record: any) =>
        <div>链接点击量：
          <span className={sc('statusName')}>  {_record.linkHitsQuantity }   </span>
          ，按钮点击量：
          <span className={sc('statusName')}> {_record.buttonHitsQuantity } </span>
        </div>,
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_record: any) => (
        <Space size="middle">
          {edge == 2 &&
            <a
              href="#"
              onClick={() => copyLink(_record as any)}
            >复制链接</a>
          }
          {edge == 3 &&
            <a
              type="primary"
              href={_record.microProgramQRCodeUrl}
              download={_record.microProgramQRCodeUrl}
            >
              下载二维码
            </a>
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
          <Dropdown overlay={moreMenu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={()=>{handleMoreMenuClick(_record as any)}}>
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
            form.setFieldsValue(formData)
            setCurrent(0)
          }}>
            上一步
          </Button>,
          <Button key="submit" type="primary" onClick={ async ()=>{
           await finishSubmit()
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
          {current==0 &&(
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
                <DatePicker.RangePicker allowClear size={"large"}/>
              </Form.Item>

              <Form.Item name="activeChannelId" label="渠道值"  rules={[{ required: true, message: '请输入渠道值！' }]}>
                <Select placeholder="请选择" allowClear disabled={activeStatusData=='DOWN'&&types.indexOf("新建") == -1}>
                  {selectChannelList.map((item ) => (
                    <Select.Option key={item.channelName} value={item.id}>
                      {item.channelName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="activeSceneId" label="场景值"  rules={[{ required: true, message: '请输入场景值！' }]}>
                <Select placeholder="请选择" allowClear disabled={activeStatusData=='DOWN'&&types.indexOf("新建") == -1}>
                  {selectSceneList.map((item ) => (
                    <Select.Option key={item.sceneName} value={item.id}>
                      {item.sceneName}
                    </Select.Option>
                  ))}
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
                  <Input placeholder="请输入" maxLength={8}/>
                </Form.Item>
              }

              {edge === 4 &&
                <Form.Item
                  label='分享码主人'
                  name="shareMaster"
                  rules={[{ required: true, message: '请输入分享码主人！' }]}
                >
                  <Input placeholder="请输入" maxLength={35} disabled={activeStatusData=='DOWN'&&types.indexOf("新建") == -1}/>
                </Form.Item>
              }
            </Form>
          )}
          {current==1 && (<div className={sc('modelWord')}>
            <h2 >以下链接用于预览效果用，不计入数据统计</h2>
            <img src={url} alt=""/>
          </div>)}
          {current==2 && (<div className={sc('modelWord')}>
            <h2 >以下小程序码用于预览效果用，不计入数据统计</h2>
          </div>)}
          {current==3 && (<div className={sc('modelWord')}>
            <h2 >以下分享码用于预览效果用，不计入数据统计</h2>
          </div>)}
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
        {(edge==2||edge==3)&&
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
          pagination={
            pageInfo.total === 0
              ? false
              : {
                total: pageInfo.total,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.total || 1}页`,
              }
          }
        />}
        {edge==4&&
        <Table
          bordered
          columns={columns1}
          dataSource={dataSource}
          rowKey={'id'}
          pagination={
            pageInfo.total === 0
              ? false
              : {
                total: pageInfo.total,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.total || 1}页`,
              }
          }
        />}
      </div>
      {getModal()}
    </PageContainer>
  );
};
