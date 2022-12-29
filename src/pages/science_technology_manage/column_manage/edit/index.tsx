import {PageContainer} from "@ant-design/pro-layout";

import './index.less';
import scopedClasses from "@/utils/scopedClasses";
import ProCard from "@ant-design/pro-card";
import {Button, Form, Input, InputNumber, message,Modal} from "antd";
import {history} from "@@/core/history";
import UploadForm from "@/components/upload_form";
import { getColumnDetailById, saveColumn} from "@/services/column-manage";
import  {useEffect, useState} from "react";
const sc = scopedClasses('column-manage-edit');
export default () => {
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const creativeColumnId = history.location.query?.id as string;

  const [form] = Form.useForm();
  const getColumnDetail = async () =>{
    try {
      const res = await getColumnDetailById(creativeColumnId)
      if(res.code==0){
        console.log(res)
        form.setFieldsValue(res.result)
      }
    }catch (e){
      console.log(e)
    }
  }
  useEffect(() => {
    if(creativeColumnId){
      getColumnDetail()
    }
  }, [creativeColumnId]);
  //新增和修改的发布按钮
  const onFinish = async () => {
    form
      .validateFields()
      .then(async (value: any) => {
        try {
          const res = await saveColumn({...value,id:creativeColumnId})
         if(res.code==0){
           message.success(`发布成功`);
           history.goBack()
         }
        }catch (e){
          console.log(e)
        }
      })
      .catch((err: any)=>{
        console.log(err)
      })

  };
  return(
    <PageContainer className={sc('container')}>
      <Form className={sc('container-form')} form={form}   onValuesChange={() => {
        setFormIsChange(true);
      }}>
        <Form.Item name="name" label="专栏名称" required   rules={[{ required: true, message: '请输入专栏名称！' }]}>
          <Input placeholder={'请输入'} />
        </Form.Item>
        <Form.Item
          name="content"
          label="专栏介绍"
          required
          rules={[{ required: true, message: '请输入专栏介绍！' }]}
        >
          <Input.TextArea showCount maxLength={300}  placeholder={'请输入'}/>
        </Form.Item>
        <Form.Item
          label="服务端"
          className={'pics'}
        >
          <Form.Item  label="Web端" required className={'pic'}>
            <Form.Item style={{backgroundColor:"#F8F9FA"}}  name="webPhotoId" label="Web端banner图片" required className={'link'} rules={[{ required: true, message: '请输入Web端banner图片！' }]}>
            <UploadForm
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              maxSize={5}
              accept=".png,.jpg"
            />
            </Form.Item>
            <div className={'pic-word'} style={{marginBottom:'20px'}}>限定一张图片，不超过5M，<span className={'red'}>尺寸（1200 * 160）</span>，格式支持png、jpg;</div>
            <Form.Item style={{backgroundColor:"#F8F9FA"}}  name="webLink" label="Web端链接地址" required className={'link'} rules={[{ required: true, message: '请输入Web端链接地址！' }]}>
            <Input  placeholder={'请输入Web端链接'}/>
            </Form.Item>
          </Form.Item>
          <Form.Item  label="App端"  className={'pic'}>
            <Form.Item style={{backgroundColor:"#F8F9FA"}} name="appPhotoId" label="App端banner图片"  className={'link'} >
              {/*<div className={'pic-content'}>*/}
              <UploadForm
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                maxSize={5}
                accept=".png,.jpg"
              />
              {/*</div>*/}
            </Form.Item>
            <div className={'pic-word'} style={{marginBottom:'20px'}}>限定一张图片，不超过5M，<span className={'red'}>尺寸（375 * 150）</span>，格式支持png、jpg;</div>
            <Form.Item style={{backgroundColor:"#F8F9FA"}} name="appLink" label="App端链接地址" className={'link'} >
              <Input  placeholder={'请输入App端链接'}/>
            </Form.Item>
          </Form.Item>
        </Form.Item>
        <Form.Item name="sort" label="展示顺序"   >
          <InputNumber
            min={1}
            defaultValue={1}
            step={1}
            max={100}
            placeholder="请输入"
          />
        </Form.Item>
        <Form.Item
          name="remark"
          label="备注"
        >
          <Input.TextArea showCount maxLength={300} placeholder={'请输入'} />
        </Form.Item>
      </Form>
      <ProCard layout="center">
        <Button style={{marginRight:'40px'}} onClick={() =>{
        if(formIsChange ){
          Modal.confirm({
            title: '提示',
            content: '之前填写的信息还未保存发布，确定离开吗？',
            okText: '确定离开',
            onOk: () => {
              history.goBack()
            },
            cancelText: '取消',
          }) }else{  history.goBack()}
        }
          }>返回</Button>
        <Button type={"primary"} onClick={onFinish}>发布</Button>
      </ProCard>
    </PageContainer>
  )
}
