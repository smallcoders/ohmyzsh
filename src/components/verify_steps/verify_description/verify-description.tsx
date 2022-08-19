import React from 'react';
import './verify-description.less';
import { Form } from 'antd';
import { Input, Radio } from 'antd';

import { useEffect, useState } from 'react';

type Props = {
  form?: any;
};

export default ({ form }: Props) => {
  const [checkNick, setCheckNick] = useState(false);
  useEffect(() => {
    form.validateFields(['reason']);
  }, [checkNick, form]);
  const onRadioChange = (e: any) => {
    console.log(e.target, '<-----e.target');
    setCheckNick(!e.target.value);
  };
  return (
    <Form className="verify-description-form" layout={'horizontal'} form={form}>
      <Form.Item
        name="result"
        initialValue={true}
        rules={[
          {
            required: true,
          },
        ]}
        label="审核意见"
      >
        <Radio.Group onChange={onRadioChange}>
          <Radio className="radio-label" value={true}>
            通过
          </Radio>
          <Radio className="radio-label" value={false}>
            拒绝
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name={'reason'} 
        // rules={[
        //   {
        //     required: checkNick,
        //     message: '请输入意见说明',
        //   },
        // ]}
        label="意见说明">
        <Input.TextArea
          autoSize={false}
          className="message-modal-textarea"
          maxLength={200}
          showCount={true}
          rows={4}
        />
      </Form.Item>
    </Form>
  );
};
