import React from 'react';
import './verify-description.less';
import { Form } from 'antd';
import { Input, Radio, Steps, Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

import { useEffect, useState } from 'react';

type Props = {
  form?: any;
  mustFillIn?: boolean; //拒绝理由是否必填
  applyDetail?: any // 审核详情
};

export default ({ form, mustFillIn = false, applyDetail }: Props) => {
  const [checkNick, setCheckNick] = useState(false);
  useEffect(() => {
    form.validateFields(['reason']);
  }, [checkNick, form]);
  const onRadioChange = (e: any) => {
    // console.log(e.target, '<-----e.target');
    setCheckNick(!e.target.value);
  };
  return (
    <Steps className='verify-description-steps' direction="vertical" current={0}>
      <Steps.Step
        key={0}
        title={applyDetail?.handleUserName}
        icon={<Avatar icon={<UserOutlined />} />}
        description={
          (
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
                rules={[
                  {
                    required: mustFillIn && checkNick,
                    message: '请输入意见说明',
                  },
                ]}
                label="意见说明"
              >
                <Input.TextArea
                  autoSize={false}
                  className="message-modal-textarea"
                  maxLength={200}
                  showCount={true}
                  rows={4}
                />
              </Form.Item>
            </Form>
          )
        }
      >
      </Steps.Step>
      <Steps.Step
        key={1}
        title='系统审核'
        icon={<Avatar icon={<UserOutlined />} />}
        description={
          (
            <div className='description-item'>
              <div className='content'>
                {
                  applyDetail?.auditResult
                  ?
                  <div className='green'>
                    审核通过
                  </div>
                  :
                  <div className='red'>
                    审核拒绝
                    <div>{applyDetail?.systemAudit}</div>
                  </div>
                }
              </div>
              <div className='time'>{ applyDetail?.auditTime && moment(applyDetail.auditTime).format('YYYY-MM-DD HH:mm:ss') }</div>
            </div>
          )
        }>
      </Steps.Step>
      <Steps.Step
        key={2}
        title={applyDetail?.userName}
        icon={<Avatar icon={<UserOutlined />} />}
        description={
          (
            <div className='description-item'>
              <div className='content'>
                提交审核
              </div>
              <div className='time'>{ applyDetail?.auditTime && moment(applyDetail.createTime).format('YYYY-MM-DD HH:mm:ss') }</div>
            </div>
          )
        }>
      </Steps.Step>
    </Steps>
  );
};
