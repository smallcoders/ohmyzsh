import { ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import { useCallback } from 'react';
import type { StepFormProps } from '../create';

export interface ParameterData {
  id: number;
  name: string;
  content: string;
}

export default (props: StepFormProps) => {
  const [form] = Form.useForm();
  const onFinish = useCallback(async () => {
    props.currentChange(1);
  }, [props]);
  return (
    <div>
      <Form form={form} labelCol={{ span: 4 }} layout="vertical" onFinish={onFinish}>
        <ProFormTextArea
          name="content"
          label="商品介绍"
          placeholder="请输入"
          rules={[{ required: true }]}
        />
        <ProFormTextArea
          name="parameter"
          label="商品参数"
          placeholder="请输入"
          rules={[{ required: true }]}
        />
        <ProFormTextArea
          name="detail"
          label="商品细节"
          placeholder="请输入"
          rules={[{ required: true }]}
        />
        <ProFormTextArea
          name="application"
          label="商品应用"
          placeholder="请输入"
          rules={[{ required: true }]}
        />
      </Form>
      <div className="form-footer">
        <Button type="primary">完成商品设置</Button>
        <Button onClick={() => form.submit()}>保存</Button>
        <Button onClick={() => props.currentChange(-1)}>上一步</Button>
      </div>
    </div>
  );
};
