import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Button, Input } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { StepFormProps } from '../create';
import type { SpecData } from './StepsForm1';

interface StepsForm3Props {
  specs: SpecData[];
}

interface TableDataRow {
  id: number;
  purchasePrice: number | undefined;
  sellingPrice: number | undefined;
  [key: string]: string | number | undefined;
}

export default (props: StepsForm3Props & StepFormProps) => {
  const [data, setData] = useState<TableDataRow[]>([]);
  const [editableKeys, setEditableKeys] = useState<number[]>([]);
  const [columns, setColumns] = useState<ProColumns<TableDataRow>[]>([]);
  const [freight, setFreight] = useState<number>();

  const formRef = useRef<FormInstance<any>>();

  const parsePrice = useCallback((specs: SpecData[] = []) => {
    let result: { label: string; value: string }[][] = [];
    // 枚举
    specs.forEach((spec) => {
      if (!spec.value || !spec.value.length) {
        return;
      }

      if (result.length === 0) {
        result = spec.value.map((item) => [{ label: spec.name, value: item }]);
        return;
      }

      const res = [];

      for (let i = 0; i < result.length; i++) {
        const temp = result[i];
        for (let j = 0; j < spec.value.length; j++) {
          res.push([...temp, { label: spec.name, value: spec.value[j] }]);
        }
      }
      result = res;
    });

    return result.length ? result : [[{ label: '规格（无）', value: '/' }]];
  }, []);

  useEffect(() => {
    const result = parsePrice(props.specs);

    setData(
      result.map((item, index) => {
        const res: TableDataRow = {
          id: index + 1,
          purchasePrice: undefined,
          sellingPrice: undefined,
          code: '',
        };
        item.forEach((v, i) => {
          res[`spec${i}`] = v.value;
        });
        return res;
      }),
    );

    setEditableKeys(result.map((_, i) => i + 1));

    const specCol: ProColumns<TableDataRow, number | string>[] = result[0]?.map((item, i) => {
      return {
        title: item.label,
        dataIndex: `spec${i}`,
        valueType: 'text',
        editable: false,
      };
    });

    setColumns(() => {
      return [
        {
          title: '序号',
          dataIndex: 'id',
          valueType: 'text',
          editable: false,
        },
        ...specCol,
        {
          title: () => (
            <span>
              <span className="red">*</span>订货编码
            </span>
          ),
          dataIndex: 'code',
          valueType: 'text',
          formItemProps: () => {
            return {
              rules: [{ required: true, message: '此项为必填项' }],
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
          valueType: 'number',
          formItemProps: () => {
            return {
              rules: [{ required: true, message: '此项为必填项' }],
            };
          },
        },
        {
          title: () => (
            <span>
              <span className="red">*</span>商品销售价（元）
            </span>
          ),
          dataIndex: 'sellingPrice',
          valueType: 'number',
          formItemProps: () => {
            return {
              rules: [{ required: true, message: '此项为必填项' }],
            };
          },
        },
      ];
    });
  }, [props, parsePrice]);

  const onFinish = useCallback(async () => {
    await formRef.current?.validateFields();

    props.currentChange(1);
  }, [props]);

  return (
    <div>
      <EditableProTable
        style={{ marginBottom: 20 }}
        rowKey="id"
        options={false}
        search={false}
        pagination={false}
        value={data}
        columns={columns}
        onChange={setData}
        recordCreatorProps={false}
        editableFormRef={formRef}
        editable={{
          type: 'multiple',
          editableKeys,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <div style={{ width: 80, textAlign: 'right' }}>
          <span className="red">*</span>运费：
        </div>
        <div>
          <Input
            addonAfter="元"
            type="number"
            value={freight}
            onChange={(e) => setFreight(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="form-footer">
        <Button onClick={() => props.currentChange(-1)}>上一步</Button>
        <Button type="primary" onClick={onFinish}>
          下一步
        </Button>
      </div>
    </div>
  );
};
