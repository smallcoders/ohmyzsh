import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useEffect, useState,useRef} from "react";
import {message,Button,Modal,Form,Radio,Input} from "antd";
import {getMeetingPage} from "@/services/baseline";
import {useAccess} from "@@/plugin-access/access";

export default () => {
  // // 拿到当前角色的access权限兑现
  const access = useAccess()
  const sc = scopedClasses('conference-card');
  const [searchForm] = Form.useForm();
  const [detail, setDetail] = useState<any>({});
  const [modalVisible, setModalVisible] = useState<any>(false);
  // 获取分页数据
  const getPage = async (pageIndex: number = 1, pageSize = 10) => {
    try {
      const res = await getMeetingPage({
        pageIndex,
        pageSize,
      });
      if (code === 0) {
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPage();
  }, []);
 
  return (
    <PageContainer>
      <div className={sc('container')}>
        <div className={sc('container-desc')}>
          <span>会议卡片展示：</span>
          <span>{detail?.title || '--'}</span>
          <Button onClick={()=>{setModalVisible(true)}} style={{ marginLeft: '30px' }} type="primary">编辑 </Button>
      </div>
      <div className={sc('container-desc')}>
        <span>会议卡片展示位置：</span>
        <span>{detail?.title || '--'}</span>
      </div>
    </div>
    <Modal
      title="会议卡片设置"
      width="800px"
      visible={modalVisible}
      maskClosable={false}
      okText="确定"
      onOk={() => {
        const search = searchForm.getFieldsValue();
        console.log(search)
      } }>
  <Form  form={searchForm}>
    <Form.Item name="isShow" label="是否展示："  initialValue={true}>
      <Radio.Group defaultValue={true}  >
        <Radio value={true}>是</Radio>
        <Radio value={false}>否</Radio>
      </Radio.Group>
    </Form.Item>
      <Form.Item name="loacl" label="展示位置：">
      <Input placeholder="请输入1~30的数字" maxLength={100}/>
      </Form.Item>
      </Form>
      </Modal>
    </PageContainer>
  );
};
