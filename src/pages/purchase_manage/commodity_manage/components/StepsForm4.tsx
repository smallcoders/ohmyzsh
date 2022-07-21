import FormEdit from '@/components/FormEdit';
import { addProductDetail, queryProduct } from '@/services/commodity';
import { Button, Form, Space } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'umi';
import type { StepFormProps } from '../create';

export default (props: StepFormProps) => {
  const { id, currentChange, setChanged } = props;
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
      <Form
        form={form}
        labelCol={{ span: 4 }}
        layout="vertical"
        onChange={() => setChanged(true)}
        onFinish={save}
      >
        <Form.Item name="productContent" label="商品介绍" rules={[{ required: true }]}>
          <FormEdit />
        </Form.Item>
        <Form.Item name="productArgs" label="商品参数" rules={[{ required: true }]}>
          <FormEdit />
        </Form.Item>
        <Form.Item name="productDetail" label="商品细节">
          <FormEdit />
        </Form.Item>
        <Form.Item name="productApp" label="商品应用">
          <FormEdit />
        </Form.Item>
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
