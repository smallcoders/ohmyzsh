import DebounceSelect from '@/components/DebounceSelect';
import useQuery from '@/hooks/useQuery';
import { addProduct, queryLabel, queryProduct, queryProvider } from '@/services/commodity';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Button, Form, Select, Space } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const { currentChange, setChanged, setProductId } = props;
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
          if (res.code) return;
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
  }, [query]);

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
      onChange={() => setChanged(true)}
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

      <Form.Item name="saleIds" label="商品促销标签">
        <LabelSelect labelType={0} />
      </Form.Item>
      <Form.Item name="serverIds" label="服务标签">
        <LabelSelect labelType={1} />
      </Form.Item>
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
        rules={[{ required: true }]}
      >
        <UploadImageFormItem listType="picture-card" maxCount={1} />
      </ProForm.Item>
      <ProForm.Item
        name="banner"
        label="商品轮播图"
        extra="图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下，最大支持10张图片"
        rules={[{ required: true }]}
      >
        <UploadImageFormItem listType="picture-card" maxCount={10} />
      </ProForm.Item>

      <Form.Item name="supplier" label="供应商">
        <ProviderSelect />
      </Form.Item>
    </ProForm>
  );
};

function LabelSelect(props: {
  value?: string;
  labelType: 0 | 1;
  onChange?: (val: string) => void;
}) {
  const { value, labelType, onChange } = props;

  const selected = useMemo(() => {
    return value?.split(',').filter((item) => item.trim()) || [];
  }, [value]);

  const selectChanged = useCallback(
    (values: string[]) => {
      if (onChange) {
        onChange(values.join(','));
      }
    },
    [onChange],
  );

  const fetchOptions = useCallback(
    async (search: string) => {
      const res = await queryLabel({ labelType, label: search, pageSize: 30, pageIndex: 1 });

      if (res.code) {
        return [];
      }

      return res.result.map((item) => {
        return {
          label: item.label,
          value: item.id.toString(),
        };
      });
    },
    [labelType],
  );

  return (
    <DebounceSelect
      value={selected}
      placeholder="请输入"
      mode="multiple"
      onChange={selectChanged}
      fetchOptions={fetchOptions}
    />
  );
}

function ProviderSelect(props: { value?: string; onChange?: (val: string) => void }) {
  const { value, onChange } = props;
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  const fetchOptions = useCallback(async () => {
    const res = await queryProvider();
    console.log(res);

    if (!res.code) {
      setOptions(
        res.result.map((item) => ({ label: item.providerTypeName, value: item.id.toString() })),
      );
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return <Select value={value} placeholder="请输入" options={options} onChange={onChange} />;
}
