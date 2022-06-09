import React, { useState } from 'react';
import './verify-description.less';
import { Form } from 'antd';
import { Input, Radio } from 'antd';

type Props = {
  form?: any;
};

export default ({ form }: Props) => {
  const [result, setResult] = useState<string>();
  return (
    <Form className="verify-description-form" layout={'horizontal'} form={form}>
      <Form.Item
        name="result"
        initialValue={'AUDIT_PASSED'}
        rules={[
          {
            required: true,
          },
        ]}
        label="审核意见"
      >
        <Radio.Group onChange={(e) => setResult(e.target.value)}>
          <Radio className="radio-label" value={'AUDIT_PASSED'}>
            通过
          </Radio>
          <Radio className="radio-label" value={'AUDIT_REJECTED'}>
            拒绝
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name={'reason'}
        label="意见说明"
        rules={[
          {
            required: result === 'AUDIT_REJECTED',
          },
        ]}
      >
        <Input.TextArea
          autoSize={false}
          className="message-modal-textarea"
          maxLength={60}
          showCount={true}
          rows={4}
        />
      </Form.Item>
    </Form>
  );
};
