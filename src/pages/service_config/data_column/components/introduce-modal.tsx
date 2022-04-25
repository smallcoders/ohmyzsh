import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import '../service-config-data-column.less';
const IntroduceModal = ({ visible, setVisible, submit, detail, publishLoading }) => {
  const [form] = useForm();
  const [control, setControl] = useState<boolean>(false);
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const [sum, setSum] = useState<number>(0);

  const getSum = (constructions = []) => {
    setSum(
      constructions.reduce((total: number, item: any) => {
        return total + (item?.value || 0);
      }, 0),
    );
  };
  useEffect(() => {
    if (detail?.id) {
      if (detail?.constructions) {
        getSum(detail?.constructions);
      }
      if (detail?.manage) {
        setControl(true);
      }
      form.setFieldsValue({ ...detail });
    }
  }, detail);

  const clearForm = () => {
    form.resetFields();
    setSum(0);
    setControl(false);
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        console.log(values);
        await submit({
          id: detail?.id,
          ...values,
        });
        clearForm();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const line = <span style={{ color: '#D9D9D9' }}>——</span>;

  const onChangeValue = () => {
    const values = form.getFieldValue('constructions');
    getSum(values);
  };
  return (
    <Modal
      title={detail?.title}
      width="60%"
      visible={visible}
      onCancel={() => {
        clearForm();
        setVisible(false);
      }}
      okButtonProps={{
        loading: publishLoading,
      }}
      onOk={() => {
        // await addOrUpdata();
        onSubmit();
      }}
      destroyOnClose
    >
      <Form className="introduce-form" {...formLayout} form={form} layout="horizontal">
        <Form.Item
          label="是否由运营平台控制"
          initialValue={false}
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
          name={'manage'}
        >
          <Radio.Group
            onChange={(e) => {
              console.log(e);
              setControl(e.target.value);
              if (e.target.value) {
                form.setFieldsValue({
                  constructions: [
                    {
                      title: '',
                      value: undefined,
                    },
                  ],
                });
                setSum(0);
              }
            }}
          >
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
        {control && (
          <>
            <Form.Item label="数据构成" required>
              <div
                style={{
                  padding: 5,
                  textAlign: 'right',
                }}
              >
                {sum}
              </div>
              <Form.List
                name="constructions"
                rules={[
                  {
                    validator: async (_, constructions) => {
                      if (!constructions || constructions.length === 0) {
                        return Promise.reject(new Error('请添加'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                        }}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          style={{ flex: 1 }}
                          rules={[
                            {
                              required: true,
                              message: '请输入数据来源',
                            },
                          ]}
                          name={[field.name, 'title']}
                        >
                          <Input placeholder="数据来源" style={{ width: '100%' }} maxLength={35} />
                        </Form.Item>
                        {line}
                        <Form.Item
                          {...field}
                          style={{ flex: 1 }}
                          rules={[
                            {
                              required: true,
                              message: '请输入数据量',
                            },
                          ]}
                          name={[field.name, 'value']}
                        >
                          <InputNumber
                            placeholder="数据量"
                            style={{ width: '100%' }}
                            min={0}
                            max={99999999}
                            onChange={() => {
                              onChangeValue();
                            }}
                          />
                        </Form.Item>

                        {index !== 0 && (
                          <div
                            style={{
                              fontSize: '16px',
                              position: 'absolute',
                              right: '-30px',
                              background: 'rgba(0, 0, 0, 0.45)',
                              borderRadius: '50%',
                              transform: 'translateY(30%)',
                              height: '20px',
                              width: '20px',
                              lineHeight: '18px',
                              textAlign: 'center',
                              color: '#fff',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              remove(field.name);
                              getSum(form.getFieldValue('constructions'));
                            }}
                          >
                            x
                          </div>
                        )}
                        {/* <MinusCircleOutlined onClick={() => remove(field.name)} /> */}
                      </div>
                    ))}
                    <div className="form-item">
                      <Form.Item style={{ width: '100%' }}>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          添加
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </div>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item
              label="昨日新增数量"
              name={'addedNumber'}
              initialValue={0}
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value.match(/^[0-9|-]+$/)) {
                      return Promise.reject(new Error('输入数字或“-”'));
                    }
                    if (value.length > 0 && value.lastIndexOf('-') > 0) {
                      return Promise.reject(new Error('“-”位置不正确'));
                    }
                  },
                },
              ]}
            >
              <Input
                placeholder="请输入新增数量，24小时之后此模块没有改动，则自动清空新增数量"
                style={{ width: '100%' }}
                min={0}
                max={8}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default IntroduceModal;
