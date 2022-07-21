import { addSpecsPrice, goToSpecsPrice } from '@/services/commodity';
import type DataCommodity from '@/types/data-commodity';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Button, Form, Input, Space } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { StepFormProps } from '../create';

type TableDataRow = DataCommodity.PriceInfo & Record<string, any>;

export default (props: StepFormProps) => {
  const { id, currentChange, setChanged } = props;
  const [prices, setPrices] = useState<TableDataRow[]>([]);
  const [editableKeys, setEditableKeys] = useState<number[]>([]);
  const [columns, setColumns] = useState<ProColumns<TableDataRow>[]>([]);
  const [loading, setloading] = useState(false);

  const formRef = useRef<FormInstance<any>>();
  const [form] = Form.useForm();

  const init = useCallback(async () => {
    if (!id) return;

    const res = await goToSpecsPrice({ productId: id });

    if (res.code) return;

    const data = res.result.map((item) => {
      const specs = item.specs.split(',').filter((v) => v.trim());
      const specsData: Record<string, string> = {};
      specs.forEach((spec, index) => {
        specsData[`specs${index}`] = spec;
      });

      if (specs.length === 0) {
        specsData.specs0 = '/';
      }
      return {
        ...item,
        ...specsData,
        purchasePrice: item.purchasePrice / 100,
        salePrice: item.salePrice / 100,
      };
    });

    setEditableKeys(data.map((item) => item.id));
    setPrices(data);
    form.setFieldsValue({ transportFee: res.result[0].transportFee || 0 });

    let specCol: ProColumns<TableDataRow, any>[] = res.result[0].specsTitle
      .split(',')
      .filter((v) => v.trim())
      .map((item, i) => {
        return {
          title: `规格（${item}）`,
          dataIndex: `specs${i}`,
          valueType: 'text',
          editable: false,
        };
      });

    if (specCol.length === 0) {
      specCol = [
        {
          title: `规格（无）`,
          dataIndex: 'specs0',
          valueType: 'text',
          editable: false,
        },
      ];
    }

    const col: ProColumns<TableDataRow, any>[] = [
      {
        title: '序号',
        editable: false,
        render: (_, __, i) => i + 1,
      },
      ...specCol,
      {
        title: () => (
          <span>
            <span className="red">*</span>订货编码
          </span>
        ),
        dataIndex: 'productNo',
        valueType: 'text',
        formItemProps: () => {
          return {
            rules: [
              { required: true, message: '此项为必填项' },
              ({ getFieldsValue }) => ({
                validator(_, value) {
                  const values = getFieldsValue();

                  const arr = Object.keys(values).map((key) => values[key].productNo);
                  if (arr.filter((item) => item === value).length > 1) {
                    return Promise.reject(new Error('此编码已存在！'));
                  }
                  return Promise.resolve();
                },
              }),
            ],
          };
        },
      },
      {
        title: () => (
          <span>
            <span className="red">*</span>商品采购价（元）
          </span>
        ),
        dataIndex: 'purchasePrice',
        valueType: 'inputNumber',
        formItemProps: () => {
          return {
            rules: [
              { required: true, message: '此项为必填项' },
              ({}) => ({
                validator(_, value) {
                  if (/^[0-9]*$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('此项为数字'));
                },
              }),
            ],
          };
        },
      },
      {
        title: () => (
          <span>
            <span className="red">*</span>商品销售价（元）
          </span>
        ),
        dataIndex: 'salePrice',
        valueType: 'number',
        formItemProps: () => {
          return {
            rules: [
              { required: true, message: '此项为必填项' },
              ({}) => ({
                validator(_, value) {
                  if (/^[0-9]*$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('此项为数字'));
                },
              }),
            ],
          };
        },
      },
    ];
    setColumns(col);
  }, [id, form]);

  const onFinish = useCallback(async () => {
    setloading(true);

    await formRef.current?.validateFields().finally(() => setloading(false));
    await form.validateFields().finally(() => setloading(false));
    const values = formRef.current?.getFieldsValue();

    const priceChildList = prices.map((item) => {
      return {
        id: item.id,
        specs: item.specs,
        productNo: values[item.id].productNo,
        purchasePrice: Number(values[item.id].purchasePrice) * 100,
        salePrice: Number(values[item.id].salePrice) * 100,
      };
    });
    const queryDta = {
      priceChildList,
      productId: id,
      transportFee: form.getFieldValue('transportFee'),
      specsTitle: prices[0].specsTitle,
    };
    const res = await addSpecsPrice(queryDta).finally(() => setloading(false));

    setloading(false);
    if (!res.code) {
      currentChange(1);
    }
  }, [form, id, prices, currentChange]);

  const onPre = useCallback(async () => {
    currentChange(-1);
  }, [currentChange]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div>
      <EditableProTable
        style={{ marginBottom: 20 }}
        rowKey="id"
        options={false}
        search={false}
        pagination={false}
        value={prices}
        columns={columns}
        onChange={(e) => {
          setChanged(true);
          setPrices(e);
        }}
        recordCreatorProps={false}
        editableFormRef={formRef}
        editable={{
          type: 'multiple',
          editableKeys,
        }}
      />

      <Form form={form} style={{ width: 600 }} onChange={() => setChanged(true)}>
        <Form.Item label="运费" name="transportFee" rules={[{ required: true }]}>
          <Input addonAfter="元" type="number" />
        </Form.Item>
      </Form>
      <div className="form-footer">
        <Space>
          <Button onClick={onPre}>上一步</Button>
          <Button type="primary" loading={loading} onClick={onFinish}>
            下一步
          </Button>
        </Space>
      </div>
    </div>
  );
};
