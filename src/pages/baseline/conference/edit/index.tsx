import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useEffect, useState,useRef} from "react";
import {Button, Col, Form, Input, Row, Modal, Select, message, Breadcrumb} from "antd";
import {history} from "@@/core/history";
import { getArticlePage, getArticleType} from "@/services/baseline";
import useLimit from '@/hooks/useLimit'
import {addHotRecommend,editHotRecommend, getHotRecommendDetail, queryByIds} from "@/services/topic";
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
  const [form] = Form.useForm();

  const { query } = history.location as any;
  // 方法
  // 上架/暂存
  const addRecommend = async (state: number) => {
    form
      .validateFields()
      .then(async (value) => {
        const {topic,weight}=value
        const submitRes =   !query?.id ? await addHotRecommend({
          topic,
          weight:parseInt(weight),
          enable:1,
        }):await editHotRecommend({
          id:query?.id,
          topic,
          weight:parseInt(weight),
          enable:1,
        })
        if (submitRes.code === 0) {
          history.goBack()
          message.success(state==1?'上架成功':'暂存成功')
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
                     title: query?.id ? `编辑` : '新增',
                     breadcrumb: (
                       <Breadcrumb>
                         <Breadcrumb.Item>
                           <Link to="/baseline">基线管理</Link>
                         </Breadcrumb.Item>
                         <Breadcrumb.Item>
                           <Link to="/baseline/baseline-conference-manage">会议管理 </Link>
                         </Breadcrumb.Item>
                         <Breadcrumb.Item>
                           {query?.id ? `编辑` : '新增'}
                         </Breadcrumb.Item>
                       </Breadcrumb>
                     ),
                   }}
                   footer={[
                     <Button onClick={() => {
                       addRecommend(1)
                     }}>上架</Button>,
                     <Button onClick={() => {
                        addRecommend(1)
                      }}>暂存</Button>,
                    <Button style={{marginRight:'40px'}} onClick={() =>{
                        if(formIsChange ){
                        Modal.confirm({
                            title: '提示',
                            content: '之前填写的信息还未上架，确定离开吗？',
                            okText: '确定离开',
                            onOk: () => {
                            history.goBack()
                            },
                            cancelText: '取消',
                        }) }else{  history.goBack()}
                    }
                    }>返回</Button>
                   ]}>
      <div className={sc('container-table-body')}>
        <Form form={form}  {...formLayout}  onValuesChange={() => {
          setFormIsChange(true);
        }}>
              <Form.Item name="topic" label="页面标题"
                         rules={[
                           {
                             required: true,
                             message: `必填`,
                           },
                         ]}>
                <Input placeholder="请输入" maxLength={100}/>
                <div>说明：在产业圈中显示，可以通过一句话展示会议概要</div>
              </Form.Item>
              <Form.Item name="topic" label="会议名称"
                         rules={[
                           {
                             required: true,
                             message: `必填`,
                           },
                         ]}>
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
      
              <Form.Item name="topic" label="会议主题" >
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
         
          <Form.Item name="topic" label="会议地点" >
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
              <Form.Item name="topic" label="会议联系人">
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
        
              <Form.Item name="topic" label="会议时间">
                <Input placeholder="请输入" maxLength={100}/>
              </Form.Item>
     
            <Form.Item name="weight" label="权重" >
               <Input ref={weightRef} placeholder='请输入1～100的整数，数字越大排名越小' onInput={useLimit(weightRef)} />
            </Form.Item>
       
          <Form.Item name="content" label="会议日程">
            <FormEdit width={624} />
          </Form.Item>
        </Form>
      </div>
    </PageContainer>
  );
};
