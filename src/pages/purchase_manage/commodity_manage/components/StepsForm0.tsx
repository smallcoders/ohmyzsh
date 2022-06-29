import useQuery from '@/hooks/useQuery';
import { addProduct, queryProduct } from '@/services/commodity';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Button, Space } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'umi';
import UploadImageFormItem from '../../components/UploadImageFormItem';
import type { StepFormProps } from '../create';

interface ProductForm {
  productName: string;
  productModel: string;
  saleIds: string;
  serverIds: string;
  productOrg: string;
  productPic: string;
  supplier: string;
  banner: string;
}

export default (props: StepFormProps & { setProductId: (id: string | number) => void }) => {
  const { currentChange, changeLoading, setProductId } = props;
  const history = useHistory();
  const query = useQuery();
  const formRef = useRef<ProFormInstance<ProductForm>>();
  const onFinish = useCallback(
    async (value: ProductForm) => {
      const data: ProductForm & { id?: number | string } = value;
      if (query.id) {
        data.id = query.id;
      }

      const res = await addProduct(data);
      setProductId(res.result.id);
      currentChange(1);
    },
    [currentChange, setProductId, query],
  );

  useEffect(() => {
    if (query.id) {
      queryProduct(query.id)
        .then((res) => {
          const data = {
            productName: res.result.productName,
            productModel: res.result.productModel,
            saleIds: res.result.saleIds,
            serverIds: res.result.serverIds,
            productOrg: res.result.productOrg,
            productPic: res.result.productPic,
            supplier: res.result.supplier,
            banner: res.result.banner,
          };
          formRef.current?.setFieldsValue(data);
        })
        .finally(() => {});
    }
  }, [query, changeLoading]);

  return (
    <ProForm
      style={{ maxWidth: '600px' }}
      layout="horizontal"
      name="base"
      title="商品基础信息"
      labelCol={{ span: 8 }}
      formRef={formRef}
      submitter={{
        render: (p) => (
          <div className="form-footer">
            <Space>
              <Button type="primary" onClick={() => p.submit()}>
                保存，下一步
              </Button>
              <Button onClick={() => history.goBack()}>取消</Button>
            </Space>
          </div>
        ),
      }}
      onFinish={onFinish}
    >
      <ProFormText
        name="productName"
        label="商品名称"
        placeholder="名称可包含商品中英品牌、名称等等信息"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="productModel"
        label="商品型号"
        placeholder="请输入"
        rules={[{ required: true }]}
      />

      <ProFormSelect name="saleIds" label="商品促销标签" placeholder="请输入" />
      <ProFormSelect name="serverIds" label="服务标签" placeholder="请输入" />
      <ProFormText
        name="productOrg"
        label="商品单位"
        placeholder="请输入"
        rules={[{ required: true }]}
      />

      <ProForm.Item
        name="productPic"
        label="商品封面图"
        extra="图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下"
      >
        <UploadImageFormItem listType="picture-card" maxCount={1} />
      </ProForm.Item>
      <ProForm.Item
        name="banner"
        label="商品轮播图"
        extra="图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下，最大支持10张图片"
      >
        <UploadImageFormItem listType="picture-card" maxCount={10} />
      </ProForm.Item>

      <ProFormText
        name="supplier"
        label="供应商"
        placeholder="请输入"
        rules={[{ required: true }]}
      />
    </ProForm>
  );
};
