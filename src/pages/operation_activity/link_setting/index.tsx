import scopedClasses from "@/utils/scopedClasses";
import React, { useEffect, useState} from "react";
import type { RadioChangeEvent,} from "antd";
import copy from 'copy-to-clipboard';
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
import html2canvas from 'html2canvas'
import QRCode from 'qrcode.react'
import { Access, useAccess } from 'umi';
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
  postAddActivity,
  getChannelAndScene,
  postDownActivity,
  postAppletCode,
  postOperationRecord,
  postEditActivity,
  getCheckedMasterName, getUrlById
} from "@/services/opration-activity";
import moment from 'moment';
import {httpUpload} from "@/services/common";


const { Step } = Steps;
const sc = scopedClasses('operation-activity-link-setting');
export default () => {
  //数据
  const [selectChannelList,setSelectChannel] = useState<Activity.Content[]>([])
  const [selectSceneList,setSelectScene] = useState<Activity.Content[]>([])
  const [selectChannelListAll,setSelectChannelAll] = useState<Activity.Content[]>([])
  const [selectSceneListAll,setSelectSceneAll] = useState<Activity.Content[]>([])
  const [activeStatusData, setActiveStatusData] = useState({});
  const [columnData, setColumnData] = useState({});
  const [activeImageId, setActiveImageId] = useState('');
  const [removeData, setRemoveData] = useState({});
  const [dataSource, setDataSource] = useState<Activity.Content[]>([]);
  const [types, setTypes] = useState('');
  const [btnValue, setBtnValue] = useState({});
  const [url, setUrl] = useState('');
  const [idName, setIdName] = useState('');
  const [shardCodeMaster, setShardCodeMaster] = useState('');
  const [randomId, setRandomId] = useState('');
  const [recordContent,setRecordContent]=useState<Activity.Content[]>([]);
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<Activity.Content>({});
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

  const ipHost = () => {
    if (!!~window.location.host.indexOf('localhost')) {
      return 'http://172.30.33.222'
    } else if(!!~window.location.host.indexOf('172.30.33')){
      return  window.location.protocol + '//' + window.location.host.split(':')[0]
    } else if(!!~window.location.host.indexOf('10.103.142.216')){
      return 'https://preprod.lingyangplat.com'
    } else {
      return 'https://www.lingyangplat.com'
    }
  }

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
      const res =await getAllChannel({flag:true})
      if(res.code === 0){
        setSelectChannel(res.result)
      }
    }catch (e) {
      console.log(e)
    }
  }
  const getChannelListAll =async () =>{
    try {
      const res =await getChannelAndScene()
      if(res.code === 0){
        setSelectChannelAll(Array.from(new Set(res?.result?.channelList)))
        setSelectSceneAll(Array.from(new Set(res?.result?.sceneList)))
      }
    }catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getChannelList();
    getChannelListAll();
  }, []);

  //获取全部场景值
  const getSceneList =async () =>{
    try {
      const res =await getAllScene({flag:true})
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
        path:'pagesMine/jump-blank',
        reallyPath:value.targetLink,
        activeName:value.activeName
      }
      const res =await postAppletCode(data)
      if(res.code === 0){
        setUrl(res.result.url)
        setRandomId(res.result.randomId)
        setActiveImageId(res.result.activeImageId)
      }
    }catch (e) {
      console.log(e)
    }
  }

  //获取活动的操作记录
  const getOperationRecord =async (value: any) =>{
    try {
      const res =await postOperationRecord(value)
      if(res.code === 0){
        setRecordContent(res.result)
      }
    }catch (e) {
      console.log(e)
    }
  }

  const downloadIamge=(imgsrc: any,) =>{//下载图片地址和图片名
    const image = new Image();
    console.log(formData)
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    console.log(image.width)
    image.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 600;
      const context = canvas.getContext("2d");
      // @ts-ignore
      if(idName=='#imgWechat'&& context){
        context.drawImage(image, 0, 0,0,0);
      }else if(idName=='#imgShare1'&& context){
        context.drawImage(image, 0, 0,600, 600,);
      }
      const urlName = canvas.toDataURL("image/png"); //得到图片的base64编码数据
      const arr = urlName.split(',')
      // @ts-ignore
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const  u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob=new Blob([u8arr], { type: mime });
      const nowDate=moment().format("YY-MM-DD");
      const file = new window.File([blob], `${formData?.activeName}-${nowDate}.png`, {type: 'image/png'});
      const formData1 = new FormData();
      formData1.append("file",file);
      console.log(formData1)
      if(edge==4){
        httpUpload(formData1).then(res=>{
          if(res.code==0){
            const activeImageId1=res.result
            window.location.href=(`/antelope-common/common/file/download/${res.result}`)
            message.success('下载成功')
            setTimeout(() => {
              if(edge==4){
                if(types.indexOf("新建") !== -1){
                  const data={...formData,...{activeImageId:activeImageId1}}
                  postAddActivity(data).then(res1=>{
                    if (res1.code === 0) {
                      getOperationActivity().then(r=>{
                        console.log(r)
                      });
                    } else {
                      message.error(res1.message);
                    }
                  })
                }
              }
            }, 1000)
          }
        })
      }
      if(edge==3){
        window.location.href=(`/antelope-manage/manage/active/download/${activeImageId}`)
      }
    };
    image.src = imgsrc;
  }
  //下载图片
  const exportImg = () => {
    console.log(idName)
    const imgshare=document.querySelector(idName)
    html2canvas(imgshare as HTMLElement, { // 转换为图片
      useCORS: true, // 解决资源跨域问题
      scale:5
    }).then(canvas => {
      // imgUrl 是图片的 base64格式 代码 png 格式
      const imgUrl = canvas.toDataURL('image/png');
      //下面是 下载图片的功能。 不需要不加 注意加 .png
      downloadIamge(imgUrl)
      // message.success('下载成功')
    }) };
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
      console.log(columnData)
      console.log(value)
      if (value.time) {
        value.startTime = moment(value.time[0]).format('YYYY-MM-DD');
        value.endTime = moment(value.time[1]).format('YYYY-MM-DD');
      }
      const data={ ...columnData, ...value };
      setColumnData(data)
      if(edge==2){
        setBtnValue('发布并复制分享链接')
        console.log(value)
        value.activeType = 'H5'
        if(value.activeImageId){
          const res=await  getUrlById(value.activeImageId)
          if(res.code==0){
            value.url=res?.result
          }
        }
        value.activeUrl= `${ipHost()}/antelope-activity-h5/share-code/index.html?preview=true&targetLinkType=${value.targetLinkType}&buttonText=${value.buttonText}&targetLink=${value.targetLink}&url=${value.url}`
        setCurrent(1)
        setFormData(value)
      }else if(edge==3){
        setBtnValue('发布并下载二维码')
        setCurrent(2)
        value.activeType = 'APPLET'
        setIdName('#imgWechat')
        await getAppletCode(value)
        setFormData(value)
      }else if(edge==4){
        setBtnValue('发布并下载图片')
        value.activeType = 'SHARD_CODE'
        setIdName('#imgShare1')
        setFormData(value)
        setShardCodeMaster(value.shardCodeMaster)
        setCurrent(3)
      }
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
    console.log(e)
    if(e.id){
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      copy(`${ipHost()}/antelope-activity-h5/share-code/index.html?preview=false&targetLinkType=${e.targetLinkType}&id=${e.id}`)
        message.success('链接复制成功');

    }else{
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      copy(`${ipHost()}/antelope-activity-h5/share-code/index.html?preview=true&targetLinkType=${e.targetLinkType}&buttonText=${e.buttonText}&targetLink=${e.targetLink}&url=${e.url}`)
        message.success('链接复制成功');
    }
  };

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
      const res =types.indexOf("新建") !== -1?await postAddActivity(formData):await postEditActivity(columnData)
      if (res.code === 0) {
        await getOperationActivity();
        const data= types.indexOf("新建") !== -1?{...formData,...{id:res.result}}:columnData
        setColumnData(data)
        copyLink(data)
      } else {
        message.error(res.message);
      }
    }
    else if(edge==3){
      const microProgramQRCodeUrl=url
      const res =types.indexOf("新建") !== -1
        ?await postAddActivity({...formData,microProgramQRCodeUrl,randomId,activeImageId})
        :await postEditActivity({...columnData,microProgramQRCodeUrl,randomId,activeImageId})
      if (res.code === 0) {
        await getOperationActivity();
        exportImg()
      } else {
        message.error(res.message);
      }
    }
    else if(edge==4){
      exportImg()
      if(types.indexOf("新建") == -1){
        const res =await postEditActivity({...columnData})
        if (res.code === 0) {
          await getOperationActivity();
        } else {
          message.error(res.message);
        }
      }
    }
    clearForm();
    setCurrent(0)
    setModalVisible(false)
  }


  //新增链接按钮下拉
  const handleMenuClick=(e: any)=> {
    setEdge(e.key);
    setCurrent(0)
    if(e.key=='H5'){
      setTypes('新建H5链接')
      setEdge(Activity.Edge.H5)
    }
    else if(e.key=='WECHAT'){
      setTypes('新建小程序码')
      setEdge(Activity.Edge.WECHAT)
    }
    else if(e.key=='SHARE'){
      setTypes('新建分享码')
      setEdge(Activity.Edge.SHARE)
    }
    setModalVisible(true);
  }

  //更多下拉
  const handleMoreMenuClick=(e: any)=> {
    const {startTime ,endTime} = e
    const result=e
    const time = [
      result.time=moment(startTime),
      result.time=moment(endTime),
    ]
    result.time=time
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
          overlayStyle={{translate:'10px 40px'}}
          placement="topRight"
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
                {selectChannelListAll.map((item ) => (
                  <Select.Option key={ item.id } value={ item.id }>
                    {item.channelName}
                  </Select.Option>
                ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="activeSceneId" label="场景值">
                <Select placeholder="请选择" allowClear>
                {selectSceneListAll.map((item ) => (
                  <Select.Option key={ item.id } value={ item.id }>
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
  const content =(
    recordContent?.map((item: any) => (
      // eslint-disable-next-line react/jsx-key
      <div className={sc('operate-record')}>
           <div className={sc('operate-record-container')}>
             <div className={sc('operate-record-container-left')}>{item.operation}</div>
             <div className={sc('operate-record-container-right')}>
               <div className={sc('operate-record-container-right-time')}>{item.updateTime}</div>
               <div className={sc('operate-record-container-right-name')}>操作人：{item.operatorName}</div>
             </div>
           </div>
         </div>
    )));
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
        _record.startTime + '～' + _record.endTime,
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
          <Access accessible={access['P_OA_H5LJ']}>
            <a
              href="#"
              onClick={() => copyLink(_record as any)}
            >复制链接</a>
          </Access>
          <Popover content={content} trigger="click" >
            <a
              href="#"
              onClick={async () => {
              await  getOperationRecord(_record.id as any)
              }}
            >操作记录</a>
          </Popover>
          <Access accessible={access['P_OA_H5LJ']}>
            <Dropdown overlay={moreMenu} trigger={['click']}>
              <a className="ant-dropdown-link" onClick={()=>{handleMoreMenuClick(_record as any)}}>
                更多 <DownOutlined />
              </a>
            </Dropdown>
          </Access>
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
        _record.startTime + '～' + _record.endTime,
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
        <div>扫码量：
          <span className={sc('statusName')}>  {_record.linkHitsQuantity }   </span>
        </div>,
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_record: any) => (
        <Space size="middle">
          <Access accessible={access['PX_OA_XCXLJ']}>
            <a
              type="primary"
              onClick={downWechatCode}
              href={`/antelope-manage/manage/active/download/${_record?.activeImageId}`}
              download={`/antelope-manage/manage/active/download/${_record?.activeImageId}`}
            >
              下载二维码
            </a>
          </Access>
          <Popover content={content} trigger="click">
            <a
              href="#"
              onClick={async () => {
                await  getOperationRecord(_record.id as any)
              }}
            >操作记录</a>
          </Popover>
          <Access accessible={access['P_OA_XCXLJ']}>
            <Dropdown overlay={moreMenu} trigger={['click']}>
              <a className="ant-dropdown-link" onClick={()=>{handleMoreMenuClick(_record as any)}}>
                更多 <DownOutlined />
              </a>
            </Dropdown>
          </Access>
        </Space>
      ),
    },
  ];
  const columns2: ColumnsType<Activity.Content> = [
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
        _record.startTime + '～' + _record.endTime,
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
        <div>扫码量：
          <span className={sc('statusName')}>  {_record.linkHitsQuantity }   </span>
        </div>,
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_record: any) => (
        <Space size="middle">
          <Access accessible={access['PX_OA_FXMLJ']}>
            <a
              download={`/antelope-common/common/file/download/${_record?.activeImageId}`}
              href={`/antelope-common/common/file/download/${_record?.activeImageId}`}
              onClick={downShareCode}
            >下载分享码</a>
          </Access>
          <Popover content={content} trigger="click">
            <a
              href="#"
              onClick={async () => {
                await  getOperationRecord(_record.id as any)
              }}
            >操作记录</a>
          </Popover>
          <Access accessible={access['P_OA_FXMLJ']}>
            <Dropdown overlay={moreMenu} trigger={['click']}>
              <a className="ant-dropdown-link" onClick={()=>{handleMoreMenuClick(_record as any)}}>
                更多 <DownOutlined />
              </a>
            </Dropdown>
          </Access>
        </Space>
      ),
    },
  ];

  const edges = {
    [Activity.Edge.H5]: 'H5链接', // H5链接
    [Activity.Edge.WECHAT]: '小程序码', // 小程序码
    [Activity.Edge.SHARE]: '分享码', // 分享码
  }

  useEffect(() => {
    for (const key in permissions) {
      const permission = permissions[key]
      console.log('access', access)
      // permission 看这个属性，是否再access中存在，存在为true
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        console.log('key',key)
        setEdge(key as any)
        break
      }
    }
  }, [])

  const permissions = {
    [Activity.Edge.H5]: 'PQ_OA_H5LJ', // H5链接
    [Activity.Edge.WECHAT]: 'PQ_OA_XCXLJ', // 小程序码
    [Activity.Edge.SHARE]: 'PQ_OA_FXMLJ', // 分享码
  }
  const selectButton = (): React.ReactNode => {
    const handleEdgeChange = (e: RadioChangeEvent) => {
      console.log(typeof  e.target.value)
      setEdge(e.target.value);
    };
    return (
      <Radio.Group value={edge} onChange={handleEdgeChange}>
        {
          Object.keys(edges).map((p, index) => {
            return <Access accessible={access?.[permissions[p]]}><Radio.Button value={p}>{edges[p]}</Radio.Button></Access>
          })
        }
        {/* <Radio.Button value={Activity.Edge.H5}>H5链接</Radio.Button>
        <Radio.Button value={Activity.Edge.WECHAT}>小程序码</Radio.Button>
        <Radio.Button value={Activity.Edge.SHARE}>分享码</Radio.Button> */}
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
        bodyStyle={{
          height: '500px',
          overflow: 'auto'
        }}
        onCancel={() => {
          clearForm();
          setCurrent(0)
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
          <Button key="submit"
                  type="primary"
               onClick={ async ()=>{
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
                    <Select.Option key={ item.id } value={ item.id }>
                      {item.channelName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="activeSceneId" label="场景值"  rules={[{ required: true, message: '请输入场景值！' }]}>
                <Select placeholder="请选择" allowClear disabled={activeStatusData=='DOWN'&&types.indexOf("新建") == -1}>
                  {selectSceneList.map((item ) => (
                    <Select.Option key={ item.id } value={ item.id }>
                      {item.sceneName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {edge == 2&&
                <Form.Item
                  label='目标链接类型'
                  name="targetLinkType"
                  rules={[{ required: true, message: '请输入目标链接类型！' }]}
                >
                  <Select placeholder="请选择" allowClear >
                    <Select.Option value={'H5'}>H5</Select.Option>
                    <Select.Option value={'APPLET'}>APPLET</Select.Option>
                  </Select>
                </Form.Item>}

              {edge != 4&&
              <Form.Item
                label='跳转目标链接'
                name="targetLink"
                rules={[{ required: true, message: '请输入跳转目标链接！' }]}
              >
                <Input placeholder="请输入" maxLength={2000}/>
              </Form.Item>}

              {edge == 2 &&
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

              {edge == 2&&
                <Form.Item
                  label='按钮文案'
                  name="buttonText"
                  rules={[{required: true, message: '请输入按钮文案！'}]}
                >
                  <Input placeholder="请输入" maxLength={8}/>
                </Form.Item>
              }

              {edge == 4 &&(types.indexOf("新建") !== -1)&&
                <Form.Item
                  label='分享码主人'
                  name="shardCodeMaster"
                  rules={[{ required: true, message: '请输入分享码主人！' },
                    {
                      validator(rule,value, callback) {
                        try{
                          if(value.length>0){
                            getCheckedMasterName(value).then(res=> {
                              if (res?.code == 0 &&res?.result) {
                                form.setFields([
                                  { name: 'shardCodeMaster', value:'', errors: ['该用户已存在分享码'] },
                                ]);
                              }else{
                                callback()
                              }
                            })}
                        }catch (e){
                          console.log(e,'err')
                        }
                      },
                      validateTrigger: 'onBlur',
                    },
                    {
                      validator(rule,value, callback) {
                        if (value==undefined) {
                          form.setFields([
                            // { name: '表单字段name', value: '需要设置的值', errors: ['错误信息'] }, 当 errors 为非空数组时，表单项呈现红色，
                            {name: 'shardCodeMaster', value: '', errors: ['请输入分享码主人!']},
                          ]);
                        }else{
                          callback()
                        }
                      },
                      validateTrigger: 'onBlur',
                    },
                  ]}
                >
                  <Input placeholder="请输入" maxLength={35} disabled={activeStatusData=='DOWN'&&types.indexOf("新建") == -1}/>
                </Form.Item>
              }
              {edge == 4 &&activeStatusData =='DOWN'&&(types.indexOf("新建") == -1)&&
                <Form.Item
                  label='分享码主人'
                  name="shardCodeMaster"
                  rules={[{ required: true, message: '请输入分享码主人！' },
                   ]}
                >
                  <Input placeholder="请输入" maxLength={35} disabled={activeStatusData=='DOWN'&&types.indexOf("新建") == -1}/>
                </Form.Item>
              }
            </Form>
          )}
          {current==1 && (<div className={sc('modelWord')}>
            <h2 >以下链接用于预览效果用，不计入数据统计</h2>
            {formData&&(
              <div>
            <h2 className={sc('modelWord-link')}>{ `${ipHost()}/antelope-activity-h5/share-code/index.html?preview=true&targetLinkType=${formData.targetLinkType}&buttonText=${formData.buttonText}&targetLink=${formData.targetLink}&url=${formData.url}`}
            </h2>
            <Button
              type="primary"
              key="search"
              onClick={() => copyLink(formData as any)}
            >
              复制链接
            </Button></div>)
            }
          </div>)}
          {current==2 && (<div className={sc('modelWord')}>
            <h2 >以下小程序码用于预览效果用，不计入数据统计</h2>
            <div id={'imgWechat'}>
              <img src={url} />
            </div>
          </div>)}
          {current==3 && (<div className={sc('modelWord')} >
            <h2 >以下分享码用于预览效果用，不计入数据统计</h2>
            <div className={sc('modelWord-bk')} id={'imgShare'}>
              <div className={sc('modelWord-bk-invite')}>邀请人：{shardCodeMaster}</div>
              <div className="qr-anhui-pf">
                <QRCode
                  value={(`${ipHost()}/antelope-activity-h5/antelope-download/index.html?shardCodeMaster=${shardCodeMaster}&preview=true`) }
                  renderAs={'canvas'}
                  size={300}
                  bgColor={'#FFFFFF'}
                  fgColor={'#000000'}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
            <div className={sc('modelWord-bk1')} id={'imgShare1'}>
              <div className={sc('modelWord-bk1-invite')}>邀请人：{shardCodeMaster}</div>
              <div className="qr-anhui-pf">
                <QRCode
                  value={(`${ipHost()}/antelope-activity-h5/antelope-download/index.html?shardCodeMaster=${shardCodeMaster}&preview=false`)}
                  renderAs={'canvas'}
                  size={300}
                  bgColor={'#FFFFFF'}
                  fgColor={'#000000'}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
          </div>)}
        </ProCard>
      </Modal>
    );
  };

  const access = useAccess()

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-header')}>
          {selectButton()}
          <Access accessible={access['PA_OA_LJ']}>
            <div className={sc('container-header-select')}>
              <Dropdown overlay={menu} placement="bottomLeft">
                <Button style={{background:'#6680FF',color:'#fff'}}>新增  ···</Button>
              </Dropdown>
            </div>
          </Access>
        </div>
      <div className={sc('container-body')}>
        {edge==2&&
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
          pagination={
            pageInfo.total === 0
              ? false
              : {
                onChange: getOperationActivity,
                total: pageInfo.total,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${Math.ceil(pageInfo.total / pageInfo.pageSize) || 1}页`,
              }
          }
        />}
        {edge==3&&
          <Table
            bordered
            columns={columns1}
            dataSource={dataSource}
            rowKey={'id'}
            pagination={
              pageInfo.total === 0
                ? false
                : {
                  onChange: getOperationActivity,
                  total: pageInfo.total,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${Math.ceil(pageInfo.total / pageInfo.pageSize) || 1}页`,
                }
            }
          />}
        {edge==4&&
        <Table
          bordered
          columns={columns2}
          dataSource={dataSource}
          rowKey={'id'}
          pagination={
            pageInfo.total === 0
              ? false
              : {
                onChange: getOperationActivity,
                total: pageInfo.total,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${Math.ceil(pageInfo.total / pageInfo.pageSize) || 1}页`,
              }
          }
        />}
      </div>
      {getModal()}
    </PageContainer>
  );
};
