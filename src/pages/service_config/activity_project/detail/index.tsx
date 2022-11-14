import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Form } from 'antd';
import { useState } from 'react';
import { useHistory } from 'umi';
export default () => {
  let detaildata = {};
  try {
    const detailJson: any = localStorage.getItem('activity_detail');
    detaildata = JSON.parse(detailJson);
  } catch (error) {}
  const history = useHistory();
  const [detail, setDetail] = useState<any>(detaildata);
  return (
    <PageContainer title={false}>
      <ProCard gutter={8} ghost>
        <ProCard direction="column" ghost gutter={[0, 8]}>
          <ProCard>
            <h2>基本信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="姓名">{detail?.name}</Form.Item>
              <Form.Item label="用户ID">{detail?.userId}</Form.Item>
              <Form.Item label="手机号">{detail?.phone}</Form.Item>
              <Form.Item label="微信号">{detail?.productName}</Form.Item>
              <Form.Item label="注册时间">{detail?.registerTime}</Form.Item>
              <Form.Item label="注册端">{detail?.registerSource}</Form.Item>
              <Form.Item label="身份">{detail?.role}</Form.Item>
              <Form.Item label="所属组织">{detail?.orgName}</Form.Item>
              <Form.Item label="邀请人数">{detail?.assistanceCount}</Form.Item>
            </Form>
          </ProCard>
          <ProCard>
            <h2>标注信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="奖品兑换">{detail?.exchange ? '已兑换' : '未兑换'}</Form.Item>
              <Form.Item label="操作时间">{detail?.operationTime}</Form.Item>
              <Form.Item label="操作人">{detail?.operationName}</Form.Item>
            </Form>
          </ProCard>

          <ProCard layout="center">
            <Button onClick={() => history.goBack()}>返回</Button>
          </ProCard>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
