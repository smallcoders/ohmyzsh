import { PageContainer } from '@ant-design/pro-layout';
import { Button, Empty, message as antdMessage, Form, Input, Popover, message } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
import { useState, useEffect } from 'react';
import { getExcCustomer, saveOrUpdateCustomer } from '@/services/financial-exclusive';
import { FooterToolbar } from '@ant-design/pro-components';
import type FinancialExclusive from '@/types/financial-exclusive';
import empty from '@/assets/financial/empty.png';
import UploadForm from '@/components/upload_form';
import { getFileInfo } from '@/services/common';

import './index.less';
const sc = scopedClasses('financial-exclusive');

export default () => {
  const [form] = Form.useForm();
  const [isSet, setIsSet] = useState<boolean>(false);
  const [customerInfo, setCustomerInfo] = useState<FinancialExclusive.ExcCustomer>({});
  const excCustomerInfo = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { code, result, message } = await getExcCustomer();
      if (code === 0) {
        if (Object.keys(result).length !== 0) {
          const res = await getFileInfo(String(result.wetChatImage));
          if (res.code === 0) {
            setCustomerInfo({ ...result, path: res.result[0].path });
          }
        } else {
          setCustomerInfo({});
        }
      } else {
        antdMessage.error(`请求失败，原因:{${message}}`);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  useEffect(() => {
    excCustomerInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addOrUpdate = async () => {
    const values = await form.validateFields();
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { code, message: resultMsg } = await (customerInfo.id
        ? saveOrUpdateCustomer({
            ...values,
            amount: Number(values.amount) * 1000000,
            id: customerInfo.id,
          })
        : saveOrUpdateCustomer({
            ...values,
            amount: Number(values.amount) * 1000000,
          }));
      if (code === 0) {
        message.success(customerInfo.id ? '编辑成功' : '新增成功');
        excCustomerInfo();
        setIsSet(false);
      } else {
        message.error(customerInfo.id ? '编辑失败' : '新增失败, 原因:' + resultMsg);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  return (
    <PageContainer
      className={Object.keys(customerInfo).length !== 0 && !isSet ? sc('page2') : sc('page1')}
      ghost
      header={{
        title: '金融专属服务',
        breadcrumb: {},
      }}
      footer={[
        <>
          <Button
            onClick={() => {
              setIsSet(false);
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={() => {
              addOrUpdate();
            }}
          >
            保存
          </Button>
        </>,
      ]}
    >
      <div className={sc('container')}>
        <div className={sc('container-title')}>
          <span>金融大客户条件设置</span>
          {Object.keys(customerInfo).length !== 0 && !isSet ? (
            <Button
              onClick={() => {
                setIsSet(true);
                form.setFieldsValue({ ...customerInfo });
              }}
            >
              编辑
            </Button>
          ) : (
            <></>
          )}
        </div>
        {Object.keys(customerInfo).length === 0 && !isSet ? (
          <div className={sc('container-content-empty')}>
            <Empty
              image={empty}
              imageStyle={{
                height: 160,
              }}
              description={<span>暂无内容，点击进行金融大客户条件设置</span>}
            />
            <Button
              type="primary"
              onClick={() => {
                setIsSet(true);
              }}
            >
              立即设置
            </Button>
          </div>
        ) : Object.keys(customerInfo).length !== 0 && !isSet ? (
          <div className={sc('container-content-detail')}>
            <div className="item">
              <label>
                <span>*</span>
                拟融资金融需大于等于：{' '}
              </label>
              {customerInfo?.amount ? (customerInfo?.amount / 1000000).toFixed(2) + '万元' : '--'}
            </div>
            <div className="item">
              <label>
                <span>*</span>
                金融专属顾问昵称：
              </label>
              {customerInfo.name}
            </div>
            <div className="item">
              <label>
                <span>*</span>金融专属顾问企业微信：
              </label>
              <img style={{ width: 120 }} src={customerInfo?.path} alt="" />
            </div>
          </div>
        ) : (
          <>
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 6 }}
              form={form}
              validateTrigger={['onBlur']}
              style={{ marginTop: 24 }}
            >
              <Form.Item label="拟融资金融需大于等于">
                <Form.Item
                  name="amount"
                  rules={[{ required: true, message: '请输入金融，支持两位小数' }]}
                >
                  <Input placeholder="请输入" suffix="万元" />
                </Form.Item>
                <div className="info">此内容为金融大客户判断门槛</div>
              </Form.Item>

              <Form.Item label="金融专属顾问昵称">
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: '请输入金融专属顾问昵称' }]}
                >
                  <Input maxLength={35} placeholder="请输入" />
                </Form.Item>
                <div className="info">
                  昵称为小羚。
                  <Popover
                    content={
                      <div>
                        <img src={require('@/assets/banking_loan/example1.png')} alt="" />
                      </div>
                    }
                  >
                    <span className="example">查看示例</span>
                  </Popover>
                </div>
              </Form.Item>

              <Form.Item label="金融专属顾问企业微信">
                <Form.Item
                  name="wetChatImage"
                  extra=""
                  rules={[{ required: true, message: '请上传金融专属顾问企业微信' }]}
                >
                  <UploadForm
                    listType="picture-card"
                    showUploadList={false}
                    maxSize={0.3}
                    accept=".png,.jpeg,.jpg"
                    maxCount={1}
                  />
                </Form.Item>
                <div className="info">
                  请上传1张企业微信二维码图片<span className="size">规格大小待定</span>。
                  <Popover
                    content={
                      <div>
                        <img src={require('@/assets/banking_loan/example2.png')} alt="" />
                      </div>
                    }
                  >
                    <span className="example">查看示例</span>
                  </Popover>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </PageContainer>
  );
};
