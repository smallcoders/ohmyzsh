import ProForm, { ProFormSelect, ProFormText, ProFormUploadButton } from '@ant-design/pro-form';
import { Button } from 'antd';
import { useCallback } from 'react';
import type { StepFormProps } from '../create';

export default (props: StepFormProps) => {
  const onFinish = useCallback(async () => {
    // doing
    props.currentChange(1);
  }, [props]);
  return (
    <ProForm
      style={{ maxWidth: '600px' }}
      layout="horizontal"
      name="base"
      title="商品基础信息"
      labelCol={{ span: 8 }}
      submitter={{
        render: (p) => (
          <div className="form-footer">
            <Button type="primary" onClick={() => p.submit()}>
              下一步
            </Button>
          </div>
        ),
      }}
      onFinish={onFinish}
    >
      <ProFormText
        name="name"
        label="商品名称"
        placeholder="名称可包含商品中英品牌、名称等等信息"
        rules={[{ required: true }]}
      />
      <ProFormText name="type" label="商品型号" placeholder="请输入" rules={[{ required: true }]} />
      <ProFormText name="code" label="订货编码" placeholder="请输入" rules={[{ required: true }]} />
      <ProFormSelect name="label" label="商品促销标签" placeholder="请输入" />
      <ProFormSelect name="label2" label="服务标签" placeholder="请输入" />
      <ProFormText name="unit" label="商品单位" placeholder="请输入" rules={[{ required: true }]} />
      <ProFormUploadButton
        name="thumbnail"
        label="商品封面图"
        max={1}
        listType="picture-card"
        extra="图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下"
      />
      <ProFormUploadButton
        name="thumbnails"
        label="商品轮播图"
        max={10}
        listType="picture-card"
        extra="图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下，最大支持10张图片"
      />
      <ProFormText
        name="supplier"
        label="供应商"
        placeholder="请输入"
        rules={[{ required: true }]}
      />
    </ProForm>
  );
};
