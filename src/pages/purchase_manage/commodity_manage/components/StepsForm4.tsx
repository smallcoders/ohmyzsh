import { addProductDetail, queryProduct } from '@/services/commodity';
import { ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form, Space } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'umi';
import type { StepFormProps } from '../create';

export default (props: StepFormProps) => {
  const { id = 29, currentChange } = props;
  const [form] = Form.useForm();
  const typeRef = useRef<0 | 1>(0);
  const history = useHistory();
  const save = useCallback(
    async (values) => {
      const res = await addProductDetail({
        ...values,
        productId: id,
        finishStatus: typeRef.current,
      });

      if (!res.code) {
        history.goBack();
      }
    },
    [id, history],
  );

  useEffect(() => {
    if (id) {
      queryProduct(id)
        .then((res) => {
          const data = {
            productContent: res.result.productContent,
            productArgs: res.result.productArgs,
            productDetail: res.result.productDetail,
            productApp: res.result.productApp,
          };
          form.setFieldsValue(data);
        })
        .finally(() => {});
    }
  }, [id, form]);

  const onConfirm = useCallback(
    (type: 0 | 1) => {
      typeRef.current = type;
      form.submit();
    },
    [form],
  );

  return (
    <div>
      <Form form={form} labelCol={{ span: 4 }} layout="vertical" onFinish={save}>
        <ProFormTextArea
          name="productContent"
          label="商品介绍"
          placeholder="请输入"
          rules={[{ required: true }]}
        />
        <ProFormTextArea
          name="productArgs"
          label="商品参数"
          placeholder="请输入"
          rules={[{ required: true }]}
        />
        <ProFormTextArea
          name="productDetail"
          label="商品细节"
          placeholder="请输入"
          rules={[{ required: true }]}
        />
        <ProFormTextArea
          name="productApp"
          label="商品应用"
          placeholder="请输入"
          rules={[{ required: true }]}
        />
      </Form>
      <div className="form-footer">
        <Space>
          <Button type="primary" onClick={() => onConfirm(1)}>
            完成商品设置
          </Button>
          <Button onClick={() => onConfirm(0)}>保存</Button>
          <Button onClick={() => currentChange(-1)}>上一步</Button>
        </Space>
      </div>
    </div>
  );
};
