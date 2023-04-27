import { Input, Form, Select, Button, message, message as antdMessage, Radio } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import UploaImageV2 from '@/components/upload_form/upload-image-v2';
import { addGlobalFloatAd, getGlobalFloatAdDetail, getAllLayout, getAllLabels } from '@/services/baseline';
import { history } from 'umi';
import './index.less';
import { UploadOutlined } from '@ant-design/icons';

const sc = scopedClasses('suspension-add');
export default () => {
  const [form] = Form.useForm();
  const { id } = history.location.query as { id: string | undefined };
  const [userType, setUserType] = useState<any>('all')
  const [labels, setLabels] = useState<any>([])
  const [pageInfo, setPageInfo] = useState<any>({pageSize: 10, pageIndex: 1})
  useEffect(() => {
    if (id){
      getGlobalFloatAdDetail({ id }).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          console.log(result)
        } else {
          antdMessage.error(`请求失败，原因:{${resultMsg}}`);
        }
      });
    }
    getAllLayout().then((res) => {
      console.log(res, '123123')
    })
    getAllLabels({ ...pageInfo }).then((res) => {
      if (res.code === 0){
        setLabels(res.result)
      }
    })
  }, []);

  const handleSubmit = async () => {
    await form.validateFields();
    // todo 审核接口
    addGlobalFloatAd().then((res) => {
      console.log(res)
    })
  };

  return (
    <PageContainer
      className={sc('page')}
      ghost
      footer={[
        <>
          <Button type="primary" onClick={handleSubmit}>
            立即上架
          </Button>
          <Button onClick={handleSubmit}>
            暂存
          </Button>
          <Button onClick={() => history.goBack()}>返回</Button>
        </>,
      ]}
    >
      <Form className={sc('container-form')} form={form}>
        <div className="title">全局悬浮窗广告信息</div>
        <Form.Item labelCol={{span: 4}} wrapperCol={{span: 12}} name="advertiseName" label="活动名称" required>
          <Input placeholder="请输入" maxLength={35} />
        </Form.Item>
        <Form.Item
          name="imgs"
          label="图片"
          required
          extra="图片格式仅支持JPG、PNG、JPEG"
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <UploaImageV2 multiple={true} accept=".png,.jpeg,.jpg" maxCount={3}>
            <Button icon={<UploadOutlined />}>上传</Button>
          </UploaImageV2>
        </Form.Item>
        <Form.Item labelCol={{span: 4}} wrapperCol={{span: 12}}  name="siteLink" label="站内链接配置" required>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item labelCol={{span: 4}} wrapperCol={{span: 12}} name="name" label="作用范围" required>
          <Radio.Group  value={userType} onChange={(e) => {
            setUserType(e.target.value)
          }}>
            <Radio value='all'>全部用户</Radio>
            <Radio value='part'>部分用户</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item wrapperCol={{offset: 4, span: 12}} name="labelIds" required validateTrigger="onBlur">
          <Select options={[]} placeholder="请选择" />
        </Form.Item>
      </Form>
    </PageContainer>
  );
};
