import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import React, {useEffect, useState,useRef} from "react";
import moment from 'moment';
import { history } from 'umi';
import SelfTable from "@/components/self_table";
import {Button, Form, Input,Popconfirm,DatePicker, Modal, message, Breadcrumb} from "antd";
import {saveMeeting} from "@/services/baseline";
import useLimit from '@/hooks/useLimit'
import {Link} from "umi";
import FormEdit from '@/components/FormEdit';
const sc = scopedClasses('baseline-conference-add');
export default () => {
    const formLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 8 },
      };
  const weightRef = useRef()
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [expandAttributes, setExpandAttributes] = useState<any>([]);
  const [numb, setNumb] = useState<any>(0);
  const [form] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    totalexpandAttributes: 0,
    pageTotal: 0,
  });
  const columns = [
    {
      title: '字段ID',
      dataIndex: 'key',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 400,
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
               <Input onChange={(e:any)=>{record.name=e.target.value}} placeholder="请输入用户需填写的字段" style={{width:'300px',marginTop:'10px'}} maxLength={40}/> 
          </div>)}
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
             <Popconfirm
              title="删除后，用户填写的该字段内容也将删除，确定删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={()=>{
                const newArray=expandAttributes.filter((p:any)=>{
                  return p.key !== record.key
                })
                console.log(newArray);
                setExpandAttributes([...newArray])
              }}
            >
          <Button type='link'>删除</Button>
          </Popconfirm>
          </div>)}
    },
  ];
  const { meetingId } = history.location.query as any;
  // 方法
  // 上架/暂存
  const addRecommend = async (submitFlag: Boolean) => {
    form
      .validateFields()
      .then(async (value) => {
        const {time} = value
        debugger
        const startTime = moment(time[0]).format('YYYY-MM-DD  HH:mm');
        const endTime = moment(time[1]).format('YYYY-MM-DD  HH:mm');
        console.log({submitFlag,startTime,endTime,expandAttributes,...value})
        debugger
        const submitRes =  await saveMeeting({submitFlag,expandAttributes,startTime,endTime,...value})
        if (submitRes.code === 0) {
          history.goBack()
          message.success(submitFlag?'上架成功':'暂存成功')
        } else {
          message.error(`${submitRes.message}`);
        }
      })
      .catch((e) => {
        console.log(e)
      });
  };
 
  return (
    <PageContainer className={sc('container')}
                   header={{
                     title: meetingId? `编辑` : '新增',
                     breadcrumb: (
                       <Breadcrumb>
                         <Breadcrumb.Item>
                           <Link to="/baseline">基线管理</Link>
                         </Breadcrumb.Item>
                         <Breadcrumb.Item>
                           <Link to="/baseline/baseline-conference-manage">会议管理 </Link>
                         </Breadcrumb.Item>
                         <Breadcrumb.Item>
                           {meetingId ? `编辑` : '新增'}
                         </Breadcrumb.Item>
                       </Breadcrumb>
                     ),
                   }}
                   footer={[
                     <Button type='primary' onClick={() => {
                       addRecommend(true)
                     }}>上架</Button>,
                     <Button onClick={() => {
                        addRecommend(false)
                      }}>暂存</Button>,
                    <Button style={{marginRight:'40px'}} onClick={() =>{
                        if(formIsChange ){
                        setVisible(true) }else{  history.goBack()}
                    }
                    }>返回</Button>
                   ]}>
      <div className={sc('container-table-body')}>
        <div className={sc('container-table-body-title')}>会议信息</div>
        <Form form={form}  {...formLayout}  onValuesChange={() => {
          setFormIsChange(true);
        }}>
              <Form.Item name="title" 
              help='说明：在产业圈中显示，可以通过一句话展示会议概要'
              label="页面标题"
                         rules={[
                           {
                             required: true,
                             message: `必填`,
                           },
                         ]}>
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
              <Form.Item name="name" label="会议名称"
                         rules={[
                           {
                             required: true,
                             message: `必填`,
                           },
                         ]}>
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
      
              <Form.Item name="theme" label="会议主题" >
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
         
          <Form.Item name="place" label="会议地点" >
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
              <Form.Item name="place" label="主办方" 
                        rules={[
                           {
                             required: true,
                             message: `必填`,
                           },
                         ]} >
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
              <Form.Item name="contact" label="会议联系方式" rules={[
                           {
                             required: true,
                             message: `必填`,
                           },
                         ]}>
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
              <Form.Item name="time" label="会议时间" rules={[
                           {
                             required: true,
                             message: `必填`,
                           },
                         ]}>
                <DatePicker.RangePicker allowClear showTime format="YYYY-MM-DD HH:mm" />
              </Form.Item>
            
            <Form.Item name="weight" label="权重" >
               <Input ref={weightRef} placeholder='请输入1～100的整数，数字越大排名越靠前' onInput={useLimit(weightRef)} />
            </Form.Item>
       
          <Form.Item name="agenda" label="会议日程">
            <FormEdit width={624} />
          </Form.Item>
        </Form>
        <div className={sc('container-table-body-title')}>用户报名填写信息</div>
        <div>说明：最多可新增5个字段</div>
         <Button
         style={{margin:'10px 0'}}
          type="primary"
          disabled={expandAttributes.length>=5}
          key="addStyle"
          onClick={()=>{
            setNumb(numb+1)
            let newNumber
            if(numb+1>=0&&numb+1<10){
              newNumber = '00'+(numb+1)
            }else if(numb+1>=10){
              newNumber = '0'+(numb+1)
            }else{
              newNumber = ''+(numb+1)
            }
            expandAttributes.push({key:newNumber,id:newNumber,name:''})
            setExpandAttributes([...expandAttributes])
          }}
        >
          <PlusOutlined /> 新增
        </Button>
        <SelfTable
          bordered
          columns={columns}
          dataSource={expandAttributes}
          pagination={
            pageInfo.totalexpandAttributes === 0
              ? false
              : {
                showSizeChanger: true,
                total: pageInfo.totalexpandAttributes,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total: number) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
              }
          }
        />
      </div>
      <Modal
        visible={visible}
        title='提示'
        footer={[
          <Button key="back" onClick={() =>  setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" onClick={() => history.goBack()}>
            直接离开
          </Button>,
           <Button key="submit" type="primary" 
           onClick={() => { 
            addRecommend(false)
            history.goBack()}}>
           暂存并离开
         </Button>,
        ]}
      >
        <p>数据未保存，是否仍要离开当前页面？</p>
      </Modal>
    </PageContainer>
  );
};
