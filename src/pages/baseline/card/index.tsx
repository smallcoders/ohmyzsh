import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useEffect, useState,useRef} from "react";
import {message,Button,Modal,Form,Radio,InputNumber} from "antd";
import {queryMeetingConfig,saveMeetingConfig} from "@/services/baseline";
import {Access,useAccess} from "@@/plugin-access/access";

export default () => {
  // // 拿到当前角色的access权限兑现
  const access = useAccess()
  const sc = scopedClasses('conference-card');
  const [searchForm] = Form.useForm();
  const [detail, setDetail] = useState<any>({});
  const [modalVisible, setModalVisible] = useState<any>(false);
  // 获取数据
  const getPage = async () => {
    try {
      const res = await queryMeetingConfig()
      if (res.code === 0) {
        setDetail(res?.result)
      } else {
        message.error(`请求数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPage();
  }, []);
//保存设置
 const handleSave = async()=>{
  const {show,position} = searchForm.getFieldsValue()
  try {
    const res = await saveMeetingConfig({show,position})
      if(res.code === 0){
        getPage();
        setModalVisible(false)
    } else {
      message.error(`请求数据失败`);
    }
  } catch (error) {
    console.log(error);
  }
 }

  return (
    <PageContainer>
      <div className={sc('container')}>
        <div className={sc('container-desc')}>
          <span>会议卡片展示：</span>
          {detail&&<span>{detail?.show?'是':'否'}</span>}
          <Access accessible={access['PU_BLM_HYKPSZ']}>
          <Button onClick={()=>{setModalVisible(true)}} style={{ marginLeft: '30px' }} type="primary">编辑 </Button>
          </Access>
      </div>
      <div className={sc('container-desc')}>
        <span>会议卡片展示位置：</span>
        <span>{detail?.position || '--'}</span>
      </div>
    </div>
    <Modal
      title="会议卡片设置"
      width="800px"
      visible={modalVisible}
      maskClosable={false}
      okText="确定"
      onCancel={()=>{setModalVisible(false)}}
      onOk={handleSave}>
  <Form  form={searchForm}>
    <Form.Item name="show" label="是否展示："  initialValue={true}>
      <Radio.Group defaultValue={true}  >
        <Radio value={true}>是</Radio>
        <Radio value={false}>否</Radio>
      </Radio.Group>
    </Form.Item>
      <Form.Item   help='请输入1~20的数字' name="position" label="展示位置：" initialValue={5} >
      <InputNumber min={1} max={20} placeholder="请输入" style={{ width: '100%' }} />
      </Form.Item>
      </Form>
      </Modal>
    </PageContainer>
  );
};
